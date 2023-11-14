import { MenuItem } from "../menu-item";
import { MenuItemBuilder } from "./menu-item-builder";

export class MenuListBuilder {
  private menuItems: Array<MenuItem>;

  private constructor(menuItems: Array<MenuItem>) {
    this.menuItems = menuItems;
  }

  static from(menuItems: Array<MenuItem>): MenuListBuilder {
    return new MenuListBuilder(menuItems);
  }

  private static copyMenuItems(
    items: Array<MenuItem>,
    transform: (builder: MenuItemBuilder) => MenuItemBuilder
  ): Array<MenuItem> {
    const result = new Array<MenuItem>();
    items.forEach((item) => {
      const newItem = transform(
        MenuItemBuilder.fromMenuItem(item).setChildren(
          MenuListBuilder.copyMenuItems(item.children, transform)
        )
      ).build();
      newItem.expanded = item.expanded;
      result.push(newItem);
    });
    return result;
  }

  insertItem(item: MenuItem, parentTreeId?: number): MenuListBuilder {
    this.menuItems = MenuListBuilder.copyMenuItems(
      this.menuItems,
      (itemBuilder) => {
        if (parentTreeId !== undefined && itemBuilder.treeId === parentTreeId) {
          return itemBuilder.addChild(item);
        }
        return itemBuilder;
      }
    );
    if (parentTreeId === undefined) {
      this.menuItems.push(item);
    }
    return this;
  }

  updateItem(item: MenuItem): MenuListBuilder {
    this.menuItems = MenuListBuilder.copyMenuItems(
      this.menuItems,
      (itemBuilder) => {
        if (itemBuilder.treeId === item.treeId) {
          return itemBuilder
            .setId(item.id)
            .setTreeId(item.treeId)
            .setType(item.type)
            .setTitle(item.title)
            .setName(item.name)
            .setCode(item.code)
            .setGender(item.gender)
            .setHidden(item.hidden)
            .setPrimary(item.primary)
            .setTimeRange(item.timeRange)
            .setStageMappings(item.stageMappings);
        }
        return itemBuilder;
      }
    );
    return this;
  }

  build(): Array<MenuItem> {
    return this.menuItems;
  }
}
