"""
Redis Cache Service
"""

import redis.asyncio as redis
import json
from typing import Optional, Any
import os


class CacheService:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.client: Optional[redis.Redis] = None

    async def connect(self):
        """Connect to Redis"""
        try:
            self.client = await redis.from_url(
                self.redis_url,
                decode_responses=True
            )
            # Test connection
            await self.client.ping()
        except Exception as e:
            print(f"Warning: Could not connect to Redis: {e}")
            self.client = None

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.client:
            await self.client.close()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.client:
            return None
        
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None

    async def set(self, key: str, value: Any, ttl: int = 3600):
        """Set value in cache"""
        if not self.client:
            return
        
        try:
            serialized = json.dumps(value)
            await self.client.setex(key, ttl, serialized)
        except Exception as e:
            print(f"Cache set error: {e}")

    async def delete(self, key: str):
        """Delete key from cache"""
        if not self.client:
            return
        
        try:
            await self.client.delete(key)
        except Exception as e:
            print(f"Cache delete error: {e}")

    async def health_check(self) -> bool:
        """Check cache health"""
        if not self.client:
            return False
        
        try:
            await self.client.ping()
            return True
        except:
            return False

