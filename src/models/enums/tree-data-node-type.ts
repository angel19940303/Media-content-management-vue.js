export class TreeDataNodeType {
  static readonly ROOT = 0;
  static readonly CATEGORY = 1;
  static readonly STAGE = 2;
  static readonly SEASON = 3;

  static titleForType(type: number) {
    switch (type) {
      case TreeDataNodeType.ROOT:
        return "Root";
      case TreeDataNodeType.CATEGORY:
        return "Category";
      case TreeDataNodeType.STAGE:
        return "Stage";
      case TreeDataNodeType.SEASON:
        return "Season";
    }
  }
}
