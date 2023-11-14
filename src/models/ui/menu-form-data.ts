import { Locale } from "../common/locale";
import { StageMapping } from "../menu/stage-mapping";
import { LocaleBuilder } from "../common/builders/locale-builder";
import { Gender } from "../enums/gender";
import { MenuItem } from "../menu/menu-item";
import { DateUtil } from "../../utils/date-util";
import { MenuFormValidation } from "./menu-form-validation";
import { MenuItemType } from "../enums/menu-item-type";
import { MenuItemBuilder } from "../menu/builders/menu-item-builder";
import { MenuItemProperty } from "../enums/menu-item-property";
import { ConfigUtil } from "../../utils/config-util";

export class MenuFormData {
  readonly id: string | undefined;
  readonly type: number;
  readonly name: Locale;
  readonly shortName: Locale;
  readonly code: Locale;
  readonly gender: number;
  readonly start: string;
  readonly end: string;
  readonly hidden: boolean;
  readonly noTable: boolean;
  readonly noScorers: boolean;
  readonly noTeamStats: boolean;
  readonly noTracker: boolean;
  readonly noDraw: boolean;
  readonly domesticLeague: boolean;
  readonly highlightedTournament: boolean;
  readonly highlightedMatchListSections: boolean;
  readonly highlightedMatchRounds: string[];
  readonly isPopular: boolean;
  readonly isPopularVisible: boolean;
  readonly primary: boolean;
  readonly stageMappings: Array<StageMapping>;
  readonly flagVariants: Map<number, string>;
  readonly validation: MenuFormValidation;
  readonly countryCodes: Array<string>;
  readonly sortOrderPopular?: number;

  private constructor(
    id: string | undefined,
    type: number,
    name: Locale,
    shortName: Locale,
    code: Locale,
    gender: number,
    start: string,
    end: string,
    hidden: boolean,
    noTable: boolean,
    noScorers: boolean,
    noTeamStats: boolean,
    noTracker: boolean,
    noDraw: boolean,
    domesticLeague: boolean,
    highlightedTournament: boolean,
    highlightedMatchListSections: boolean,
    highlightedMatchRounds: string[],
    isPopular: boolean,
    isPopularVisible: boolean,
    primary: boolean,
    stageMappings: Array<StageMapping>,
    flagVariants: Map<number, string>,
    validation: MenuFormValidation,
    countryCodes: Array<string>,
    sortOrderPopular?: number
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.shortName = shortName;
    this.code = code;
    this.gender = gender;
    this.start = start;
    this.end = end;
    this.hidden = hidden;
    this.noTable = noTable;
    this.noScorers = noScorers;
    this.noTeamStats = noTeamStats;
    this.noTracker = noTracker;
    this.noDraw = noDraw;
    this.domesticLeague = domesticLeague;
    this.highlightedTournament = highlightedTournament;
    this.highlightedMatchListSections = highlightedMatchListSections;
    this.highlightedMatchRounds = highlightedMatchRounds;
    this.isPopular = isPopular;
    this.isPopularVisible = isPopularVisible;
    this.primary = primary;
    this.stageMappings = stageMappings;
    this.flagVariants = flagVariants;
    this.validation = validation;
    this.countryCodes = countryCodes;
    this.sortOrderPopular = sortOrderPopular;
  }

  static create(type: number, siblings: Array<MenuItem>): MenuFormData {
    const validation = MenuFormValidation.create(siblings);
    return new MenuFormData(
      undefined,
      type,
      LocaleBuilder.create().build(),
      LocaleBuilder.create().build(),
      LocaleBuilder.create().build(),
      Gender.UNKNOWN,
      "",
      "",
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      [],
      false,
      false,
      false,
      [],
      new Map<number, string>(),
      validation,
      []
    );
  }

  static from(menuItem: MenuItem, siblings: Array<MenuItem>): MenuFormData {
    const start = !menuItem.timeRange
      ? ""
      : DateUtil.apiTimestampToDatePickerString(menuItem.timeRange.start);
    const end = !menuItem.timeRange
      ? ""
      : DateUtil.apiTimestampToDatePickerString(menuItem.timeRange.end);
    const validation = MenuFormValidation.create(siblings);
    return new MenuFormData(
      menuItem.id,
      menuItem.type,
      menuItem.name,
      menuItem.shortName,
      menuItem.code,
      menuItem.gender,
      start,
      end,
      menuItem.hidden,
      menuItem.noTable,
      menuItem.noScorers,
      menuItem.noTeamStats,
      menuItem.noTracker,
      menuItem.noDraw,
      menuItem.domesticLeague,
      menuItem.highlightedTournament,
      menuItem.highlightedMatchListSections,
      menuItem.highlightedMatchRounds,
      menuItem.isPopular,
      menuItem.isPopularVisible,
      menuItem.primary,
      menuItem.stageMappings,
      menuItem.flagVariants,
      validation,
      menuItem.countryCodes,
      menuItem.sortOrderPopular
    );
  }

