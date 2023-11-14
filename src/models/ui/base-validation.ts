import { Locale } from "../common/locale";
import { MenuItem } from "../menu/menu-item";
import { ConfigUtil } from "../../utils/config-util";

export class BaseValidation {
  private static readonly CODE_VALIDATION_REGEX = new RegExp(
    /^[a-zA-Z\-0-9]*$/
  );

  static validateName(name: Locale): Array<string> {
    return this.validateLocale(
      name,
      () => true,
      () => false
    );
  }

  static validateCode(
    code: Locale,
    siblings: Array<MenuItem>,
    full?: boolean
  ): Array<string> {
    const validate = (value: string) =>
      BaseValidation.CODE_VALIDATION_REGEX.test(value);
    if (full === true) {
      const checkDuplicates = (language: string, value: string) => {
        return (
          siblings.find(
            (item) => item.code.locale.get(language)?.value === value
          ) !== undefined
        );
      };
      return this.validateLocale(code, validate, checkDuplicates);
    }
    return this.validateLocale(code, validate, () => false);
  }

  static validateLocale(
    locale: Locale,
    validate: (value: string) => boolean,
    checkDuplicates: (language: string, value: string) => boolean
  ): Array<string> {
    const errors = new Array<string>();
    const defaultValue = locale.locale.get(ConfigUtil.defaultLanguage());
    if (!defaultValue || defaultValue.value.length === 0) {
      const languageName =
        ConfigUtil.languages().find(
          (item) => item.code === ConfigUtil.defaultLanguage()
        )?.name || ConfigUtil.defaultLanguage();
      errors.push('Default language ("' + languageName + '") value is empty');
    }
    locale.locale.forEach((value, language) => {
      const languageName =
        ConfigUtil.languages().find((item) => item.code === language)?.name ||
        language;
      if (!validate(value.value)) {
        errors.push(
          "Value for " +
            languageName +
            " is invalid (allowed characters: A-Za-z0-9-)"
        );
      }
      if (checkDuplicates(language, value.value)) {
        errors.push("Duplicate value for " + languageName);
      }
    });
    return errors;
  }
}
