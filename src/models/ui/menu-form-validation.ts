import { MenuItem } from "../menu/menu-item";
import { Locale } from "../common/locale";
import { TimeRange } from "../common/time-range";
import { MenuItemType } from "../enums/menu-item-type";
import { StageMapping } from "../menu/stage-mapping";
import { FlagVariant } from "../enums/flag-variant";
import { ValidationUtil } from "../../utils/validation-util";
import { BaseValidation } from "./base-validation";

export class MenuFormValidation {
  readonly isValid: boolean;
  readonly isNameValid: boolean;
  readonly isCodeValid: boolean;
  readonly isTimeRangeValid: boolean;
  readonly isPrimaryValid: boolean;
  readonly isStageMappingValid: boolean;
  readonly areFlagVariantsValid: boolean;

  private readonly nameErrors: Array<string>;
  private readonly codeErrors: Array<string>;
  private readonly timeRangeErrors: Array<string>;
  private readonly primaryErrors: Array<string>;
  private readonly stageMappingErrors: Array<string>;
  private readonly flagVariantErrors: Map<number, string>;
  private readonly isInitial: boolean;
  private readonly siblings: Array<MenuItem>;

  constructor(
    nameErrors: Array<string>,
    codeErrors: Array<string>,
    timeRangeErrors: Array<string>,
    primaryErrors: Array<string>,
    stageMappingErrors: Array<string>,
    flagVariantErrors: Map<number, string>,
    siblings: Array<MenuItem>,
    isInitial: boolean
  ) {
    this.nameErrors = nameErrors;
    this.codeErrors = codeErrors;
    this.timeRangeErrors = timeRangeErrors;
    this.primaryErrors = primaryErrors;
    this.stageMappingErrors = stageMappingErrors;
    this.flagVariantErrors = flagVariantErrors;
    this.siblings = siblings;
    this.isInitial = isInitial;

    this.isNameValid = isInitial || nameErrors.length === 0;
    this.isCodeValid = isInitial || codeErrors.length === 0;
    this.isTimeRangeValid = isInitial || timeRangeErrors.length === 0;
    this.isPrimaryValid = isInitial || primaryErrors.length === 0;
    this.isStageMappingValid = isInitial || stageMappingErrors.length === 0;
    this.areFlagVariantsValid = isInitial || flagVariantErrors.size === 0;

    this.isValid =
      this.isNameValid &&
      this.isCodeValid &&
      this.isTimeRangeValid &&
      this.isPrimaryValid &&
      this.isStageMappingValid &&
      this.areFlagVariantsValid;
  }

  static validateTimeRange(type: number, timeRange?: TimeRange): Array<string> {
    if (
      type === MenuItemType.SEASON &&
      timeRange &&
      timeRange.start > timeRange.end
    ) {
      return ["Invalid time range"];
    }
    return [];
  }

  static validateTimeRangeParts(
    type: number,
    start: string,
    end: string
  ): Array<string> {
    if (
      type !== MenuItemType.SEASON ||
      (start === "" && end === "") ||
      (start !== "" && start <= end)
    ) {
      return [];
    }
    return ["Invalid time range"];
  }

  static validatePrimary(
    type: number,
    primary: boolean,
    siblings: Array<MenuItem>,
    full?: boolean
  ): Array<string> {
    if (
      type === MenuItemType.SEASON &&
      !primary &&
      full === true &&
      siblings.find((n) => n.primary) === undefined
    ) {
      return ["No primary season has been selected"];
    }
    return [];
  }

  static validateStageMappings(
    type: number,
    stageMappings: Array<StageMapping>
  ): Array<string> {
    if (type === MenuItemType.SEASON && stageMappings.length === 0) {
      return ["No stage mapping has been added to the season"];
    }
    return [];
  }

  static validateFlagVariants(
    flagVariants: Map<number, string>
  ): Map<number, string> {
    const result = new Map<number, string>();
    flagVariants.forEach((value, key) => {
      if (
        value.length > 0 &&
        !ValidationUtil.isValidUrl(value) &&
        !ValidationUtil.isValidUrlPath(value)
      ) {
        const title = FlagVariant.title(key);
        result.set(key, "Invalid " + title + " flag URL");
      }
    });
    return result;
  }

