import { ProviderIdItem } from "./provider-id-item";
import { Team } from "./team";
import { DateUtil } from "../../utils/date-util";

export class Match {
  readonly actualEndTimestamp?: number;
  readonly actualStartTimestamp?: number;
  readonly categoryCode?: string;
  readonly categoryId?: string;
  readonly categoryName?: string;
  readonly coverage?: number;
  readonly elapsedTime?: number;
  readonly elapsedInjuryTime?: number;
  readonly elapsedTimeType?: number;
  readonly regularTimeScore?: number[];
  readonly hasCommentaries?: number;
  readonly hasIncidents?: number;
  readonly hasLineups?: number;
  readonly hasPlayerData?: number;
  readonly hasReferee?: number;
  readonly hasStats?: number;
  readonly hasSubstitutions?: number;
  readonly hasHalfTimeScore?: number;
  readonly id: string;
  readonly overallStatus?: number;
  readonly previousStatus?: number;
  readonly providerId: number;
  readonly providerIds: ProviderIdItem[];
  readonly playTime?: number;
  readonly previousOverallStatus?: number;
  readonly round?: string;
  readonly sportCode?: string;
  readonly sportId?: number;
  readonly score?: number[];
  readonly stageCode?: string;
  readonly gender?: number;
  readonly stageId?: string;
  readonly stageName?: string;
  readonly scheduledStartTimestamp?: number;
  readonly status?: number;
  readonly statusText?: string;
  readonly teams: Team[];
  readonly lastUpdateTimestamp?: number;
  readonly scheduledStartDate?: Date;

  private constructor(
    actualEndTimestamp: number | undefined,
    actualStartTimestamp: number | undefined,
    categoryCode: string | undefined,
    categoryId: string | undefined,
    categoryName: string | undefined,
    coverage: number | undefined,
    elapsedTime: number | undefined,
    elapsedInjuryTime: number | undefined,
    elapsedTimeType: number | undefined,
    regularTimeScore: number[] | undefined,
    hasCommentaries: number | undefined,
    hasIncidents: number | undefined,
    hasLineups: number | undefined,
    hasPlayerData: number | undefined,
    hasReferee: number | undefined,
    hasStats: number | undefined,
    hasSubstitutions: number | undefined,
    hasHalfTimeScore: number | undefined,
    id: string,
    overallStatus: number | undefined,
    previousStatus: number | undefined,
    providerId: number,
    providerIds: ProviderIdItem[],
    playTime: number | undefined,
    previousOverallStatus: number | undefined,
    round: string | undefined,
    sportCode: string | undefined,
    sportId: number | undefined,
    score: number[] | undefined,
    stageCode: string | undefined,
    gender: number | undefined,
    stageId: string | undefined,
    stageName: string | undefined,
    scheduledStartTimestamp: number | undefined,
    status: number | undefined,
    statusText: string | undefined,
    teams: Team[],
    lastUpdateTimestamp: number | undefined
  ) {
    this.actualEndTimestamp = actualEndTimestamp;
    this.actualStartTimestamp = actualStartTimestamp;
    this.categoryCode = categoryCode;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.coverage = coverage;
    this.elapsedTime = elapsedTime;
    this.elapsedInjuryTime = elapsedInjuryTime;
    this.elapsedTimeType = elapsedTimeType;
    this.regularTimeScore = regularTimeScore;
    this.hasCommentaries = hasCommentaries;
    this.hasIncidents = hasIncidents;
    this.hasLineups = hasLineups;
    this.hasPlayerData = hasPlayerData;
    this.hasReferee = hasReferee;
    this.hasStats = hasStats;
    this.hasSubstitutions = hasSubstitutions;
    this.hasHalfTimeScore = hasHalfTimeScore;
    this.id = id;
    this.overallStatus = overallStatus;
    this.previousStatus = previousStatus;
    this.providerId = providerId;
    this.providerIds = providerIds;
    this.playTime = playTime;
    this.previousOverallStatus = previousOverallStatus;
    this.round = round;
    this.sportCode = sportCode;
    this.sportId = sportId;
    this.score = score;
    this.stageCode = stageCode;
    this.gender = gender;
    this.stageId = stageId;
    this.stageName = stageName;
    this.scheduledStartTimestamp = scheduledStartTimestamp;
    this.status = status;
    this.statusText = statusText;
    this.teams = teams;
    this.lastUpdateTimestamp = lastUpdateTimestamp;
    this.scheduledStartDate =
      scheduledStartTimestamp === undefined
        ? undefined
        : DateUtil.apiTimestampToDate(scheduledStartTimestamp, true);
  }

