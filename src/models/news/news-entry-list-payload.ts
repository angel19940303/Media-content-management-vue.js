import { NewsEntryDataPayload } from "./news-entry-data-payload";

export interface NewsEntryListPayload {
  data: NewsEntryDataPayload[];
  totalNumberOfRecords: number;
}
