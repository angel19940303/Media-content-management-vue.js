import { MenuItemList } from "../models/menu/menu-item-list";
import { ProviderCategoryCollection } from "../models/menu/provider-category-collection";
import { ProviderStage } from "../models/menu/provider-stage";
import { MenuItemType } from "../models/enums/menu-item-type";

export class MenuCleanupUtil {
  private readonly menu: MenuItemList;
  private readonly data: ProviderCategoryCollection;
  private readonly processedMenu: MenuItemList;

  constructor(menu?: MenuItemList, data?: ProviderCategoryCollection) {
    this.menu = menu || MenuItemList.create();
    this.data = data || new ProviderCategoryCollection([], []);
    this.processedMenu = MenuCleanupUtil.process(menu, data);
  }

  private static process(
    menu?: MenuItemList,
    data?: ProviderCategoryCollection
  ): MenuItemList {
    if (menu === undefined) {
      return MenuItemList.create();
    }
    if (data === undefined) {
      return menu;
    }

    const providerData = this.providerData(data);

    const seasonsToHide = new Set<number>();
    const stagesToRemove = new Set<number>();
    const stagesToHide = new Set<number>();

    return menu
      .mapped((builder) => {
        if (builder.type === MenuItemType.SEASON) {
          const validMappings = builder.stageMappings.filter(
            (m) => providerData.get(m.providerId)?.has(m.stageId) === true
          );
          if (validMappings.length === 0) {
            const seasonNameParts = this.parseSeasonName(builder.title);
            if (seasonNameParts.find((part) => part >= 2022)) {
              builder.setStageMappings(validMappings);
            } else {
              seasonsToHide.add(builder.treeId);
            }
          }
        } else if (
          builder.type === MenuItemType.STAGE &&
          builder.children.every(
            (c) => c.stageMappings.length === 0 || seasonsToHide.has(c.treeId)
          )
        ) {
          if (
            builder.children.some((child) => child.stageMappings.length === 0)
          ) {
            stagesToRemove.add(builder.treeId);
          } else {
            stagesToHide.add(builder.treeId);
          }
        }
        return builder;
      })
      .mapped((builder) => {
        if (
          builder.type === MenuItemType.SEASON &&
          builder.stageMappings.length === 0
        ) {
          return undefined;
        }
        if (
          builder.type === MenuItemType.STAGE &&
          stagesToRemove.has(builder.treeId)
        ) {
          return undefined;
        }
        if (
          builder.type === MenuItemType.STAGE &&
          stagesToHide.has(builder.treeId)
        ) {
          return builder.setHidden(true);
        }
        if (
          builder.type !== MenuItemType.SEASON &&
          builder.children.length === 0
        ) {
          return undefined;
        }
        if (
          builder.type !== MenuItemType.SEASON &&
          builder.children.every((c) => c.hidden)
        ) {
          return builder.setHidden(true);
        }
        return builder;
      })
      .withRecalculatedLocalizedSortOrders();
  }

  private static providerData(
    data: ProviderCategoryCollection
  ): Map<number, Set<string>> {
    const providerData = new Map<number, Set<string>>();
    data.categories.forEach((category) => {
      category.stages?.forEach((stage) => {
        if (!this.isValidStage(stage)) {
          console.error("Invalid provider stage", stage);
          return;
        }
        let providerStageIds = providerData.get(stage.pid || 0);
        if (providerStageIds === undefined) {
          providerStageIds = new Set<string>();
          providerData.set(stage.pid || 0, providerStageIds);
        }
        providerStageIds.add(stage.st_id || "");
      });
    });
    return providerData;
  }

  private static isValidStage(stage: ProviderStage): boolean {
    return (
      stage.pid !== undefined &&
      stage.c_id !== undefined &&
      stage.st_id !== undefined &&
      stage.c_name !== undefined &&
      stage.st_name !== undefined &&
      stage.season !== undefined
    );
  }

  private static parseSeasonName(seasonName: string): number[] {
    const regex = new RegExp(/[0-9]{2,4}/);
    const result = regex.exec(seasonName);
    if (result === null) {
      return [];
    }
    return result.map((value) => parseInt(value, 10));
  }

  withMenu(menu: MenuItemList): MenuCleanupUtil {
    return new MenuCleanupUtil(menu, this.data);
  }

  withData(data: ProviderCategoryCollection | undefined): MenuCleanupUtil {
    return new MenuCleanupUtil(
      this.menu,
      data || new ProviderCategoryCollection([], [])
    );
  }

  cleanedUpMenu(): MenuItemList {
    return this.processedMenu;
  }

  removedItems(): Map<number, string[]> {
    const validItemIds = new Set<number>();
    MenuItemList.traverseRecursively(this.processedMenu.items, [], (item) => {
      validItemIds.add(item.treeId);
    });

    const removedItems = new Map<number, string[]>();
    MenuItemList.traverseRecursively(
      this.menu.items,
      [],
      (item, index, parents) => {
        if (!validItemIds.has(item.treeId)) {
          let removedItemsOfType = removedItems.get(item.type);
          if (removedItemsOfType === undefined) {
            removedItemsOfType = [];
            removedItems.set(item.type, removedItemsOfType);
          }
          const titleParts = parents.map((p) => p.title);
          titleParts.push(item.title);
          removedItemsOfType?.push(titleParts.join(" "));
        }
      }
    );

    return removedItems;
  }
}
