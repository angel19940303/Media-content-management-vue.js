import { MenuItemType } from "../../enums/menu-item-type";
import { Locale } from "../../common/locale";
import { Gender } from "../../enums/gender";
import { StageMapping } from "../stage-mapping";
import { TimeRange } from "../../common/time-range";
import { MenuItem } from "../menu-item";
import { LocaleBuilder } from "../../common/builders/locale-builder";
import { StageMappingBuilder } from "./stage-mapping-builder";
import { TextUtil } from "../../../utils/text-util";
import { TreeDataNodeType } from "../../enums/tree-data-node-type";
import { MenuItemProperty } from "../../enums/menu-item-property";
import { ConfigUtil } from "../../../utils/config-util";
import { DateUtil } from "../../../utils/date-util";

export class MenuItemBuilder {
  id: string | undefined = undefined;
  type: number = MenuItemType.UNKNOWN;
  treeId: number = 0;
  title: string = "";
  name: Locale = LocaleBuilder.create()
    .addValueParts(ConfigUtil.defaultLanguage(), "")
    .build();
  shortName: Locale = LocaleBuilder.create()
    .addValueParts(ConfigUtil.defaultLanguage(), "")
    .build();
  code: Locale = LocaleBuilder.create()
    .addValueParts(ConfigUtil.defaultLanguage(), "")
    .build();
  gender: number = Gender.UNKNOWN;
  hidden: boolean = false;
  noTable: boolean = false;
  noScorers: boolean = false;
  noTeamStats: boolean = false;
  noTracker: boolean = false;
  noDraw: boolean = false;
  domesticLeague: boolean = false;
  highlightedTournament: boolean = false;
  highlightedMatchListSections: boolean = false;
  highlightedMatchRounds: string[] = [];
  isPopular: boolean = false;
  isPopularVisible: boolean = false;
  primary: boolean = false;
  children: Array<MenuItem> = [];
  stageMappings: Array<StageMapping> = [];
  flagVariants: Map<number, string> = new Map<number, string>();
  timeRange?: TimeRange;
  expanded?: boolean;
  sortOrderPopular?: number;
  path: Array<string> = [];
  countryCodes: Array<string> = [];
  localizedSortOrders = new Map<string, number>();

  static create(): MenuItemBuilder {
    return new MenuItemBuilder();
  }

  static fromData(data: any): MenuItemBuilder {
    const builder = new MenuItemBuilder();
    const nameLocale = LocaleBuilder.fromData(data.name).build();
    if (typeof data.id === "string") {
      builder.setId(data.id);
    }
    if (typeof data.type === "number") {
      builder.setType(data.type);
    }
    if (typeof data.treeId === "number") {
      builder.setTreeId(data.treeId);
    }
    builder.setName(nameLocale);
    builder.setShortName(LocaleBuilder.fromData(data.shortName).build());
    builder.setCode(LocaleBuilder.fromData(data.code).build());
    if (typeof data.title === "string" && data.title.length > 0) {
      builder.setTitle(data.title);
    } else {
      let title =
        nameLocale.locale.get(ConfigUtil.defaultLanguage())?.value || "";
      if (data.type === TreeDataNodeType.STAGE) {
        title += Gender.shortSuffix(data.gender || Gender.UNKNOWN);
      }
      builder.setTitle(title);
    }
    if (typeof data.gender === "number") {
      builder.setGender(data.gender);
    }
    builder.setHidden(data.hidden === true);
    builder.setNoTable(data.noTable === true);
    builder.setNoDraw(data.noDraw === true);
    builder.setNoScorers(data.noScorers === true);
    builder.setNoTeamStats(data.noTeamStats === true);
    builder.setNoTracker(data.noTracker === true);
    builder.setIsPopular(data.isPopular === true);
    builder.setIsPopularVisible(data.isPopularVisible === true);
    builder.setPrimary(data.primary === true);
    if (
      data.timeRange &&
      typeof data.timeRange.start === "number" &&
      typeof data.timeRange.end === "number"
    ) {
      builder.setTimeRangeParts(data.timeRange.start, data.timeRange.end);
    }
    if (data.flagVariants && typeof data.flagVariants === "object") {
      Object.getOwnPropertyNames(data.flagVariants).forEach((key) => {
        const flagVariantId = TextUtil.parseNumber(key);
        const value = data.flagVariants[key];
        if (flagVariantId && typeof value === "string") {
          builder.setFlagVariant(flagVariantId, value);
        }
      });
    }
    if (Array.isArray(data.children)) {
      builder.setChildren(data.children);
    }
    if (data.sortOrderPopular && typeof data.sortOrderPopular === "number") {
      builder.setSortOrderPopular(data.sortOrderPopular);
    }
    if (Array.isArray(data.path)) {
      builder.setPath(data.path);
    }
    if (Array.isArray(data.countryCodes)) {
      builder.setCountryCodes(data.countryCodes);
    }
    if (
      data.localizedSortOrders &&
      typeof data.localizedSortOrders === "object"
    ) {
      Object.getOwnPropertyNames(data.localizedSortOrders).forEach((key) => {
        const value = TextUtil.parseNumber(data.localizedSortOrders[key]);
        if (value !== undefined) {
          builder.setLocalizedSortOrder(key, value);
        }
      });
    }
    return builder;
  }

