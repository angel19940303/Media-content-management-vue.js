export interface TimeRange {
  start: number;
  end: number;
}

export class TimeRangeValidator {
  static isValid(start: string, end: string): boolean {
    return (
      (start.length === 0 && end.length === 0) ||
      (start.length > 0 && end.length > 0 && start <= end)
    );
  }
}
