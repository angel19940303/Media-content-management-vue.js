import { CountryCode } from "./country-code";

export class EnumList {
  private readonly genders = new Map<string, number>();
  private readonly languagesByCode = new Map<string, string>();
  private readonly languagesById = new Map<string, number>();
  private readonly providers = new Map<string, number>();
  private readonly sports = new Map<string, number>();

  private readonly reversedGenders = new Map<number, string>();
  private readonly reversedLanguagesByCode = new Map<string, string>();
  private readonly reversedLanguagesById = new Map<number, string>();
  private readonly reversedProviders = new Map<number, string>();
  private readonly reversedSports = new Map<number, string>();

  private readonly genderIndex = new Array<string>();
  private readonly languageIndex = new Array<string>();
  private readonly providerIndex = new Array<string>();
  private readonly sportIndex = new Array<string>();

  private readonly countryCodes = new Array<CountryCode>();

  private constructor(
    genders: Map<string, number>,
    languagesByCode: Map<string, string>,
    languagesById: Map<string, number>,
    provides: Map<string, number>,
    sports: Map<string, number>,
    reversedGenders: Map<number, string>,
    reversedLanguagesByCode: Map<string, string>,
    reversedLanguagesById: Map<number, string>,
    reversedProviders: Map<number, string>,
    reversedSports: Map<number, string>,
    genderIndex: Array<string>,
    languageIndex: Array<string>,
    providerIndex: Array<string>,
    sportIndex: Array<string>,
    countryCodes: Array<CountryCode>
  ) {
    this.genders = genders;
    this.languagesByCode = languagesByCode;
    this.languagesById = languagesById;
    this.providers = provides;
    this.sports = sports;

    this.reversedGenders = reversedGenders;
    this.reversedLanguagesByCode = reversedLanguagesByCode;
    this.reversedLanguagesById = reversedLanguagesById;
    this.reversedProviders = reversedProviders;
    this.reversedSports = reversedSports;

    this.genderIndex = genderIndex;
    this.languageIndex = languageIndex;
    this.providerIndex = providerIndex;
    this.sportIndex = sportIndex;

    this.countryCodes = countryCodes;
  }

  static createEmoty(): EnumList {
    return new EnumList(
      new Map<string, number>(),
      new Map<string, string>(),
      new Map<string, number>(),
      new Map<string, number>(),
      new Map<string, number>(),
      new Map<number, string>(),
      new Map<string, string>(),
      new Map<number, string>(),
      new Map<number, string>(),
      new Map<number, string>(),
      new Array<string>(),
      new Array<string>(),
      new Array<string>(),
      new Array<string>(),
      new Array<CountryCode>()
    );
  }

  static fromData(data?: any): EnumList | undefined {
    if (data === undefined) {
      return undefined;
    }

    const [providers, reversedProviders] = EnumList.parseItemNumMap(
      data["providers"]
    );
    const [genders, reversedGenders] = EnumList.parseItemNumMap(data["gender"]);
    const [languagesByCode, reversedLanguagesByCode] = EnumList.parseItemStrMap(
      data["languages"]
    );
    const [
      languagesById,
      reversedLanguagesById,
    ] = EnumList.parseReversedItemNumMap(data["languages_index"]);
    const [sports, reversedSports] = EnumList.parseItemNumMap(data["sports"]);

    const providerIndex = EnumList.indexFromItemMap(providers);
    let genderIndex = EnumList.parseItemIndex(data["gender_index"]);
    const languageIndex = EnumList.parseItemIndex(data["languages_index"]);
    let sportIndex = EnumList.parseItemIndex(data["sports_index"]);

    if (genderIndex.length !== genders.size) {
      genderIndex = EnumList.indexFromItemMap(genders);
    }

    if (sportIndex.length !== sports.size) {
      sportIndex = EnumList.indexFromItemMap(sports);
    }

    const countryCodes: Array<CountryCode> = Array.isArray(
      data["country_codes"]
    )
      ? data["country_codes"]
      : [];

    if (
      providers.size === 0 &&
      genders.size === 0 &&
      languagesByCode.size === 0 &&
      languagesById.size === 0 &&
      sports.size === 0
    ) {
      return undefined;
    }

    return new EnumList(
      genders,
      languagesByCode,
      languagesById,
      providers,
      sports,
      reversedGenders,
      reversedLanguagesByCode,
      reversedLanguagesById,
      reversedProviders,
      reversedSports,
      genderIndex,
      languageIndex,
      providerIndex,
      sportIndex,
      countryCodes
    );
  }