  static fromMenuItem(menuItem: MenuItem): MenuItemBuilder {
    const nameLocale = LocaleBuilder.fromLocaleObject(menuItem.name).build();
    const shortNameLocale = LocaleBuilder.fromLocaleObject(
      menuItem.shortName
    ).build();
    const codeLocale = LocaleBuilder.fromLocaleObject(menuItem.code).build();
    const builder = new MenuItemBuilder()
      .setId(menuItem.id)
      .setType(menuItem.type)
      .setTreeId(menuItem.treeId)
      .setTitle(menuItem.title)
      .setName(nameLocale)
      .setShortName(shortNameLocale)
      .setCode(codeLocale)
      .setGender(menuItem.gender)
      .setHidden(menuItem.hidden)
      .setNoTable(menuItem.noTable)
      .setNoDraw(menuItem.noDraw)
      .setNoScorers(menuItem.noScorers)
      .setNoTeamStats(menuItem.noTeamStats)
      .setNoTracker(menuItem.noTracker)
      .setDomesticLeague(menuItem.domesticLeague)
      .setHighlightedTournament(menuItem.highlightedTournament)
      .setHighlightedMatchListSections(menuItem.highlightedMatchListSections)
      .setHighlightedMatchRounds(menuItem.highlightedMatchRounds)
      .setIsPopular(menuItem.isPopular)
      .setIsPopularVisible(menuItem.isPopularVisible)
      .setPrimary(menuItem.primary)
      .setTimeRange(menuItem.timeRange)
      .setFlagVariants(menuItem.flagVariants)
      .setChildren(menuItem.children)
      .setExpanded(menuItem.expanded)
      .setSortOrderPopular(menuItem.sortOrderPopular)
      .setCountryCodes(menuItem.countryCodes)
      .setPath(menuItem.path);
    if (menuItem.stageMappings !== undefined) {
      menuItem.stageMappings.forEach((mapping) =>
        builder.addStageMapping(mapping)
      );
    }
    menuItem.localizedSortOrders.forEach((order, language) => {
      builder.setLocalizedSortOrder(language, order);
    });
    return builder;
  }

  static rebuild(item: MenuItem): MenuItem {
    return this.fromMenuItem(item).build();
  }

  private static forEachItem(
    items: MenuItem[],
    indexPath: number[],
    f: (item: MenuItem, indexPath: number[]) => void
  ): void {
    items.forEach((item, index) => {
      const newIndexPath = [...indexPath, index];
      f(item, [...indexPath, index]);
      if (item.children !== undefined && item.children.length > 0) {
        this.forEachItem(item.children, newIndexPath, f);
      }
    });
  }

  private constructor() {}

  setId(id: string | undefined): MenuItemBuilder {
    this.id = id;
    return this;
  }

  setType(type: number): MenuItemBuilder {
    this.type = type;
    return this;
  }

  setTreeId(treeId: number): MenuItemBuilder {
    this.treeId = treeId;
    return this;
  }

  setTitle(title: string): MenuItemBuilder {
    this.title = title;
    return this;
  }

