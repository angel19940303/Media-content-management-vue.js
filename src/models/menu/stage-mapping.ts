import { TimeRange } from "../common/time-range";
import { Locale } from "../common/locale";

export interface StageMapping {
  stageId: string;
  fullName: string;
  providerId: number;
  categoryName: string;
  stageName: string;
  seasonName: string;
  gender: number;
  assignmentCount: number;
  timeRange?: TimeRange;
  localizedName?: Locale;
}
