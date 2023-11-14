export class NewsMediaType {
  static readonly IMAGE = 0;
  static readonly VIDEO = 1;
  static readonly AUDIO = 2;

  private static readonly ALL = [
    NewsMediaType.IMAGE,
    NewsMediaType.VIDEO,
    NewsMediaType.AUDIO,
  ];

  static title(type: number): string {
    switch (type) {
      case this.IMAGE:
        return "Images";
      case this.VIDEO:
        return "Videos";
      case this.AUDIO:
        return "Audios";
    }
    return "Unknown";
  }

  static titleWithCount(type: number, count: number): string {
    let suffix = "unknown";
    switch (type) {
      case this.IMAGE:
        suffix = count === 1 ? "image" : "images";
        break;
      case this.VIDEO:
        suffix = count === 1 ? "video" : "videos";
        break;
      case this.AUDIO:
        suffix = count === 1 ? "audio" : "audios";
        break;
    }
    return `${count} ${suffix}`;
  }

  static all(): Array<number> {
    return this.ALL;
  }
}