  setName(name: Locale): MenuItemBuilder {
    const oldDefaultName =
      this.name.locale.get(ConfigUtil.defaultLanguage())?.value || "";
    const newDefaultName =
      name.locale.get(ConfigUtil.defaultLanguage())?.value || "";
    this.name = name;
    this.updateTitlePart(oldDefaultName, newDefaultName);
    return this;
  }

  upsertName(language: string, name: string): MenuItemBuilder {
    const locale = LocaleBuilder.fromLocale(this.name)
      .addValueParts(language, name)
      .build();
    return this.setName(locale);
  }

  setShortName(shortName: Locale): MenuItemBuilder {
    this.shortName = shortName;
    return this;
  }

  upsertShortName(language: string, shortName: string): MenuItemBuilder {
    const locale = LocaleBuilder.fromLocale(this.shortName)
      .addValueParts(language, shortName)
      .build();
    return this.setShortName(locale);
  }

  setCode(code: Locale): MenuItemBuilder {
    this.code = code;
    return this;
  }

  setGender(gender: number): MenuItemBuilder {
    const oldGenderSuffix = Gender.suffix(this.gender) || "";
    const newGenderSuffix = Gender.suffix(gender) || "";
    this.gender = gender;
    this.updateTitlePart(oldGenderSuffix, newGenderSuffix);
    return this;
  }

  setHidden(hidden: boolean): MenuItemBuilder {
    this.hidden = hidden;
    return this;
  }

  setNoTable(noTable: boolean): MenuItemBuilder {
    this.noTable = noTable;
    return this;
  }

  setNoScorers(noScorers: boolean): MenuItemBuilder {
    this.noScorers = noScorers;
    return this;
  }

  setNoTeamStats(noTeamStats: boolean): MenuItemBuilder {
    this.noTeamStats = noTeamStats;
    return this;
  }

  setNoTracker(noTracker: boolean): MenuItemBuilder {
    this.noTracker = noTracker;
    return this;
  }

  setNoDraw(noDraw: boolean): MenuItemBuilder {
    this.noDraw = noDraw;
    return this;
  }

  setDomesticLeague(domesticLeague: boolean): MenuItemBuilder {
    this.domesticLeague = domesticLeague;
    return this;
  }

  setHighlightedTournament(highlightedTournament: boolean): MenuItemBuilder {
    this.highlightedTournament = highlightedTournament;
    return this;
  }

  setHighlightedMatchListSections(
    highlightedMatchListSections: boolean
  ): MenuItemBuilder {
    this.highlightedMatchListSections = highlightedMatchListSections;
    return this;
  }

  setHighlightedMatchRounds(highlightedMatchRounds: string[]): MenuItemBuilder {
    this.highlightedMatchRounds = highlightedMatchRounds;
    return this;
  }

  setIsPopular(isPopular: boolean): MenuItemBuilder {
    this.isPopular = isPopular;
    return this;
  }

  setIsPopularVisible(isPopularVisible: boolean): MenuItemBuilder {
    this.isPopularVisible = isPopularVisible;
    return this;
  }

  setPrimary(primary: boolean): MenuItemBuilder {
    this.primary = primary;
    return this;
  }

  setChildren(children: Array<MenuItem>): MenuItemBuilder {
    this.children = children;
    return this;
  }

  addChild(child: MenuItem): MenuItemBuilder {
    this.children.push(child);
    return this;
  }

  addChildFromBuilder(childBuilder: MenuItemBuilder): MenuItemBuilder {
    this.children.push(childBuilder.build());
    return this;
  }

  addStageMapping(stageMapping: StageMapping): MenuItemBuilder {
    this.stageMappings.push(stageMapping);
    return this;
  }

  addStageMappingFromBuilder(builder: StageMappingBuilder): MenuItemBuilder {
    this.stageMappings.push(builder.build());
    return this;
  }

  setTimeRange(timeRange: TimeRange | undefined): MenuItemBuilder {
    this.timeRange = timeRange;
    return this;
  }

  setTimeRangeParts(start: number, end: number): MenuItemBuilder {
    this.timeRange = { start: start, end: end };
    return this;
  }

  setStageMappings(stageMappings?: Array<StageMapping>): MenuItemBuilder {
    this.stageMappings = stageMappings || [];
    return this;
  }

  setFlagVariants(flagVariants: Map<number, string>): MenuItemBuilder {
    this.flagVariants = flagVariants;
    return this;
  }

