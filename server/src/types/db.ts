export interface ProductRow {
  id: number;
  name: string;
  price: number;
  created_at: string;
}

export interface VideoRow {
  id: number;
  product_id: number;
  video_url: string;
  title: string;
  created_at: string;
}

export type EventType = 'view' | 'click' | 'add_to_cart';

export interface EngagementEventRow {
  id: number;
  video_id: number;
  event_type: EventType;
  timestamp: string;
}