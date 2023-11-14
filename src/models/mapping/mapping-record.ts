import { MappingMatchRecord } from "./mapping-match-record";

export interface MappingRecord {
  creator_match: MappingMatchRecord;
  mapping_match: MappingMatchRecord;
  rank: number;
}
