export class VideoType {
  static readonly UNKNOWN = 0;
  static readonly COACH_INTERVIEW = 1;
  static readonly MATCH_HIGHLIGHT = 2;
  static readonly POST_MATCH = 3;

  static readonly ALL = [
    VideoType.UNKNOWN,
    VideoType.COACH_INTERVIEW,
    VideoType.MATCH_HIGHLIGHT,
    VideoType.POST_MATCH,
  ];

  static titleForType(type: number): string {
    switch (type) {
      case this.COACH_INTERVIEW:
        return "Coach Interview";
      case this.MATCH_HIGHLIGHT:
        return "Match Highlight";
      case this.POST_MATCH:
        return "Post Match";
      default:
        return "Unknown";
    }
  }
}
