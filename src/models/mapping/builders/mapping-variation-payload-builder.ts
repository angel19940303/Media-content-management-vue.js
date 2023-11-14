import { Sport } from "../../enums/sport";
import { Provider } from "../../enums/provider";
import { Gender } from "../../enums/gender";
import { MappingVariationPayload } from "../mapping-variation-payload";
import { MappingParticipantPayload } from "../mapping-participant-payload";
import { MappingVariation } from "../mapping-variation";

export class MappingVariationPayloadBuilder {
  private sportId = Sport.SOCCER;
  private providerId = Provider.ENET;
  private genderId = Gender.UNKNOWN;
  private kind = 0;
  private participantId = "";
  private variation: MappingVariation = {
    name: "",
    entity_id: "",
    provider_id: Provider.ENET,
  };

  static fromParticipantPayload(
    participantPayload: MappingParticipantPayload
  ): MappingVariationPayloadBuilder {
    return this.new()
      .setSportId(participantPayload.sport)
      .setProviderId(participantPayload.provider)
      .setGenderId(participantPayload.gender)
      .setKind(participantPayload.participant_kind)
      .setParticipantId(participantPayload.participant_id);
  }

  static new(): MappingVariationPayloadBuilder {
    return new MappingVariationPayloadBuilder();
  }

  private constructor() {}

  setSportId(sportId: number): MappingVariationPayloadBuilder {
    this.sportId = sportId;
    return this;
  }

  setProviderId(providerId: number): MappingVariationPayloadBuilder {
    this.providerId = providerId;
    return this;
  }

  setGenderId(genderId: number): MappingVariationPayloadBuilder {
    this.genderId = genderId;
    return this;
  }

  setKind(kind: number): MappingVariationPayloadBuilder {
    this.kind = kind;
    return this;
  }

  setParticipantId(participantId: string): MappingVariationPayloadBuilder {
    this.participantId = participantId;
    return this;
  }

  setVariation(variation: MappingVariation): MappingVariationPayloadBuilder {
    this.variation = variation;
    return this;
  }

  build(): MappingVariationPayload | undefined {
    return {
      sport_id: this.sportId,
      provider_id: this.providerId,
      gender_id: this.genderId,
      kind: this.kind,
      participant_id: this.participantId,
      variation: this.variation,
    };
  }
}
