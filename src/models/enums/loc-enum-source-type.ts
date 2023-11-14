export class LocEnumSourceType {
  static readonly PROVIDER_CATEGORIES = 1;
  static readonly TEAMS_IN_STAGES = 2;

  static title(type: number): string | undefined {
    switch (type) {
      case LocEnumSourceType.PROVIDER_CATEGORIES:
        return "Provider categories";
      case LocEnumSourceType.TEAMS_IN_STAGES:
        return "Teams in stages";
      default:
        return undefined;
    }
  }

  static readonly TYPES = [
    LocEnumSourceType.PROVIDER_CATEGORIES,
    LocEnumSourceType.TEAMS_IN_STAGES,
  ];
}
