import { ValidationUtil } from "../../utils/validation-util";
import { NewsFeedDataPayload } from "../news/news-feed-data-payload";
import { EnumList } from "../common/enum-list";

export class NewsFeedFormValidation {
  readonly isUrlValid: boolean;
  readonly isFrequencyValid: boolean;
  readonly isLanguageValid: boolean;
  readonly isSportValid: boolean;
  readonly isSourceValid: boolean;
  readonly isValid: boolean;

  private readonly urlErrors: Array<string>;
  private readonly frequencyErrors: Array<string>;
  private readonly languageErrors: Array<string>;
  private readonly sportErrors: Array<string>;
  private readonly sourceErrors: Array<string>;

  private readonly isInitial: boolean;

  private constructor(
    urlErrors: Array<string>,
    frequencyErrors: Array<string>,
    languageErrors: Array<string>,
    sportErrors: Array<string>,
    sourceErrors: Array<string>,
    isInitial: boolean
  ) {
    this.isUrlValid = isInitial || urlErrors.length === 0;
    this.isFrequencyValid = isInitial || frequencyErrors.length === 0;
    this.isLanguageValid = isInitial || languageErrors.length === 0;
    this.isSportValid = isInitial || sportErrors.length === 0;
    this.isSourceValid = isInitial || sourceErrors.length === 0;
    this.urlErrors = urlErrors;
    this.frequencyErrors = frequencyErrors;
    this.languageErrors = languageErrors;
    this.sportErrors = sportErrors;
    this.sourceErrors = sourceErrors;
    this.isValid =
      this.isUrlValid &&
      this.isFrequencyValid &&
      this.isLanguageValid &&
      this.isSportValid &&
      this.isSourceValid;
    this.isInitial = isInitial;
  }

  private static validateUrl(url: string | undefined): Array<string> {
    const errors = new Array<string>();
    if (url === undefined) {
      errors.push("URL is empty");
    } else if (!ValidationUtil.isValidUrl(url)) {
      errors.push("URL is invalid");
    }
    return errors;
  }

  private static validateFrequency(frequency: number): Array<string> {
    if (frequency < 0) {
      return ["Frequency must not be negative"];
    }
    return [];
  }

  private static validateSportId(
    sportId: number,
    enums: EnumList
  ): Array<string> {
    if (!ValidationUtil.isValidSportId(sportId, enums)) {
      return ["Sport is invalid"];
    }
    return [];
  }

  private static validateLanguageCode(
    languageCode: string,
    enums: EnumList
  ): Array<string> {
    if (!ValidationUtil.isValidLanguageCode(languageCode, enums)) {
      return ["Language is invalid"];
    }
    return [];
  }

  private static validateSource(source: string): Array<string> {
    if (source.length === 0) {
      return ["Source is empty"];
    }
    return [];
  }

  static create(): NewsFeedFormValidation {
    return new NewsFeedFormValidation([], [], [], [], [], true);
  }

  static from(
    data: NewsFeedDataPayload,
    enums: EnumList
  ): NewsFeedFormValidation {
    const urlErrors = NewsFeedFormValidation.validateUrl(data.URL);
    const frequencyErrors = NewsFeedFormValidation.validateFrequency(
      data.FrequencyInMinutes
    );
    const sportErrors = NewsFeedFormValidation.validateSportId(
      data.Sport,
      enums
    );
    const languageErrors = NewsFeedFormValidation.validateLanguageCode(
      data.Language,
      enums
    );
    const sourceErrors = NewsFeedFormValidation.validateSource(data.Source);
    return new NewsFeedFormValidation(
      urlErrors,
      frequencyErrors,
      languageErrors,
      sportErrors,
      sourceErrors,
      false
    );
  }

  getUrlErrors(): Array<string> {
    return this.isInitial ? [] : this.urlErrors;
  }

  getSportErrors(): Array<string> {
    return this.isInitial ? [] : this.sportErrors;
  }

  getLanguageErrors(): Array<string> {
    return this.isInitial ? [] : this.languageErrors;
  }

  getFrequencyErrors(): Array<string> {
    return this.isInitial ? [] : this.frequencyErrors;
  }

  getSourceErrors(): Array<string> {
    return this.isInitial ? [] : this.sourceErrors;
  }

  withUrl(url: string | undefined): NewsFeedFormValidation {
    const errors = NewsFeedFormValidation.validateUrl(url);
    return new NewsFeedFormValidation(
      errors,
      this.frequencyErrors,
      this.languageErrors,
      this.sportErrors,
      this.sourceErrors,
      false
    );
  }

  withFrequency(frequency: number): NewsFeedFormValidation {
    const errors = NewsFeedFormValidation.validateFrequency(frequency);
    return new NewsFeedFormValidation(
      this.urlErrors,
      errors,
      this.languageErrors,
      this.sportErrors,
      this.sourceErrors,
      false
    );
  }

  withLanguageCode(languageCode: string, enums: EnumList) {
    const errors = NewsFeedFormValidation.validateLanguageCode(
      languageCode,
      enums
    );
    return new NewsFeedFormValidation(
      this.urlErrors,
      this.frequencyErrors,
      errors,
      this.sportErrors,
      this.sourceErrors,
      false
    );
  }

  withSportId(sportId: number, enums: EnumList) {
    const errors = NewsFeedFormValidation.validateSportId(sportId, enums);
    return new NewsFeedFormValidation(
      this.urlErrors,
      this.frequencyErrors,
      this.languageErrors,
      errors,
      this.sourceErrors,
      false
    );
  }

  withSource(source: string) {
    const errors = NewsFeedFormValidation.validateSource(source);
    return new NewsFeedFormValidation(
      this.urlErrors,
      this.frequencyErrors,
      this.languageErrors,
      this.sportErrors,
      errors,
      false
    );
  }

  validated(): NewsFeedFormValidation {
    if (this.isInitial) {
      return new NewsFeedFormValidation(
        this.urlErrors,
        this.frequencyErrors,
        this.languageErrors,
        this.sportErrors,
        this.sourceErrors,
        false
      );
    }
    return this;
  }
}
