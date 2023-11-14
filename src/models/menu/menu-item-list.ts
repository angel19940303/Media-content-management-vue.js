import { MenuItem } from "./menu-item";
import { MenuItemBuilder } from "./builders/menu-item-builder";
import { MenuItemType } from "../enums/menu-item-type";
import { LocaleBuilder } from "../common/builders/locale-builder";
import { LocalizedSortOrderBuilder } from "./builders/localized-sort-order-builder";
import { ConfigUtil } from "../../utils/config-util";
import { DateUtil } from "../../utils/date-util";

interface MenuItemNode {
  path: Array<string>;
  item: MenuItem;
  parent?: MenuItem;
}

export class MenuItemList {
  readonly items: Array<MenuItem>;
  readonly validationErrors: Map<number, Array<string>>;
  readonly localizedSortOrders: Map<string, Map<number, number>>;

  private constructor(
    items?: Array<MenuItem>,
    validationErrors?: Map<number, Array<string>>,
    localizedSortOrders?: Map<string, Map<number, number>>
  ) {
    this.items = items || [];
    this.validationErrors =
      validationErrors || new Map<number, Array<string>>();
    this.localizedSortOrders =
      localizedSortOrders || new Map<string, Map<number, number>>();
  }

  static create(): MenuItemList {
    return new MenuItemList();
  }

  static from(
    items?: Array<MenuItem>,
    language?: string,
    localizedSortOrders?: Map<string, Map<number, number>>
  ): MenuItemList {
    const defaultLanguage = ConfigUtil.defaultLanguage();
    const selectedLanguage = language ?? defaultLanguage;
    const localizedSortOrderBuilder = LocalizedSortOrderBuilder.create().setLocalizedSortOrders(
      localizedSortOrders
    );
    localizedSortOrderBuilder.setDataForLanguage(items, selectedLanguage);
    return new MenuItemList(
      items,
      undefined,
      localizedSortOrderBuilder.build()
    );
  }

  static withUpdatedLanguage(
    items?: Array<MenuItem>,
    language?: string,
    localizedSortOrders?: Map<string, Map<number, number>>
  ): MenuItemList {
    const localizedSortOrderBuilder = LocalizedSortOrderBuilder.create()
      .setLocalizedSortOrders(localizedSortOrders)
      .sanitized();
    if (items === undefined || items.length === 0) {
      return new MenuItemList(
        items,
        undefined,
        localizedSortOrderBuilder.build()
      );
    }
    const defaultLanguage = ConfigUtil.defaultLanguage();
    const selectedLanguage = language ?? defaultLanguage;
    localizedSortOrderBuilder.expandByLanguage(selectedLanguage);
    const newItems = this.copy(items, (builder) => {
      const titleValue =
        builder.name.locale.get(selectedLanguage) ??
        builder.name.locale.get(defaultLanguage);
      return builder.setTitle(titleValue?.value ?? builder.title);
    });
    newItems.sort((i1, i2) =>
      localizedSortOrderBuilder.compareItems(selectedLanguage, i1, i2)
    );
    return new MenuItemList(
      newItems,
      undefined,
      localizedSortOrderBuilder.build()
    );
  }

