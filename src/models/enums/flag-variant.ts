export class FlagVariant {
  static readonly UNKNOWN = 0;
  static readonly SVG_1X1 = 1;
  static readonly SVG_4X3 = 2;
  static readonly PNG_1X1 = 3;
  static readonly PNG_4X3 = 4;

  static readonly VARIANTS = [
    FlagVariant.SVG_1X1,
    FlagVariant.SVG_4X3,
    FlagVariant.PNG_1X1,
    FlagVariant.PNG_4X3,
  ];

  static title(variant: number): string {
    switch (variant) {
      case FlagVariant.SVG_1X1:
        return "SVG 1x1";
      case FlagVariant.SVG_4X3:
        return "SVG 4x3";
      case FlagVariant.PNG_1X1:
        return "PNG 1x1";
      case FlagVariant.PNG_4X3:
        return "PNG 4x3";
      default:
        return "Unknown";
    }
  }

  static fileName(variant: number): string | undefined {
    switch (variant) {
      case FlagVariant.SVG_1X1:
        return "1x1.svg";
      case FlagVariant.SVG_4X3:
        return "4x3.svg";
      case FlagVariant.PNG_1X1:
        return "1x1.png";
      case FlagVariant.PNG_4X3:
        return "4x3.png";
      default:
        return undefined;
    }
  }
}
