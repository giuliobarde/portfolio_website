import type { RichTextField } from "@prismicio/client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EducationItem {
  degree?: string;
  field_of_study?: string;
  school?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  gpa?: string;
  description?: RichTextField;
  coursework?: string;
  achievements?: RichTextField;
}

export interface WorkItem {
  company?: string;
  position?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: RichTextField;
  achievements?: RichTextField;
  technologies?: string;
}

export interface TimelineRange {
  start: number;
  end: number;
}

export interface YearMarker {
  year: number;
  percent: number;
}

export interface MonthMarker {
  percent: number;
  month: number;
}

export interface TimelinePosition {
  startPct: number;
  endPct: number;
  midPct: number;
  widthPct: number;
}

export interface BranchLayout {
  work: WorkItem;
  index: number; // original index in the work items array
  laneIndex: number; // 0 = closest to main line
  startPct: number;
  endPct: number;
  midPct: number;
  widthPct: number;
}

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

/**
 * Stable "now" timestamp — rounded to the 1st of the current UTC month.
 * Prevents React hydration mismatch caused by Date.now() differing
 * between SSR and client.
 */
export function getStableNow(): number {
  const d = new Date();
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

export function parseDateTs(date: string | undefined): number | null {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d.getTime();
}

export function formatDate(date: string | undefined): string {
  if (!date) return "";
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toLowerCase();
}

export function formatDuration(start?: string, end?: string): string {
  const s = formatDate(start);
  const e = end ? formatDate(end) : "present";
  if (!s && !e) return "";
  return `${s} — ${e}`;
}

/* ------------------------------------------------------------------ */
/*  Timeline range & markers                                           */
/* ------------------------------------------------------------------ */

export function getTimelineRange(
  entries: Array<{ start_date?: string; end_date?: string }>,
  now: number,
): TimelineRange {
  let minDate = Infinity;
  let maxDate = -Infinity;
  for (const item of entries) {
    const s = parseDateTs(item.start_date);
    const e = item.end_date ? parseDateTs(item.end_date) : now;
    if (s !== null) minDate = Math.min(minDate, s);
    if (e !== null) maxDate = Math.max(maxDate, e);
  }
  if (minDate === Infinity) minDate = now - 5 * 365.25 * 86400000;
  if (maxDate === -Infinity) maxDate = now;

  const sd = new Date(minDate);
  const ed = new Date(maxDate);
  const paddedStart = new Date(
    sd.getFullYear(),
    sd.getMonth() - 1,
    1,
  ).getTime();
  const paddedEnd = new Date(
    ed.getFullYear(),
    ed.getMonth() + 4,
    1,
  ).getTime();
  return { start: paddedStart, end: paddedEnd };
}

/** Round to 4 decimal places for SSR/client consistency */
const r = (n: number) => Math.round(n * 10000) / 10000;

export function dateToPercent(ts: number, range: TimelineRange): number {
  if (range.end === range.start) return 50;
  const raw = ((ts - range.start) / (range.end - range.start)) * 100;
  return r(raw);
}

export function generateTimeMarkers(range: TimelineRange) {
  const startDate = new Date(range.start);
  const endDate = new Date(range.end);
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const years: YearMarker[] = [];
  const months: MonthMarker[] = [];

  for (let y = startYear; y <= endYear + 1; y++) {
    for (let m = 0; m < 12; m++) {
      const ts = new Date(y, m, 1).getTime();
      if (ts < range.start || ts > range.end) continue;
      const pct = dateToPercent(ts, range);
      if (m === 0) {
        years.push({ year: y, percent: pct });
      } else {
        months.push({ percent: pct, month: m });
      }
    }
  }
  return { years, months };
}

/* ------------------------------------------------------------------ */
/*  Position computations                                              */
/* ------------------------------------------------------------------ */

export function computePositions(
  items: Array<{ start_date?: string; end_date?: string }>,
  range: TimelineRange,
  now: number,
): TimelinePosition[] {
  return items.map((item) => {
    const startTs = parseDateTs(item.start_date) ?? range.start;
    const endTs = item.end_date
      ? (parseDateTs(item.end_date) ?? range.end)
      : now;
    const startPct = r(dateToPercent(startTs, range));
    const endPct = r(dateToPercent(endTs, range));
    const midPct = r((startPct + endPct) / 2);
    return {
      startPct,
      endPct,
      midPct,
      widthPct: r(endPct - startPct),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Branch lane assignment (greedy algorithm)                          */
/* ------------------------------------------------------------------ */

/**
 * Assigns each work entry to a "lane" (0-based) for branching below
 * the main education line. Non-overlapping jobs reuse lanes;
 * concurrent jobs get separate lanes.
 */
export function computeBranchLanes(
  workItems: WorkItem[],
  range: TimelineRange,
  now: number,
): BranchLayout[] {
  // Create entries with timestamps and original indices
  const entries = workItems.map((work, index) => {
    const startTs = parseDateTs(work.start_date) ?? range.start;
    const endTs = work.end_date
      ? (parseDateTs(work.end_date) ?? range.end)
      : now;
    return { work, index, startTs, endTs };
  });

  // Sort by start time
  const sorted = [...entries].sort((a, b) => a.startTs - b.startTs);

  // Greedy lane assignment
  const laneEndTimes: number[] = []; // endTs of the last entry on each lane

  const layouts: BranchLayout[] = sorted.map((entry) => {
    // Find lowest lane that's free (previous occupant ended before this starts)
    let assignedLane = -1;
    for (let i = 0; i < laneEndTimes.length; i++) {
      if (laneEndTimes[i] <= entry.startTs) {
        assignedLane = i;
        break;
      }
    }

    if (assignedLane === -1) {
      // No free lane — create a new one
      assignedLane = laneEndTimes.length;
      laneEndTimes.push(entry.endTs);
    } else {
      laneEndTimes[assignedLane] = entry.endTs;
    }

    const startPct = r(dateToPercent(entry.startTs, range));
    const endPct = r(dateToPercent(entry.endTs, range));
    const midPct = r((startPct + endPct) / 2);

    return {
      work: entry.work,
      index: entry.index,
      laneIndex: assignedLane,
      startPct,
      endPct,
      midPct,
      widthPct: r(endPct - startPct),
    };
  });

  // Re-sort by original index for consistent rendering
  return layouts.sort((a, b) => a.index - b.index);
}

/* ------------------------------------------------------------------ */
/*  Rich text helper                                                   */
/* ------------------------------------------------------------------ */

export function hasRichText(field?: RichTextField): boolean {
  if (!field || !Array.isArray(field) || field.length === 0) return false;
  return field.some(
    (block) =>
      "text" in block &&
      typeof block.text === "string" &&
      block.text.trim() !== "",
  );
}
