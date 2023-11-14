import { Team } from "./team";

export class TeamStatsCollection {
  readonly teams: Team[];
  private constructor(teams: Team[]) {
    this.teams = teams;
  }
  static fromData(data?: any): TeamStatsCollection | undefined {
    if (data === undefined) {
      return undefined;
    }
    const teams = Team.listFromData(data["participants_stats"]);
    if (teams.length === 0) {
      return undefined;
    }
    return new TeamStatsCollection(teams);
  }
}
