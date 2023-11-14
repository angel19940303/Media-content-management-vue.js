import { MenuItemProperty } from "../enums/menu-item-property";

interface StageDataAnalysisResultPartial {
  id?: string;
  hasData?: boolean;
  hasLeagueTable?: boolean;
  hasDraw?: boolean;
  hasTopScorers?: boolean;
  hasTeamStats?: boolean;
  hasTrackerWidget?: boolean;
}

export class StageDataAnalysisResult implements StageDataAnalysisResultPartial {
  readonly id: string;
  readonly hasData: boolean;
  readonly hasLeagueTable: boolean;
  readonly hasDraw: boolean;
  readonly hasTopScorers: boolean;
  readonly hasTeamStats: boolean;
  readonly hasTrackerWidget: boolean;
  constructor(
    id: string,
    hasData: boolean,
    hasLeagueTable: boolean,
    hasDraw: boolean,
    hasTopScorers: boolean,
    hasTeamStats: boolean,
    hasTrackerWidget: boolean
  ) {
    this.id = id;
    this.hasData = hasData;
    this.hasLeagueTable = hasLeagueTable;
    this.hasDraw = hasDraw;
    this.hasTopScorers = hasTopScorers;
    this.hasTeamStats = hasTeamStats;
    this.hasTrackerWidget = hasTrackerWidget;
  }

  copy(value: StageDataAnalysisResultPartial): StageDataAnalysisResult {
    return new StageDataAnalysisResult(
      value.id || this.id,
      value.hasData !== undefined ? value.hasData : this.hasData,
      value.hasLeagueTable !== undefined
        ? value.hasLeagueTable
        : this.hasLeagueTable,
      value.hasDraw !== undefined ? value.hasDraw : this.hasDraw,
      value.hasTopScorers !== undefined
        ? value.hasTopScorers
        : this.hasTopScorers,
      value.hasTeamStats !== undefined ? value.hasTeamStats : this.hasTeamStats,
      value.hasTrackerWidget !== undefined
        ? value.hasTrackerWidget
        : this.hasTrackerWidget
    );
  }

  valueForProperty(property: number): boolean | undefined {
    switch (property) {
      case MenuItemProperty.HIDDEN:
        return !this.hasData;
      case MenuItemProperty.NO_TRACKER:
        return !this.hasTrackerWidget;
      case MenuItemProperty.NO_TEAM_STATS:
        return !this.hasTeamStats;
      case MenuItemProperty.NO_SCORERS:
        return !this.hasTopScorers;
      case MenuItemProperty.NO_TABLE:
        return !this.hasLeagueTable;
      case MenuItemProperty.NO_DRAW:
        return !this.hasDraw;
      default:
        return undefined;
    }
  }
}
