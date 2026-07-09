import { toIsoString, toRelativeTime } from "@zuccadev-labs/barrits";

/**
 * [EN] Datetime manipulation examples for Bun runtime.
 * Demonstrates ISO 8601 formatting and locale-aware relative time.
 * [ES] Ejemplos de manipulación de fechas para runtime Bun.
 */

export const createDatetimeExamples = () => {
  const now = new Date();
  const iso = toIsoString(now);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const relative = toRelativeTime(twoHoursAgo);

  return {
    toIsoString: iso,
    toRelativeTime: relative,
  };
};
