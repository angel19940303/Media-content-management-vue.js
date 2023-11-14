import { TreeItem } from "react-sortable-tree";
import { Locale } from "../common/locale";
import { StageMapping } from "./stage-mapping";
import { TimeRange } from "../common/time-range";

export interface MenuItem extends TreeItem {
  id: string | undefined;
  type: number;
  treeId: number;
  title: string;
  subtitle: string | undefined;
  name: Locale;
  shortName: Locale;
  code: Locale;
  gender: number;
  hidden: boolean;
  noTable: boolean;
  noScorers: boolean;
  noTeamStats: boolean;
  noTracker: boolean;
  noDraw: boolean;
  domesticLeague: boolean;
  highlightedTournament: boolean;
  highlightedMatchListSections: boolean;
  highlightedMatchRounds: string[];
  isPopular: boolean;
  isPopularVisible: boolean;
  primary: boolean;
  children: Array<MenuItem>;
  stageMappings: Array<StageMapping>;
  flagVariants: Map<number, string>;
  timeRange?: TimeRange;
  sortOrderPopular?: number;
  path: Array<string>;
  countryCodes: Array<string>;
  localizedSortOrders: Map<string, number>;
}
