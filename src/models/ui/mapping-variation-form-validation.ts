import { EnumList } from "../common/enum-list";
import { BaseUIModel } from "./base-ui-model";

export class MappingVariationFormValidation extends BaseUIModel {
  readonly isProviderIdValid: boolean;
  readonly isNameValid: boolean;
  readonly isEntityIdValid: boolean;
  readonly isValid: boolean;

  readonly providerIdErrors: string[];
  readonly nameErrors: string[];
  readonly entityIdErrors: string[];

  readonly isInitial: boolean;

  private constructor(
    providerIdErrors: string[],
    nameErrors: string[],
    entityIdErrors: string[],
    isInitial: boolean
  ) {
    super();
    this.isProviderIdValid = isInitial || providerIdErrors.length === 0;
    this.isNameValid = isInitial || nameErrors.length === 0;
    this.isEntityIdValid = isInitial || entityIdErrors.length === 0;
    this.isValid =
      this.isProviderIdValid && this.isNameValid && this.isEntityIdValid;

    this.providerIdErrors = providerIdErrors;
    this.nameErrors = nameErrors;
    this.entityIdErrors = entityIdErrors;

    this.isInitial = isInitial;
  }

  static create(): MappingVariationFormValidation {
    return new MappingVariationFormValidation([], [], [], true);
  }

  static fromData(
    providerId: number,
    name: string,
    entityId: string,
    isInitial: boolean,
    enums: EnumList
  ): MappingVariationFormValidation {
    return new MappingVariationFormValidation(
      this.validateProviderId(providerId, enums),
      this.validateName(name),
      this.validateEntityId(entityId),
      true
    );
  }

  private static validateProviderId(
    providerId: number,
    enums: EnumList
  ): string[] {
    if (providerId === 0) {
      return ["provider is unknown"];
    }
    if (!enums.hasProvider(providerId)) {
      return ["provider does not exist"];
    }
    return [];
  }

  private static validateName(name: string): string[] {
    if (name.length === 0) {
      return ["name is empty"];
    }
    return [];
  }

  private static validateEntityId(entityId: string): string[] {
    return [];
  }

  getProviderIdErrors(): string[] {
    return this.isInitial ? [] : this.providerIdErrors;
  }

  getNameErrors(): string[] {
    return this.isInitial ? [] : this.nameErrors;
  }

  getEntityIdErrors(): string[] {
    return this.isInitial ? [] : this.entityIdErrors;
  }

  withProviderId(
    providerId: number,
    enums: EnumList
  ): MappingVariationFormValidation {
    const providerIdErrors = MappingVariationFormValidation.validateProviderId(
      providerId,
      enums
    );
    return this.copy({ providerIdErrors: providerIdErrors, isInitial: false });
  }

  withName(name: string): MappingVariationFormValidation {
    const nameErrors = MappingVariationFormValidation.validateName(name);
    return this.copy({ nameErrors: nameErrors, isInitial: false });
  }

  withEntityId(entityId: string): MappingVariationFormValidation {
    const entityIdErrors = MappingVariationFormValidation.validateEntityId(
      entityId
    );
    return this.copy({ entityIdErrors: entityIdErrors, isInitial: false });
  }

  validated(): MappingVariationFormValidation {
    if (this.isInitial) {
      return this.copy({ isInitial: false });
    }
    return this;
  }

  private copy(
    values: Partial<MappingVariationFormValidation>
  ): MappingVariationFormValidation {
    return new MappingVariationFormValidation(
      this.valueOrElse(values.providerIdErrors, this.providerIdErrors),
      this.valueOrElse(values.nameErrors, this.nameErrors),
      this.valueOrElse(values.entityIdErrors, this.entityIdErrors),
      this.valueOrElse(values.isInitial, this.isInitial)
    );
  }
}
