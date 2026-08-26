export interface VideoAnalytics {
  videoId: number;
  title: string;
  productName: string;
  views: number;
  clicks: number;
  addToCarts: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface VideoAnalyticsResponse {
  data: VideoAnalytics[];
  pagination: PaginationMeta;
}