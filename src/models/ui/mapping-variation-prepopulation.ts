import { MappingVariation } from "../mapping/mapping-variation";
import { MappingMatchTeam } from "./mapping-match";

export class MappingVariationPrePopulation {
  readonly name: string;
  readonly sport: number;
  readonly provider: number;
  readonly gender: number;
  readonly participantId: string;
  readonly variation: MappingVariation;

  private constructor(
    name: string,
    sport: number,
    provider: number,
    gender: number,
    participantId: string,
    variationId: string,
    variationName: string,
    variationProvider: number
  ) {
    this.name = name;
    this.sport = sport;
    this.provider = provider;
    this.gender = gender;
    this.participantId = participantId;
    this.variation = {
      entity_id: variationId,
      name: variationName,
      provider_id: variationProvider,
    };
  }

  static fromMappingMatchTeams(
    sourceTeam: MappingMatchTeam,
    destinationTeam: MappingMatchTeam
  ): MappingVariationPrePopulation {
    return new MappingVariationPrePopulation(
      destinationTeam.name,
      destinationTeam.sport,
      destinationTeam.providerId,
      destinationTeam.gender,
      destinationTeam.id,
      sourceTeam.id,
      sourceTeam.name,
      sourceTeam.providerId
    );
  }
}
