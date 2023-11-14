import { Stage } from "./stage";
import { DrawRoundCollection } from "./draw-round-collection";
import { TeamStatsCollection } from "./team-stats-collection";

export class StageDataCollection {
  readonly stage: Stage;
  readonly draw?: DrawRoundCollection;
  readonly teamStats?: TeamStatsCollection;
  private constructor(
    stage: Stage,
    draw: DrawRoundCollection | undefined,
    teamStats: TeamStatsCollection | undefined
  ) {
    this.stage = stage;
    this.draw = draw;
    this.teamStats = teamStats;
  }

  static fromData(
    stageData?: any,
    drawData?: any,
    teamStatsData?: any
  ): StageDataCollection | undefined {
    const stage = Stage.fromData(stageData);
    if (stage === undefined) {
      return undefined;
    }
    const draw = DrawRoundCollection.fromData(drawData);
    const teamStats = TeamStatsCollection.fromData(teamStatsData);
    return new StageDataCollection(stage, draw, teamStats);
  }
}
