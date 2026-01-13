"""
Cache Service

Redis-based caching with fallback to in-memory cache.
"""

import hashlib
import json
from typing import Any

import redis.asyncio as redis
import structlog

from src.config import settings

logger = structlog.get_logger()


class CacheService:
    """Redis cache service with graceful fallback"""

    def __init__(self) -> None:
        self._redis: redis.Redis | None = None
        self._connected: bool = False
        self._fallback_cache: dict[str, tuple[Any, float]] = {}

    async def connect(self) -> None:
        """Connect to Redis"""
        try:
            self._redis = redis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
            await self._redis.ping()
            self._connected = True
            logger.info("Connected to Redis", url=settings.redis_url)
        except Exception as e:
            logger.warning("Failed to connect to Redis, using fallback cache", error=str(e))
            self._connected = False

    async def disconnect(self) -> None:
        """Disconnect from Redis"""
        if self._redis:
            await self._redis.close()
            self._redis = None
            self._connected = False
            logger.info("Disconnected from Redis")

    async def get(self, key: str) -> Any | None:
        """Get value from cache"""
        try:
            if self._connected and self._redis:
                value = await self._redis.get(key)
                if value:
                    return json.loads(value)
            else:
                # Fallback cache
                if key in self._fallback_cache:
                    return self._fallback_cache[key][0]
        except Exception as e:
            logger.error("Cache get error", key=key, error=str(e))
        return None

    async def set(self, key: str, value: Any, ttl: int | None = None) -> bool:
        """Set value in cache"""
        ttl = ttl or settings.redis_cache_ttl
        try:
            serialized = json.dumps(value)
            if self._connected and self._redis:
                await self._redis.setex(key, ttl, serialized)
            else:
                # Fallback cache (no TTL enforcement)
                self._fallback_cache[key] = (value, ttl)
            return True
        except Exception as e:
            logger.error("Cache set error", key=key, error=str(e))
            return False

    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            if self._connected and self._redis:
                await self._redis.delete(key)
            else:
                self._fallback_cache.pop(key, None)
            return True
        except Exception as e:
            logger.error("Cache delete error", key=key, error=str(e))
            return False

    async def health_check(self) -> dict:
        """Check cache health"""
        if self._connected and self._redis:
            try:
                await self._redis.ping()
                return {"status": "healthy", "type": "redis"}
            except Exception:
                return {"status": "unhealthy", "type": "redis"}
        return {"status": "healthy", "type": "memory"}

    @staticmethod
    def generate_key(*parts: str) -> str:
        """Generate a cache key from parts"""
        content = ":".join(parts)
        hash_value = hashlib.sha256(content.encode()).hexdigest()[:16]
        return f"{parts[0]}:{hash_value}"

    def is_connected(self) -> bool:
        """Check if connected to Redis"""
        return self._connected


# Singleton instance
_cache_instance: CacheService | None = None


async def get_cache() -> CacheService:
    """Get or create cache instance"""
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = CacheService()
        await _cache_instance.connect()
    return _cache_instance


async def close_cache() -> None:
    """Close cache connection"""
    global _cache_instance
    if _cache_instance:
        await _cache_instance.disconnect()
        _cache_instance = None
