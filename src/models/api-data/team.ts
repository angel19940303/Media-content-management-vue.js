import { LeagueTableRanking } from "./league-table-ranking";
import { TeamStats } from "./team-stats";
import { TeamStatsExtended } from "./team-stats-extended";

export class Team {
  readonly secondYellowCards?: number;
  readonly assists?: number;
  readonly countryId?: string;
  readonly countryName?: string;
  readonly gender?: number;
  readonly goals?: number;
  readonly id: string;
  readonly kind?: number;
  readonly name?: string;
  readonly ownGoals?: number;
  readonly position?: number;
  readonly jerseyPattern?: number;
  readonly redCards?: number;
  readonly yellowCards?: number;
  readonly leagueTableRanking?: LeagueTableRanking;
  readonly teamStats?: TeamStats;
  readonly teamStatsExtended?: TeamStatsExtended;

  private constructor(
    secondYellowCards: number | undefined,
    assists: number | undefined,
    countryId: string | undefined,
    countryName: string | undefined,
    gender: number | undefined,
    goals: number | undefined,
    id: string,
    kind: number | undefined,
    name: string | undefined,
    ownGoals: number | undefined,
    position: number | undefined,
    jerseyPattern: number | undefined,
    redCards: number | undefined,
    yellowCards: number | undefined,
    leagueTableRanking: LeagueTableRanking | undefined,
    teamStats: TeamStats | undefined,
    teamStatsExtended: TeamStatsExtended | undefined
  ) {
    this.secondYellowCards = secondYellowCards;
    this.assists = assists;
    this.countryId = countryId;
    this.countryName = countryName;
    this.gender = gender;
    this.goals = goals;
    this.id = id;
    this.kind = kind;
    this.name = name;
    this.ownGoals = ownGoals;
    this.position = position;
    this.jerseyPattern = jerseyPattern;
    this.redCards = redCards;
    this.yellowCards = yellowCards;
    this.leagueTableRanking = leagueTableRanking;
    this.teamStats = teamStats;
    this.teamStatsExtended = teamStatsExtended;
  }

  static fromData(data?: any): Team | undefined {
    if (data === undefined) {
      return undefined;
    }
    const id: string | undefined = data["id"] || data["team_id"];
    if (id === undefined) {
      return undefined;
    }
    const secondYellowCards: number | undefined = data["2nd_yellow"];
    const assists: number | undefined = data["assists"];
    const countryId: string | undefined = data["cid"];
    const countryName: string | undefined = data["cname"];
    const gender: number | undefined = data["gender"];
    const goals: number | undefined = data["goals"];
    const kind: number | undefined = data["kn"];
    const name: string | undefined = data["name"] || data["team_name"];
    const ownGoals: number | undefined = data["own_goals"];
    const position: number | undefined = data["pos"];
    const jerseyPattern: number | undefined = data["ptrn"];
    const redCards: number | undefined = data["red"];
    const yellowCards: number | undefined = data["yellow"];
    const leagueTableRanking = LeagueTableRanking.fromData(data);
    const teamStats = TeamStats.fromData(data["team_stats"]);
    const teamStatsExtended = TeamStatsExtended.fromData(
      data["team_stats_extended"]
    );
    return new Team(
      secondYellowCards,
      assists,
      countryId,
      countryName,
      gender,
      goals,
      id,
      kind,
      name,
      ownGoals,
      position,
      jerseyPattern,
      redCards,
      yellowCards,
      leagueTableRanking,
      teamStats,
      teamStatsExtended
    );
  }

  static listFromData(data?: any): Team[] {
    const list = new Array<Team>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((teamData) => {
        const team = Team.fromData(teamData);
        if (team !== undefined) {
          list.push(team);
        }
      });
    }
    return list;
  }
}
