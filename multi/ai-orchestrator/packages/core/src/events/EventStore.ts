/**
 * Event Store
 *
 * Persistent storage for domain events with event sourcing support.
 * Enables audit trail and state reconstruction.
 */

import type { DomainEvent, EventType, AggregateType } from '../types/event.js';

export interface EventStoreConfig {
  maxEventsPerAggregate?: number;
  enableSnapshots?: boolean;
  snapshotInterval?: number;
}

export interface EventQuery {
  aggregateId?: string;
  aggregateType?: AggregateType;
  eventTypes?: EventType[];
  fromVersion?: number;
  toVersion?: number;
  fromTimestamp?: Date;
  toTimestamp?: Date;
  limit?: number;
  offset?: number;
}

export interface Snapshot<T> {
  aggregateId: string;
  aggregateType: AggregateType;
  version: number;
  state: T;
  timestamp: Date;
}

/**
 * Abstract Event Store interface
 * Implementations can use different backends (PostgreSQL, Redis, etc.)
 */
export abstract class EventStore {
  protected readonly config: Required<EventStoreConfig>;

  constructor(config: EventStoreConfig = {}) {
    this.config = {
      maxEventsPerAggregate: config.maxEventsPerAggregate ?? 10000,
      enableSnapshots: config.enableSnapshots ?? true,
      snapshotInterval: config.snapshotInterval ?? 100
    };
  }

  /**
   * Append an event to the store
   */
  abstract append(event: DomainEvent): Promise<void>;

  /**
   * Append multiple events atomically
   */
  abstract appendBatch(events: DomainEvent[]): Promise<void>;

  /**
   * Get events for an aggregate
   */
  abstract getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;

  /**
   * Query events with filters
   */
  abstract query(query: EventQuery): Promise<DomainEvent[]>;

  /**
   * Get the latest version for an aggregate
   */
  abstract getLatestVersion(aggregateId: string): Promise<number>;

  /**
   * Save a snapshot
   */
  abstract saveSnapshot<T>(snapshot: Snapshot<T>): Promise<void>;

  /**
   * Get the latest snapshot for an aggregate
   */
  abstract getSnapshot<T>(aggregateId: string): Promise<Snapshot<T> | null>;

  /**
   * Rebuild state from events
   */
  async rebuildState<T>(
    aggregateId: string,
    reducer: (state: T, event: DomainEvent) => T,
    initialState: T
  ): Promise<T> {
    // Try to get snapshot first
    const snapshot = await this.getSnapshot<T>(aggregateId);
    let state = snapshot?.state ?? initialState;
    const fromVersion = snapshot?.version ?? 0;

    // Get events after snapshot
    const events = await this.getEvents(aggregateId, fromVersion);

    // Apply events to state
    for (const event of events) {
      state = reducer(state, event);
    }

    return state;
  }

  /**
   * Check if a snapshot should be created
   */
  protected shouldCreateSnapshot(version: number): boolean {
    return this.config.enableSnapshots && version % this.config.snapshotInterval === 0;
  }
}

/**
 * In-memory Event Store implementation (for development/testing)
 */
export class InMemoryEventStore extends EventStore {
  private events: DomainEvent[] = [];
  private snapshots: Map<string, Snapshot<unknown>> = new Map();

  async append(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }

  async appendBatch(events: DomainEvent[]): Promise<void> {
    this.events.push(...events);
  }

  async getEvents(aggregateId: string, fromVersion: number = 0): Promise<DomainEvent[]> {
    return this.events.filter(
      e => e.aggregateId === aggregateId && e.version > fromVersion
    );
  }

  async query(query: EventQuery): Promise<DomainEvent[]> {
    let results = [...this.events];

    if (query.aggregateId) {
      results = results.filter(e => e.aggregateId === query.aggregateId);
    }

    if (query.aggregateType) {
      results = results.filter(e => e.aggregateType === query.aggregateType);
    }

    if (query.eventTypes && query.eventTypes.length > 0) {
      results = results.filter(e => query.eventTypes!.includes(e.eventType));
    }

    if (query.fromVersion !== undefined) {
      results = results.filter(e => e.version >= query.fromVersion!);
    }

    if (query.toVersion !== undefined) {
      results = results.filter(e => e.version <= query.toVersion!);
    }

    if (query.fromTimestamp) {
      results = results.filter(e => e.timestamp >= query.fromTimestamp!);
    }

    if (query.toTimestamp) {
      results = results.filter(e => e.timestamp <= query.toTimestamp!);
    }

    if (query.offset) {
      results = results.slice(query.offset);
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  async getLatestVersion(aggregateId: string): Promise<number> {
    const events = this.events.filter(e => e.aggregateId === aggregateId);
    if (events.length === 0) return 0;
    return Math.max(...events.map(e => e.version));
  }

  async saveSnapshot<T>(snapshot: Snapshot<T>): Promise<void> {
    this.snapshots.set(snapshot.aggregateId, snapshot as Snapshot<unknown>);
  }

  async getSnapshot<T>(aggregateId: string): Promise<Snapshot<T> | null> {
    return (this.snapshots.get(aggregateId) as Snapshot<T>) ?? null;
  }

  /**
   * Clear all events (for testing)
   */
  clear(): void {
    this.events = [];
    this.snapshots.clear();
  }

  /**
   * Get total event count
   */
  getEventCount(): number {
    return this.events.length;
  }
}

// Singleton instance
let eventStoreInstance: EventStore | null = null;

export function getEventStore(config?: EventStoreConfig): EventStore {
  if (!eventStoreInstance) {
    // Default to in-memory store
    eventStoreInstance = new InMemoryEventStore(config);
  }
  return eventStoreInstance;
}

export function setEventStore(store: EventStore): void {
  eventStoreInstance = store;
}

export function resetEventStore(): void {
  eventStoreInstance = null;
}
