import { Locale } from "../common/locale";
import { LocaleBuilder } from "../common/builders/locale-builder";
import { LocEnumItem } from "../loc-enums/loc-enum-item";
import { LocEnumFormValidation } from "./loc-enum-form-validation";
import { LocEnumItemBuilder } from "../loc-enums/builders/loc-enum-item-builder";

export class LocEnumFormData {
  readonly name: Locale;
  readonly sportId: number;
  readonly providerIds: Map<number, string>;
  readonly validation: LocEnumFormValidation;

  private constructor(
    name: Locale,
    sportId: number,
    providerIds: Map<number, string>,
    validation: LocEnumFormValidation
  ) {
    this.name = name;
    this.sportId = sportId;
    this.providerIds = providerIds;
    this.validation = validation;
  }

  static create(sportId: number): LocEnumFormData {
    return new LocEnumFormData(
      LocaleBuilder.create().build(),
      sportId,
      new Map<number, string>(),
      LocEnumFormValidation.create()
    );
  }

  static from(locEnumItem: LocEnumItem): LocEnumFormData {
    return new LocEnumFormData(
      locEnumItem.name,
      locEnumItem.sportId,
      locEnumItem.providerIds,
      LocEnumFormValidation.create()
    );
  }

  withName(name: Locale): LocEnumFormData {
    return this.copy({
      name: name,
      validation: this.validation.withName(name),
    });
  }

  withSportId(sportId: number): LocEnumFormData {
    return this.copy({
      sportId: sportId,
      validation: this.validation.withSportId(sportId),
    });
  }

  withProviderIds(providerIds: Map<number, string>): LocEnumFormData {
    return this.copy({
      providerIds: providerIds,
      validation: this.validation.withProviderIds(providerIds),
    });
  }

  withNewProviderId(provider: number, id: string): LocEnumFormData {
    const newProviderIds = new Map<number, string>(this.providerIds);
    newProviderIds.set(provider, id);
    return this.withProviderIds(newProviderIds);
  }

  validated(): LocEnumFormData {
    const validation = this.validation
      .withName(this.name)
      .withSportId(this.sportId)
      .withProviderIds(this.providerIds);
    return this.copy({ validation: validation });
  }

  locEnumItemBuilder(): LocEnumItemBuilder {
    return new LocEnumItemBuilder()
      .setName(this.name)
      .setSport(this.sportId)
      .setProviderIds(this.providerIds);
  }

  private copy(data: Partial<LocEnumFormData>): LocEnumFormData {
    const getOrElse = <T>(value: T | undefined, fallback: T) =>
      value !== undefined ? value : fallback;
    return new LocEnumFormData(
      data.name || this.name,
      getOrElse(data.sportId, this.sportId),
      data.providerIds || this.providerIds,
      data.validation || this.validation
    );
  }
}
