export class MenuEditAction {
  static readonly UNASSIGNED_STAGES = 0;
  static readonly STAGE_DATA_BATCH_ANALYSIS = 1;
  static readonly EXPORT_NAMES_TO_CSV = 2;
  static readonly IMPORT_NAMES_FROM_CSV = 3;
  static readonly VALIDATE_STAGE_TEAMS = 4;
  static readonly ADD_VARIATION_TO_PARTICIPANT_MAPPING = 5;
  static readonly STAGE_DATA_BATCH_PULL = 6;
  static readonly DATA_BATCH_TRANSLATE = 7;
  static readonly SEASON_DATE_RECOVERY = 8;
  static readonly IMPORT_ITEMS_FROM_DATA = 9;
  static readonly EXPORT_TO_JSON = 10;
  static readonly IMPORT_FROM_JSON = 11;
  static readonly ORDER_ROOT_ITEMS = 12;
  static readonly CLEANUP = 13;

  private static readonly ALL = [
    MenuEditAction.UNASSIGNED_STAGES,
    MenuEditAction.STAGE_DATA_BATCH_ANALYSIS,
    MenuEditAction.STAGE_DATA_BATCH_PULL,
    MenuEditAction.EXPORT_NAMES_TO_CSV,
    MenuEditAction.IMPORT_NAMES_FROM_CSV,
    MenuEditAction.DATA_BATCH_TRANSLATE,
    MenuEditAction.SEASON_DATE_RECOVERY,
    MenuEditAction.ORDER_ROOT_ITEMS,
    MenuEditAction.CLEANUP,
  ];

  static readonly ADMIN_ALL = new Set<number>([MenuEditAction.CLEANUP]);

  static titleForAction(action: number): string {
    switch (action) {
      case MenuEditAction.UNASSIGNED_STAGES:
        return "Unassigned stages";
      case MenuEditAction.STAGE_DATA_BATCH_ANALYSIS:
        return "Stage data batch analysis";
      case MenuEditAction.EXPORT_NAMES_TO_CSV:
        return "Export localized names to CSV";
      case MenuEditAction.IMPORT_NAMES_FROM_CSV:
        return "Import localized names from CSV";
      case MenuEditAction.VALIDATE_STAGE_TEAMS:
        return "Validate Localized Team IDs";
      case MenuEditAction.ADD_VARIATION_TO_PARTICIPANT_MAPPING:
        return "Add Variation To Participant Mapping";
      case MenuEditAction.STAGE_DATA_BATCH_PULL:
        return "Stage data batch pull";
      case MenuEditAction.DATA_BATCH_TRANSLATE:
        return "Data batch translate";
      case MenuEditAction.SEASON_DATE_RECOVERY:
        return "Recover season time ranges";
      case MenuEditAction.IMPORT_ITEMS_FROM_DATA:
        return "Import items from data";
      case MenuEditAction.EXPORT_TO_JSON:
        return "Export to JSON";
      case MenuEditAction.IMPORT_FROM_JSON:
        return "Import from JSON";
      case MenuEditAction.ORDER_ROOT_ITEMS:
        return "Order root items";
      case MenuEditAction.CLEANUP:
        return "Clean up";
      default:
        return "";
    }
  }

  static all(): number[] {
    return MenuEditAction.ALL;
  }
}
