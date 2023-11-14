import { LeagueTableAdditionalInfoItem } from "./league-table-additional-info-item";
import { LeagueTableLegendItem } from "./league-table-legend-item";
import { Team } from "./team";

export class LeagueTable {
  readonly additionalInfo: LeagueTableAdditionalInfoItem[];
  readonly code?: number;
  readonly legend: LeagueTableLegendItem[];
  readonly name?: string;
  readonly teams: Team[];
  private constructor(
    additionalInfo: LeagueTableAdditionalInfoItem[],
    code: number | undefined,
    legend: LeagueTableLegendItem[],
    name: string | undefined,
    teams: Team[]
  ) {
    this.additionalInfo = additionalInfo;
    this.code = code;
    this.legend = legend;
    this.name = name;
    this.teams = teams;
  }

  static fromData(data?: any): LeagueTable | undefined {
    if (data === undefined) {
      return undefined;
    }
    const teams = Team.listFromData(data["teams"]);
    if (teams.length === 0) {
      return undefined;
    }
    const additionalInfo = LeagueTableAdditionalInfoItem.listFromData(
      data["additional_info"]
    );
    const code: number | undefined = data["code"];
    const legend = LeagueTableLegendItem.listFromData(data["legend"]);
    const name: string | undefined = data["name"];
    return new LeagueTable(additionalInfo, code, legend, name, teams);
  }

  static listFromData(data?: any): LeagueTable[] {
    const list = new Array<LeagueTable>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((tableData) => {
        const leagueTable = LeagueTable.fromData(tableData);
        if (leagueTable !== undefined) {
          list.push(leagueTable);
        }
      });
    }
    return list;
  }
}
