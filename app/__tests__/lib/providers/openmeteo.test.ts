/**
 * __tests__/lib/providers/openmeteo.test.ts
 *
 * Unit tests for OpenMeteoProvider.
 * Verifies response mapping, weather code translation, rounding,
 * retry behaviour, and error handling — without hitting the network.
 */

import { OpenMeteoProvider } from "@/app/lib/providers/openmeteo";

const NAIROBI_LAT = -1.2921;
const NAIROBI_LON = 36.8219;
const NAIROBI_CITY = "Nairobi";

const HOURLY_SLOT_COUNT = 24;

function buildCurrentWeatherResponse(overrides: Record<string, unknown> = {}) {
  return {
    current: {
      temperature_2m: 24.6,
      apparent_temperature: 23.1,
      relative_humidity_2m: 65,
      wind_speed_10m: 12.3,
      weather_code: 1,
      ...overrides,
    },
  };
}

function buildHourlyForecastResponse(slotCount: number = HOURLY_SLOT_COUNT) {
  return {
    hourly: {
      time: Array.from(
        { length: slotCount },
        (_, i) => `2026-06-17T${String(i).padStart(2, "0")}:00`,
      ),
      temperature_2m: Array.from({ length: slotCount }, (_, i) => 20 + i * 0.5),
      weather_code: Array.from({ length: slotCount }, () => 0),
    },
  };
}

function mockFetchSuccess(body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response);
}

function mockFetchFailure(status: number, body = "Error") {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    text: async () => body,
  } as unknown as Response);
}

function mockFetchNetworkError() {
  global.fetch = jest.fn().mockRejectedValue(new Error("Connect timeout"));
}

describe("OpenMeteoProvider", () => {
  let provider: OpenMeteoProvider;

  beforeEach(() => {
    provider = new OpenMeteoProvider();
jest.spyOn(global, "setTimeout").mockImplementation((fn: TimerHandler) => {
  if (typeof fn === "function") fn();
  return 0 as unknown as ReturnType<typeof setTimeout>;
});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCurrentWeather", () => {
    it("maps Open-Meteo response to CurrentConditions correctly", async () => {
      mockFetchSuccess(buildCurrentWeatherResponse());

      const promise = provider.getCurrentWeather(
        NAIROBI_LAT,
        NAIROBI_LON,
        NAIROBI_CITY,
      );
      jest.runAllTimers();
      const result = await promise;

      expect(result.cityName).toBe(NAIROBI_CITY);
      expect(result.temp).toBe(25); // 24.6 rounded
      expect(result.feelsLike).toBe(23); // 23.1 rounded
      expect(result.humidity).toBe(65);
      expect(result.windSpeed).toBe(12); // 12.3 rounded
      expect(result.aiSummary).toBe("");
    });

    it("rounds temperature values rather than truncating", async () => {
      mockFetchSuccess(buildCurrentWeatherResponse({ temperature_2m: 24.5 }));

      const promise = provider.getCurrentWeather(
        NAIROBI_LAT,
        NAIROBI_LON,
        NAIROBI_CITY,
      );
      jest.runAllTimers();
      const result = await promise;

      expect(result.temp).toBe(25);
    });

    it("throws when upstream returns a non-ok status", async () => {
      mockFetchFailure(503);

      const promise = provider.getCurrentWeather(
        NAIROBI_LAT,
        NAIROBI_LON,
        NAIROBI_CITY,
      );
      jest.runAllTimers();

      await expect(promise).rejects.toThrow(
        "Open-Meteo current weather failed: 503",
      );
    });

    it("retries on network error and eventually throws", async () => {
      mockFetchNetworkError();

      const promise = provider.getCurrentWeather(
        NAIROBI_LAT,
        NAIROBI_LON,
        NAIROBI_CITY,
      );
      jest.runAllTimers();

      await expect(promise).rejects.toThrow(/failed after/);
      expect(global.fetch).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    });
  });

  describe("getCurrentWeather — weather code mapping", () => {
    const cases: [number, string][] = [
      [0, "Clear sky"],
      [1, "Partly cloudy"],
      [3, "Partly cloudy"],
      [10, "Foggy"],
      [51, "Rainy"],
      [71, "Snowy"],
      [95, "Thunderstorm"],
    ];

    test.each(cases)(
      "weather code %i maps to '%s'",
      async (code, expectedCondition) => {
        mockFetchSuccess(buildCurrentWeatherResponse({ weather_code: code }));

        const promise = provider.getCurrentWeather(
          NAIROBI_LAT,
          NAIROBI_LON,
          NAIROBI_CITY,
        );
        jest.runAllTimers();
        const result = await promise;

        expect(result.condition).toBe(expectedCondition);
      },
    );
  });

  describe("getHourlyForecast", () => {
    it("returns the correct number of hourly slots", async () => {
      mockFetchSuccess(buildHourlyForecastResponse(48));

      const promise = provider.getHourlyForecast(NAIROBI_LAT, NAIROBI_LON);
      jest.runAllTimers();
      const result = await promise;

      expect(result).toHaveLength(HOURLY_SLOT_COUNT);
    });

    it("maps each slot to the correct shape", async () => {
      mockFetchSuccess(buildHourlyForecastResponse());

      const promise = provider.getHourlyForecast(NAIROBI_LAT, NAIROBI_LON);
      jest.runAllTimers();
      const result = await promise;

      expect(result[0]).toMatchObject({
        time: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        temp: expect.any(Number),
        condition: "Clear sky",
      });
    });

    it("throws when upstream returns a non-ok status", async () => {
      mockFetchFailure(429);

      const promise = provider.getHourlyForecast(NAIROBI_LAT, NAIROBI_LON);
      jest.runAllTimers();

      await expect(promise).rejects.toThrow(
        "Open-Meteo hourly forecast failed: 429",
      );
    });

    it("retries on network error and eventually throws", async () => {
      mockFetchNetworkError();

      await expect(
        provider.getCurrentWeather(NAIROBI_LAT, NAIROBI_LON, NAIROBI_CITY),
      ).rejects.toThrow(/failed after/);

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });
});
