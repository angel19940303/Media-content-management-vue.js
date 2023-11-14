import { Team } from "./team";

export class TopScorer {
  readonly goals?: string;
  readonly name?: string;
  readonly penalties?: string;
  readonly ranking: number;
  readonly team?: Team;
  private constructor(
    goals: string | undefined,
    name: string | undefined,
    penalties: string | undefined,
    ranking: number,
    team: Team | undefined
  ) {
    this.goals = goals;
    this.name = name;
    this.penalties = penalties;
    this.ranking = ranking;
    this.team = team;
  }

  static fromData(data?: any): TopScorer | undefined {
    if (data === undefined) {
      return undefined;
    }
    const ranking: number | undefined = data["ranking"];
    if (ranking === undefined) {
      return undefined;
    }
    const goals: string | undefined = data["goals"];
    const name: string | undefined = data["participant_name"];
    const penalties: string | undefined = data["penalties"];
    const team = Team.fromData(data["team"]);
    return new TopScorer(goals, name, penalties, ranking, team);
  }

  static listFromData(data?: any): TopScorer[] {
    const list = new Array<TopScorer>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((topScorerData) => {
        const topScorer = TopScorer.fromData(topScorerData);
        if (topScorer !== undefined) {
          list.push(topScorer);
        }
      });
    }
    return list;
  }
}
