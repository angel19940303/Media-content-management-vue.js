import { LeagueTableCollection } from "./league-table-collection";
import { TopScorer } from "./top-scorer";
import { Match } from "./match";

export class Stage {
  readonly leagueTables?: LeagueTableCollection;
  readonly topScorers: TopScorer[];
  readonly categoryId?: string;
  readonly categoryName?: string;
  readonly endTimestamp?: number;
  readonly matches: Match[];
  readonly providerId: number;
  readonly sportId: number;
  readonly stageCode?: string;
  readonly gender?: string;
  readonly stageId: string;
  readonly stageName?: string;
  readonly startTimestamp?: number;
  private constructor(
    leagueTables: LeagueTableCollection | undefined,
    topScorers: TopScorer[],
    categoryId: string | undefined,
    categoryName: string | undefined,
    endTimestamp: number | undefined,
    matches: Match[],
    providerId: number,
    sportId: number,
    stageCode: string | undefined,
    gender: string | undefined,
    stageId: string,
    stageName: string | undefined,
    startTimestamp: number | undefined
  ) {
    this.leagueTables = leagueTables;
    this.topScorers = topScorers;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.endTimestamp = endTimestamp;
    this.matches = matches;
    this.providerId = providerId;
    this.sportId = sportId;
    this.stageCode = stageCode;
    this.gender = gender;
    this.stageId = stageId;
    this.stageName = stageName;
    this.startTimestamp = startTimestamp;
  }

  static fromData(
    data?: any,
    allowNoProvider?: boolean,
    allowNoSport?: boolean
  ): Stage | undefined {
    if (data === undefined) {
      return undefined;
    }
    const providerId: number | undefined = data["pid"];
    const sportId: number | undefined = data["s_id"];
    const stageId: string | undefined = data["st_id"];
    if (
      (allowNoProvider !== true && providerId === undefined) ||
      (allowNoSport !== true && sportId === undefined) ||
      stageId === undefined
    ) {
      return undefined;
    }
    const leagueTables = LeagueTableCollection.fromData(data["L"]);
    const topScorers = TopScorer.listFromData(data["T"]);
    const categoryId: string | undefined = data["c_id"];
    const categoryName: string | undefined = data["c_name"];
    const endTimestamp: number | undefined = data["end"];
    const matches = Match.listFromData(data["matches"]);
    const stageCode: string | undefined = data["st_code"];
    const gender: string | undefined = data["st_gender"];
    const stageName: string | undefined = data["st_name"];
    const startTimestamp: number | undefined = data["start"];
    return new Stage(
      leagueTables,
      topScorers,
      categoryId,
      categoryName,
      endTimestamp,
      matches,
      providerId || -1,
      sportId || -1,
      stageCode,
      gender,
      stageId,
      stageName,
      startTimestamp
    );
  }

  static listFromData(data?: any): Stage[] {
    const stages = new Array<Stage>();
    if (data !== undefined && Array.isArray(data)) {
      data.forEach((item: any) => {
        const stage = this.fromData(item, true, true);
        if (stage !== undefined) {
          stages.push(stage);
        }
      });
    }
    return stages;
  }

  compositeName(): string | undefined {
    if (this.categoryName !== undefined && this.stageName !== undefined) {
      return this.categoryName + " - " + this.stageName;
    }
    return this.stageName;
  }
}
