import { StageDataCollection } from "../models/api-data/stage-data-collection";
import { StageDataAnalysisResult } from "../models/ui/stage-data-analysis-result";
import { Provider } from "../models/enums/provider";
import { DrawRound } from "../models/api-data/draw-round";
import { Match } from "../models/api-data/match";

export class StageDataAnalysisUtil {
  private readonly id: string;
  private readonly stageData?: StageDataCollection;

  private result: StageDataAnalysisResult;

  private constructor(id: string, stageData?: StageDataCollection) {
    this.id = id;
    this.stageData = stageData;
    this.result = new StageDataAnalysisResult(
      id,
      false,
      false,
      false,
      false,
      false,
      false
    );
  }

  static create(
    id: string,
    stageData?: StageDataCollection
  ): StageDataAnalysisUtil {
    return new StageDataAnalysisUtil(id, stageData);
  }

  analyse(): StageDataAnalysisResult {
    this.checkHasData();
    this.checkHasLeagueTable();
    this.checkHasDraw();
    this.checkHasTopScorers();
    this.checkHasTeamStats();
    this.checkHasTrackerWidget();
    return this.result;
  }

  private checkHasData(): void {
    let hasData = false;
    if (this.stageData !== undefined) {
      hasData = this.stageData.stage.matches.length > 0;
    }
    this.result = this.result.copy({ hasData: hasData });
  }

  private checkHasLeagueTable(): void {
    let hasLeagueTable = false;
    if (this.stageData !== undefined) {
      const leagueTables = this.stageData.stage.leagueTables;
      if (leagueTables !== undefined && leagueTables.tables.length > 0) {
        hasLeagueTable =
          leagueTables.tables.find((t) => t.teams.length > 0) !== undefined;
      }
    }
    this.result = this.result.copy({ hasLeagueTable: hasLeagueTable });
  }

  private checkHasDraw(): void {
    let hasValidRounds = false;
    //let hasValidMatches = false;
    if (
      this.stageData !== undefined &&
      this.stageData.draw !== undefined &&
      this.stageData.draw.rounds.length > 0
    ) {
      const rounds = this.stageData.draw.rounds;
      const sortedRounds = rounds.sort((a: DrawRound, b: DrawRound) => {
        if (a.events.length === b.events.length) {
          const aRoundType = a.roundType || "";
          const bRoundType = b.roundType || "";
          return aRoundType === bRoundType
            ? 0
            : aRoundType < bRoundType
            ? -1
            : 1;
        }
        return a.events.length > b.events.length ? -1 : 1;
      });

      let previousRound: DrawRound | undefined = undefined;
      hasValidRounds = true;
      for (let i = 0; i < sortedRounds.length; i++) {
        const round = sortedRounds[i];
        if (
          previousRound !== undefined &&
          round.events.length !== previousRound.events.length / 2
        ) {
          hasValidRounds = false;
          break;
        }
        previousRound = round;
      }

      if (hasValidRounds) {
        let newestMatch: Match | undefined = undefined;
        const drawMatchIds = new Set<string>();

        for (let i = 0; i < sortedRounds.length; i++) {
          const round = sortedRounds[i];
          for (let j = 0; j < round.events.length; j++) {
            const eventMatches = round.events[j];
            for (let k = 0; k < eventMatches.length; k++) {
              const match = eventMatches[k];
              if (match.id !== "-1") {
                drawMatchIds.add(match.id);
              }
              const matchStart = match.scheduledStartTimestamp;
              const newestStart = newestMatch?.scheduledStartTimestamp;
              if (
                newestStart === undefined ||
                (matchStart !== undefined && matchStart > newestStart)
              ) {
                newestMatch = match;
              }
            }
          }
        }

        if (
          newestMatch !== undefined &&
          newestMatch.scheduledStartTimestamp !== undefined
        ) {
          const matchIds = new Set<string>();
          for (let i = 0; i < this.stageData.stage.matches.length; i++) {
            const match = this.stageData.stage.matches[i];
            if (
              match.scheduledStartTimestamp !== undefined &&
              match.scheduledStartTimestamp <=
                newestMatch.scheduledStartTimestamp &&
              drawMatchIds.has(match.id)
            ) {
              matchIds.add(match.id);
            }
          }
          //hasValidMatches = matchIds.size === drawMatchIds.size;
        }
      }
    }
    // TODO: Add the hasValidMatches check when all matches are included in stage data
    this.result = this.result.copy({ hasDraw: hasValidRounds });
  }

  private checkHasTopScorers(): void {
    let hasTopScorers = false;
    if (this.stageData !== undefined) {
      hasTopScorers = this.stageData.stage.topScorers.length > 0;
    }
    this.result = this.result.copy({ hasTopScorers: hasTopScorers });
  }

  private checkHasTeamStats(): void {
    let hasTeamStats = false;
    if (
      this.stageData !== undefined &&
      this.stageData.teamStats !== undefined
    ) {
      const teamWithStats = this.stageData.teamStats.teams.find((t) => {
        return t.teamStats !== undefined || t.teamStatsExtended !== undefined;
      });
      hasTeamStats = teamWithStats !== undefined;
    }
    this.result = this.result.copy({ hasTeamStats: hasTeamStats });
  }

  private checkHasTrackerWidget(): void {
    let hasTrackerWidget = false;
    if (
      this.stageData !== undefined &&
      this.stageData.stage.matches.length > 0
    ) {
      const match = this.stageData.stage.matches.find((m) => {
        return m.providerIds.find((pid) => {
          return (
            pid.providerId === Provider.RBALL ||
            pid.providerId === Provider.BETGENIUS
          );
        });
      });
      hasTrackerWidget = match !== undefined;
    }
    this.result = this.result.copy({ hasTrackerWidget: hasTrackerWidget });
  }
}
