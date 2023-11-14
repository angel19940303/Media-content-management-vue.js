import { Match } from "./match";

export class DrawRound {
  readonly roundType?: string;
  readonly events: Match[][];
  private constructor(roundType: string | undefined, events: Match[][]) {
    this.roundType = roundType;
    this.events = events;
  }

  static fromData(data?: any): DrawRound | undefined {
    if (data === undefined) {
      return undefined;
    }
    const eventData: any[] | undefined = data["events"];
    if (
      eventData === undefined ||
      !Array.isArray(eventData) ||
      eventData.length === 0
    ) {
      return undefined;
    }

    const events = new Array<Match[]>();
    eventData.forEach((eventItemData) => {
      const matches = Match.listFromData(eventItemData);
      if (matches.length > 0) {
        events.push(matches);
      }
    });

    if (events.length === 0) {
      return undefined;
    }

    const roundType: string | undefined = data["round_type"];
    return new DrawRound(roundType, events);
  }

  static listFromData(data?: any): DrawRound[] {
    const list = new Array<DrawRound>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((roundData) => {
        const round = DrawRound.fromData(roundData);
        if (round !== undefined) {
          list.push(round);
        }
      });
    }
    return list;
  }
}
