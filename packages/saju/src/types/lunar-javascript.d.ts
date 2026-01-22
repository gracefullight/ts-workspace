declare module "lunar-javascript" {
  export class Solar {
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar;
    static fromDate(date: Date): Solar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getLunar(): Lunar;
    toFullString(): string;
  }

  export class Lunar {
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Lunar;
    static fromDate(date: Date): Lunar;

    getYear(): number;
    /** Returns negative value for leap month (e.g., -4 means leap 4th month) */
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getSolar(): Solar;

    /** 天干 (Heavenly Stem) of year */
    getYearGan(): string;
    /** 地支 (Earthly Branch) of year */
    getYearZhi(): string;
    /** 干支 (Stem-Branch) of year */
    getYearInGanZhi(): string;

    /** 天干 of month */
    getMonthGan(): string;
    /** 地支 of month */
    getMonthZhi(): string;
    /** 干支 of month */
    getMonthInGanZhi(): string;

    /** 天干 of day */
    getDayGan(): string;
    /** 地支 of day */
    getDayZhi(): string;
    /** 干支 of day */
    getDayInGanZhi(): string;

    /** 天干 of hour */
    getTimeGan(): string;
    /** 地支 of hour */
    getTimeZhi(): string;
    /** 干支 of hour */
    getTimeInGanZhi(): string;

    /** 八字 (Four Pillars / BaZi) */
    getBaZi(): string[];

    /** Check if current month is a leap month */
    isLeap(): boolean;

    toFullString(): string;
  }

  // biome-ignore lint/complexity/noStaticOnlyClass: External library type definition
  export class HolidayUtil {
    static fix(data: Record<string, string> | null): void;
  }
}
