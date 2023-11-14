export class LeagueTableRanking {
  readonly draws?: string;
  readonly goalsAgainst?: string;
  readonly goalDifference?: string;
  readonly goalsFor?: string;
  readonly inProgress?: number;
  readonly losses?: string;
  readonly matchesPlayed?: string;
  readonly points?: string;
  readonly ranking: number;
  readonly stagePhases?: number[];
  readonly wins?: string;

  private constructor(
    draws: string | undefined,
    goalsAgainst: string | undefined,
    goalDifference: string | undefined,
    goalsFor: string | undefined,
    inProgress: number | undefined,
    losses: string | undefined,
    matchesPlayed: string | undefined,
    points: string | undefined,
    ranking: number,
    stagePhases: number[] | undefined,
    wins: string | undefined
  ) {
    this.draws = draws;
    this.goalsAgainst = goalsAgainst;
    this.goalDifference = goalDifference;
    this.goalsFor = goalsFor;
    this.inProgress = inProgress;
    this.losses = losses;
    this.matchesPlayed = matchesPlayed;
    this.points = points;
    this.ranking = ranking;
    this.stagePhases = stagePhases;
    this.wins = wins;
  }

  static fromData(data?: any): LeagueTableRanking | undefined {
    if (data === undefined) {
      return undefined;
    }
    const ranking: number | undefined = data["ranking"];
    if (ranking === undefined) {
      return undefined;
    }
    const draws: string | undefined = data["draws"];
    const goalsAgainst: string | undefined = data["goal_against"];
    const goalDifference: string | undefined = data["goal_difference"];
    const goalsFor: string | undefined = data["goal_for"];
    const inProgress: number | undefined = data["in_progress"];
    const losses: string | undefined = data["loss"];
    const matchesPlayed: string | undefined = data["played"];
    const points: string | undefined = data["points"];
    const stagePhases: number[] | undefined = data["stage_phases"];
    const wins: string | undefined = data["wins"];
    return new LeagueTableRanking(
      draws,
      goalsAgainst,
      goalDifference,
      goalsFor,
      inProgress,
      losses,
      matchesPlayed,
      points,
      ranking,
      stagePhases,
      wins
    );
  }
}
