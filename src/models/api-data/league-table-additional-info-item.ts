export class LeagueTableAdditionalInfoItem {
  readonly id: number;
  private constructor(id: number) {
    this.id = id;
  }

  static fromData(data: any): LeagueTableAdditionalInfoItem | undefined {
    if (data === undefined) {
      return undefined;
    }
    const id: number | undefined = data["id"];
    if (id === undefined) {
      return undefined;
    }
    return new LeagueTableAdditionalInfoItem(id);
  }

  static listFromData(data?: any): LeagueTableAdditionalInfoItem[] {
    const list = new Array<LeagueTableAdditionalInfoItem>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((itemData) => {
        const item = LeagueTableAdditionalInfoItem.fromData(data);
        if (item !== undefined) {
          list.push(item);
        }
      });
    }
    return list;
  }
}