  withId(id: string | undefined): MenuFormData {
    return this.copy({ id: id });
  }

  withName(name: Locale): MenuFormData {
    return this.copy({
      name: name,
      validation: this.validation.withName(name),
    });
  }

  withShortName(shortName: Locale): MenuFormData {
    return this.copy({ shortName: shortName });
  }

  withCode(code: Locale, siblings: Array<MenuItem>): MenuFormData {
    return this.copy({
      code: code,
      validation: this.validation.withCode(code, siblings),
    });
  }

  withGender(gender: number): MenuFormData {
    return this.copy({ gender: gender });
  }

  withTimeRange(start: string, end: string): MenuFormData {
    return this.copy({
      start: start,
      end: end,
      validation: this.validation.withTimeRange(this.type, start, end),
    });
  }

  withHidden(hidden: boolean): MenuFormData {
    return this.copy({ hidden: hidden });
  }

  withNoTable(noTable: boolean): MenuFormData {
    return this.copy({ noTable: noTable });
  }

  withNoScorers(noScorers: boolean): MenuFormData {
    return this.copy({ noScorers: noScorers });
  }

  withNoTeamStats(noTeamStats: boolean): MenuFormData {
    return this.copy({ noTeamStats: noTeamStats });
  }

  withDomesticLeague(domesticLeague: boolean): MenuFormData {
    return this.copy({ domesticLeague: domesticLeague });
  }

  withHighlightedTournament(highlightedTournament: boolean): MenuFormData {
    return this.copy({ highlightedTournament: highlightedTournament });
  }

  withHighlightedMatchListSections(
    highlightedMatchListSections: boolean
  ): MenuFormData {
    return this.copy({
      highlightedMatchListSections: highlightedMatchListSections,
    });
  }

  withHighlightedMatchRounds(highlightedMatchRounds: string[]): MenuFormData {
    return this.copy({ highlightedMatchRounds: highlightedMatchRounds });
  }

  withNoTracker(noTracker: boolean): MenuFormData {
    return this.copy({ noTracker: noTracker });
  }

  withNoDraw(noDraw: boolean): MenuFormData {
    return this.copy({ noDraw: noDraw });
  }

  withPrimary(primary: boolean, siblings: Array<MenuItem>): MenuFormData {
    return this.copy({
      primary: primary,
      validation: this.validation.withPrimary(this.type, primary, siblings),
    });
  }

  withStageMappings(stageMappings: Array<StageMapping>): MenuFormData {
    return this.copy({
      stageMappings: stageMappings,
      validation: this.validation.withStageMappings(this.type, stageMappings),
    });
  }

  withFlagVariants(flagVariants: Map<number, string>): MenuFormData {
    return this.copy({
      flagVariants: flagVariants,
      validation: this.validation.withFlagVariants(flagVariants),
    });
  }

  withCountryCodes(countryCodes: Array<string>): MenuFormData {
    return this.copy({ countryCodes: countryCodes.sort() });
  }

  withAddedCountryCode(countryCode: string): MenuFormData {
    if (this.countryCodes.indexOf(countryCode) >= 0) {
      return this;
    }
    const countryCodes = Array.from(this.countryCodes);
    countryCodes.push(countryCode);
    countryCodes.sort();
    return this.copy({ countryCodes: countryCodes });
  }

  withRemovedCountryCode(countryCode: string): MenuFormData {
    const countryCodes = this.countryCodes.filter(
      (code) => code !== countryCode
    );
    return this.copy({ countryCodes: countryCodes });
  }

