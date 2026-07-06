import { toIsoString, toRelativeTime } from "@zuccadev-labs/barrits";

export const createDatetimeExamples = () => {
  const iso = toIsoString(new Date("2026-07-03"));
  const relative = toRelativeTime(new Date(Date.now() - 3600000));
  return { toIsoString: iso, toRelativeTime: relative };
};
