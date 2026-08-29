import { TIER_THRESHOLDS } from "../config/loyalty";
import type { TierName } from "../types/loyalty";

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function tierForPoints(lifetimePoints: number): TierName {
  let result: TierName = "Bronze";
  for (const t of TIER_THRESHOLDS) {
    if (lifetimePoints >= t.min) result = t.tier;
  }
  return result;
}

export function nextTierInfo(
  lifetimePoints: number,
): { next: TierName | null; remaining: number; pct: number } {
  const idx = TIER_THRESHOLDS.findIndex((t) => t.tier === tierForPoints(lifetimePoints));
  const next = TIER_THRESHOLDS[idx + 1];
  if (!next) return { next: null, remaining: 0, pct: 100 };
  const current = TIER_THRESHOLDS[idx];
  const span = next.min - current.min;
  const progressed = lifetimePoints - current.min;
  return {
    next: next.tier,
    remaining: next.min - lifetimePoints,
    pct: Math.max(0, Math.min(100, Math.round((progressed / span) * 100))),
  };
}

export function pad(str: string | number, len: number): string {
  return String(str).padEnd(len, " ").slice(0, Math.max(len, String(str).length));
}

export function padL(str: string | number, len: number): string {
  return String(str).padStart(len, " ");
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function mergeSort<T>(items: T[], compare: (a: T, b: T) => number): T[] {
  if (items.length <= 1) return items;
  const mid = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, mid), compare);
  const right = mergeSort(items.slice(mid), compare);
  const merged: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (compare(left[i], right[j]) <= 0) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

export function binarySearchById<T extends { id: string }>(sortedById: T[], id: string): T | null {
  let lo = 0;
  let hi = sortedById.length - 1;
  const target = id.trim().toUpperCase();
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midId = sortedById[mid].id.toUpperCase();
    if (midId === target) return sortedById[mid];
    if (midId < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return null;
}

export function filterItems<T>(items: T[], predicates: Array<(item: T) => boolean>): T[] {
  return items.filter((item) => predicates.every((p) => p(item)));
}

