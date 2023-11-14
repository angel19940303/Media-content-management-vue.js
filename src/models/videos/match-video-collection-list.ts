import { MatchVideoCollection } from "./match-video-collection";

export class MatchVideoCollectionList {
  private readonly list: Array<MatchVideoCollection>;
  private readonly map: Map<string, MatchVideoCollection>;

  private constructor(
    list: Array<MatchVideoCollection>,
    map: Map<string, MatchVideoCollection>
  ) {
    this.list = list;
    this.map = map;
  }

  static fromData(list: Array<MatchVideoCollection>): MatchVideoCollectionList {
    const map = new Map<string, MatchVideoCollection>();
    list.forEach((item) => map.set(item.internalEventId, item));
    return new MatchVideoCollectionList(list, map);
  }

  get(id: string): MatchVideoCollection | undefined {
    return this.map.get(id);
  }

  all(): Array<MatchVideoCollection> {
    return this.list;
  }
}
