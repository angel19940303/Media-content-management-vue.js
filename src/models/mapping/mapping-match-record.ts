import { MappingParticipantRecord } from "./mapping-participant-record";

export interface MappingMatchRecord {
  RecordID: number;
  MappedID: number | undefined;
  Sport: number;
  Provider: number;
  Creator: number;
  Gender: number;
  ID: string;
  Season: string;
  StartTime: string;
  CategoryID: string;
  CategoryName: string;
  StageID: string;
  StageName: string;
  Rank: number;
  Tokens: string[];
  Participants: MappingParticipantRecord[];
  Deleted: boolean;
  Confirmed: true;
  CreatedAt: string;
  UpdatedAt: string;
}
