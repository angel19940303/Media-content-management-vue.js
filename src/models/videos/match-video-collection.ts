import { VideoEntryDataPayload } from "./video-entry-data-payload";

export interface MatchVideoCollection {
  internalEventId: string;
  language: string;
  videos: VideoEntryDataPayload[];
  created_at: string;
  updated_at: string;
}
