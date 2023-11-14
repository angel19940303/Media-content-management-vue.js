import { NewsTag } from "../models/news/news-tag";

export class DataTransformUtil {
  private static readonly MAX_ID = 9999999999;

  static parseNewsTags(tags: any | null | undefined): Array<[string, NewsTag]> {
    if (tags === undefined || tags === null) {
      return [];
    }
    const parsedTags = new Array<[string, NewsTag]>();
    Object.getOwnPropertyNames(tags).forEach((key) => {
      const value: any = tags[key];
      if (
        value !== undefined &&
        typeof value.ID === "string" &&
        typeof value.Meta === "string"
      ) {
        parsedTags.push([key, { ID: value.ID, Meta: value.Meta }]);
      }
    });
    return parsedTags;
  }

  static serializeNewsTags(tags: Array<[string, NewsTag]>): any | null {
    if (tags.length === 0) {
      return null;
    }
    const serializedTags: any = {};
    tags.forEach(([key, tag]) => (serializedTags[key] = tag));
    return serializedTags;
  }

  static compareIDs(id1: any, id2: any): number {
    let id1Num = parseInt(id1, 10);
    let id2Num = parseInt(id2, 10);
    if (isNaN(id1Num)) {
      id1Num = this.MAX_ID;
    }
    if (isNaN(id2Num)) {
      id2Num = this.MAX_ID;
    }
    return id1Num - id2Num;
  }

  static sortedListById<T>(data: any | undefined): Array<T> | undefined {
    if (data === undefined || !Array.isArray(data)) {
      return undefined;
    }
    return data.sort((item1, item2) => this.compareIDs(item1.id, item2.id));
  }

  static getOrElse<T>(value: T | undefined, fallback: T): T {
    return value !== undefined ? value : fallback;
  }

  static getOrElseOpt<T>(
    value: T | undefined,
    fallback: T | undefined
  ): T | undefined {
    return value !== undefined ? value : fallback;
  }
}
