export class LeagueTableLegendItem {
  readonly stagePhase: number;
  readonly stagePhaseText?: string;
  private constructor(stagePhase: number, stagePhaseText: string | undefined) {
    this.stagePhase = stagePhase;
    this.stagePhaseText = stagePhaseText;
  }

  static fromData(data?: any): LeagueTableLegendItem | undefined {
    if (data === undefined) {
      return undefined;
    }
    const stagePhase: number | undefined = data["stage_phase"];
    if (stagePhase === undefined) {
      return undefined;
    }
    const stagePhaseText: string | undefined = data["stage_phase_text"];
    return new LeagueTableLegendItem(stagePhase, stagePhaseText);
  }

  static listFromData(data?: any): LeagueTableLegendItem[] {
    const list = new Array<LeagueTableLegendItem>();
    if (data !== undefined && Array.isArray(data) && data.length > 0) {
      data.forEach((itemData) => {
        const item = LeagueTableLegendItem.fromData(itemData);
        if (item !== undefined) {
          list.push(item);
        }
      });
    }
    return list;
  }
}
