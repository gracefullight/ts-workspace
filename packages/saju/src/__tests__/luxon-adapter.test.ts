import { DateTime } from "luxon";
import { beforeAll, describe, expect, it } from "vitest";
import type { DateAdapter } from "@/adapters/date-adapter";
import { createLuxonAdapter } from "@/adapters/luxon";

describe("Luxon Adapter", () => {
  let adapter: DateAdapter<DateTime>;

  beforeAll(async () => {
    adapter = await createLuxonAdapter();
  });

  describe("Basic date getters", () => {
    it("should get year correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "Asia/Seoul" });
      expect(adapter.getYear(dt)).toBe(2000);
    });

    it("should get month correctly (1-based)", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "Asia/Seoul" });
      expect(adapter.getMonth(dt)).toBe(1);
    });

    it("should get day correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "Asia/Seoul" });
      expect(adapter.getDay(dt)).toBe(1);
    });

    it("should get hour correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      expect(adapter.getHour(dt)).toBe(18);
    });

    it("should get minute correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      expect(adapter.getMinute(dt)).toBe(0);
    });

    it("should get second correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0, second: 30 },
        { zone: "Asia/Seoul" },
      );
      expect(adapter.getSecond(dt)).toBe(30);
    });

    it("should get zone name correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "Asia/Seoul" });
      expect(adapter.getZoneName(dt)).toBe("Asia/Seoul");
    });
  });

  describe("Date arithmetic", () => {
    it("should add minutes correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const result = adapter.plusMinutes(dt, 30);
      expect(adapter.getMinute(result)).toBe(30);
      expect(adapter.getHour(result)).toBe(18);
    });

    it("should add minutes with hour overflow", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 23, minute: 45 },
        { zone: "Asia/Seoul" },
      );
      const result = adapter.plusMinutes(dt, 30);
      expect(adapter.getHour(result)).toBe(0);
      expect(adapter.getMinute(result)).toBe(15);
      expect(adapter.getDay(result)).toBe(2);
    });

    it("should add days correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "Asia/Seoul" });
      const result = adapter.plusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(6);
      expect(adapter.getMonth(result)).toBe(1);
    });

    it("should add days with month overflow", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 30 }, { zone: "Asia/Seoul" });
      const result = adapter.plusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(4);
      expect(adapter.getMonth(result)).toBe(2);
    });

    it("should subtract days correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 1, day: 10 }, { zone: "Asia/Seoul" });
      const result = adapter.minusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(5);
      expect(adapter.getMonth(result)).toBe(1);
    });

    it("should subtract days with month underflow", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 2, day: 3 }, { zone: "Asia/Seoul" });
      const result = adapter.minusDays(dt, 5);
      expect(adapter.getDay(result)).toBe(29);
      expect(adapter.getMonth(result)).toBe(1);
    });
  });

  describe("Timezone operations", () => {
    it("should convert to UTC correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const utc = adapter.toUTC(dt);
      expect(adapter.getZoneName(utc)).toBe("UTC");
      expect(adapter.getHour(utc)).toBe(9);
    });

    it("should set zone correctly", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const ny = adapter.setZone(dt, "America/New_York");
      expect(adapter.getZoneName(ny)).toBe("America/New_York");
      expect(adapter.getHour(ny)).toBe(4);
    });

    it("should preserve instant when setting zone", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const ny = adapter.setZone(dt, "America/New_York");
      expect(adapter.toMillis(dt)).toBe(adapter.toMillis(ny));
    });
  });

  describe("Conversion methods", () => {
    it("should convert to ISO string", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const iso = adapter.toISO(dt);
      expect(iso).toContain("2000-01-01");
      expect(iso).toContain("18:00");
    });

    it("should convert to milliseconds", () => {
      const dt = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const millis = adapter.toMillis(dt);
      expect(typeof millis).toBe("number");
      expect(millis).toBeGreaterThan(0);
    });

    it("should create date from milliseconds", () => {
      const millis = 946717200000;
      const dt = adapter.fromMillis(millis, "Asia/Seoul");
      expect(adapter.getYear(dt)).toBe(2000);
      expect(adapter.getMonth(dt)).toBe(1);
      expect(adapter.getDay(dt)).toBe(1);
    });
  });

  describe("UTC date creation", () => {
    it("should create UTC date correctly", () => {
      const dt = adapter.createUTC(2000, 2, 5, 12, 30, 45);
      expect(adapter.getYear(dt)).toBe(2000);
      expect(adapter.getMonth(dt)).toBe(2);
      expect(adapter.getDay(dt)).toBe(5);
      expect(adapter.getHour(dt)).toBe(12);
      expect(adapter.getMinute(dt)).toBe(30);
      expect(adapter.getSecond(dt)).toBe(45);
      expect(adapter.getZoneName(dt)).toBe("UTC");
    });
  });

  describe("Date comparison", () => {
    it("should compare dates correctly (greater than)", () => {
      const dt1 = DateTime.fromObject({ year: 2000, month: 1, day: 2 }, { zone: "UTC" });
      const dt2 = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "UTC" });
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(true);
    });

    it("should compare dates correctly (equal)", () => {
      const dt1 = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "UTC" });
      const dt2 = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "UTC" });
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(true);
    });

    it("should compare dates correctly (less than)", () => {
      const dt1 = DateTime.fromObject({ year: 1999, month: 12, day: 31 }, { zone: "UTC" });
      const dt2 = DateTime.fromObject({ year: 2000, month: 1, day: 1 }, { zone: "UTC" });
      expect(adapter.isGreaterThanOrEqual(dt1, dt2)).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle leap year correctly", () => {
      const dt = DateTime.fromObject({ year: 2000, month: 2, day: 29 }, { zone: "UTC" });
      expect(adapter.getDay(dt)).toBe(29);
      expect(adapter.getMonth(dt)).toBe(2);
    });

    it("should handle year boundary", () => {
      const dt = DateTime.fromObject(
        { year: 1999, month: 12, day: 31, hour: 23, minute: 59 },
        { zone: "UTC" },
      );
      const result = adapter.plusMinutes(dt, 2);
      expect(adapter.getYear(result)).toBe(2000);
      expect(adapter.getMonth(result)).toBe(1);
      expect(adapter.getDay(result)).toBe(1);
    });

    it("should handle different timezones at same instant", () => {
      const seoul = DateTime.fromObject(
        { year: 2000, month: 1, day: 1, hour: 18, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      const utc = adapter.toUTC(seoul);
      expect(adapter.toMillis(seoul)).toBe(adapter.toMillis(utc));
    });
  });

  describe("Hour pillar calculation with timezone (Issue #15 regression)", () => {
    it("should return local timezone hour, not UTC hour", async () => {
      const localAdapter = await createLuxonAdapter();

      // 23:00 in Asia/Seoul
      const seoulTime = DateTime.fromObject(
        { year: 1990, month: 1, day: 15, hour: 23, minute: 0 },
        { zone: "Asia/Seoul" },
      );

      // getHour should return the local timezone hour (23)
      expect(localAdapter.getHour(seoulTime)).toBe(23);
    });

    it("should maintain correct hour when timezone is specified", async () => {
      const localAdapter = await createLuxonAdapter();

      // Test all 12 시진 (2-hour periods) boundaries
      const hourTests = [
        { hour: 0, expected: 0 }, // 子時 (23:00-01:00)
        { hour: 1, expected: 1 }, // 丑時 (01:00-03:00)
        { hour: 5, expected: 5 }, // 寅時 boundary
        { hour: 11, expected: 11 }, // 午時 boundary
        { hour: 12, expected: 12 }, // 午時
        { hour: 18, expected: 18 }, // 酉時
        { hour: 22, expected: 22 }, // 亥時
        { hour: 23, expected: 23 }, // 子時
      ];

      for (const { hour, expected } of hourTests) {
        const dt = DateTime.fromObject(
          { year: 1990, month: 6, day: 15, hour, minute: 30 },
          { zone: "Asia/Seoul" },
        );
        expect(localAdapter.getHour(dt)).toBe(expected);
      }
    });

    it("should correctly handle hour across different timezones", async () => {
      const localAdapter = await createLuxonAdapter();

      // Same instant in different timezones should have different local hours
      const seoulDt = DateTime.fromObject(
        { year: 1990, month: 6, day: 15, hour: 14, minute: 0 },
        { zone: "Asia/Seoul" },
      );

      const tokyoDt = seoulDt.setZone("Asia/Tokyo");
      const utcDt = seoulDt.setZone("UTC");

      // Local hours should be different based on timezone
      expect(localAdapter.getHour(seoulDt)).toBe(14);
      expect(localAdapter.getHour(tokyoDt)).toBe(14); // Same as Seoul (both UTC+9)
      expect(localAdapter.getHour(utcDt)).toBe(5); // UTC+0 (14-9=5)
    });

    it("should return correct hour for zi hour (子時) edge case", async () => {
      const localAdapter = await createLuxonAdapter();

      // 23:00 should return hour 23 (子時 start)
      const dt23 = DateTime.fromObject(
        { year: 1990, month: 1, day: 15, hour: 23, minute: 0 },
        { zone: "Asia/Seoul" },
      );
      expect(localAdapter.getHour(dt23)).toBe(23);

      // 00:30 should return hour 0 (still 子時)
      const dt0 = DateTime.fromObject(
        { year: 1990, month: 1, day: 16, hour: 0, minute: 30 },
        { zone: "Asia/Seoul" },
      );
      expect(localAdapter.getHour(dt0)).toBe(0);
    });
  });
});
