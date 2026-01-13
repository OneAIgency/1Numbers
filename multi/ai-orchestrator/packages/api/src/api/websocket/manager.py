"""
WebSocket Connection Manager

Manages WebSocket connections for real-time updates.
"""

import asyncio
import json
from datetime import datetime
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect
import structlog

logger = structlog.get_logger()


class ConnectionManager:
    """Manages WebSocket connections and message broadcasting"""

    def __init__(self) -> None:
        # Active connections: {client_id: WebSocket}
        self._connections: dict[str, WebSocket] = {}

        # Subscriptions: {channel: set of client_ids}
        self._subscriptions: dict[str, set[str]] = {}

        # Connection metadata: {client_id: {metadata}}
        self._metadata: dict[str, dict] = {}

    async def connect(
        self,
        websocket: WebSocket,
        client_id: str,
        metadata: dict | None = None,
    ) -> None:
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self._connections[client_id] = websocket
        self._metadata[client_id] = metadata or {}

        logger.info(
            "WebSocket connected",
            client_id=client_id,
            total_connections=len(self._connections),
        )

    def disconnect(self, client_id: str) -> None:
        """Remove a disconnected client"""
        if client_id in self._connections:
            del self._connections[client_id]

        if client_id in self._metadata:
            del self._metadata[client_id]

        # Remove from all subscriptions
        for channel, subscribers in self._subscriptions.items():
            subscribers.discard(client_id)

        logger.info(
            "WebSocket disconnected",
            client_id=client_id,
            total_connections=len(self._connections),
        )

    def subscribe(self, client_id: str, channel: str) -> None:
        """Subscribe a client to a channel"""
        if channel not in self._subscriptions:
            self._subscriptions[channel] = set()
        self._subscriptions[channel].add(client_id)

        logger.debug(
            "Client subscribed to channel",
            client_id=client_id,
            channel=channel,
        )

    def unsubscribe(self, client_id: str, channel: str) -> None:
        """Unsubscribe a client from a channel"""
        if channel in self._subscriptions:
            self._subscriptions[channel].discard(client_id)

    async def send_personal(self, client_id: str, message: dict[str, Any]) -> bool:
        """Send a message to a specific client"""
        if client_id not in self._connections:
            return False

        try:
            websocket = self._connections[client_id]
            await websocket.send_json(message)
            return True
        except Exception as e:
            logger.error(
                "Failed to send personal message",
                client_id=client_id,
                error=str(e),
            )
            self.disconnect(client_id)
            return False

    async def broadcast(self, message: dict[str, Any]) -> int:
        """Broadcast a message to all connected clients"""
        sent_count = 0
        disconnected = []

        for client_id, websocket in self._connections.items():
            try:
                await websocket.send_json(message)
                sent_count += 1
            except Exception:
                disconnected.append(client_id)

        # Clean up disconnected clients
        for client_id in disconnected:
            self.disconnect(client_id)

        return sent_count

    async def broadcast_to_channel(
        self,
        channel: str,
        message: dict[str, Any],
    ) -> int:
        """Broadcast a message to all clients subscribed to a channel"""
        if channel not in self._subscriptions:
            return 0

        sent_count = 0
        disconnected = []

        for client_id in self._subscriptions[channel]:
            if client_id in self._connections:
                try:
                    await self._connections[client_id].send_json(message)
                    sent_count += 1
                except Exception:
                    disconnected.append(client_id)

        # Clean up disconnected clients
        for client_id in disconnected:
            self.disconnect(client_id)

        return sent_count

    async def send_task_update(
        self,
        task_id: str,
        event_type: str,
        data: dict[str, Any],
    ) -> int:
        """Send a task update to subscribers"""
        message = {
            "type": event_type,
            "task_id": task_id,
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
        }

        # Send to task-specific channel
        task_count = await self.broadcast_to_channel(f"task:{task_id}", message)

        # Also broadcast to global tasks channel
        global_count = await self.broadcast_to_channel("tasks", message)

        return task_count + global_count

    async def send_agent_progress(
        self,
        task_id: str,
        agent_type: str,
        progress: float,
        message: str,
    ) -> int:
        """Send agent progress update"""
        return await self.send_task_update(
            task_id,
            "agent_progress",
            {
                "agent_type": agent_type,
                "progress": progress,
                "message": message,
            },
        )

    async def send_mode_change(
        self,
        old_mode: str,
        new_mode: str,
        config: dict[str, Any],
    ) -> int:
        """Broadcast mode change to all clients"""
        message = {
            "type": "mode_change",
            "data": {
                "old_mode": old_mode,
                "new_mode": new_mode,
                "config": config,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }
        return await self.broadcast(message)

    def get_connection_count(self) -> int:
        """Get the number of active connections"""
        return len(self._connections)

    def get_channel_subscribers(self, channel: str) -> int:
        """Get the number of subscribers for a channel"""
        return len(self._subscriptions.get(channel, set()))

    def get_stats(self) -> dict[str, Any]:
        """Get WebSocket statistics"""
        return {
            "total_connections": len(self._connections),
            "channels": {
                channel: len(subscribers)
                for channel, subscribers in self._subscriptions.items()
            },
        }


# Singleton instance
_manager_instance: ConnectionManager | None = None


def get_manager() -> ConnectionManager:
    """Get or create WebSocket manager instance"""
    global _manager_instance
    if _manager_instance is None:
        _manager_instance = ConnectionManager()
    return _manager_instance