  static fromData(data?: any): Match | undefined {
    if (data === undefined) {
      return undefined;
    }
    const providerId: number | undefined = data["pid"];
    const id: string | undefined = data["id"];
    if (providerId === undefined || id === undefined) {
      return undefined;
    }
    const actualEndTimestamp: number | undefined = data["a_end"];
    const actualStartTimestamp: number | undefined = data["a_start"];
    const categoryCode: string | undefined = data["c_code"];
    const categoryId: string | undefined = data["c_id"];
    const categoryName: string | undefined = data["c_name"];
    const coverage: number | undefined = data["cov"];
    const elapsedTime: number | undefined = data["elapsed"];
    const elapsedInjuryTime: number | undefined = data["elapsed_i"];
    const elapsedTimeType: number | undefined = data["elapsed_t"];
    const regularTimeScore: number[] | undefined = data["ft_score"];
    const hasCommentaries: number | undefined = data["has_comms"];
    const hasIncidents: number | undefined = data["has_incs"];
    const hasLineups: number | undefined = data["has_lineups"];
    const hasPlayerData: number | undefined = data["has_pdata"];
    const hasReferee: number | undefined = data["has_referee"];
    const hasStats: number | undefined = data["has_stats"];
    const hasSubstitutions: number | undefined = data["has_subs"];
    const hasHalfTimeScore: number | undefined = data["ht_score"];
    const overallStatus: number | undefined = data["o_status"];
    const previousStatus: number | undefined = data["p_status"];
    const providerIds = ProviderIdItem.listFromData(data["pids"]);
    const playTime: number | undefined = data["play"];
    const previousOverallStatus: number | undefined = data["po_status"];
    const round: string | undefined = data["round"];
    const sportCode: string | undefined = data["s_code"];
    const sportId: number | undefined = data["s_id"];
    const score: number[] | undefined = data["score"];
    const stageCode: string | undefined = data["st_code"];
    const gender: number | undefined = data["st_gender"];
    const stageId: string | undefined = data["st_id"];
    const stageName: string | undefined = data["st_name"];
    const scheduledStartTimestamp: number | undefined = data["start"];
    const status: number | undefined = data["status"];
    const statusText: string | undefined = data["status_txt"];
    const teams = Team.listFromData(data["teams"]);
    const lastUpdateTimestamp: number | undefined = data["ut"];
    return new Match(
      actualEndTimestamp,
      actualStartTimestamp,
      categoryCode,
      categoryId,
      categoryName,
      coverage,
      elapsedTime,
      elapsedInjuryTime,
      elapsedTimeType,
      regularTimeScore,
      hasCommentaries,
      hasIncidents,
      hasLineups,
      hasPlayerData,
      hasReferee,
      hasStats,
      hasSubstitutions,
      hasHalfTimeScore,
      id,
      overallStatus,
      previousStatus,
      providerId,
      providerIds,
      playTime,
      previousOverallStatus,
      round,
      sportCode,
      sportId,
      score,
      stageCode,
      gender,
      stageId,
      stageName,
      scheduledStartTimestamp,
      status,
      statusText,
      teams,
      lastUpdateTimestamp
    );
  }

  static listFromData(data?: any): Match[] {
    const list = new Array<Match>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((matchData) => {
        const match = Match.fromData(matchData);
        if (match !== undefined) {
          list.push(match);
        }
      });
    }
    return list;
  }

  startTime(): string | undefined {
    if (this.scheduledStartDate === undefined) {
      return undefined;
    }
    return DateUtil.formatStartTime(this.scheduledStartDate);
  }

  startDate(): string | undefined {
    if (this.scheduledStartDate === undefined) {
      return undefined;
    }
    return DateUtil.formatDateShort(this.scheduledStartDate);
  }

  homeTeamName(): string {
    return this.getTeamName(0);
  }

  awayTeamName(): string {
    return this.getTeamName(1);
  }

  homeScore(): number {
    return this.getScore(0);
  }

  awayScore(): number {
    return this.getScore(1);
  }

  private getTeamName(position: number): string {
    return this.teams
      .filter((t) => t.position === position)
      .map((t) => t.name)
      .join("/");
  }

  private getScore(position: number): number {
    if (this.score !== undefined && this.score.length > position) {
      return this.score[position];
    }
    return 0;
  }
}
