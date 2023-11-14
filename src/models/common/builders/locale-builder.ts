import { LocaleType } from "../locale-type";
import { Locale } from "../locale";
import { ConfigUtil } from "../../../utils/config-util";
import { ValidationUtil } from "../../../utils/validation-util";

export class LocaleBuilder {
  private readonly locale: Map<string, LocaleType>;

  private constructor() {
    this.locale = new Map<string, LocaleType>();
  }

  static createEmpty(): LocaleBuilder {
    return this.create().addValueParts(ConfigUtil.defaultLanguage(), "");
  }

  static fromData(data?: any): LocaleBuilder {
    const builder = new LocaleBuilder();
    if (data && data.locale && typeof data.locale === "object") {
      Object.getOwnPropertyNames(data.locale).forEach((language) => {
        const value: any = data.locale[language];
        if (value.value && typeof value.value === "string") {
          builder.addValueParts(language, value.value, value.manual === true);
        }
      });
    }
    return builder;
  }

  static fromLocale(locale: Locale): LocaleBuilder {
    const builder = new LocaleBuilder();
    locale.locale.forEach((value, key) => builder.addValue(key, value));
    return builder;
  }

  static fromLocaleObject(locale: Locale | undefined): LocaleBuilder {
    if (locale === undefined) {
      return this.createEmpty();
    } else if (typeof locale.locale.get === "function") {
      return this.fromLocale(locale);
    }
    const rawValues: any = locale.locale;
    const builder = this.create();
    Object.getOwnPropertyNames(rawValues).forEach((language) => {
      const value: LocaleType = rawValues[language];
      if (value !== undefined) {
        builder.addValue(language, value);
      }
    });
    return builder;
  }

  static create(): LocaleBuilder {
    return new LocaleBuilder();
  }

  addValue(language: string, value: LocaleType): LocaleBuilder {
    this.locale.set(language, value);
    return this;
  }

  addValueParts(
    language: string,
    valueText: string,
    isManual?: boolean
  ): LocaleBuilder {
    this.locale.set(language, {
      value: valueText,
      manual: isManual === true ? 1 : 0,
    });
    return this;
  }

  fillMissingTranslations(): LocaleBuilder {
    let defaultValue = this.locale.get(ConfigUtil.defaultLanguage());
    if (defaultValue === undefined) {
      const values = Array.from(this.locale.values());
      if (values.length > 0) {
        defaultValue = values[0];
      }
    }
    if (defaultValue !== undefined) {
      for (let i = 0; i < ConfigUtil.languages().length; i++) {
        const language = ConfigUtil.languages()[i];
        if (
          !this.locale.has(language.code) ||
          this.locale.get(language.code)?.value.length === 0
        ) {
          this.locale.set(language.code, defaultValue);
        }
      }
    }
    return this;
  }

  build(): Locale {
    return { locale: this.locale };
  }

  buildNonEmpty(): Locale | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.build();
  }

  isEmpty(): boolean {
    return !ValidationUtil.isNonEmptyLocale(this.build());
  }
}
