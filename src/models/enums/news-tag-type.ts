export class NewsTagType {
  static readonly STAGE = 0;
  static readonly PARTICIPANT = 1;

  private static readonly ALL = [NewsTagType.STAGE, NewsTagType.PARTICIPANT];

  static title(type: number): string {
    switch (type) {
      case this.STAGE:
        return "Stage";
      case this.PARTICIPANT:
        return "Participant";
    }
    return "Unknown";
  }

  static all(): Array<number> {
    return this.ALL;
  }
}
