import type { BannerConfig } from "../types/ad";

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Epoch milliseconds for a `startsAt` / `endsAt` value. A bare date means
 * the start or the end of that day in the visitor's time zone (`Date.parse`
 * would read it as UTC midnight). Anything else goes through `Date.parse`.
 */
function parseBound(value: string, edge: "start" | "end"): number {
  const match = DATE_ONLY.exec(value);
  if (!match) return Date.parse(value);
  const [, year, month, day] = match;
  if (edge === "start") return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  return new Date(Number(year), Number(month) - 1, Number(day) + 1).getTime() - 1;
}

/**
 * Whether `now` falls inside the ad's `startsAt` / `endsAt` window. An ad
 * with neither is always in. A value that doesn't parse is ignored.
 */
export function isInWindow(config: BannerConfig, now: number): boolean {
  if (config.startsAt && now < parseBound(config.startsAt, "start")) return false;
  if (config.endsAt && now > parseBound(config.endsAt, "end")) return false;
  return true;
}
