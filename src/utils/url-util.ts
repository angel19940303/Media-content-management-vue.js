import { ValidationUtil } from "./validation-util";

export interface UrlParts {
  protocol: string;
  host: string;
  path: string[];
  query: Map<string, string>;
  hash: string;
}

export class UrlUtil {
  static parseUrl(urlStr: string): UrlParts | undefined {
    if (!ValidationUtil.isValidUrl(urlStr)) {
      return undefined;
    }
    const url = new URL(urlStr);
  }
}
