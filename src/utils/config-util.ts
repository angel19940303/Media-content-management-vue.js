import * as Config from "../config/config.json";

interface Language {
  name: string;
  code: string;
  shortCode: string;
}

export class ConfigUtil {
  private static readonly DEFAULT_ENV = "dev";

  static env(): string {
    const windowObj: any = window;
    const env: string | undefined = windowObj.env;
    if (env !== undefined) {
      return env;
    }
    return this.DEFAULT_ENV;
  }

  static languages(): Language[] {
    return Config.languages;
  }

  static defaultSport(): string {
    return Config.defaultSport;
  }

  static defaultLanguage(): string {
    return Config.defaultLanguage;
  }

  static unknownLanguage(): string {
    return Config.unknownLanguage;
  }

  static imageUrl(fileName: string): string {
    switch (this.env()) {
      case "prod":
        return Config.imageProdBaseUrl + fileName;
      default:
        return Config.imageDevBaseUrl + fileName;
    }
  }
}
