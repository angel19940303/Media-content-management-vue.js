import { NewsFeedDataPayload } from "./news-feed-data-payload";
import { EnumList } from "../common/enum-list";
import { DataTransformUtil } from "../../utils/data-transform-util";

export class NewsFeedDataList {
  readonly items: Array<NewsFeedDataPayload>;

  private constructor(items: Array<NewsFeedDataPayload>) {
    this.items = items;
  }

  static fromData(data: Array<NewsFeedDataPayload>): NewsFeedDataList {
    return new NewsFeedDataList(
      data.sort((p1, p2) => DataTransformUtil.compareIDs(p1.ID, p2.ID))
    );
  }

  addItem(item: NewsFeedDataPayload): NewsFeedDataList {
    const newItems = Array.from(this.items);
    newItems.push(item);
    return new NewsFeedDataList(newItems);
  }

  updateItem(item: NewsFeedDataPayload): NewsFeedDataList {
    const newItems = Array.from(this.items);
    const index = newItems.findIndex(
      (i) => item.ID !== undefined && i.ID === item.ID
    );
    if (index < 0) {
      return this.addItem(item);
    }
    newItems.splice(index, 1, item);
    return new NewsFeedDataList(newItems);
  }

  itemAtIndex(index: number): NewsFeedDataPayload | undefined {
    if (index < 0 || index >= this.items.length) {
      return undefined;
    }
    return this.items[index];
  }

  filteredItems(
    filterStr: string,
    enums?: EnumList
  ): Array<NewsFeedDataPayload> {
    const filteredStrParts = filterStr.split(" ");
    const filteredItems = new Array<NewsFeedDataPayload>();
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const sport = enums?.sportName(item.Sport)?.toLowerCase();
      const provider = enums?.providerName(item.Provider)?.toLowerCase();
      const language = enums?.languageNameForCode(item.Language)?.toLowerCase();
      let matchesFilter = false;
      for (let j = 0; j < filteredStrParts.length; j++) {
        const part = filteredStrParts[j].toLowerCase();
        matchesFilter =
          item.URL.indexOf(part) >= 0 ||
          (sport !== undefined && sport.indexOf(part) >= 0) ||
          (provider !== undefined && provider.indexOf(part) >= 0) ||
          (language !== undefined && language.indexOf(part) >= 0);
        if (!matchesFilter) {
          break;
        }
      }
      if (matchesFilter) {
        filteredItems.push(item);
      }
    }
    return filteredItems;
  }
}
