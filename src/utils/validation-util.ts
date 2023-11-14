import { EnumList } from "../models/common/enum-list";
import { Locale } from "../models/common/locale";

export class ValidationUtil {
  private static readonly ISO_DATE_VALIDATION_REGEX = new RegExp(
    "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z"
  );

  private static readonly URL_PATH_VALIDATION_REGEX = new RegExp(
    "^/[/.a-zA-Z0-9-]+$"
  );

  private static readonly URL_VALIDATION_REGEX = new RegExp(
    /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  );

  private static readonly EMAIL_VALIDATION_REGEX = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  static isValidUrlPath(str: string): boolean {
    return ValidationUtil.URL_PATH_VALIDATION_REGEX.test(str);
  }

  static isValidUrl(str: string): boolean {
    return ValidationUtil.URL_VALIDATION_REGEX.test(str);
  }

  static isValidIsoDate(str: string): boolean {
    return ValidationUtil.ISO_DATE_VALIDATION_REGEX.test(str);
  }

  static isValidEmail(str: string): boolean {
    return ValidationUtil.EMAIL_VALIDATION_REGEX.test(str);
  }

  static isValidSportId(sportId: number, enums: EnumList): boolean {
    return enums.hasSport(sportId) && sportId > 0;
  }

  static isValidLanguageCode(languageCode: string, enums: EnumList): boolean {
    return (
      enums.hasLanguageWithCode(languageCode) &&
      languageCode !== "UNKNOWN_LANGUAGE"
    );
  }

  static isYoutubeUrl(str: string): boolean {
    return (
      this.isValidUrl(str) &&
      (str.indexOf("://youtube.") >= 0 ||
        str.indexOf("://www.youtube.") >= 0 ||
        str.indexOf("://youtu.be") >= 0 ||
        str.indexOf("://www.youtu.be") >= 0)
    );
  }

  static isValidProviderId(providerId: number, enums: EnumList): boolean {
    return enums.hasProvider(providerId) && providerId > 0;
  }

  static isNonEmptyLocale(locale: Locale): boolean {
    if (locale.locale.size > 0) {
      const valueIterator = locale.locale.values();
      let valueItem = valueIterator.next();
      while (!valueItem.done) {
        if (valueItem.value.value !== "") {
          return true;
        }
        valueItem = valueIterator.next();
      }
    }
    return false;
  }

  static isEmptyLocaleOrHasValueForLanguage(
    locale: Locale,
    language: string
  ): boolean {
    if (this.isNonEmptyLocale(locale)) {
      return (
        locale.locale.has(language) && locale.locale.get(language)?.value !== ""
      );
    }
    return true;
  }
}