  static namePath(
    treeId: number,
    items: Array<MenuItem>,
    parentPath?: Array<string>
  ): Array<string> {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.treeId === treeId) {
        if (parentPath) {
          return [...parentPath, item.title];
        }
        return [item.title];
      }
      if (item.children && item.children.length > 0) {
        const basePath = parentPath
          ? [...parentPath, item.title]
          : [item.title];
        const path = this.namePath(treeId, item.children, basePath);
        if (path.length > 0) {
          return path;
        }
      }
    }
    return [];
  }

  static stageMappingIds(items: Array<MenuItem>): Array<string> {
    const ids = new Array<string>();
    items.forEach((item) => {
      if (item.stageMappings) {
        item.stageMappings.forEach((mapping) => ids.push(mapping.stageId));
      }
      if (item.children) {
        ids.push(...MenuItemList.stageMappingIds(item.children));
      }
    });
    return ids;
  }

  static copy(
    items: Array<MenuItem>,
    transform: (builder: MenuItemBuilder) => MenuItemBuilder | undefined
  ): Array<MenuItem> {
    const result = new Array<MenuItem>();
    items.forEach((item) => {
      const newItemBuilder = transform(
        MenuItemBuilder.fromMenuItem(item).setChildren(
          MenuItemList.copy(item.children, transform)
        )
      );
      if (newItemBuilder) {
        const newItem = newItemBuilder.build();
        newItem.expanded = item.expanded;
        result.push(newItem);
      }
    });
    return result;
  }

  static flatten(list: Array<MenuItem>): Array<MenuItem> {
    const resultList = new Array<MenuItem>();

    const flattenSingle = (item: MenuItem): Array<MenuItem> => {
      const items = new Array<MenuItem>();
      const children = new Array<MenuItem>();
      if (item.children !== undefined && item.children.length > 0) {
        item.children.forEach((childItem) => {
          const newChildItem = MenuItemBuilder.fromMenuItem(childItem).build();
          if (item.type === childItem.type) {
            items.push(...flattenSingle(newChildItem));
          } else {
            children.push(newChildItem);
          }
        });
      }
      if (children.length > 0) {
        items.unshift(
          MenuItemBuilder.fromMenuItem(item).setChildren(children).build()
        );
      }
      return items;
    };

    list.forEach((item) => resultList.push(...flattenSingle(item)));

    return resultList;
  }

  private static copyValidationErrors(
    validationErrors: Map<number, Array<string>> | undefined,
    transform: (validationErrors: Map<number, Array<string>>) => void
  ): Map<number, Array<string>> | undefined {
    if (!validationErrors) {
      return undefined;
    }
    const newValidationErrors = new Map<number, Array<string>>(
      validationErrors
    );
    transform(newValidationErrors);
    return newValidationErrors;
  }

  private static validate(
    items: Array<MenuItem>,
    parentId?: number,
    parentType?: number
  ): Map<number, Array<string>> {
    const actualParentType =
      parentType === undefined ? MenuItemType.UNKNOWN : parentType;
    const actualParentId = parentId === undefined ? -1 : parentId;
    const errors = new Map<number, Array<string>>();
    const existingCodes = new Map<string, Set<number>>();
    let visibleChildCount = 0;
    let primaryChildCount = 0;

    const updateItemErrors = (
      itemErrors: Array<string>,
      itemTreeId: number
    ) => {
      const existingItemErrors = errors.get(itemTreeId) || [];
      errors.set(itemTreeId, existingItemErrors.concat(itemErrors));
    };

    items.forEach((item) => {
      if (item.type === MenuItemType.SEASON && item.primary) {
        primaryChildCount++;
      }
      if (item.type === MenuItemType.SEASON || !item.hidden) {
        visibleChildCount++;
      }
      item.code.locale.forEach((value, language) => {
        const key = language + ":" + value.value;
        let occurrences = existingCodes.get(key);
        if (!occurrences) {
          occurrences = new Set<number>();
          existingCodes.set(key, occurrences);
        }
        occurrences.add(item.treeId);
      });
      this.validate(item.children, item.treeId, item.type).forEach(
        updateItemErrors
      );
    });

    if (actualParentType === MenuItemType.STAGE) {
      if (primaryChildCount === 0) {
        updateItemErrors(["No primary season in stage"], actualParentId);
      } else if (primaryChildCount > 1) {
        updateItemErrors(["Too many primary seasons in stage"], actualParentId);
      }
    }
    if (actualParentType !== MenuItemType.SEASON) {
      if (visibleChildCount === 0) {
        updateItemErrors(["No visible children"], actualParentId);
      }
    }

    existingCodes.forEach((treeIds, compositeCode) => {
      if (treeIds.size > 1) {
        const language = compositeCode.substr(0, 2);
        const code = compositeCode.substr(3);
        treeIds.forEach((treeId) => {
          updateItemErrors(
            ['Duplicate code "' + code + '" in language "' + language + '"'],
            treeId
          );
        });
      }
    });

    return errors;
  }

  static traverseRecursively(
    items: MenuItem[],
    parents: MenuItem[],
    callback: (item: MenuItem, index: number, parents: MenuItem[]) => void
  ): void {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      callback(item, i, parents);
      const newParents = [...parents, item];
      if (item.children !== undefined) {
        this.traverseRecursively(item.children, newParents, callback);
      }
    }
  }

  store(item: MenuItem, isNew?: boolean, parentId?: number) {
    if (isNew === true) {
      return this.insert(item, parentId);
    } else {
      const updated = this.update(item);
      if (parentId !== undefined) {
        const parentItem = this.find(parentId)?.item;
        if (parentItem !== undefined) {
          return updated.update(MenuItemBuilder.rebuild(parentItem));
        }
      }
      return updated;
    }
  }

  insert(item: MenuItem, parentId?: number): MenuItemList {
    const newSortOrders = new Map<string, Map<number, number>>(
      this.localizedSortOrders
    );
    const sortOrderKeys = Array.from(newSortOrders.keys());
    const newItem = MenuItemBuilder.fromMenuItem(item)
      .forEachChild((child, indexPath) => {
        sortOrderKeys.forEach((key) =>
          newSortOrders
            .get(key)
            ?.set(child.treeId, indexPath[indexPath.length - 1])
        );
      })
      .build();
    const items = MenuItemList.copy(this.items, (itemBuilder) => {
      if (parentId !== undefined && itemBuilder.treeId === parentId) {
        const itemCount = itemBuilder.children.length;
        if (newItem.primary) {
          itemBuilder.setPrimaryChild();
        }
        sortOrderKeys.forEach((key) =>
          newSortOrders.get(key)?.set(newItem.treeId, itemCount)
        );
        return itemBuilder.addChild(newItem);
      }
      return itemBuilder;
    });
    if (parentId === undefined) {
      if (newItem.primary) {
        items.forEach((item) => (item.primary = false));
      }
      sortOrderKeys.forEach((key) =>
        newSortOrders.get(key)?.set(newItem.treeId, items.length)
      );
      items.push(newItem);
    }
    return new MenuItemList(items, this.validationErrors, newSortOrders);
  }

  update(item: MenuItem): MenuItemList {
    const items = MenuItemList.copy(this.items, (itemBuilder) => {
      if (itemBuilder.treeId === item.treeId) {
        return itemBuilder
          .setId(item.id)
          .setTreeId(item.treeId)
          .setType(item.type)
          .setTitle(item.title)
          .setName(item.name)
          .setShortName(item.shortName)
          .setCode(item.code)
          .setGender(item.gender)
          .setHidden(item.hidden)
          .setNoTable(item.noTable)
          .setNoDraw(item.noDraw)
          .setNoScorers(item.noScorers)
          .setNoTeamStats(item.noTeamStats)
          .setNoTracker(item.noTracker)
          .setDomesticLeague(item.domesticLeague)
          .setHighlightedTournament(item.highlightedTournament)
          .setHighlightedMatchListSections(item.highlightedMatchListSections)
          .setHighlightedMatchRounds(item.highlightedMatchRounds)
          .setPrimary(item.primary)
          .setTimeRange(item.timeRange)
          .setStageMappings(item.stageMappings)
          .setFlagVariants(item.flagVariants)
          .setCountryCodes(item.countryCodes)
          .setExpanded(item.expanded);
      }
      if (
        item.primary &&
        itemBuilder.children.findIndex(
          (listItem) => listItem.treeId === item.treeId
        ) >= 0
      ) {
        itemBuilder.setPrimaryChild(item.treeId);
      }
      return itemBuilder;
    });
    const validationErrors = MenuItemList.copyValidationErrors(
      this.validationErrors,
      (validationErrors) => {
        validationErrors.delete(item.treeId);
      }
    );
    return new MenuItemList(items, validationErrors, this.localizedSortOrders);
  }

  remove(itemId: number): MenuItemList {
    const newSortOrders = new Map<string, Map<number, number>>(
      this.localizedSortOrders
    );
    const sortOrderKeys = Array.from(newSortOrders.keys());
    const parentId = this.find(itemId)?.parent?.treeId;
    const items = MenuItemList.copy(this.items, (itemBuilder) => {
      if (itemBuilder.treeId === itemId) {
        return undefined;
      }
      return itemBuilder;
    });
    if (parentId !== undefined) {
      const parentItem = this.find(parentId, items);
      if (parentItem) {
        sortOrderKeys.forEach((key) => {
          const sortOrders = newSortOrders.get(key);
          parentItem.item.children.forEach((child, index) =>
            sortOrders?.set(child.treeId, index)
          );
        });
      }
    } else {
      sortOrderKeys.forEach((key) => {
        const sortOrders = newSortOrders.get(key);
        items.forEach((item, index) => sortOrders?.set(item.treeId, index));
      });
    }
    const validationErrors = MenuItemList.copyValidationErrors(
      this.validationErrors,
      (validationErrors) => {
        validationErrors.delete(itemId);
      }
    );
    return new MenuItemList(items, validationErrors, newSortOrders);
  }

  withUpdatedLanguage(language?: string): MenuItemList {
    return MenuItemList.withUpdatedLanguage(
      this.items,
      language,
      this.localizedSortOrders
    );
  }

  withUpdatedOrdering(language?: string): MenuItemList {
    return MenuItemList.from(this.items, language, this.localizedSortOrders);
  }

  applyAnalysisResults(
    ids: Set<string>,
    property: number,
    value: boolean
  ): MenuItemList {
    const items = MenuItemList.copy(this.items, (itemBuilder) => {
      if (itemBuilder.id !== undefined && ids.has(itemBuilder.id)) {
        itemBuilder.setPropertyValue(property, value);
      }
      return itemBuilder;
    });
    return new MenuItemList(
      items,
      this.validationErrors,
      this.localizedSortOrders
    );
  }

  contains(itemId: number): boolean {
    return this.find(itemId) !== undefined;
  }

  find(
    itemId: number | undefined,
    items?: Array<MenuItem>
  ): MenuItemNode | undefined {
    const _items = items || this.items;
    if (itemId !== undefined) {
      for (let i = 0; i < _items.length; i++) {
        const item = _items[i];
        if (item.treeId === itemId) {
          return { item: item, path: [item.title] };
        }
        if (item.children && item.children.length > 0) {
          const node = this.find(itemId, item.children);
          if (node && node.path.length > 0) {
            const parent = node.parent || item;
            return {
              item: node.item,
              path: [item.title, ...node.path],
              parent: parent,
            };
          }
        }
      }
    }
    return undefined;
  }

  all(): Array<MenuItem> {
    return this.items;
  }

  popular(items?: Array<MenuItem>): Array<MenuItem> {
    const itemsToTraverse = items ?? this.items;
    const popularItems = new Array<MenuItem>();
    itemsToTraverse.forEach((item) => {
      if (item.isPopular) {
        const title = MenuItemList.namePath(item.treeId, this.items).join(" ");
        popularItems.push(
          MenuItemBuilder.fromMenuItem(item)
            .setTitle(title)
            .setChildren([])
            .build()
        );
      }
      if (item.children && item.children.length > 0) {
        const popularChildItems = this.popular(item.children);
        popularItems.push(...popularChildItems);
      }
    });
    popularItems.sort(
      (a, b) => (a.sortOrderPopular || -1) - (b.sortOrderPopular || -1)
    );
    popularItems.sort(
      (a, b) => (a.sortOrderPopular || -1) - (b.sortOrderPopular || -1)
    );
    return popularItems;
  }

  withFilledTranslations(): MenuItemList {
    const newItems = MenuItemList.copy(this.items, (itemBuilder) => {
      return itemBuilder
        .setName(
          LocaleBuilder.fromLocale(itemBuilder.name)
            .fillMissingTranslations()
            .build()
        )
        .setCode(
          LocaleBuilder.fromLocale(itemBuilder.code)
            .fillMissingTranslations()
            .build()
        )
        .setShortName(
          LocaleBuilder.fromLocale(itemBuilder.shortName)
            .fillMissingTranslations()
            .build()
        );
    });
    return new MenuItemList(
      newItems,
      this.validationErrors,
      this.localizedSortOrders
    );
  }

  validated(): MenuItemList {
    const newItems = Array.from(this.items);
    const validationErrors = MenuItemList.validate(newItems);

    const expandErrors = (items: Array<MenuItem>) => {
      let isExpanded = false;
      items.forEach((item) => {
        item.expanded = expandErrors(item.children);
        if (item.expanded || validationErrors.has(item.treeId)) {
          isExpanded = true;
        }
      });
      return isExpanded;
    };

    expandErrors(newItems);

    return new MenuItemList(
      newItems,
      validationErrors,
      this.localizedSortOrders
    );
  }

  entryIds(): Set<string> {
    const result = new Set<string>();
    const idsFromItems = (items: Array<MenuItem>): void => {
      items.forEach((item) => {
        if (item.id) {
          result.add(item.id);
        }
        if (item.children && item.children.length > 0) {
          idsFromItems(item.children);
        }
      });
    };
    idsFromItems(this.items);
    return result;
  }

  flatListOfType(type: number): MenuItem[] {
    const result = new Array<MenuItem>();
    const traverse = (items: Array<MenuItem>, path: Array<string>): void => {
      items.forEach((item) => {
        const itemPath = Array.from(path);
        itemPath.push(item.title);
        if (item.type === type && item.id !== undefined) {
          result.push(
            MenuItemBuilder.fromMenuItem(item).setPath(itemPath).build()
          );
        }
        if (item.children && item.children.length > 0) {
          traverse(item.children, itemPath);
        }
      });
    };

    traverse(this.items, []);

    return result;
  }

  collapseAllExpandIds(
    idsToExpand: Set<number>,
    items?: Array<MenuItem>
  ): boolean {
    const currentItems = items || this.items;
    let isExpanded = false;
    currentItems.forEach((item) => {
      let hasExpandedChildren = false;
      if (item.children !== undefined && item.children.length > 0) {
        hasExpandedChildren = this.collapseAllExpandIds(
          idsToExpand,
          item.children
        );
      }
      item.expanded = idsToExpand.has(item.treeId) || hasExpandedChildren;
      if (item.expanded) {
        isExpanded = true;
      }
    });
    return isExpanded;
  }

  itemTopOffset(
    treeId: number,
    height: number,
    sourceItems?: Array<MenuItem>
  ): { offset: number; hasItem: boolean } {
    const items = sourceItems || this.items;
    let totalOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.treeId === treeId) {
        return { offset: totalOffset, hasItem: true };
      }
      totalOffset += height;
      if (item.children && item.expanded === true) {
        const { offset, hasItem } = this.itemTopOffset(
          treeId,
          height,
          item.children
        );
        totalOffset += offset;
        if (hasItem) {
          return { offset: totalOffset, hasItem: true };
        }
      }
    }
    return { offset: totalOffset, hasItem: false };
  }

  namePath(treeId: number): Array<string> {
    return MenuItemList.namePath(treeId, this.items);
  }

  filteredItems(
    condition: (item: MenuItem, path: string) => boolean,
    transform?: (item: MenuItemBuilder) => MenuItemBuilder,
    path?: string,
    sourceItems?: Array<MenuItem>
  ): Array<MenuItem> {
    const items = sourceItems ?? this.items;
    const filteredItems = new Array<MenuItem>();
    items.forEach((item) => {
      let filteredChildren: Array<MenuItem> | undefined = undefined;
      const itemPath =
        path !== undefined ? path + " " + item.title : item.title;
      if (item.children && item.children.length > 0) {
        filteredChildren = this.filteredItems(
          condition,
          transform,
          itemPath,
          item.children
        );
      }
      if (
        condition(item, itemPath) ||
        (filteredChildren !== undefined && filteredChildren.length > 0)
      ) {
        const builder = MenuItemBuilder.fromMenuItem(item).setChildren(
          filteredChildren || []
        );
        if (transform) {
          filteredItems.push(transform(builder).build());
        } else {
          filteredItems.push(builder.build());
        }
      }
    });
    return filteredItems;
  }

  mapped(
    transform: (item: MenuItemBuilder) => MenuItemBuilder | undefined
  ): MenuItemList {
    return MenuItemList.from(
      MenuItemList.copy(this.items, transform),
      undefined,
      this.localizedSortOrders
    );
  }

  sortedRootItems(languages: string[], selectedLanguage: string): MenuItemList {
    if (languages.length === 0) {
      return this;
    }

    const namesByLanguage = new Map<string, { id: number; name: string }[]>();
    const ordersByLanguage = new Map<string, Map<number, number>>();
    const newLocalizedSortOrders = new Map<string, Map<number, number>>(
      this.localizedSortOrders
    );

    languages.forEach((language) => namesByLanguage.set(language, []));

    this.items.forEach((item) => {
      const defaultName =
        item.name.locale.get(ConfigUtil.defaultLanguage())?.value || "";
      languages.forEach((language) => {
        const languageName =
          item.name.locale.get(language)?.value || defaultName;
        namesByLanguage
          .get(language)
          ?.push({ id: item.treeId, name: languageName });
      });
    });

    namesByLanguage.forEach((names, language) => {
      const languageOrders = new Map<number, number>();
      names
        .sort((i1, i2) => {
          if (typeof i1.name.localeCompare !== "function") {
            return 0;
          }
          return i1.name.localeCompare(i2.name);
        })
        .forEach(({ id }, index) => {
          languageOrders.set(id, index);
        });
      ordersByLanguage.set(language, languageOrders);
    });

    const newItems = this.items.map((item) => {
      const builder = MenuItemBuilder.fromMenuItem(item);
      languages.forEach((language) => {
        const localizedOrder = ordersByLanguage.get(language)?.get(item.treeId);
        const newLanguageSortOrders = new Map<number, number>();
        newLocalizedSortOrders
          .get(language)
          ?.forEach((value, key) => newLanguageSortOrders.set(key, value));
        newLocalizedSortOrders.set(language, newLanguageSortOrders);
        if (localizedOrder === undefined) {
          builder.setLocalizedSortOrder(language, -1);
          newLanguageSortOrders.set(item.treeId, -1);
        } else {
          builder.setLocalizedSortOrder(language, localizedOrder);
          newLanguageSortOrders.set(item.treeId, localizedOrder);
        }
      });
      return builder.build();
    });

    newItems.sort((i1, i2) => {
      return (
        (i1.localizedSortOrders.get(selectedLanguage) || -1) -
        (i2.localizedSortOrders.get(selectedLanguage) || -1)
      );
    });

    return MenuItemList.from(
      newItems,
      selectedLanguage,
      newLocalizedSortOrders
    );
  }

  withAppliedLocalizedSortOrders(languages: Array<string>): MenuItemList {
    const localizedSortOrders = LocalizedSortOrderBuilder.create()
      .setLocalizedSortOrders(this.localizedSortOrders)
      .expanded(languages)
      .build();
    const sortOrderKeys = Array.from(localizedSortOrders.keys());
    const newItems = MenuItemList.copy(this.items, (itemBuilder) => {
      sortOrderKeys.forEach((key) => {
        const sortOrder = localizedSortOrders.get(key)?.get(itemBuilder.treeId);
        if (sortOrder !== undefined) {
          itemBuilder.setLocalizedSortOrder(key, sortOrder);
        }
      });
      return itemBuilder;
    });
    localizedSortOrders.forEach((values, key) =>
      console.log(key, values.get(12))
    );
    return MenuItemList.from(
      newItems,
      ConfigUtil.defaultLanguage(),
      localizedSortOrders
    );
  }

  withRecalculatedLocalizedSortOrders(): MenuItemList {
    const newSortOrders = new Map<string, Map<number, number>>();
    const sortOrderKeys = Array.from(this.localizedSortOrders.keys());
    MenuItemList.traverseRecursively(this.items, [], (item) => {
      if (item.children.length > 0) {
        sortOrderKeys.forEach((key) => {
          const sortOrdersByKey = this.localizedSortOrders.get(key);
          if (sortOrdersByKey) {
            let newSortOrdersByKey = newSortOrders.get(key);
            if (newSortOrdersByKey === undefined) {
              newSortOrdersByKey = new Map<number, number>();
              newSortOrders.set(key, newSortOrdersByKey);
            }
            item.children
              .map((i) => {
                const order = sortOrdersByKey.get(i.treeId);
                return [
                  i.treeId,
                  order === undefined ? sortOrdersByKey.size : order,
                ];
              })
              .sort(([i1, o1], [i2, o2]) => o1 - o2)
              .forEach(([id], index) => newSortOrdersByKey?.set(id, index));
          }
        });
      }
    });

    sortOrderKeys.forEach((key) => {
      const sortOrdersByKey = this.localizedSortOrders.get(key);
      if (sortOrdersByKey) {
        let newSortOrdersByKey = newSortOrders.get(key);
        if (newSortOrdersByKey === undefined) {
          newSortOrdersByKey = new Map<number, number>();
          newSortOrders.set(key, newSortOrdersByKey);
        }
        this.items
          .map((i) => {
            const order = sortOrdersByKey.get(i.treeId);
            return [
              i.treeId,
              order === undefined ? sortOrdersByKey.size : order,
            ];
          })
          .sort(([i1, o1], [i2, o2]) => o1 - o2)
          .forEach(([id], index) => newSortOrdersByKey?.set(id, index));
      }
    });

    return new MenuItemList(this.items, this.validationErrors, newSortOrders);
  }

  getRecentInvisibleSeasons(): [[number, string][], [number, string][]] {
    const nonPrimarySeasons = new Array<[number, string]>();
    const hiddenStages = new Array<[number, string]>();
    const refStartDate = new Date();
    const refEndDate = new Date();
    refStartDate.setDate(refStartDate.getDate() + 7);
    const refStartTimestamp = DateUtil.dateToApiTimestamp(refStartDate, true);
    const refEndTimestamp = DateUtil.dateToApiTimestamp(refEndDate, true);
    MenuItemList.traverseRecursively(this.items, [], (item, index, parents) => {
      const isRecentSeason =
        item.type === MenuItemType.SEASON &&
        item.timeRange !== undefined &&
        item.timeRange.start <= refStartTimestamp &&
        item.timeRange.end > refEndTimestamp;
      if (isRecentSeason) {
        const parentStage =
          parents.length > 0 ? parents[parents.length - 1] : undefined;
        if (!item.primary) {
          const path = [...parents, item].map((item) => item.title).join(" ");
          nonPrimarySeasons.push([item.treeId, path]);
        }
        if (parentStage !== undefined && parentStage.hidden) {
          const path = parents.map((item) => item.title).join(" ");
          hiddenStages.push([parentStage.treeId, path]);
        }
      }
    });
    return [nonPrimarySeasons, hiddenStages];
  }

  serializable(): any {
    const defaultLanguage = ConfigUtil.defaultLanguage();
    const toSerializable = (object: any): any | undefined => {
      const categoryKeys = new Set<string>([
        "children",
        "code",
        "flagVariants",
        "hidden",
        "id",
        "name",
        "shortName",
        "type",
        "isPopular",
        "isPopularVisible",
        "sortOrderPopular",
        "localizedSortOrders",
        "countryCodes",
      ]);
      const stageKeys = new Set<string>([
        "children",
        "code",
        "gender",
        "hidden",
        "id",
        "name",
        "noDraw",
        "noScorers",
        "noTeamStats",
        "noTable",
        "noTracker",
        "domesticLeague",
        "highlightedTournament",
        "highlightedMatchListSections",
        "highlightedMatchRounds",
        "shortName",
        "type",
        "isPopular",
        "isPopularVisible",
        "sortOrderPopular",
        "localizedSortOrders",
        "countryCodes",
      ]);
      const seasonKeys = new Set<string>([
        "code",
        "id",
        "name",
        "primary",
        "shortName",
        "stageMappings",
        "timeRange",
        "type",
        "localizedSortOrders",
      ]);
      try {
        if (
          typeof object === "number" ||
          typeof object === "string" ||
          typeof object === "boolean" ||
          object === null ||
          object === undefined
        ) {
          return object;
        } else if (Array.isArray(object)) {
          return object.map((item, index) => {
            const serializedItem = toSerializable(item);
            if (serializedItem && typeof serializedItem === "object") {
              serializedItem.sortOrder = index;
            }
            return serializedItem;
          });
        } else if (object instanceof Map) {
          const result: any = {};
          object.forEach((value, key) => (result[key] = toSerializable(value)));
          return result;
        } else if (object instanceof Set) {
          return toSerializable(Array.from(object));
        } else {
          if ("locale" in object) {
            const defaultValue =
              typeof object.locale.get === "function"
                ? object.locale.get(defaultLanguage)
                : object.locale[defaultLanguage];
            if (
              !defaultValue ||
              !defaultValue.value ||
              isNaN(defaultValue.value.length) ||
              defaultValue.value.length === 0
            ) {
              return undefined;
            }
          }
          const result: any = {};
          const type = object.type;
          Object.getOwnPropertyNames(object).forEach((key) => {
            if (
              (type === MenuItemType.CATEGORY && !categoryKeys.has(key)) ||
              (type === MenuItemType.STAGE && !stageKeys.has(key)) ||
              (type === MenuItemType.SEASON && !seasonKeys.has(key))
            ) {
              return;
            }
            result[key] = toSerializable(object[key]);
          });
          return result;
        }
      } catch (e) {
        console.error(e);
        return {};
      }
    };

    return toSerializable(this.items);
  }
}