  private static parseItemNumMap<T>(
    data?: any
  ): [Map<string, number>, Map<number, string>] {
    const result = new Map<string, number>();
    const reversedResult = new Map<number, string>();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach((key) => {
        const value = parseInt(data[key], 10);
        if (!isNaN(value)) {
          result.set(key, value);
          reversedResult.set(value, key);
        }
      });
    }
    return [result, reversedResult];
  }

  private static parseReversedItemNumMap<T>(
    data?: any
  ): [Map<string, number>, Map<number, string>] {
    const result = new Map<string, number>();
    const reversedResult = new Map<number, string>();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach((key) => {
        const keyNum = parseInt(key, 10);
        if (!isNaN(keyNum)) {
          const value = data[key].toString();
          result.set(value, keyNum);
          reversedResult.set(keyNum, value);
        }
      });
    }
    return [result, reversedResult];
  }

  private static parseItemStrMap<T>(
    data?: any
  ): [Map<string, string>, Map<string, string>] {
    const result = new Map<string, string>();
    const reversedResult = new Map<string, string>();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach((key) => {
        const value = data[key].toString();
        result.set(key, value);
        reversedResult.set(value, key);
      });
    }
    return [result, reversedResult];
  }

  private static parseItemIndex(data?: any): Array<string> {
    const result = new Map<string, number>();
    if (data !== undefined) {
      Object.getOwnPropertyNames(data).forEach((key) => {
        const keyNum = parseInt(key, 10);
        if (!isNaN(keyNum)) {
          const value: any = data[key];
          result.set(value.toString(), keyNum);
        }
      });
    }
    return EnumList.indexFromItemMap(result);
  }

  private static indexFromItemMap(itemMap: Map<string, number>): Array<string> {
    const entryList = Array.from(itemMap.entries());
    return entryList
      .sort((a: [string, number], b: [string, number]) => a[1] - b[1])
      .map((i) => i[0]);
  }

  hasProvider(id: number): boolean {
    return this.reversedProviders.has(id);
  }

  hasSport(id: number): boolean {
    return this.reversedSports.has(id);
  }

  hasLanguageWithCode(code: string): boolean {
    return this.reversedLanguagesByCode.has(code);
  }

  hasLanguageWithId(id: number): boolean {
    return this.reversedLanguagesById.has(id);
  }

  hasGender(id: number): boolean {
    return this.reversedGenders.has(id);
  }

  providerName(id: number): string | undefined {
    return this.reversedProviders.get(id);
  }

  sportName(id: number): string | undefined {
    return this.reversedSports.get(id);
  }

  languageNameForCode(code: string): string | undefined {
    return this.reversedLanguagesByCode.get(code);
  }

  languageNameForId(id: number): string | undefined {
    return this.reversedLanguagesById.get(id);
  }

  genderName(id: number): string | undefined {
    return this.reversedGenders.get(id);
  }

  defaultSport(): number | undefined {
    if (this.sportIndex.length === 0) {
      return undefined;
    }
    const code = this.sportIndex[0];
    return this.sports.get(code);
  }

  defaultLanguage(): string | undefined {
    if (this.languageIndex.length === 0) {
      return undefined;
    }
    const code = this.languageIndex[0];
    return this.languagesByCode.get(code);
  }

  defaultProvider(): number | undefined {
    if (this.providerIndex.length === 0) {
      return undefined;
    }
    const code = this.providerIndex[0];
    return this.providers.get(code);
  }

  defaultGender(): number | undefined {
    if (this.genderIndex.length === 0) {
      return undefined;
    }
    const code = this.genderIndex[0];
    return this.genders.get(code);
  }

  getSports(): Array<string> {
    return this.sportIndex;
  }

  getGenders(): Array<string> {
    return this.genderIndex;
  }

  getProviders(): Array<string> {
    return this.providerIndex;
  }

  getLanguages(): Array<string> {
    return this.languageIndex;
  }

  getSportId(sport: string): number | undefined {
    return this.sports.get(sport);
  }

  getLanguageCode(language: string): string | undefined {
    return this.languagesByCode.get(language);
  }

  getLanguageId(language: string): number | undefined {
    return this.languagesById.get(language);
  }

  getProviderId(provider: string): number | undefined {
    return this.providers.get(provider);
  }

  getGenderId(gender: string): number | undefined {
    return this.genders.get(gender);
  }

  getCountryCodes(): Array<CountryCode> {
    return this.countryCodes;
  }
}
