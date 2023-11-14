import { MappingParticipantPayload } from "../mapping/mapping-participant-payload";
import { Gender } from "../enums/gender";
import { MappingVariation } from "../mapping/mapping-variation";
import { BaseUIModel } from "./base-ui-model";

export class MappingParticipantSearchResult extends BaseUIModel {
  readonly id: number;
  readonly title: string;
  readonly subTitle: string;
  readonly sport: number;
  readonly provider: number;
  readonly gender: number;
  readonly kind: number;
  readonly participantId: string;
  readonly isMapped: boolean;
  readonly variations: MappingVariation[];

  constructor(
    id: number,
    title: string,
    subTitle: string,
    sport: number,
    provider: number,
    gender: number,
    kind: number,
    participantId: string,
    isMapped: boolean,
    variations: MappingVariation[]
  ) {
    super();
    this.id = id;
    this.title = title;
    this.subTitle = subTitle;
    this.sport = sport;
    this.provider = provider;
    this.gender = gender;
    this.kind = kind;
    this.participantId = participantId;
    this.isMapped = isMapped;
    this.variations = variations;
  }

  static fromPayload(
    payload: MappingParticipantPayload | undefined
  ): MappingParticipantSearchResult | undefined {
    if (
      payload === undefined ||
      payload.id === undefined ||
      payload.name === undefined ||
      payload.sport === undefined ||
      payload.provider === undefined ||
      payload.gender === undefined ||
      payload.participant_kind === undefined
    ) {
      return undefined;
    }
    const genderStr = Gender.title(payload.gender);
    const title =
      payload.name + (genderStr !== undefined ? " (" + genderStr + ")" : "");
    const variationList = new Array<MappingVariation>();
    const variationNameSet = new Set<string>();
    if (payload.variations !== undefined) {
      payload.variations.forEach((variation) => {
        if (
          variation.name !== undefined &&
          !variationNameSet.has(variation.name)
        ) {
          variationNameSet.add(variation.name);
          variationList.push(variation);
        }
      });
    }
    const isMapped = payload.mapped_id !== undefined;
    return new MappingParticipantSearchResult(
      payload.id,
      title,
      variationList.map((variation) => variation.name).join(", "),
      payload.sport,
      payload.provider,
      payload.gender,
      payload.participant_kind,
      payload.participant_id,
      isMapped,
      variationList
    );
  }

  static fromPayloadList(
    payloadList: MappingParticipantPayload[] | undefined
  ): MappingParticipantSearchResult[] {
    const results = new Array<MappingParticipantSearchResult>();
    if (payloadList !== undefined) {
      payloadList.forEach((payload) => {
        const result = this.fromPayload(payload);
        if (result !== undefined) {
          results.push(result);
        }
      });
    }
    return results;
  }

  private static variationsEqual(
    variation1: MappingVariation,
    variation2: MappingVariation
  ): boolean {
    return (
      variation1.name === variation2.name &&
      variation1.provider_id === variation2.provider_id &&
      variation1.entity_id === variation2.entity_id
    );
  }

  withAddedVariation(
    variation: MappingVariation
  ): MappingParticipantSearchResult {
    const newVariations = Array.from(this.variations);
    if (
      newVariations.find((existing) =>
        MappingParticipantSearchResult.variationsEqual(variation, existing)
      ) === undefined
    ) {
      newVariations.push(variation);
    }
    const subTitle = newVariations
      .map((variation) => variation.name)
      .join(", ");
    return this.copy({ subTitle: subTitle, variations: newVariations });
  }

  withRemovedVariation(
    variation: MappingVariation
  ): MappingParticipantSearchResult {
    const newVariations = Array.from(this.variations);
    const index = newVariations.findIndex((existing) =>
      MappingParticipantSearchResult.variationsEqual(variation, existing)
    );
    if (index < 0) {
      return this;
    }
    newVariations.splice(index, 1);
    const subTitle = newVariations
      .map((variation) => variation.name)
      .join(", ");
    return this.copy({ subTitle: subTitle, variations: newVariations });
  }

  private copy(
    values: Partial<MappingParticipantSearchResult>
  ): MappingParticipantSearchResult {
    return new MappingParticipantSearchResult(
      this.valueOrElse(values.id, this.id),
      this.valueOrElse(values.title, this.title),
      this.valueOrElse(values.subTitle, this.subTitle),
      this.valueOrElse(values.sport, this.sport),
      this.valueOrElse(values.provider, this.provider),
      this.valueOrElse(values.gender, this.gender),
      this.valueOrElse(values.kind, this.kind),
      this.valueOrElse(values.participantId, this.participantId),
      this.valueOrElse(values.isMapped, this.isMapped),
      this.valueOrElse(values.variations, this.variations)
    );
  }
}
