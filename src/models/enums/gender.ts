export class Gender {
  static readonly UNKNOWN = 0;
  static readonly MALE = 1;
  static readonly FEMALE = 2;

  static readonly GENDER_LIST: Array<number> = [
    Gender.UNKNOWN,
    Gender.MALE,
    Gender.FEMALE,
  ];

  static title(gender: number): string {
    switch (gender) {
      case Gender.MALE:
        return "Male";
      case Gender.FEMALE:
        return "Female";
    }
    return "Unknown";
  }

  static suffix(gender: number): string {
    switch (gender) {
      case Gender.FEMALE:
        return " - women";
      default:
        return "";
    }
  }

  static shortSuffix(gender: number): string {
    switch (gender) {
      case Gender.FEMALE:
        return " (w)";
      default:
        return "";
    }
  }
}