  static create(siblings: Array<MenuItem>): MenuFormValidation {
    return new MenuFormValidation(
      [],
      [],
      [],
      [],
      [],
      new Map<number, string>(),
      siblings,
      true
    );
  }

  static from(
    menuItem: MenuItem,
    siblings: Array<MenuItem>
  ): MenuFormValidation {
    return new MenuFormValidation(
      BaseValidation.validateName(menuItem.name),
      BaseValidation.validateCode(menuItem.code, siblings),
      MenuFormValidation.validateTimeRange(menuItem.type, menuItem.timeRange),
      MenuFormValidation.validatePrimary(
        menuItem.type,
        menuItem.primary,
        siblings
      ),
      MenuFormValidation.validateStageMappings(
        menuItem.type,
        menuItem.stageMappings
      ),
      MenuFormValidation.validateFlagVariants(menuItem.flagVariants),
      siblings,
      false
    );
  }

  getNameErrors(): Array<string> {
    return this.isInitial ? [] : this.nameErrors;
  }

  getCodeErrors(): Array<string> {
    return this.isInitial ? [] : this.codeErrors;
  }

  getTimeRangeErrors(): Array<string> {
    return this.isInitial ? [] : this.timeRangeErrors;
  }

  getPrimaryErrors(): Array<string> {
    return this.isInitial ? [] : this.primaryErrors;
  }

  getStageMappingErrors(): Array<string> {
    return this.isInitial ? [] : this.stageMappingErrors;
  }

  getFlagVariantErrors(): Map<number, string> {
    return this.isInitial ? new Map<number, string>() : this.flagVariantErrors;
  }

  withName(name: Locale): MenuFormValidation {
    const errors = BaseValidation.validateName(name);
    return new MenuFormValidation(
      errors,
      this.codeErrors,
      this.timeRangeErrors,
      this.primaryErrors,
      this.stageMappingErrors,
      this.flagVariantErrors,
      this.siblings,
      false
    );
  }

  withCode(
    code: Locale,
    siblings: Array<MenuItem>,
    full?: boolean
  ): MenuFormValidation {
    const errors = BaseValidation.validateCode(code, siblings, full);
    return new MenuFormValidation(
      this.nameErrors,
      errors,
      this.timeRangeErrors,
      this.primaryErrors,
      this.stageMappingErrors,
      this.flagVariantErrors,
      siblings,
      false
    );
  }

  withTimeRange(type: number, start: string, end: string): MenuFormValidation {
    const errors = MenuFormValidation.validateTimeRangeParts(type, start, end);
    return new MenuFormValidation(
      this.nameErrors,
      this.codeErrors,
      errors,
      this.primaryErrors,
      this.stageMappingErrors,
      this.flagVariantErrors,
      this.siblings,
      false
    );
  }

  withPrimary(
    type: number,
    primary: boolean,
    siblings: Array<MenuItem>,
    full?: boolean
  ): MenuFormValidation {
    const errors = MenuFormValidation.validatePrimary(
      type,
      primary,
      siblings,
      full
    );
    return new MenuFormValidation(
      this.nameErrors,
      this.codeErrors,
      this.timeRangeErrors,
      errors,
      this.stageMappingErrors,
      this.flagVariantErrors,
      siblings,
      false
    );
  }

  withStageMappings(
    type: number,
    stageMappings: Array<StageMapping>
  ): MenuFormValidation {
    const errors = MenuFormValidation.validateStageMappings(
      type,
      stageMappings
    );
    return new MenuFormValidation(
      this.nameErrors,
      this.codeErrors,
      this.timeRangeErrors,
      this.primaryErrors,
      errors,
      this.flagVariantErrors,
      this.siblings,
      false
    );
  }

  withFlagVariants(flagVariants: Map<number, string>): MenuFormValidation {
    const errors = MenuFormValidation.validateFlagVariants(flagVariants);
    return new MenuFormValidation(
      this.nameErrors,
      this.codeErrors,
      this.timeRangeErrors,
      this.primaryErrors,
      this.stageMappingErrors,
      errors,
      this.siblings,
      false
    );
  }

  validated(): MenuFormValidation {
    if (this.isInitial) {
      return new MenuFormValidation(
        this.nameErrors,
        this.codeErrors,
        this.timeRangeErrors,
        this.primaryErrors,
        this.stageMappingErrors,
        this.flagVariantErrors,
        this.siblings,
        false
      );
    }
    return this;
  }
}
