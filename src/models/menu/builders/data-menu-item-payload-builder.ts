import { MenuDataPayload } from "../menu-data-payload";
import { IncrementalIdGenerator } from "../../common/incremental-id-generator";
import { Locale } from "../../common/locale";
import { LocaleBuilder } from "../../common/builders/locale-builder";
import { MenuItem } from "../menu-item";
import { Gender } from "../../enums/gender";
import { MenuItemBuilder } from "./menu-item-builder";
import { MenuItemPayloadBuilderDefaultValues } from "./menu-item-payload-builder-default-values";
import { MenuItemPayload } from "../menu-item-payload";
import { StageMapping } from "../stage-mapping";
import { TextUtil } from "../../../utils/text-util";
import { LocalizedSortOrderBuilder } from "./localized-sort-order-builder";
import { ConfigUtil } from "../../../utils/config-util";

export class DataMenuItemPayloadBuilder {
  private readonly assignedSeasonCounts: Map<string, number>;
  private publishUrl?: string;
  private menuItems: Array<MenuItem>;
  private treeIdCounter: IncrementalIdGenerator;
  private defaultValues: MenuItemPayloadBuilderDefaultValues;
  private existingStageItems: Map<string, MenuItem>;
  private existingSeasonItems: Map<string, Map<string, MenuItem>>;
  private localizedSortOrders: Map<string, Map<number, number>>;

  private constructor(
    treeIdCounter: IncrementalIdGenerator,
    defaultValues: MenuItemPayloadBuilderDefaultValues
  ) {
    this.treeIdCounter = treeIdCounter;
    this.defaultValues = defaultValues;
    this.menuItems = new Array<MenuItem>();
    this.assignedSeasonCounts = new Map<string, number>();
    this.existingStageItems = new Map<string, MenuItem>();
    this.existingSeasonItems = new Map<string, Map<string, MenuItem>>();
    this.localizedSortOrders = new Map<string, Map<number, number>>();
  }

  static create(
    treeIdCounter: IncrementalIdGenerator,
    defaultValues: MenuItemPayloadBuilderDefaultValues
  ): DataMenuItemPayloadBuilder {
    return new DataMenuItemPayloadBuilder(treeIdCounter, defaultValues);
  }

  build(): MenuItemPayload {
    return {
      publishUrl: this.publishUrl,
      menuItems: this.menuItems,
      stageMappings: [],
      assignedSeasonCounts: this.assignedSeasonCounts,
      localizedSortOrders: this.localizedSortOrders,
    };
  }

  addData(data: MenuDataPayload | undefined): DataMenuItemPayloadBuilder {
    this.publishUrl = data?.publishUrl;

    const parseLocale = (data: any): Locale => {
      const builder = LocaleBuilder.create();
      if (data && data.locale) {
        Object.getOwnPropertyNames(data.locale).forEach((key) => {
          const value = data.locale[key];
          if (!value || !value.value || value.value.length === 0) {
            return;
          }
          builder.addValueParts(key, value.value, value.manual === true);
        });
      }
      return builder.build();
    };

    const parseMenuItems = (
      items: any
    ): [Array<MenuItem>, Map<string, Map<number, number>>, number] => {
      const menuItems = new Array<MenuItem>();
      //const localizedSortOrders = new Map<string, Map<number, number>>();
      const localizedSortOrderBuilder = LocalizedSortOrderBuilder.create();
      let itemCount = 0;
      if (Array.isArray(items)) {
        items.forEach((item) => {
          const nameLocale = parseLocale(item.name);
          const title =
            (nameLocale.locale.get(ConfigUtil.defaultLanguage())?.value || "") +
            (item.gender === Gender.FEMALE ? " (w)" : "");

          const builder = MenuItemBuilder.create()
            .setId(item.id)
            .setType(item.type)
            .setTreeId(this.treeIdCounter.getAndIncrement())
            .setTitle(title)
            .setName(nameLocale)
            .setShortName(parseLocale(item.shortName))
            .setCode(parseLocale(item.code))
            .setGender(item.gender)
            .setHidden(item.hidden === true)
            .setNoTable(item.noTable === true)
            .setNoDraw(item.noDraw === true)
            .setNoScorers(item.noScorers === true)
            .setNoTeamStats(item.noTeamStats === true)
            .setNoTracker(item.noTracker === true)
            .setDomesticLeague(item.domesticLeague === true)
            .setHighlightedTournament(item.highlightedTournament === true)
            .setHighlightedMatchListSections(
              item.highlightedMatchListSections === true
            )
            .setHighlightedMatchRounds(item.highlightedMatchRounds || [])
            .setIsPopular(item.isPopular === true)
            .setIsPopularVisible(item.isPopularVisible === true)
            .setPrimary(item.primary === true);

          if (item.timeRange && item.timeRange.start && item.timeRange.end) {
            builder.setTimeRangeParts(item.timeRange.start, item.timeRange.end);
          }

          if (item.flagVariants) {
            Object.getOwnPropertyNames(item.flagVariants).forEach((key) => {
              const id = parseInt(key, 10);
              if (isNaN(id)) {
                return;
              }
              builder.setFlagVariant(id, item.flagVariants[key] || "");
            });
          }

          if (item.children) {
            const [children, childSortOrders, childCount] = parseMenuItems(
              item.children
            );
            builder.setChildren(children);
            localizedSortOrderBuilder.setLocalizedSortOrders(
              childSortOrders,
              false
            );
            itemCount += childCount;
          }

          if (item.stageMappings) {
            item.stageMappings.forEach((stageMapping: StageMapping) => {
              if (!stageMapping.stageId) {
                return;
              }
              builder.addStageMapping(stageMapping);
              const count =
                this.assignedSeasonCounts.get(stageMapping.stageId) || 0;
              this.assignedSeasonCounts.set(stageMapping.stageId, count + 1);
            });
          }

          if (item.sortOrderPopular) {
            builder.setSortOrderPopular(item.sortOrderPopular);
          }

          if (item.localizedSortOrders) {
            Object.getOwnPropertyNames(item.localizedSortOrders).forEach(
              (key) => {
                const value =
                  TextUtil.parseNumber(item.localizedSortOrders[key]) || 0;
                if (value !== undefined) {
                  builder.setLocalizedSortOrder(key, value);
                }
              }
            );
          }

          if (Array.isArray(item.countryCodes)) {
            builder.setCountryCodes(item.countryCodes);
          }

          const menuItem = builder.build();
          localizedSortOrderBuilder.addMenuItemData(menuItem);
          itemCount++;
          menuItems.push(menuItem);
        });
      }
      return [menuItems, localizedSortOrderBuilder.build(), itemCount];
    };

    if (!data) {
      this.menuItems = [];
    } else {
      const [menuItems, localizedSortOrders, itemCount] = parseMenuItems(
        data.menu
      );
      const localizedSortOrderBuilder = LocalizedSortOrderBuilder.create().setLocalizedSortOrders(
        localizedSortOrders,
        true
      );
      if (!localizedSortOrderBuilder.has(ConfigUtil.defaultLanguage())) {
        localizedSortOrderBuilder.setDataForLanguage(
          this.menuItems,
          ConfigUtil.defaultLanguage()
        );
      }
      this.menuItems = menuItems;
      this.localizedSortOrders = localizedSortOrderBuilder
        .sanitized(itemCount)
        .build();
    }

    return this;
  }
}