  setFlagVariant(flagVariant: number, url: string): MenuItemBuilder {
    this.flagVariants.set(flagVariant, url);
    return this;
  }

  setPrimaryChild(treeId?: number): MenuItemBuilder {
    this.children.forEach(
      (child) =>
        (child.primary = treeId !== undefined && child.treeId === treeId)
    );
    return this;
  }

  setSortOrderPopular(sortOrderPopular?: number): MenuItemBuilder {
    this.sortOrderPopular = sortOrderPopular;
    return this;
  }

  setExpanded(expanded?: boolean): MenuItemBuilder {
    this.expanded = expanded;
    return this;
  }

  setPath(path: Array<string>): MenuItemBuilder {
    this.path = path;
    return this;
  }

  setPropertyValue(property: number, value: boolean): MenuItemBuilder {
    switch (property) {
      case MenuItemProperty.HIDDEN:
        return this.setHidden(value);
      case MenuItemProperty.NO_TEAM_STATS:
        return this.setNoTeamStats(value);
      case MenuItemProperty.NO_SCORERS:
        return this.setNoScorers(value);
      case MenuItemProperty.NO_TABLE:
        return this.setNoTable(value);
      case MenuItemProperty.NO_DRAW:
        return this.setNoDraw(value);
      case MenuItemProperty.NO_TRACKER:
        return this.setNoTracker(value);
      case MenuItemProperty.DOMESTIC_LEAGUE:
        return this.setDomesticLeague(value);
      case MenuItemProperty.HIGHLIGHTED_TOURNAMENT:
        return this.setHighlightedTournament(value);
      case MenuItemProperty.HIGHLIGHTED_MATCH_LIST_SECTIONS:
        return this.setHighlightedMatchListSections(value);
    }
    return this;
  }

  setCountryCodes(countryCodes: Array<string>): MenuItemBuilder {
    this.countryCodes = countryCodes || [];
    return this;
  }

  setLocalizedSortOrder(key: string, value: number): MenuItemBuilder {
    this.localizedSortOrders.set(key, value);
    return this;
  }

  forEachChild(
    f: (child: MenuItem, indexPath: number[]) => void
  ): MenuItemBuilder {
    if (this.children !== undefined && this.children.length > 0) {
      MenuItemBuilder.forEachItem(this.children, [], f);
    }
    return this;
  }

  build(): MenuItem {
    let subtitle: string | undefined = undefined;
    if (
      this.type === TreeDataNodeType.STAGE &&
      this.children !== undefined &&
      this.children.length > 0
    ) {
      const primaryStartTimestamp = this.children.find((child) => child.primary)
        ?.timeRange?.start;
      if (primaryStartTimestamp !== undefined) {
        const startDate = DateUtil.apiTimestampToDate(
          primaryStartTimestamp,
          true
        );
        subtitle = DateUtil.formatDateShort(startDate);
      }
    }
    return {
      id: this.id,
      type: this.type,
      treeId: this.treeId,
      title: this.title,
      subtitle: subtitle,
      name: this.name,
      shortName: this.shortName,
      code: this.code,
      gender: this.gender,
      hidden: this.hidden,
      noTable: this.noTable,
      noScorers: this.noScorers,
      noTeamStats: this.noTeamStats,
      noTracker: this.noTracker,
      noDraw: this.noDraw,
      domesticLeague: this.domesticLeague,
      highlightedTournament: this.highlightedTournament,
      highlightedMatchListSections: this.highlightedMatchListSections,
      highlightedMatchRounds: this.highlightedMatchRounds,
      isPopular: this.isPopular,
      isPopularVisible: this.isPopularVisible,
      primary: this.primary,
      children: this.children,
      stageMappings: this.stageMappings,
      timeRange: this.timeRange,
      flagVariants: this.flagVariants,
      expanded: this.expanded,
      sortOrderPopular: this.sortOrderPopular,
      path: this.path,
      countryCodes: this.countryCodes,
      localizedSortOrders: this.localizedSortOrders,
    };
  }

  private updateTitlePart(oldPart: string, newPart: string): string {
    if (this.title.indexOf(oldPart) < 0) {
      return this.title + newPart;
    }
    return this.title.replace(oldPart, newPart);
  }
}
