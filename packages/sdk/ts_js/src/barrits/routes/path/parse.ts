import type { PathParts } from "../../shared";

export const parsePath = (value: string): PathParts => {
  const [pathname, search = ""] = value.split("?");
  const segments = pathname.split("/").map((segment) => segment.trim()).filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(search));

  return {
    segments,
    query,
  };
};