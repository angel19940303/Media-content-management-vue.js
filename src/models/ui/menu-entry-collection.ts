import { MenuItem } from "../menu/menu-item";
import { MenuItemBuilder } from "../menu/builders/menu-item-builder";
import { TreeDataNodeType } from "../enums/tree-data-node-type";

export class MenuEntryCollection {
  readonly categories: Array<MenuItem>;
  readonly stages: Array<MenuItem>;
  readonly seasons: Array<MenuItem>;
  readonly names: Map<string, string>;

  private constructor(
    categories: Array<MenuItem>,
    stages: Array<MenuItem>,
    seasons: Array<MenuItem>,
    names: Map<string, string>
  ) {
    this.categories = categories;
    this.stages = stages;
    this.seasons = seasons;
    this.names = names;
  }

  static create(
    data?: any,
    existingEntryIds?: Set<string>
  ): MenuEntryCollection {
    const categories = new Array<MenuItem>();
    const stages = new Array<MenuItem>();
    const seasons = new Array<MenuItem>();
    const names = new Map<string, string>();
    if (data && Array.isArray(data)) {
      const existing = existingEntryIds || new Set<string>();
      const added = new Set<string>();
      const processItems = (items: Array<any>, path: string): void => {
        const basePath = path.length === 0 ? path : path + " - ";
        items.forEach((item) => {
          const builder = MenuItemBuilder.fromData(item);
          const itemPath = basePath + builder.title;
          if (
            typeof item.id === "string" &&
            !existing.has(item.id) &&
            !added.has(item.id)
          ) {
            builder.setChildren([]);
            let list: Array<MenuItem> | undefined = undefined;
            if (item.type === TreeDataNodeType.CATEGORY) {
              list = categories;
            } else if (item.type === TreeDataNodeType.STAGE) {
              list = stages;
            } else if (item.type === TreeDataNodeType.SEASON) {
              list = seasons;
            }
            if (list) {
              list.push(builder.build());
              names.set(item.id, itemPath);
              added.add(item.id);
            }
          }
          if (item.children && item.children.length > 0) {
            processItems(item.children, itemPath);
          }
        });
      };
      processItems(data, "");
    }
    return new MenuEntryCollection(categories, stages, seasons, names);
  }

  list(type: number, filter?: string): Array<MenuItem> {
    let list: Array<MenuItem>;
    switch (type) {
      case TreeDataNodeType.CATEGORY:
        list = this.categories;
        break;
      case TreeDataNodeType.STAGE:
        list = this.stages;
        break;
      case TreeDataNodeType.SEASON:
        list = this.seasons;
        break;
      default:
        list = [];
        break;
    }

    if (filter && filter.length > 0) {
      const lowercaseFilter = filter.toLowerCase();
      return list.filter(
        (item) => this.name(item.id).toLowerCase().indexOf(lowercaseFilter) >= 0
      );
    }

    return list;
  }

  name(id: string | undefined): string {
    if (id === undefined) {
      return "";
    }
    return this.names.get(id) || "";
  }
}
