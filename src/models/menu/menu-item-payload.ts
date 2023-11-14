import { MenuItem } from "./menu-item";
import { StageMapping } from "./stage-mapping";

export interface MenuItemPayload {
  publishUrl?: string;
  menuItems: Array<MenuItem>;
  stageMappings: Array<StageMapping>;
  assignedSeasonCounts: Map<string, number>;
  localizedSortOrders: Map<string, Map<number, number>>;
}
