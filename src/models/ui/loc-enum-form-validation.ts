import { Locale } from "../common/locale";
import { LocEnumItem } from "../loc-enums/loc-enum-item";
import { BaseValidation } from "./base-validation";
import { Sport } from "../enums/sport";
import { Provider } from "../enums/provider";

export class LocEnumFormValidation {
  readonly isNameValid: boolean;
  readonly isSportIdValid: boolean;
  readonly areProviderIdsValid: boolean;
  readonly isValid: boolean;

  private readonly nameErrors: Array<string>;
  private readonly sportIdErrors: Array<string>;
  private readonly providerIdErrors: Array<string>;

  private readonly isInitial: boolean;

  private constructor(
    nameErrors: Array<string>,
    sportIdErrors: Array<string>,
    providerIdErrors: Array<string>,
    isInitial: boolean
  ) {
    this.isNameValid = isInitial || nameErrors.length === 0;
    this.isSportIdValid = isInitial || sportIdErrors.length === 0;
    this.areProviderIdsValid = isInitial || providerIdErrors.length === 0;

    this.nameErrors = nameErrors;
    this.sportIdErrors = sportIdErrors;
    this.providerIdErrors = providerIdErrors;
    this.isInitial = isInitial;
    this.isValid =
      this.isNameValid && this.isSportIdValid && this.areProviderIdsValid;
  }

  private static validateSportId(sportId: number): Array<string> {
    if (Sport.code(sportId) === undefined) {
      return ["Invalid sport ID"];
    }
    return [];
  }

  private static validateProviderIds(
    providerIds: Map<number, string>
  ): Array<string> {
    const errors = new Array<string>();
    let hasNonEmptyProviderId = false;
    providerIds.forEach((id, providerId) => {
      if (Provider.codeForProvider(providerId) === undefined) {
        errors.push("Invalid provider ID: " + providerId);
      }
      hasNonEmptyProviderId = hasNonEmptyProviderId || id.length > 0;
    });
    if (!hasNonEmptyProviderId) {
      errors.push("Provider IDs are empty");
    }
    return errors;
  }

  static create(): LocEnumFormValidation {
    return new LocEnumFormValidation([], [], [], true);
  }

  static from(locEnumItem: LocEnumItem) {
    return new LocEnumFormValidation(
      BaseValidation.validateName(locEnumItem.name),
      LocEnumFormValidation.validateSportId(locEnumItem.sportId),
      LocEnumFormValidation.validateProviderIds(locEnumItem.providerIds),
      false
    );
  }

  getNameErrors(): Array<string> {
    return this.isInitial ? [] : this.nameErrors;
  }

  getSportIdErrors(): Array<string> {
    return this.isInitial ? [] : this.sportIdErrors;
  }

  getProviderIdErrors(): Array<string> {
    return this.isInitial ? [] : this.providerIdErrors;
  }

  withName(name: Locale): LocEnumFormValidation {
    const errors = BaseValidation.validateName(name);
    return new LocEnumFormValidation(
      errors,
      this.sportIdErrors,
      this.providerIdErrors,
      false
    );
  }

  withSportId(sportId: number): LocEnumFormValidation {
    const errors = LocEnumFormValidation.validateSportId(sportId);
    return new LocEnumFormValidation(
      this.nameErrors,
      errors,
      this.providerIdErrors,
      false
    );
  }

  withProviderIds(providerIds: Map<number, string>): LocEnumFormValidation {
    const errors = LocEnumFormValidation.validateProviderIds(providerIds);
    return new LocEnumFormValidation(
      this.nameErrors,
      this.sportIdErrors,
      errors,
      false
    );
  }

  validated(): LocEnumFormValidation {
    if (this.isInitial) {
      return new LocEnumFormValidation(
        this.nameErrors,
        this.sportIdErrors,
        this.providerIdErrors,
        false
      );
    }
    return this;
  }
}
