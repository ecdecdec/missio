import { PROGRAMS } from "@/lib/programs-data";

// Counted from the program database so the landing page never shows made-up numbers.
export const SITE_STATS = {
  programs: PROGRAMS.length,
  countries: new Set(PROGRAMS.map((p) => p.country)).size,
  organizations: new Set(PROGRAMS.map((p) => p.organization)).size,
};
