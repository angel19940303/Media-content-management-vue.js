import { MenuItem } from "../menu-item";
import { MenuItemList } from "../menu-item-list";
import { ConfigUtil } from "../../../utils/config-util";

export class LocalizedSortOrderBuilder {
  private static readonly UNKNOWN_SORT_ORDER = 9999999999;

  private localizedSortOrders: Map<string, Map<number, number>>;

  private constructor() {
    this.localizedSortOrders = new Map<string, Map<number, number>>();
  }

  static create(): LocalizedSortOrderBuilder {
    return new LocalizedSortOrderBuilder();
  }

  private static sortOrdersAreEqual(
    sortOrders1: Map<number, number>,
    sortOrders2: Map<number, number>
  ): boolean {
    if (sortOrders1.size !== sortOrders2.size) {
      return false;
    }
    const keys = Array.from(sortOrders1.keys());
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value1 = sortOrders1.get(key);
      const value2 = sortOrders2.get(key);
      if (value1 !== value2) {
        return false;
      }
    }
    return true;
  }
  setDataForLanguage(
    data: Array<MenuItem> | undefined,
    language: string
  ): LocalizedSortOrderBuilder {
    if (data !== undefined) {
      const sortOrders = this.getOrCreateSortOrders(language);
      MenuItemList.traverseRecursively(data, [], (item, index) => {
        sortOrders.set(item.treeId, index);
      });
    }
    return this;
  }

  setLocalizedSortOrders(
    localizedSortOrders: Map<string, Map<number, number>> | undefined,
    overwrite?: boolean
  ): LocalizedSortOrderBuilder {
    if (overwrite === true) {
      this.localizedSortOrders.clear();
    }
    if (localizedSortOrders !== undefined) {
      localizedSortOrders.forEach((values, key) => {
        const sortOrders = this.getOrCreateSortOrders(key);
        values.forEach((sortOrder, treeId) =>
          sortOrders.set(treeId, sortOrder)
        );
      });
    }
    return this;
  }

  addLocalizedSortOrdersFromIds(
    language: string,
    ids: Array<number>,
    overwrite?: boolean
  ): LocalizedSortOrderBuilder {
    if (overwrite === true) {
      this.localizedSortOrders.delete(language);
    }
    ids.forEach((id, index) =>
      this.getOrCreateSortOrders(language).set(id, index)
    );
    return this;
  }

  updateLocalizedSortOrdersFromIds(
    language: string,
    ids: Array<number>,
    newId: number
  ): LocalizedSortOrderBuilder {
    const isDefault = this.hasEqualSortOrdersForLanguages(
      language,
      ConfigUtil.defaultLanguage(),
      ids
    );
    const orderedIdsDefault = isDefault
      ? ids
      : this.sortedIds(ConfigUtil.defaultLanguage(), ids, newId);
    this.forEachLanguage(ids, (language, isDefault) => {
      const orderedIds = isDefault
        ? orderedIdsDefault
        : this.sortedIds(language, ids, newId);
      this.addLocalizedSortOrdersFromIds(language, orderedIds);
    });
    return this;
  }

  has(language: string, validCount?: number): boolean {
    const sortOrders = this.localizedSortOrders.get(language);
    return (
      sortOrders !== undefined &&
      (!validCount || sortOrders.size === validCount)
    );
  }

  sanitized(validCount?: number): LocalizedSortOrderBuilder {
    const defaultSortOrders = this.localizedSortOrders.get(
      ConfigUtil.defaultLanguage()
    );
    if (defaultSortOrders !== undefined) {
      Array.from(this.localizedSortOrders.keys()).forEach((key) => {
        const sortOrders = this.localizedSortOrders.get(key);
        if (key === ConfigUtil.defaultLanguage() || sortOrders === undefined) {
          return;
        }
        if (
          (validCount !== undefined && validCount !== sortOrders.size) ||
          LocalizedSortOrderBuilder.sortOrdersAreEqual(
            sortOrders,
            defaultSortOrders
          )
        ) {
          this.localizedSortOrders.delete(key);
        }
      });
    }
    return this;
  }

  expanded(languages: Array<string>): LocalizedSortOrderBuilder {
    const defaultSortOrders = this.localizedSortOrders.get(
      ConfigUtil.defaultLanguage()
    );
    if (defaultSortOrders !== undefined) {
      languages.forEach((language) => {
        if (!this.localizedSortOrders.has(language)) {
          this.localizedSortOrders.set(
            language,
            new Map<number, number>(defaultSortOrders)
          );
        }
      });
    }
    return this;
  }

  expandByLanguage(language: string): LocalizedSortOrderBuilder {
    if (!this.localizedSortOrders.has(language)) {
      const defaultSortOrders =
        this.localizedSortOrders.get(ConfigUtil.defaultLanguage()) ||
        new Map<number, number>();
      this.localizedSortOrders.set(language, defaultSortOrders);
    }
    return this;
  }

  addMenuItemData(menuItem: MenuItem): LocalizedSortOrderBuilder {
    Array.from(menuItem.localizedSortOrders.keys()).forEach((key) => {
      const sortOrder = menuItem.localizedSortOrders.get(key);
      if (sortOrder !== undefined) {
        this.getOrCreateSortOrders(key).set(menuItem.treeId, sortOrder);
      }
    });
    return this;
  }

  compareItems(language: string, item1: MenuItem, item2: MenuItem): number {
    return this.compareItemIds(language, item1.treeId, item2.treeId);
  }

  compareItemIds(language: string, itemId1: number, itemId2: number): number {
    let i1SortOrder = this.localizedSortOrders.get(language)?.get(itemId1);
    let i2SortOrder = this.localizedSortOrders.get(language)?.get(itemId2);
    if (i1SortOrder === undefined) {
      i1SortOrder = LocalizedSortOrderBuilder.UNKNOWN_SORT_ORDER;
    }
    if (i2SortOrder === undefined) {
      i2SortOrder = LocalizedSortOrderBuilder.UNKNOWN_SORT_ORDER;
    }
    return i1SortOrder - i2SortOrder;
  }

  build(): Map<string, Map<number, number>> {
    return new Map<string, Map<number, number>>(this.localizedSortOrders);
  }

  hasEqualSortOrdersForLanguages(
    language1: string,
    language2: string,
    ids: Array<number>
  ): boolean {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (
        this.getSortOrder(language1, id) !== this.getSortOrder(language2, id)
      ) {
        return false;
      }
    }
    return true;
  }

  forEachLanguage(
    ids: Array<number>,
    fn: (language: string, isDefault: boolean) => void
  ): void {
    Array.from(this.localizedSortOrders.keys()).forEach((language) => {
      const isDefault = this.hasEqualSortOrdersForLanguages(
        language,
        ConfigUtil.defaultLanguage(),
        ids
      );
      fn(language, isDefault);
    });
  }

  private sortedIds(
    language: string,
    ids: Array<number>,
    newId: number
  ): Array<number> {
    return ids.sort((i1, i2) => {
      if (i1 === newId) {
        return 1;
      } else if (i2 === newId) {
        return -1;
      } else {
        return (
          this.getSortOrder(language, i1) - this.getSortOrder(language, i2)
        );
      }
    });
  }

  private getSortOrder(language: string, id: number): number {
    const sortOrder = this.localizedSortOrders.get(language)?.get(id);
    if (sortOrder !== undefined) {
      return sortOrder;
    }
    return LocalizedSortOrderBuilder.UNKNOWN_SORT_ORDER;
  }

  private getOrCreateSortOrders(language: string): Map<number, number> {
    let sortOrders = this.localizedSortOrders.get(language);
    if (sortOrders !== undefined) {
      return sortOrders;
    }
    sortOrders = new Map<number, number>();
    this.localizedSortOrders.set(language, sortOrders);
    return sortOrders;
  }
}
