import { Locale } from "../common/locale";
import { ProviderParticipant } from "./provider-participant";

export interface InternalParticipant {
  ID: number;
  Name: Locale;
  ProviderParticipants: Map<string, ProviderParticipant>;
  NameAbbr: string;
  CountryID: number;
  Creator: number;
  CreatorID: string;
  IsHomeTeam: boolean;
}
