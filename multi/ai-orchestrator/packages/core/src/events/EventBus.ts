/**
 * Event Bus
 *
 * Central event system for publishing and subscribing to domain events.
 * Supports both in-memory events and integration with external systems (Redis).
 */

import { v4 as uuidv4 } from 'uuid';
import type { DomainEvent, EventType, AggregateType, EventMetadata } from '../types/event.js';

export type EventHandler<T = Record<string, unknown>> = (event: DomainEvent & { eventData: T }) => void | Promise<void>;

export interface Subscription {
  id: string;
  eventType: EventType | '*';
  handler: EventHandler;
  once: boolean;
}

export interface EventBusConfig {
  maxListeners?: number;
  enableLogging?: boolean;
}

export class EventBus {
  private subscriptions: Map<string, Subscription[]> = new Map();
  private wildcardSubscriptions: Subscription[] = [];
  private readonly maxListeners: number;
  private readonly enableLogging: boolean;
  private eventCount: number = 0;

  constructor(config: EventBusConfig = {}) {
    this.maxListeners = config.maxListeners ?? 100;
    this.enableLogging = config.enableLogging ?? false;
  }

  /**
   * Subscribe to an event type
   */
  subscribe<T = Record<string, unknown>>(
    eventType: EventType | '*',
    handler: EventHandler<T>
  ): string {
    const subscriptionId = uuidv4();
    const subscription: Subscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler,
      once: false
    };

    if (eventType === '*') {
      if (this.wildcardSubscriptions.length >= this.maxListeners) {
        throw new Error(`Maximum wildcard listeners (${this.maxListeners}) reached`);
      }
      this.wildcardSubscriptions.push(subscription);
    } else {
      const existing = this.subscriptions.get(eventType) ?? [];
      if (existing.length >= this.maxListeners) {
        throw new Error(`Maximum listeners for ${eventType} (${this.maxListeners}) reached`);
      }
      this.subscriptions.set(eventType, [...existing, subscription]);
    }

    return subscriptionId;
  }

  /**
   * Subscribe to an event type (one-time)
   */
  once<T = Record<string, unknown>>(
    eventType: EventType,
    handler: EventHandler<T>
  ): string {
    const subscriptionId = uuidv4();
    const subscription: Subscription = {
      id: subscriptionId,
      eventType,
      handler: handler as EventHandler,
      once: true
    };

    const existing = this.subscriptions.get(eventType) ?? [];
    this.subscriptions.set(eventType, [...existing, subscription]);

    return subscriptionId;
  }

  /**
   * Unsubscribe from an event
   */
  unsubscribe(subscriptionId: string): boolean {
    // Check wildcard subscriptions
    const wildcardIndex = this.wildcardSubscriptions.findIndex(s => s.id === subscriptionId);
    if (wildcardIndex !== -1) {
      this.wildcardSubscriptions.splice(wildcardIndex, 1);
      return true;
    }

    // Check typed subscriptions
    for (const [eventType, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscriptions.delete(eventType);
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Publish an event
   */
  async publish<T extends Record<string, unknown>>(
    eventType: EventType,
    eventData: T,
    options?: {
      aggregateId?: string;
      aggregateType?: AggregateType;
      metadata?: Partial<EventMetadata>;
    }
  ): Promise<DomainEvent> {
    const event: DomainEvent = {
      id: uuidv4(),
      aggregateId: options?.aggregateId ?? uuidv4(),
      aggregateType: options?.aggregateType ?? 'task',
      eventType,
      eventData,
      metadata: {
        ...options?.metadata,
        source: 'event-bus'
      },
      version: ++this.eventCount,
      timestamp: new Date()
    };

    if (this.enableLogging) {
      console.log(`[EventBus] Publishing: ${eventType}`, event);
    }

    // Get handlers for this event type
    const handlers = this.subscriptions.get(eventType) ?? [];
    const allHandlers = [...handlers, ...this.wildcardSubscriptions];

    // Track one-time handlers to remove
    const toRemove: string[] = [];

    // Execute all handlers
    const promises = allHandlers.map(async subscription => {
      try {
        await subscription.handler(event);
        if (subscription.once) {
          toRemove.push(subscription.id);
        }
      } catch (error) {
        console.error(`[EventBus] Handler error for ${eventType}:`, error);
      }
    });

    await Promise.all(promises);

    // Remove one-time handlers
    for (const id of toRemove) {
      this.unsubscribe(id);
    }

    return event;
  }

  /**
   * Publish multiple events in order
   */
  async publishBatch(
    events: Array<{
      eventType: EventType;
      eventData: Record<string, unknown>;
      aggregateId?: string;
      aggregateType?: AggregateType;
    }>
  ): Promise<DomainEvent[]> {
    const published: DomainEvent[] = [];

    for (const event of events) {
      const options: {
        aggregateId?: string;
        aggregateType?: AggregateType;
      } = {};

      if (event.aggregateId !== undefined) {
        options.aggregateId = event.aggregateId;
      }
      if (event.aggregateType !== undefined) {
        options.aggregateType = event.aggregateType;
      }

      const publishedEvent = await this.publish(event.eventType, event.eventData, options);
      published.push(publishedEvent);
    }

    return published;
  }

  /**
   * Get subscription count for an event type
   */
  getSubscriptionCount(eventType?: EventType): number {
    if (eventType) {
      return (this.subscriptions.get(eventType) ?? []).length;
    }

    let total = this.wildcardSubscriptions.length;
    for (const subs of this.subscriptions.values()) {
      total += subs.length;
    }
    return total;
  }

  /**
   * Get total event count
   */
  getEventCount(): number {
    return this.eventCount;
  }

  /**
   * Clear all subscriptions
   */
  clear(): void {
    this.subscriptions.clear();
    this.wildcardSubscriptions = [];
  }

  /**
   * Wait for an event (useful for testing)
   */
  waitFor<T = Record<string, unknown>>(
    eventType: EventType,
    timeout: number = 5000
  ): Promise<DomainEvent & { eventData: T }> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.unsubscribe(subscriptionId);
        reject(new Error(`Timeout waiting for event: ${eventType}`));
      }, timeout);

      const subscriptionId = this.once<T>(eventType, event => {
        clearTimeout(timeoutId);
        resolve(event);
      });
    });
  }
}

// Singleton instance
let eventBusInstance: EventBus | null = null;

export function getEventBus(config?: EventBusConfig): EventBus {
  if (!eventBusInstance) {
    eventBusInstance = new EventBus(config);
  }
  return eventBusInstance;
}

export function resetEventBus(): void {
  eventBusInstance?.clear();
  eventBusInstance = null;
}
