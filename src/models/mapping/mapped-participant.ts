import { ProviderParticipant } from "./provider-participant";
import { Provider } from "../enums/provider";

export class MappedParticipant {
  readonly id: number;
  readonly name: Map<string, string>;
  readonly nameAbbr: string;
  readonly countryId: string;
  readonly providerId: number;
  readonly providerParticipantId: number;
  readonly sportId: number;
  readonly genderId: number;
  readonly sourceProviderId: number;
  readonly providerParticipants: Map<string, ProviderParticipant>;

  private constructor(
    id: number,
    name: Map<string, string>,
    nameAbbr: string,
    countryId: string,
    providerId: number,
    providerParticipantId: number,
    sportId: number,
    genderId: number,
    sourceProviderId: number,
    providerParticipants: Map<string, ProviderParticipant>
  ) {
    this.id = id;
    this.name = name;
    this.nameAbbr = nameAbbr;
    this.countryId = countryId;
    this.providerId = providerId;
    this.providerParticipantId = providerParticipantId;
    this.sportId = sportId;
    this.genderId = genderId;
    this.sourceProviderId = sourceProviderId;
    this.providerParticipants = providerParticipants;
  }

  static fromData(
    sourceProviderId: number,
    data: any | undefined
  ): MappedParticipant | undefined {
    const id: number | undefined = data?.ID;
    const name: Map<string, string> | undefined = this.namesToMap(data?.Name);
    const countryId: string | undefined = data?.CountryID;
    const providerId: number | undefined = data?.ProviderID;
    const providerParticipantId: number | undefined =
      data?.ProviderParticipantID;
    const sportId: number | undefined = data?.SportID;
    const internalProviderId = Provider.INTERNAL.toString(10);
    if (
      id !== undefined &&
      name?.has(internalProviderId) === true &&
      countryId !== undefined &&
      providerId !== undefined &&
      providerParticipantId !== undefined &&
      sportId !== undefined
    ) {
      const nameAbbr: string = data?.NameAbbr || "";
      const genderId: number = data?.GenderID || 0;
      const providerParticipants = this.providerParticipantsToMap(
        data?.ProviderParticipants
      );
      return new MappedParticipant(
        id,
        name,
        nameAbbr,
        countryId,
        providerId,
        providerParticipantId,
        sportId,
        genderId,
        sourceProviderId,
        providerParticipants
      );
    }
    return undefined;
  }

  static mapFromData(
    providerId: number,
    data: any | undefined
  ): Map<string, MappedParticipant> {
    const map = new Map<string, MappedParticipant>();
    if (data !== undefined && Array.isArray(data)) {
      data.forEach((item: any) => {
        const mappedParticipant = this.fromData(providerId, item);
        if (mappedParticipant !== undefined) {
          const compositeId = providerId + "-" + mappedParticipant.id;
          map.set(compositeId, mappedParticipant);
        } else {
          console.warn("Mapped participant data could not be parsed", item);
        }
      });
    }
    return map;
  }

  static nameListFromData(
    dataMap: Map<string, MappedParticipant>
  ): Map<string, string> {
    const map = new Map<string, string>();
    dataMap.forEach((value, key) => {
      const name = value.name.get(value.sourceProviderId.toString(10));
      if (name === undefined) {
        console.log(
          "Match participant without name for provider " +
            value.sourceProviderId,
          value
        );
      } else {
        map.set(key, name);
      }
    });
    return map;
  }

  private static namesToMap(
    names: any | undefined
  ): Map<string, string> | undefined {
    const map = new Map<string, string>();
    if (names !== undefined) {
      Object.getOwnPropertyNames(names).forEach((key) => {
        const value = names[key];
        if (typeof value === "string") {
          map.set(key, value);
        }
      });
    }
    if (map.size === 0) {
      return undefined;
    }
    return map;
  }

  private static providerParticipantsToMap(
    participants: any | undefined
  ): Map<string, ProviderParticipant> {
    const map = new Map<string, ProviderParticipant>();
    if (participants !== undefined) {
      Object.getOwnPropertyNames(participants).forEach((key) =>
        map.set(key, participants[key])
      );
    }
    return map;
  }
}
