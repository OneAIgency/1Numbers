/**
 * WebSocket Client
 *
 * Real-time connection to the orchestrator API.
 */

import WebSocket from 'ws';
import { getConfig } from './config.js';

export type MessageHandler = (message: WebSocketMessage) => void;

export interface WebSocketMessage {
  type: string;
  task_id?: string;
  data?: Record<string, unknown>;
  timestamp?: string;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private clientId: string;

  constructor() {
    this.clientId = `cli-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const config = getConfig();
      const wsUrl = config.apiUrl.replace(/^http/, 'ws') + `/ws?client_id=${this.clientId}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        this.reconnectAttempts = 0;
        resolve();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage;
          this.emit(message.type, message);
        } catch {
          // Ignore parse errors
        }
      });

      this.ws.on('close', () => {
        this.handleDisconnect();
      });

      this.ws.on('error', (error) => {
        if (this.reconnectAttempts === 0) {
          reject(error);
        }
      });
    });
  }

  private handleDisconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnect silently failed
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(channel: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'subscribe', channel }));
    }
  }

  unsubscribe(channel: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'unsubscribe', channel }));
    }
  }

  on(event: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  private emit(event: string, message: WebSocketMessage): void {
    // Emit to specific handlers
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(message);
      } catch {
        // Ignore handler errors
      }
    });

    // Emit to wildcard handlers
    this.handlers.get('*')?.forEach((handler) => {
      try {
        handler(message);
      } catch {
        // Ignore handler errors
      }
    });
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsClient = new WebSocketClient();
