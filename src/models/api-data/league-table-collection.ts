import { LeagueTable } from "./league-table";

export class LeagueTableCollection {
  readonly tables: LeagueTable[];
  private constructor(tables: LeagueTable[]) {
    this.tables = tables;
  }

  static fromData(data?: any): LeagueTableCollection | undefined {
    if (data === undefined) {
      return undefined;
    }
    const tables = LeagueTable.listFromData(data["tables"]);
    if (tables.length === 0) {
      return undefined;
    }
    return new LeagueTableCollection(tables);
  }
}
