import { InternalParticipant } from "./internal-participant";

export interface MappedMatch {
  ID: number;
  Sport: number;
  Provider: number;
  ProviderMatchID: string;
  Season: string;
  CategoryID: string;
  CategoryName: string;
  StageID: string;
  StageName: string;
  CreatedAt: string;
  UpdateddAt: string;
  InternalParticipants: Array<InternalParticipant>;
}
