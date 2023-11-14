import { Team } from "./team";
import { Category } from "./category";
import { Stage } from "./stage";
import { Match } from "./match";

export class SearchResultCollection {
  readonly teams: Team[];
  readonly categories: Category[];
  readonly stages: Stage[];
  readonly matches: Match[];

  constructor(
    teams: Team[],
    categories: Category[],
    stages: Stage[],
    matches: Match[]
  ) {
    this.teams = teams;
    this.categories = categories;
    this.stages = stages;
    this.matches = matches;
  }

  static fromData(data: any): SearchResultCollection {
    if (data !== undefined && data !== null) {
      const teams = Team.listFromData(data.teams);
      const categories = Category.listFromData(data.categories);
      const stages = Stage.listFromData(data.stages);
      const matches = Match.listFromData(data.matches).reverse();
      return new SearchResultCollection(teams, categories, stages, matches);
    }
    return new SearchResultCollection([], [], [], []);
  }

  isEmpty(): boolean {
    return (
      this.teams.length === 0 &&
      this.categories.length === 0 &&
      this.stages.length === 0 &&
      this.matches.length === 0
    );
  }
}
