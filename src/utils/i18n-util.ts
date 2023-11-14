import * as I18nConfig from "../config/i18n-dictionary.json";
import { Locale } from "../models/common/locale";
import { LocaleBuilder } from "../models/common/builders/locale-builder";
import { ConfigUtil } from "./config-util";

export class I18nUtil {
  private static parsedDictionary:
    | Array<[RegExp, Map<string, string>]>
    | undefined;

  private static getParsedDictionary(): Array<[RegExp, Map<string, string>]> {
    if (this.parsedDictionary === undefined) {
      this.parsedDictionary = this.parseDictionary(I18nConfig.dictionary);
    }
    return this.parsedDictionary;
  }

  private static parseDictionary(
    dictionary: any[]
  ): Array<[RegExp, Map<string, string>]> {
    const parsedDictionary = new Array<[RegExp, Map<string, string>]>();

    dictionary.forEach((item: any) => {
      let source: string | undefined;
      const values = new Map<string, string>();
      Object.getOwnPropertyNames(item).forEach((key: string) => {
        const value: string | undefined =
          typeof item[key] === "string" ? item[key] : undefined;
        if (value !== undefined) {
          values.set(key, value);
          if (key === ConfigUtil.defaultLanguage()) {
            source = value;
          }
        }
      });
      if (source !== undefined) {
        parsedDictionary.push([new RegExp(source), values]);
      }
    });
    parsedDictionary.sort(
      ([source1], [source2]) => source2.source.length - source1.source.length
    );

    return parsedDictionary;
  }

  static applyTranslationToValue(value: string, language: string): string {
    const items = this.getParsedDictionary();
    let newValue = value;
    for (let i = 0; i < items.length; i++) {
      const [source, translations] = items[i];
      if (source.test(newValue)) {
        const translation = translations.get(language);
        if (translation !== undefined) {
          newValue = newValue.replace(source, translation);
        }
      }
    }
    return newValue;
  }

  static applyTranslations(locale: Locale, force: boolean): Locale {
    const defaultValue = locale.locale.get(ConfigUtil.defaultLanguage());
    if (defaultValue === undefined) {
      return locale;
    }
    const localeBuilder = LocaleBuilder.create();
    locale.locale.forEach((value, language) => {
      if (
        language !== ConfigUtil.defaultLanguage() &&
        (force ||
          value.value.length === 0 ||
          value.value === defaultValue.value)
      ) {
        const newValue = this.applyTranslationToValue(value.value, language);
        localeBuilder.addValueParts(language, newValue, value.manual > 0);
      } else {
        localeBuilder.addValue(language, value);
      }
    });
    return localeBuilder.build();
  }

  static applyTranslationToLanguage(
    locale: Locale,
    language: string,
    force: boolean
  ): Locale {
    const defaultValue = locale.locale.get(ConfigUtil.defaultLanguage());
    if (defaultValue === undefined) {
      return locale;
    }
    const localeBuilder = LocaleBuilder.fromLocale(locale);
    if (language !== ConfigUtil.defaultLanguage()) {
      const value = locale.locale.get(language) || defaultValue;
      if (
        force ||
        value.value.length === 0 ||
        value.value === defaultValue.value
      ) {
        const newValue = this.applyTranslationToValue(
          defaultValue.value,
          language
        );
        localeBuilder.addValueParts(
          language,
          newValue,
          defaultValue.manual > 0
        );
      }
    }
    return localeBuilder.build();
  }

  /*private static codeFromLanguage(language: string): string {
        switch (language) {
            case ""
        }
    }*/
}

/*(function(input) {
  const rows = input.split('\n');
  if (rows.length === 0) {
    return undefined;
  }
  const titleRow = rows[0].trim();
  const output = [];
  const titles = titleRow.split(';').map(title => title.trim());
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(';').map(value => value.trim());
    if (values.length !== titles.length) {
      throw `malformed row ${rows[i]}`;
    }
    const outputItem = {};
    for (let j = 0; j < titles.length; j++) {
      outputItem[titles[j]] = values[j];
    }
    output.push(outputItem);
  }
  return JSON.stringify(output);
})('');*/