  withValueForProperty(property: number, value: boolean): MenuFormData {
    switch (property) {
      case MenuItemProperty.HIDDEN:
        return this.withHidden(value);
      case MenuItemProperty.NO_DRAW:
        return this.withNoDraw(value);
      case MenuItemProperty.NO_SCORERS:
        return this.withNoScorers(value);
      case MenuItemProperty.NO_TABLE:
        return this.withNoTable(value);
      case MenuItemProperty.NO_TEAM_STATS:
        return this.withNoTeamStats(value);
      case MenuItemProperty.NO_TRACKER:
        return this.withNoTracker(value);
      case MenuItemProperty.DOMESTIC_LEAGUE:
        return this.withDomesticLeague(value);
      case MenuItemProperty.HIGHLIGHTED_TOURNAMENT:
        return this.withHighlightedTournament(value);
      case MenuItemProperty.HIGHLIGHTED_MATCH_LIST_SECTIONS:
        return this.withHighlightedMatchListSections(value);
      default:
        return this;
    }
  }

  validated(siblings: Array<MenuItem>): MenuFormData {
    const validation = this.validation
      .withName(this.name)
      .withCode(this.code, siblings, true)
      .withPrimary(this.type, this.primary, siblings, true)
      .withTimeRange(this.type, this.start, this.end)
      .withStageMappings(this.type, this.stageMappings)
      .withFlagVariants(this.flagVariants);
    return this.copy({ validation: validation });
  }

  menuItemBuilder(): MenuItemBuilder {
    let title = this.name.locale.get(ConfigUtil.defaultLanguage())?.value || "";
    if (this.type === MenuItemType.STAGE) {
      title += Gender.shortSuffix(this.gender);
    }
    const builder = MenuItemBuilder.create()
      .setId(this.id)
      .setType(this.type)
      .setTitle(title)
      .setName(this.name)
      .setShortName(this.shortName)
      .setCode(this.code)
      .setGender(this.gender)
      .setHidden(this.hidden)
      .setNoTable(this.noTable)
      .setNoDraw(this.noDraw)
      .setNoScorers(this.noScorers)
      .setNoTeamStats(this.noTeamStats)
      .setNoTracker(this.noTracker)
      .setDomesticLeague(this.domesticLeague)
      .setHighlightedTournament(this.highlightedTournament)
      .setHighlightedMatchListSections(this.highlightedMatchListSections)
      .setHighlightedMatchRounds(this.highlightedMatchRounds)
      .setIsPopular(this.isPopular)
      .setIsPopularVisible(this.isPopularVisible)
      .setPrimary(this.primary)
      .setFlagVariants(this.flagVariants)
      .setSortOrderPopular(this.sortOrderPopular)
      .setCountryCodes(this.countryCodes);

    this.stageMappings.forEach((stageMapping) =>
      builder.addStageMapping(stageMapping)
    );

    if (this.start !== "" && this.end !== "") {
      const start = DateUtil.datePickerStringToApiTimestamp(this.start);
      const end = DateUtil.datePickerStringToApiTimestamp(this.end);
      builder.setTimeRangeParts(start, end);
    } else {
      builder.setTimeRange(undefined);
    }
    return builder;
  }

  menuItem(): MenuItem {
    return this.menuItemBuilder().build();
  }

  private copy(data: Partial<MenuFormData>): MenuFormData {
    const getOrElse = <T>(value: T | undefined, fallback: T) =>
      value !== undefined ? value : fallback;
    return new MenuFormData(
      data.id || this.id,
      getOrElse(data.type, this.type),
      data.name || this.name,
      data.shortName || this.shortName,
      data.code || this.code,
      getOrElse(data.gender, this.gender),
      data.start || this.start,
      data.end || this.end,
      getOrElse(data.hidden, this.hidden),
      getOrElse(data.noTable, this.noTable),
      getOrElse(data.noScorers, this.noScorers),
      getOrElse(data.noTeamStats, this.noTeamStats),
      getOrElse(data.noTracker, this.noTracker),
      getOrElse(data.noDraw, this.noDraw),
      getOrElse(data.domesticLeague, this.domesticLeague),
      getOrElse(data.highlightedTournament, this.highlightedTournament),
      getOrElse(
        data.highlightedMatchListSections,
        this.highlightedMatchListSections
      ),
      getOrElse(data.highlightedMatchRounds, this.highlightedMatchRounds),
      getOrElse(data.isPopular, this.isPopular),
      getOrElse(data.isPopularVisible, this.isPopularVisible),
      getOrElse(data.primary, this.primary),
      data.stageMappings || this.stageMappings,
      data.flagVariants || this.flagVariants,
      data.validation || this.validation,
      data.countryCodes || this.countryCodes,
      getOrElse(data.sortOrderPopular, this.sortOrderPopular)
    );
  }
}
