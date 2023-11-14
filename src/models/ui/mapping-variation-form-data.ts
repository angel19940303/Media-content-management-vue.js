import { BaseUIModel } from "./base-ui-model";
import { MappingVariation } from "../mapping/mapping-variation";
import { MappingVariationFormValidation } from "./mapping-variation-form-validation";
import { EnumList } from "../common/enum-list";

export class MappingVariationFormData extends BaseUIModel {
  readonly providerId: number;
  readonly name: string;
  readonly entityId: string;
  readonly validation: MappingVariationFormValidation;

  private constructor(
    providerId: number,
    name: string,
    entityId: string,
    validation: MappingVariationFormValidation
  ) {
    super();
    this.providerId = providerId;
    this.name = name;
    this.entityId = entityId;
    this.validation = validation;
  }

  static create(): MappingVariationFormData {
    return new MappingVariationFormData(
      0,
      "",
      "",
      MappingVariationFormValidation.create()
    );
  }

  static fromData(
    providerId: number,
    name: string,
    entityId: string,
    isInitial: boolean,
    enums: EnumList
  ): MappingVariationFormData {
    const validation = MappingVariationFormValidation.fromData(
      providerId,
      name,
      entityId,
      isInitial,
      enums
    );
    return new MappingVariationFormData(providerId, name, entityId, validation);
  }

  withProviderId(
    providerId: number,
    enums: EnumList
  ): MappingVariationFormData {
    return this.copy({
      providerId: providerId,
      validation: this.validation.withProviderId(providerId, enums),
    });
  }

  withName(name: string): MappingVariationFormData {
    return this.copy({
      name: name,
      validation: this.validation.withName(name),
    });
  }

  withEntityId(entityId: string): MappingVariationFormData {
    return this.copy({
      entityId: entityId,
      validation: this.validation.withEntityId(entityId),
    });
  }

  validated(enums: EnumList): MappingVariationFormData {
    return this.copy({
      validation: this.validation
        .withProviderId(this.providerId, enums)
        .withName(this.name)
        .withEntityId(this.entityId),
    });
  }

  payload(): MappingVariation {
    return {
      provider_id: this.providerId,
      name: this.name,
      entity_id: this.entityId,
    };
  }

  private copy(
    values: Partial<MappingVariationFormData>
  ): MappingVariationFormData {
    return new MappingVariationFormData(
      this.valueOrElse(values.providerId, this.providerId),
      this.valueOrElse(values.name, this.name),
      this.valueOrElse(values.entityId, this.entityId),
      this.valueOrElse(values.validation, this.validation)
    );
  }
}
