import { MenuItem } from "../models/menu/menu-item";
import { MenuItemType } from "../models/enums/menu-item-type";
import FileSaver from "file-saver";
import { LocEnumItem } from "../models/loc-enums/loc-enum-item";
import { ConfigUtil } from "./config-util";

export class CsvUtil {
  private static readonly CSV_ROW_DELIMITER = "\n";
  private static readonly CSV_ITEM_DELIMITER = ";";

  private static readonly ID_KEY = "ID";
  private static readonly NAME_KEY_SUFFIX = " Name";
  private static readonly SHORT_NAME_KEY_SUFFIX = " Short Name";
  private static readonly REQUIRED_MENU_ITEM_ROW_LENGTH =
    ConfigUtil.languages().length * 2 + 1;
  private static readonly REQUIRED_LOCALIZED_ENUM_ROW_LENGTH = ConfigUtil.languages()
    .length;
  private static readonly INVALID_CSV_ERROR = (
    rowNumber: number,
    rowLength: number,
    expectedLength: number
  ): string => {
    return `invalid CSV data: row ${rowNumber} has an incorrect length ${rowLength} (required: ${expectedLength})`;
  };

  private readonly delimiter: string;
  private readonly newLine: string;

  constructor(delimiter: string, newLine: string) {
    this.delimiter = delimiter;
    this.newLine = newLine;
  }

  static create(): CsvUtil {
    return new CsvUtil(CsvUtil.CSV_ITEM_DELIMITER, CsvUtil.CSV_ROW_DELIMITER);
  }

  exportMenuItems(items: Array<MenuItem>): void {
    try {
      const rows = new Array<string>();
      const headerRow = new Array<string>();
      headerRow.push(CsvUtil.ID_KEY);
      ConfigUtil.languages().forEach((language) => {
        headerRow.push(language.code + CsvUtil.NAME_KEY_SUFFIX);
        headerRow.push(language.code + CsvUtil.SHORT_NAME_KEY_SUFFIX);
      });
      rows.push(headerRow.join(this.delimiter));
      this.exportMenuItemRows(items).forEach((row) => rows.push(row));

      const serializedRows = rows.join(this.newLine);

      const blob = new Blob([serializedRows], {
        type: "text/csv; charset=utf-8",
      });
      FileSaver.saveAs(blob, "menu-item-names.csv");
    } catch (e) {
      console.error(e);
      alert("An error occurred when triggering a file download.");
    }
  }

  importMenuItemNames(
    data: string
  ): Map<string, Map<string, [string, string]>> {
    return this.parseMenuItemRows(data);
  }

  exportLocalizedEnum(localizedEnum: Array<LocEnumItem>): void {
    try {
      const rows = new Array<string>();
      const headerRow = new Array<string>();
      ConfigUtil.languages().forEach((language) =>
        headerRow.push(language.code + CsvUtil.NAME_KEY_SUFFIX)
      );
      rows.push(headerRow.join(this.delimiter));
      this.exportLocalizedEnumRows(localizedEnum).forEach((row) =>
        rows.push(row)
      );
      const serializedRows = rows.join(this.newLine);
      const blob = new Blob([serializedRows], {
        type: "text/csv; charset=utf-8",
      });
      FileSaver.saveAs(blob, "loc-enum-names.csv");
    } catch (e) {
      console.error(e);
      alert("An error occurred when triggering a file download.");
    }
  }

  importLocEnumNames(data: string): Array<Map<string, string>> {
    return this.parseLocalizedEnumRows(data);
  }

  private exportMenuItemRows(items: Array<MenuItem>): Array<string> {
    const rows = new Array<string>();
    items.forEach((item) => {
      if (item.id === undefined || item.type === MenuItemType.SEASON) {
        return;
      }
      const row = new Array<string>();
      row.push(item.id);
      ConfigUtil.languages().forEach((language) => {
        const name = item.name.locale.get(language.code)?.value || "";
        const shortName = item.shortName.locale.get(language.code)?.value || "";
        row.push(name);
        row.push(shortName);
      });
      if (row.length === CsvUtil.REQUIRED_MENU_ITEM_ROW_LENGTH) {
        rows.push(row.join(this.delimiter));
      }
      if (item.children !== undefined && item.children.length > 0) {
        this.exportMenuItemRows(item.children).forEach((row) => rows.push(row));
      }
    });
    return rows;
  }

  private parseMenuItemRows(
    data: string
  ): Map<string, Map<string, [string, string]>> {
    const rows = data.trim().split(this.newLine);
    const result = new Map<string, Map<string, [string, string]>>();

    let error: string | undefined = undefined;
    for (let i = 0; i < rows.length; i++) {
      const parts = rows[i].trim().split(this.delimiter);
      if (parts.length !== CsvUtil.REQUIRED_MENU_ITEM_ROW_LENGTH) {
        error = CsvUtil.INVALID_CSV_ERROR(
          i + 1,
          parts.length,
          CsvUtil.REQUIRED_MENU_ITEM_ROW_LENGTH
        );
        break;
      }
      const id = parts[0].trim();

      if (id === CsvUtil.ID_KEY) {
        continue;
      }

      const names = new Map<string, [string, string]>();
      for (let j = 0; j < ConfigUtil.languages().length; j++) {
        const index = j * 2 + 1;
        const language = ConfigUtil.languages()[j];
        const name = parts[index].trim();
        const shortName = parts[index + 1].trim();
        names.set(language.code, [name, shortName]);
      }
      if (names.size > 0) {
        result.set(id, names);
      }
    }

    if (error !== undefined) {
      throw error;
    }

    return result;
  }

  private exportLocalizedEnumRows(
    localizedEnum: Array<LocEnumItem>
  ): Array<string> {
    const rows = new Array<string>();
    localizedEnum.forEach((item) => {
      const row = new Array<string>();
      ConfigUtil.languages().forEach((language) =>
        row.push(item.name.locale.get(language.code)?.value.trim() || "")
      );
      if (row.length === CsvUtil.REQUIRED_LOCALIZED_ENUM_ROW_LENGTH) {
        rows.push(row.join(this.delimiter));
      }
    });
    return rows;
  }

  private parseLocalizedEnumRows(data: string): Array<Map<string, string>> {
    const rows = data.trim().split(this.newLine);
    const result = new Array<Map<string, string>>();

    let error: string | undefined = undefined;
    for (let i = 0; i < rows.length; i++) {
      const parts = rows[i].trim().split(this.delimiter);
      if (parts.length !== CsvUtil.REQUIRED_LOCALIZED_ENUM_ROW_LENGTH) {
        error = CsvUtil.INVALID_CSV_ERROR(
          i + 1,
          parts.length,
          CsvUtil.REQUIRED_LOCALIZED_ENUM_ROW_LENGTH
        );
        break;
      }

      const names = new Map<string, string>();
      for (let j = 0; j < ConfigUtil.languages().length; j++) {
        const language = ConfigUtil.languages()[j];
        const name = parts[j].trim();
        if (name.indexOf(language.code) === 0) {
          break;
        }
        if (name.length > 0) {
          names.set(language.code, name);
        }
      }
      if (names.size > 0) {
        result.push(names);
      }
    }

    if (error !== undefined) {
      throw error;
    }

    return result;
  }
}
