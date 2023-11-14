import { Locale } from "../common/locale";

export interface ProviderParticipant {
  ID: string;
  InternalID: number;
  ProviderID: number;
  Name: Locale;
  NameAbbr: string;
  CountryID: number;
  GenderID: number;
  SportID: number;
}
