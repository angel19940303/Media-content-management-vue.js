export class ProviderIdItem {
  readonly providerId: number;
  readonly id: string;

  private constructor(providerId: number, id: string) {
    this.providerId = providerId;
    this.id = id;
  }

  static fromData(data?: any): ProviderIdItem | undefined {
    if (data === undefined) {
      return undefined;
    }
    const providerId: number | undefined = data["pid"];
    const id: string | undefined = data["id"];
    if (providerId === undefined || id === undefined) {
      return undefined;
    }
    return new ProviderIdItem(providerId, id);
  }

  static listFromData(data?: any): ProviderIdItem[] {
    const items = new Array<ProviderIdItem>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((itemData: any) => {
        const item = ProviderIdItem.fromData(itemData);
        if (item !== undefined) {
          items.push(item);
        }
      });
    }
    return items;
  }
}
