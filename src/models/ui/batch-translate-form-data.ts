import { Locale } from "../common/locale";
import { MenuItem } from "../menu/menu-item";
import { MenuItemList } from "../menu/menu-item-list";
import { MenuItemType } from "../enums/menu-item-type";
import { I18nUtil } from "../../utils/i18n-util";
import { LocaleBuilder } from "../common/builders/locale-builder";
import { ConfigUtil } from "../../utils/config-util";
import { LocEnumItemList } from "../loc-enums/loc-enum-item-list";

interface ValueWithId {
  id: number;
}

export class BatchTranslateFormData {
  private readonly data: any[];

  private constructor(data: any[]) {
    this.data = data;
  }

  static create(): BatchTranslateFormData {
    return new BatchTranslateFormData([]);
  }

  static fromMenuData(menuItems: MenuItem[]): BatchTranslateFormData {
    const data = new Array<any>();
    let index = 0;
    MenuItemList.traverseRecursively(menuItems, [], (item) => {
      if (item.type !== MenuItemType.SEASON) {
        index++;
        data.push(this.localeToObject(item.treeId, index, item.name));
      }
    });
    return new BatchTranslateFormData(data);
  }

  static fromLocalizedEnumItemList(
    locEnumItemList: LocEnumItemList
  ): BatchTranslateFormData {
    const data = new Array<any>();
    locEnumItemList.items.forEach((item, index) => {
      data.push(this.localeToObject(index + 1, index, item.name));
    });
    return new BatchTranslateFormData(data);
  }

  private static localeToObject(
    id: number,
    index: number,
    locale: Locale
  ): ValueWithId {
    const result: any = { id: id, index: index };
    locale.locale.forEach(
      (value, language) => (result[language] = value.value)
    );
    return result;
  }

  private static itemHasDiffs(item: any, languages: Set<string>): boolean {
    const keys = Object.getOwnPropertyNames(item);
    let initialValue: string | undefined = undefined;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (
        key === "id" ||
        key === "index" ||
        (languages.size > 0 && !languages.has(key))
      ) {
        continue;
      }
      const value = item[key];
      if (value === undefined) {
        continue;
      }
      if (initialValue === undefined) {
        initialValue = value;
      } else if (initialValue !== value) {
        return true;
      }
    }
    return false;
  }

  all(): ValueWithId[] {
    return this.data;
  }

  get(index: number): any | undefined {
    if (index >= 0 && index < this.data.length) {
      return this.data[index];
    }
    return undefined;
  }

  filteredDiffs(languages: Set<string>): BatchTranslateFormData {
    const newData = Array.from(this.data).filter((item) =>
      BatchTranslateFormData.itemHasDiffs(item, languages)
    );
    return new BatchTranslateFormData(newData);
  }

  withTranslation(
    id: number,
    language: string,
    value: string
  ): BatchTranslateFormData {
    const data = Array.from(this.data);
    const item: any | undefined = data.find((item) => item.id === id);
    if (item !== undefined) {
      item[language] = value;
    } else {
      const item: any = { id: id };
      item[language] = value;
      data.push(item);
    }
    return new BatchTranslateFormData(data);
  }

  withTranslatedLanguages(languages: string[]): BatchTranslateFormData {
    const newData = new Array<any>();
    const languagesToTranslate = new Set<string>(languages);
    this.data.forEach((item) => {
      const value = item[ConfigUtil.defaultLanguage()];
      if (typeof value !== "string") {
        newData.push(item);
        return;
      }
      const newItem: any = {};
      languagesToTranslate.forEach((language) => {
        if (language !== ConfigUtil.defaultLanguage()) {
          newItem[language] = I18nUtil.applyTranslationToValue(value, language);
        }
      });
      Object.getOwnPropertyNames(item).forEach((key) => {
        if (
          !languagesToTranslate.has(key) ||
          key === ConfigUtil.defaultLanguage()
        ) {
          newItem[key] = item[key];
        }
      });
      newData.push(newItem);
    });
    return new BatchTranslateFormData(newData);
  }

  withTranslationBatch(
    id: number,
    language: string,
    translations: string[]
  ): BatchTranslateFormData {
    const startIndex = this.data.findIndex((item) => item.id === id);
    if (startIndex < 0) {
      return this;
    }
    const newData = this.data.map((item, index) => {
      if (index >= startIndex && index < startIndex + translations.length) {
        const newItem = Object.assign({}, item);
        newItem[language] = translations[index - startIndex];
        return newItem;
      }
      return item;
    });
    return new BatchTranslateFormData(newData);
  }

  toLocales(): Map<number, Locale> {
    const locales = new Map<number, Locale>();
    this.data.forEach((item) => {
      const localeBuilder = LocaleBuilder.create();
      Object.getOwnPropertyNames(item).forEach((key) => {
        if (key === "id") {
          return;
        }
        const value = item[key];
        if (typeof value === "string") {
          localeBuilder.addValueParts(key, value, true);
        }
      });
      const locale = localeBuilder.build();
      if (locale.locale.size > 0) {
        locales.set(item.id, locale);
      }
    });
    return locales;
  }
}
