import { beforeAll, describe, expect, it } from "vitest";
import type { DateAdapter } from "@/adapters/date-adapter";
import { createDateFnsAdapter } from "@/adapters/date-fns";

interface DateFnsDate {
  date: Date;
  timeZone: string;
}

describe("date-fns Adapter", () => {
  let adapter: DateAdapter<DateFnsDate>;

  beforeAll(async () => {
    adapter = await createDateFnsAdapter();
  });

  describe("Basic date getters", () => {
    it("should get year correctly", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Seoul" };
      expect(adapter.getYear(dt)).toBe(2000);
    });

    it("should get month correctly (1-based)", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Seoul" };
      expect(adapter.getMonth(dt)).toBe(1);
    });

    it("should get day correctly", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Seoul" };
      expect(adapter.getDay(dt)).toBe(1);
    });

    it("should get hour correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      expect(adapter.getHour(dt)).toBe(18);
    });

    it("should get minute correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      expect(adapter.getMinute(dt)).toBe(0);
    });

    it("should get second correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0, 30), timeZone: "Asia/Seoul" };
      expect(adapter.getSecond(dt)).toBe(30);
    });

    it("should get zone name correctly", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Seoul" };
      expect(adapter.getZoneName(dt)).toBe("Asia/Seoul");
    });
  });

  describe("Date arithmetic", () => {
    it("should add minutes correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      const result = adapter.plusMinutes(dt, 30);
      expect(adapter.getMinute(result)).toBe(30);
      expect(adapter.getHour(result)).toBe(18);
    });

    it("should add minutes with hour overflow", () => {
      const dt = { date: new Date(2000, 0, 1, 23, 45), timeZone: "Asia/Seoul" };
      const result = adapter.plusMinutes(dt, 30);
      expect(adapter.getHour(result)).toBe(0);
      expect(adapter.getMinute(result)).toBe(15);
      expect(adapter.getDay(result)).toBe(2);
    });

    it("should add days correctly", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Seoul" };
      const result = adapter.plusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(6);
      expect(adapter.getMonth(result)).toBe(1);
    });

    it("should add days with month overflow", () => {
      const dt = { date: new Date(2000, 0, 30), timeZone: "Asia/Seoul" };
      const result = adapter.plusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(4);
      expect(adapter.getMonth(result)).toBe(2);
    });

    it("should subtract days correctly", () => {
      const dt = { date: new Date(2000, 0, 10), timeZone: "Asia/Seoul" };
      const result = adapter.minusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(5);
      expect(adapter.getMonth(result)).toBe(1);
    });

    it("should subtract days with month underflow", () => {
      const dt = { date: new Date(2000, 1, 3), timeZone: "Asia/Seoul" };
      const result = adapter.minusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(29);
      expect(adapter.getMonth(result)).toBe(1);
    });
  });

  describe("Timezone operations", () => {
    it("should convert to UTC correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      const utc = adapter.toUTC(dt);
      expect(adapter.getZoneName(utc)).toBe("UTC");
    });

    it("should set zone correctly", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      const ny = adapter.setZone(dt, "America/New_York");
      expect(adapter.getZoneName(ny)).toBe("America/New_York");
    });
  });

  describe("Conversion methods", () => {
    it("should convert to ISO string", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      const iso = adapter.toISO(dt);
      expect(iso).toContain("2000-01-01");
      expect(iso).toContain("18:00");
    });

    it("should convert to milliseconds", () => {
      const dt = { date: new Date(2000, 0, 1, 18, 0), timeZone: "Asia/Seoul" };
      const millis = adapter.toMillis(dt);
      expect(typeof millis).toBe("number");
      expect(millis).toBeGreaterThan(0);
    });

    it("should create date from milliseconds", () => {
      const millis = new Date(2000, 0, 1, 18, 0).getTime();
      const dt = adapter.fromMillis(millis, "Asia/Seoul");
      expect(adapter.getYear(dt)).toBe(2000);
      expect(adapter.getMonth(dt)).toBe(1);
      expect(adapter.getDay(dt)).toBe(1);
    });
  });

  describe("UTC date creation", () => {
    it("should create UTC date correctly", () => {
      const dt = adapter.createUTC(2000, 2, 5, 12, 30, 45);
      expect(adapter.getZoneName(dt)).toBe("UTC");
      expect(adapter.getYear(dt)).toBe(2000);
      expect(adapter.getMonth(dt)).toBe(2);
      expect(adapter.getDay(dt)).toBe(5);
    });
  });

  describe("Date comparison", () => {
    it("should compare dates correctly (greater than)", () => {
      const dt1 = { date: new Date(2000, 0, 2), timeZone: "UTC" };
      const dt2 = { date: new Date(2000, 0, 1), timeZone: "UTC" };
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(true);
    });

    it("should compare dates correctly (equal)", () => {
      const dt1 = { date: new Date(2000, 0, 1, 12, 0, 0), timeZone: "UTC" };
      const dt2 = { date: new Date(2000, 0, 1, 12, 0, 0), timeZone: "UTC" };
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(true);
    });

    it("should compare dates correctly (less than)", () => {
      const dt1 = { date: new Date(1999, 11, 31), timeZone: "UTC" };
      const dt2 = { date: new Date(2000, 0, 1), timeZone: "UTC" };
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle leap year correctly", () => {
      const dt = { date: new Date(2000, 1, 29), timeZone: "UTC" };
      expect(adapter.getDay(dt)).toBe(29);
      expect(adapter.getMonth(dt)).toBe(2);
    });

    it("should handle year boundary", () => {
      const dt = { date: new Date(1999, 11, 31, 23, 59), timeZone: "UTC" };
      const result = adapter.plusMinutes(dt, 2);
      expect(adapter.getYear(result)).toBe(2000);
      expect(adapter.getMonth(result)).toBe(1);
      expect(adapter.getDay(result)).toBe(1);
    });

    it("should preserve timeZone property after operations", () => {
      const dt = { date: new Date(2000, 0, 1), timeZone: "Asia/Tokyo" };
      const result = adapter.plusDays(dt, 1);
      expect(adapter.getZoneName(result)).toBe("Asia/Tokyo");
    });
  });

  describe("Hour pillar calculation with local time (Issue #15 regression)", () => {
    it("should use local time hours for calculation, not UTC-shifted hours", async () => {
      const localAdapter = await createDateFnsAdapter();

      // Test case: User inputs 23:00 in Asia/Seoul timezone
      // The hour pillar should be calculated based on hour 23, not shifted
      const localDateTime = {
        date: new Date(1990, 0, 15, 23, 0), // 23:00 local time
        timeZone: "Asia/Seoul",
      };

      // getHour should return 23 (the local time), not a UTC-shifted value
      expect(localAdapter.getHour(localDateTime)).toBe(23);
    });

    it("should calculate correct hour branch index for zi hour (23:00-01:00)", async () => {
      const localAdapter = await createDateFnsAdapter();

      // 23:00 should be 子時 (Zi hour, branch index 0)
      const dt23 = {
        date: new Date(1990, 0, 15, 23, 0),
        timeZone: "Asia/Seoul",
      };
      expect(localAdapter.getHour(dt23)).toBe(23);

      // 0:30 should also be 子時 (Zi hour, branch index 0)
      const dt0 = {
        date: new Date(1990, 0, 15, 0, 30),
        timeZone: "Asia/Seoul",
      };
      expect(localAdapter.getHour(dt0)).toBe(0);
    });

    it("should not shift hours when timezone metadata is set", async () => {
      const localAdapter = await createDateFnsAdapter();

      // Create date with specific local hour
      const hours = [0, 1, 5, 11, 12, 18, 22, 23];

      for (const hour of hours) {
        const dt = {
          date: new Date(1990, 5, 15, hour, 30),
          timeZone: "Asia/Seoul",
        };
        expect(localAdapter.getHour(dt)).toBe(hour);
      }
    });

    it("should maintain hour consistency across different timezones metadata", async () => {
      const localAdapter = await createDateFnsAdapter();

      // The same Date object should return same hour regardless of timezone metadata
      // because date-fns adapter uses Date.getHours() which returns local system time
      const baseDate = new Date(1990, 5, 15, 14, 0);

      const seoulDt = { date: baseDate, timeZone: "Asia/Seoul" };
      const tokyoDt = { date: baseDate, timeZone: "Asia/Tokyo" };
      const utcDt = { date: baseDate, timeZone: "UTC" };

      // All should return 14 because they use the same Date object
      expect(localAdapter.getHour(seoulDt)).toBe(14);
      expect(localAdapter.getHour(tokyoDt)).toBe(14);
      expect(localAdapter.getHour(utcDt)).toBe(14);
    });
  });
});
