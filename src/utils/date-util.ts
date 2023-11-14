import { TextUtil } from "./text-util";

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export class DateUtil {
  private static monthShortNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  private static readonly DAY_SHORT_NAMES = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  static defaultSeasonStartDate(): Date {
    const date = new Date();
    if (date.getUTCMonth() < 7) {
      date.setUTCFullYear(date.getUTCFullYear() - 1);
    }
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }

  static defaultSeasonEndDate(): Date {
    const date = new Date();
    if (date.getUTCMonth() >= 7) {
      date.setUTCFullYear(date.getUTCFullYear() + 1);
    }
    date.setUTCMonth(11, 31);
    date.setUTCHours(23, 59, 59, 999);
    return date;
  }

  static apiTimestampToDate(timestamp: number, isUTC: boolean): Date {
    const dateParts = DateUtil.apiTimestampParts(timestamp);
    if (isUTC) {
      const date = new Date();
      date.setUTCFullYear(dateParts.year, dateParts.month - 1, dateParts.day);
      date.setUTCHours(dateParts.hour, dateParts.minute, dateParts.second, 0);
      return date;
    }
    return new Date(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      dateParts.hour,
      dateParts.minute,
      dateParts.second,
      0
    );
  }

  static apiTimestampToDatePickerString(timestamp?: number): string {
    let dateParts: DateParts;
    if (!timestamp || timestamp < 19700101000000) {
      dateParts = DateUtil.dateParts(new Date());
    } else {
      dateParts = DateUtil.apiTimestampParts(timestamp);
    }
    return this.datePickerFormat(
      dateParts.year,
      dateParts.month,
      dateParts.day,
      dateParts.hour,
      dateParts.minute
    );
  }

  static dateToDatePickerString(date: Date): string {
    return this.datePickerFormat(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    );
  }

  static datePickerShortStringToDate(
    datePickerShortString: string | undefined
  ): Date | undefined {
    if (datePickerShortString === undefined) {
      return undefined;
    }
    const dateParts = this.datePartsFromDatePickerShortDate(
      datePickerShortString
    );
    return this.dateFromDateParts(dateParts, false);
  }

  static datePickerStringToApiTimestamp(datePickerString: string): number {
    const dateParts = this.datePartsFromDatePickerDate(datePickerString);
    if (dateParts !== undefined) {
      return (
        dateParts.year * 10000000000 +
        dateParts.month * 100000000 +
        dateParts.day * 1000000 +
        dateParts.hour * 10000 +
        dateParts.minute * 100
      );
    }
    /*if (
      new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/).test(
        datePickerString
      )
    ) {
      const year = parseInt(datePickerString.substr(0, 4), 10);
      const month = parseInt(datePickerString.substr(5, 2), 10);
      const day = parseInt(datePickerString.substr(8, 2), 10);
      const hour = parseInt(datePickerString.substr(11, 2), 10);
      const minute = parseInt(datePickerString.substr(14, 2), 10);

      return (
        year * 10000000000 +
        month * 100000000 +
        day * 1000000 +
        hour * 10000 +
        minute * 100
      );
    }*/
    return 0;
  }

  static iso8601StringToDate(dateStr: string): Date | undefined {
    const dateParts = this.datePartsFromIso8601Date(dateStr);
    if (dateParts === undefined) {
      return undefined;
    }
    const date = new Date();
    date.setUTCFullYear(dateParts.year, dateParts.month - 1, dateParts.day);
    date.setUTCHours(dateParts.hour, dateParts.minute, dateParts.second, 0);
    return date;
  }

  static dateToApiTimestamp(date: Date, isUTC: boolean): number {
    if (isUTC) {
      return (
        date.getUTCFullYear() * 10000000000 +
        (date.getUTCMonth() + 1) * 100000000 +
        date.getUTCDate() * 1000000 +
        date.getUTCHours() * 10000 +
        date.getUTCMinutes() * 100 +
        date.getUTCSeconds()
      );
    }
    return (
      date.getFullYear() * 10000000000 +
      (date.getMonth() + 1) * 100000000 +
      date.getDate() * 1000000 +
      date.getHours() * 10000 +
      date.getMinutes() * 100 +
      date.getSeconds()
    );
  }

  static createDate(
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    millis: number,
    isUTC: boolean
  ): Date {
    if (isUTC) {
      const result = new Date();
      result.setUTCFullYear(year, month, date);
      result.setUTCHours(hours, minutes, seconds, millis);
      return result;
    }
    return new Date(year, month, date, hours, minutes, seconds, millis);
  }

  static formatApiTimestampDateTime(timestamp: number): string {
    const parts = DateUtil.apiTimestampParts(timestamp);
    return (
      parts.day +
      " " +
      DateUtil.monthShortNames[parts.month - 1] +
      " " +
      parts.year +
      " " +
      TextUtil.pad(parts.hour, 2) +
      ":" +
      TextUtil.pad(parts.minute, 2)
    );
  }

  static formatApiParam(
    date: Date,
    utc: boolean,
    includeTime: boolean = true
  ): string {
    const parts = utc ? this.dateUtcParts(date) : this.dateParts(date);
    let dateStr =
      parts.year +
      "-" +
      TextUtil.pad(parts.month, 2) +
      "-" +
      TextUtil.pad(parts.day, 2);
    if (includeTime) {
      dateStr +=
        "T" +
        TextUtil.pad(parts.hour, 2) +
        ":" +
        TextUtil.pad(parts.minute, 2) +
        ":" +
        TextUtil.pad(parts.second, 2);
    }
    return dateStr;
  }

  static formatIso8601(date: Date): string {
    const parts = this.dateUtcParts(date);
    return (
      parts.year +
      "-" +
      TextUtil.pad(parts.month, 2) +
      "-" +
      TextUtil.pad(parts.day, 2) +
      "T" +
      TextUtil.pad(parts.hour, 2) +
      ":" +
      TextUtil.pad(parts.minute, 2) +
      ":" +
      TextUtil.pad(parts.second, 2) +
      "Z"
    );
  }

  static formatDatePickerShortString(date: Date): string {
    const parts = this.dateParts(date);
    return (
      parts.year +
      "-" +
      TextUtil.pad(parts.month, 2) +
      "-" +
      TextUtil.pad(parts.day, 2)
    );
  }

  static formatStartTime(date: Date): string {
    const parts = this.dateParts(date);
    return `${TextUtil.pad(parts.hour, 2)}:${TextUtil.pad(parts.minute, 2)}`;
  }

  static formatDayOfWeek(date: Date): string {
    let index = date.getDay();
    if (index >= this.DAY_SHORT_NAMES.length) {
      index = index % this.DAY_SHORT_NAMES.length;
    }
    return this.DAY_SHORT_NAMES[index];
  }

  static formatDateShort(date: Date): string {
    return this.monthShortNames[date.getMonth()] + " " + date.getDate();
  }

  private static datePartsFromDatePickerShortDate(
    dateStr: string
  ): DateParts | undefined {
    if (new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).test(dateStr)) {
      const year = parseInt(dateStr.substr(0, 4), 10);
      const month = parseInt(dateStr.substr(5, 2), 10);
      const day = parseInt(dateStr.substr(8, 2), 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return {
          year: year,
          month: month,
          day: day,
          hour: 0,
          minute: 0,
          second: 0,
        };
      }
    }
    return undefined;
  }

  private static datePartsFromDatePickerDate(
    dateStr: string
  ): DateParts | undefined {
    if (
      new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/).test(dateStr)
    ) {
      const year = parseInt(dateStr.substr(0, 4), 10);
      const month = parseInt(dateStr.substr(5, 2), 10);
      const day = parseInt(dateStr.substr(8, 2), 10);
      const hour = parseInt(dateStr.substr(11, 2), 10);
      const minute = parseInt(dateStr.substr(14, 2), 10);
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(hour) &&
        !isNaN(minute)
      ) {
        return {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: 0,
        };
      }
    }
    return undefined;
  }

  private static datePartsFromIso8601Date(
    dateStr: string
  ): DateParts | undefined {
    if (
      new RegExp(
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/
      ).test(dateStr)
    ) {
      const year = parseInt(dateStr.substr(0, 4), 10);
      const month = parseInt(dateStr.substr(5, 2), 10);
      const day = parseInt(dateStr.substr(8, 2), 10);
      const hour = parseInt(dateStr.substr(11, 2), 10);
      const minute = parseInt(dateStr.substr(14, 2), 10);
      const second = parseInt(dateStr.substr(17, 2), 10);
      if (
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day) &&
        !isNaN(hour) &&
        !isNaN(minute) &&
        !isNaN(second)
      ) {
        return {
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
        };
      }
    }
    return undefined;
  }

  private static apiTimestampParts(timestamp: number): DateParts {
    return {
      year: Math.floor(timestamp / 10000000000),
      month: Math.max(0, Math.floor(timestamp / 100000000) % 100),
      day: Math.floor((timestamp / 1000000) % 100),
      hour: Math.floor((timestamp / 10000) % 100),
      minute: Math.floor((timestamp / 100) % 100),
      second: Math.floor(timestamp % 100),
    };
  }

  private static dateParts(date: Date): DateParts {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
    };
  }

  private static dateUtcParts(date: Date): DateParts {
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    };
  }

  private static datePickerFormat(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number
  ): string {
    return (
      TextUtil.pad(year, 2) +
      "-" +
      TextUtil.pad(month, 2) +
      "-" +
      TextUtil.pad(day, 2) +
      "T" +
      TextUtil.pad(hour, 2) +
      ":" +
      TextUtil.pad(minute, 2)
    );
  }

  private static dateFromDateParts(
    dateParts: DateParts | undefined,
    isUTC: boolean
  ): Date | undefined {
    if (dateParts === undefined) {
      return undefined;
    }
    if (isUTC) {
      const date = new Date();
      date.setUTCFullYear(dateParts.year, dateParts.month - 1, dateParts.day);
      date.setUTCHours(dateParts.hour, dateParts.minute, dateParts.second, 0);
      return date;
    }
    return new Date(
      dateParts.year,
      dateParts.month - 1,
      dateParts.day,
      dateParts.hour,
      dateParts.minute,
      dateParts.second,
      0
    );
  }
}
