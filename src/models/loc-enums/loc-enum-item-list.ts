import { LocEnumItem } from "./loc-enum-item";
import { LocEnumItemListBuilder } from "./builders/loc-enum-item-list-builder";
import { LocEnumItemBuilder } from "./builders/loc-enum-item-builder";
import { LocaleBuilder } from "../common/builders/locale-builder";
import { ConfigUtil } from "../../utils/config-util";

export class LocEnumItemList {
  readonly items: Array<LocEnumItem>;
  readonly validationErrors: Array<string>;

  constructor(items: Array<LocEnumItem>, validationErrors: Array<string>) {
    this.items = items;
    this.validationErrors = validationErrors;
  }

  private static validate(items: Array<LocEnumItem>): Array<string> {
    if (items.length === 0) {
      return ["Enum items are empty"];
    }
    return [];
  }

  store(item: LocEnumItem, index?: number) {
    if (index !== undefined) {
      return this.update(item, index);
    }
    return this.add(item);
  }

  add(item: LocEnumItem): LocEnumItemList {
    const newItems = Array.from(this.items);
    newItems.push(item);
    return new LocEnumItemList(newItems, this.validationErrors);
  }

  update(item: LocEnumItem, index: number): LocEnumItemList {
    if (index < 0 || index >= this.items.length) {
      return this;
    }
    const newItems = Array.from(this.items);
    newItems.splice(index, 1, item);
    return new LocEnumItemList(newItems, this.validationErrors);
  }

  remove(index: number): LocEnumItemList {
    if (index < 0 || index >= this.items.length) {
      return this;
    }
    const newItems = Array.from(this.items);
    newItems.splice(index, 1);
    return new LocEnumItemList(newItems, this.validationErrors);
  }

  validated(): LocEnumItemList {
    const newItems = Array.from(this.items);
    const validationErrors = LocEnumItemList.validate(newItems);
    return new LocEnumItemList(newItems, validationErrors);
  }

  withFilledTranslations(): LocEnumItemList {
    const newItems = new Array<LocEnumItem>();
    this.items.forEach((item) => {
      const newName = LocaleBuilder.fromLocale(item.name)
        .fillMissingTranslations()
        .build();
      newItems.push(LocEnumItemBuilder.fromItem(item).setName(newName).build());
    });
    return LocEnumItemListBuilder.create().setItems(newItems).build();
  }

  detectNameDifferences(
    mappedTeamNames: Map<string, string>,
    providerId: number
  ): Array<[string, string, number]> {
    const indexes = new Array<[string, string, number]>();
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const id = item.providerIds.get(providerId);
      const name = item.name.locale.get(ConfigUtil.defaultLanguage());
      if (name !== undefined && id !== undefined) {
        const mappedName = mappedTeamNames.get(id);
        if (mappedName === undefined) {
          // TODO: Log
        } else if (name.value !== mappedName) {
          //console.log('Name mismatch', id, name.value, mappedName);
          indexes.push([name.value, mappedName, i]);
        }
      }
    }
    return indexes;
  }

  mapped(
    transform: (
      itemBuilder: LocEnumItemBuilder,
      index: number
    ) => LocEnumItemBuilder | undefined
  ): LocEnumItemList {
    const newItems = new Array<LocEnumItem>();
    this.items.forEach((item, index) => {
      const itemBuilder = LocEnumItemBuilder.fromItem(item);
      const newItemBuilder = transform(itemBuilder, index);
      if (newItemBuilder !== undefined) {
        newItems.push(newItemBuilder.build());
      }
    });
    const validationErrors = LocEnumItemList.validate(newItems);
    return new LocEnumItemList(newItems, validationErrors);
  }

  mergedWith(
    other: LocEnumItemList,
    overwriteExisting: boolean
  ): LocEnumItemList {
    const newItems = Array.from(this.items);
    const itemsToAdd = new Array<LocEnumItem>();

    other.items.forEach((item) => {
      let isNewItem = false;
      item.providerIds.forEach((itemId, providerId) => {
        const matchingItems =
          newItems.filter(
            (item) => item.providerIds.get(providerId) === itemId
          ) || [];
        isNewItem = isNewItem || matchingItems.length === 0;
        matchingItems.forEach((matchingItem) => {
          item.name.locale.forEach((value, language) => {
            if (!matchingItem.name.locale.has(language) || overwriteExisting) {
              matchingItem.name.locale.set(language, value);
            }
          });
        });
      });
      if (isNewItem) {
        itemsToAdd.push(item);
      }
    });

    newItems.push(...itemsToAdd);

    const validationErrors = LocEnumItemList.validate(newItems);
    return new LocEnumItemList(
      newItems.map((item) => LocEnumItemBuilder.fromItem(item).build()),
      validationErrors
    );
  }

  filtered(filterString: string) {
    return this.items.filter(
      (x) =>
        x.title.toLocaleLowerCase().indexOf(filterString?.toLowerCase()) > -1
    );
  }

  serializable(): any {
    const serializedContent = new Array<any>();
    this.items.forEach((item) => {
      const serializedItem: any = {};
      serializedItem.name = {};
      serializedItem.name.locale = {};
      item.name.locale.forEach((value, language) => {
        serializedItem.name.locale[language] = {
          value: value.value,
          manual: value.manual,
        };
      });
      serializedItem.sportId = item.sportId;
      serializedItem.ids = {};
      item.providerIds.forEach((id, providerId) => {
        serializedItem.ids[providerId.toString(10)] = id;
      });
      serializedContent.push(serializedItem);
    });
    return serializedContent;
  }
}
