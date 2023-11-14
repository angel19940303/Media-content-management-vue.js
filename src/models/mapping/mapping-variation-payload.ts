import { MappingVariation } from "./mapping-variation";

export interface MappingVariationPayload {
  sport_id: number;
  provider_id: number;
  gender_id: number;
  kind: number;
  participant_id: string;
  variation: MappingVariation;
}
