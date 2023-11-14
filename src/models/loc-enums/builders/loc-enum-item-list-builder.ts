import { LocEnumDataPayload } from "../loc-enum-data-payload";
import { LocEnumItem } from "../loc-enum-item";
import { LocEnumItemBuilder } from "./loc-enum-item-builder";
import { LocaleBuilder } from "../../common/builders/locale-builder";
import { Provider } from "../../enums/provider";
import { LocEnumItemList } from "../loc-enum-item-list";
import { ProviderCategoryCollection } from "../../menu/provider-category-collection";
import { Stage } from "../../api-data/stage";
import { Team } from "../../api-data/team";
import { ConfigUtil } from "../../../utils/config-util";

export class LocEnumItemListBuilder {
  private items = new Array<LocEnumItem>();

  static create(): LocEnumItemListBuilder {
    return new LocEnumItemListBuilder();
  }

  static fromPayload(payload: LocEnumDataPayload): LocEnumItemListBuilder {
    const items = new Array<LocEnumItem>();
    if (Array.isArray(payload.items)) {
      payload.items.forEach((item: any) => {
        const itemBuilder = new LocEnumItemBuilder();
        itemBuilder.setName(LocaleBuilder.fromData(item.name).build());
        if (item.ids !== undefined) {
          Object.getOwnPropertyNames(item.ids).forEach((providerIdStr) => {
            const providerId = parseInt(providerIdStr, 10);
            if (
              !isNaN(providerId) &&
              Provider.codeForProvider(providerId) !== undefined
            ) {
              const id: string = item.ids[providerIdStr];
              if (id !== undefined) {
                itemBuilder.addProviderId(providerId, id);
              }
            }
          });
        }
        items.push(itemBuilder.build());
      });
    }
    return new LocEnumItemListBuilder().setItems(items);
  }

  static fromProviderCategories(
    data: ProviderCategoryCollection,
    sport?: number
  ): LocEnumItemListBuilder {
    const listBuilder = new LocEnumItemListBuilder();
    const itemBuilderCache = new Map<string, LocEnumItemBuilder>();
    data.categories.forEach((category) => {
      if (
        category.pid === undefined ||
        Provider.codeForProvider(category.pid) === undefined ||
        category.c_name === undefined ||
        category.c_id === undefined
      ) {
        return;
      }
      let itemBuilder = itemBuilderCache.get(category.c_name);
      if (itemBuilder === undefined) {
        itemBuilder = new LocEnumItemBuilder();
        itemBuilder.addLocalisedName(
          ConfigUtil.defaultLanguage(),
          category.c_name
        );
        if (sport !== undefined) {
          itemBuilder.setSport(sport);
        }
        itemBuilderCache.set(category.c_name, itemBuilder);
      }
      itemBuilder.addProviderId(category.pid, category.c_id);
    });
    const items = Array.from(itemBuilderCache.values())
      .map((builder) => builder.build())
      .sort((a, b) => (a.title < b.title ? -1 : 1));
    return listBuilder.setItems(items);
  }

  static fromStages(stages?: Stage[], sport?: number): LocEnumItemListBuilder {
    const items = new Array<LocEnumItem>();

    if (stages !== undefined) {
      const itemIdCache = new Set<string>();

      const processTeam = (team: Team, sport: number): void => {
        if (!itemIdCache.has(team.id) && team.name !== undefined) {
          itemIdCache.add(team.id);
          items.push(
            new LocEnumItemBuilder()
              .addLocalisedName(ConfigUtil.defaultLanguage(), team.name)
              .setSport(sport)
              .addProviderId(Provider.INTERNAL, team.id)
              .build()
          );
        }
      };

      stages.forEach((stage) => {
        const stageSport = stage.sportId || sport;
        if (stageSport === undefined) {
          return;
        }
        if (stage.matches.length > 0) {
          stage.matches.forEach((match) =>
            match.teams.forEach((team) => processTeam(team, stageSport))
          );
        }
        if (
          stage.leagueTables !== undefined &&
          stage.leagueTables.tables.length > 0
        ) {
          stage.leagueTables.tables.forEach((table) => {
            table.teams.forEach((team) => processTeam(team, stageSport));
          });
        }
      });
    }

    const sortedItems = items.sort((a, b) => (a.title < b.title ? -1 : 1));

    return new LocEnumItemListBuilder().setItems(sortedItems);
  }

  setItems(items: Array<any>): LocEnumItemListBuilder {
    this.items = Array.from(items);
    return this;
  }

  addItems(items: Array<any>): LocEnumItemListBuilder {
    const newItems = Array.from(this.items);
    newItems.push(...items);
    this.items = newItems;
    return this;
  }

  build(): LocEnumItemList {
    return new LocEnumItemList(this.items, []);
  }
}
