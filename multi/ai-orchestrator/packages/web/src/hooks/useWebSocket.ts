/**
 * WebSocket Hook
 *
 * Manages WebSocket connection and subscriptions.
 */

import { useCallback, useEffect, useRef } from 'react';
import { create } from 'zustand';

interface WebSocketMessage {
  type: string;
  task_id?: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

interface WebSocketStore {
  isConnected: boolean;
  messages: WebSocketMessage[];
  setConnected: (connected: boolean) => void;
  addMessage: (message: WebSocketMessage) => void;
  clearMessages: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  messages: [],
  setConnected: (connected) => set({ isConnected: connected }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-99), message],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const { setConnected, addMessage } = useWebSocketStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const clientId = `web-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const wsUrl = `${protocol}//${window.location.host}/ws?client_id=${clientId}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      reconnectAttempts.current = 0;
      // Subscribe to tasks channel by default
      ws.send(JSON.stringify({ action: 'subscribe', channel: 'tasks' }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        addMessage(message);
      } catch {
        // Ignore parse errors
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Attempt to reconnect
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        setTimeout(connect, 1000 * reconnectAttempts.current);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [setConnected, addMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const subscribe = useCallback((channel: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'subscribe', channel }));
    }
  }, []);

  const unsubscribe = useCallback((channel: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'unsubscribe', channel }));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected: useWebSocketStore((state) => state.isConnected),
    messages: useWebSocketStore((state) => state.messages),
  };
}
