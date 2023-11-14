export interface NewsFeedDataPayload {
  ID?: number;
  Sport: number;
  Provider: number;
  Language: string;
  URL: string;
  Enabled: boolean;
  ExternalLinks: boolean;
  FrequencyInMinutes: number;
  Source: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}
