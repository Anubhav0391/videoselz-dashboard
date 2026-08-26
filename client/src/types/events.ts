export type EventType = 'view' | 'click' | 'add_to_cart';

export interface CreatedEvent {
  id: number;
  videoId: number;
  eventType: EventType;
  timestamp: string;
}