import { VideoEntryDataPayload } from "../videos/video-entry-data-payload";
import { EnumList } from "../common/enum-list";
import { DateUtil } from "../../utils/date-util";
import { ValidationUtil } from "../../utils/validation-util";
import { DataTransformUtil } from "../../utils/data-transform-util";
import { ConfigUtil } from "../../utils/config-util";

export class MatchVideoEntryFormValidation {
  readonly isUrlValid: boolean;
  readonly isTypeValid: boolean;
  readonly isDateValid: boolean;
  readonly isLanguageValid: boolean;
  readonly isValid: boolean;

  readonly urlErrors: string[];
  readonly typeErrors: string[];
  readonly dateErrors: string[];
  readonly languageErrors: string[];

  readonly isInitial: boolean;

  private constructor(
    urlErrors: string[],
    typeErrors: string[],
    dateErrors: string[],
    languageErrors: string[],
    isInitial: boolean
  ) {
    this.isUrlValid = urlErrors.length === 0;
    this.isTypeValid = typeErrors.length === 0;
    this.isDateValid = dateErrors.length === 0;
    this.isLanguageValid = languageErrors.length === 0;

    this.isValid =
      this.isUrlValid &&
      this.isTypeValid &&
      this.isDateValid &&
      this.isLanguageValid;

    this.urlErrors = urlErrors;
    this.typeErrors = typeErrors;
    this.dateErrors = dateErrors;
    this.languageErrors = languageErrors;

    this.isInitial = isInitial;
  }

  static create(): MatchVideoEntryFormValidation {
    return new MatchVideoEntryFormValidation([], [], [], [], true);
  }

  static fromData(
    language: string,
    data: VideoEntryDataPayload,
    enums: EnumList
  ): MatchVideoEntryFormValidation {
    return this.create()
      .withUrl(data.url)
      .withType(data.type)
      .withDateFromStr(data.date)
      .withLanguage(language, enums)
      .validated();
  }

  private static validateUrl(url: string): string[] {
    if (!ValidationUtil.isValidUrl(url)) {
      return ["invalid video URL"];
    }
    return [];
  }

  private static validateType(type: number): string[] {
    return [];
  }

  private static validateDate(date: Date): string[] {
    return [];
  }

  private static validateLanguage(language: string, enums: EnumList): string[] {
    if (
      !enums.hasLanguageWithCode(language) ||
      ConfigUtil.unknownLanguage() === language
    ) {
      return [`language '${language}' is invalid`];
    }
    return [];
  }

  getUrlErrors(): string[] {
    return this.isInitial ? [] : this.urlErrors;
  }

  getTypeErrors(): string[] {
    return this.isInitial ? [] : this.typeErrors;
  }

  getDateErrors(): string[] {
    return this.isInitial ? [] : this.dateErrors;
  }

  getLanguageErrors(): string[] {
    return this.isInitial ? [] : this.languageErrors;
  }

  withUrl(url: string): MatchVideoEntryFormValidation {
    return this.copy({
      urlErrors: MatchVideoEntryFormValidation.validateUrl(url),
      isInitial: false,
    });
  }

  withType(type: number): MatchVideoEntryFormValidation {
    return this.copy({
      typeErrors: MatchVideoEntryFormValidation.validateType(type),
      isInitial: false,
    });
  }

  withDate(date: Date): MatchVideoEntryFormValidation {
    return this.copy({
      dateErrors: MatchVideoEntryFormValidation.validateDate(date),
      isInitial: false,
    });
  }

  withDateFromStr(dateStr: string): MatchVideoEntryFormValidation {
    const date = DateUtil.iso8601StringToDate(dateStr);
    const dateErrors =
      date === undefined
        ? undefined
        : MatchVideoEntryFormValidation.validateDate(date);
    return this.copy({ dateErrors: dateErrors, isInitial: false });
  }

  withLanguage(
    language: string,
    enums: EnumList
  ): MatchVideoEntryFormValidation {
    const languageErrors = MatchVideoEntryFormValidation.validateLanguage(
      language,
      enums
    );
    return this.copy({ languageErrors: languageErrors, isInitial: false });
  }

  validated(): MatchVideoEntryFormValidation {
    if (this.isInitial) {
      return this.copy({ isInitial: false });
    }
    return this;
  }

  private copy(
    values: Partial<MatchVideoEntryFormValidation>
  ): MatchVideoEntryFormValidation {
    return new MatchVideoEntryFormValidation(
      DataTransformUtil.getOrElse(values.urlErrors, this.urlErrors),
      DataTransformUtil.getOrElse(values.typeErrors, this.typeErrors),
      DataTransformUtil.getOrElse(values.dateErrors, this.dateErrors),
      DataTransformUtil.getOrElse(values.languageErrors, this.languageErrors),
      DataTransformUtil.getOrElse(values.isInitial, this.isInitial)
    );
  }
}
