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

export interface WorkJobEntry {
  work: WorkItem;
  index: number;
  startTs: number;
  endTs: number;
  startPct: number;
  endPct: number;
}

export interface WorkPeriod {
  startTs: number;
  endTs: number;
  startPct: number;
  endPct: number;
  activeJobs: WorkJobEntry[];
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
/*  Work period computation (merge overlapping jobs into periods)       */
/* ------------------------------------------------------------------ */

/**
 * Merges overlapping/adjacent work items into contiguous "work periods".
 * Each period represents a time span where at least one job is active,
 * and carries the list of all jobs active during that span.
 */
export function computeWorkPeriods(
  workItems: WorkItem[],
  range: TimelineRange,
  now: number,
): WorkPeriod[] {
  if (workItems.length === 0) return [];

  // Build entries with timestamps
  const entries = workItems.map((work, index) => {
    const startTs = parseDateTs(work.start_date) ?? range.start;
    const endTs = work.end_date
      ? (parseDateTs(work.end_date) ?? range.end)
      : now;
    return { work, index, startTs, endTs };
  });

  // Sort by start time
  const sorted = [...entries].sort((a, b) => a.startTs - b.startTs);

  // Merge overlapping intervals
  const periods: Array<{
    startTs: number;
    endTs: number;
    jobs: typeof sorted;
  }> = [];

  for (const entry of sorted) {
    const last = periods[periods.length - 1];
    if (last && entry.startTs <= last.endTs) {
      // Overlapping — extend period and add job
      last.endTs = Math.max(last.endTs, entry.endTs);
      last.jobs.push(entry);
    } else {
      // New period
      periods.push({
        startTs: entry.startTs,
        endTs: entry.endTs,
        jobs: [entry],
      });
    }
  }

  // Convert to WorkPeriod with percentage positions
  return periods.map((p) => ({
    startTs: p.startTs,
    endTs: p.endTs,
    startPct: r(dateToPercent(p.startTs, range)),
    endPct: r(dateToPercent(p.endTs, range)),
    activeJobs: p.jobs.map((j) => ({
      work: j.work,
      index: j.index,
      startTs: j.startTs,
      endTs: j.endTs,
      startPct: r(dateToPercent(j.startTs, range)),
      endPct: r(dateToPercent(j.endTs, range)),
    })),
  }));
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
