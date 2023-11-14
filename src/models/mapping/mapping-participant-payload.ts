import { MappingVariation } from "./mapping-variation";

export interface MappingParticipantPayload {
  id: number;
  mapped_id: number | undefined;
  sport: number;
  provider: number;
  creator: number;
  gender: number;
  participant_kind: number;
  participant_id: string;
  country_id: string;
  name: string;
  tokens: string[];
  variations: MappingVariation[];
  abbreviation: string;
  created_at: string;
  updated_at: string;
}
