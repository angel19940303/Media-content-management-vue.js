export class MenuItemType {
  static readonly UNKNOWN = 0;
  static readonly CATEGORY = 1;
  static readonly STAGE = 2;
  static readonly SEASON = 3;

  static abbreviation(type: number) {
    switch (type) {
      case MenuItemType.CATEGORY:
        return "CA";
      case MenuItemType.STAGE:
        return "ST";
      case MenuItemType.SEASON:
        return "SE";
      default:
        return "?";
    }
  }
}
