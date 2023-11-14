import { DrawRound } from "./draw-round";

export class DrawRoundCollection {
  readonly rounds: DrawRound[];
  private constructor(rounds: DrawRound[]) {
    this.rounds = rounds;
  }

  static fromData(data?: any): DrawRoundCollection | undefined {
    if (data === undefined) {
      return undefined;
    }
    const rounds = DrawRound.listFromData(data["draws"]);
    if (rounds.length === 0) {
      return undefined;
    }
    return new DrawRoundCollection(rounds);
  }
}
