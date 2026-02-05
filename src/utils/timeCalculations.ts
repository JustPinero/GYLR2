import { CategorizedEvent, Category, TimeAllocation } from '../types';
import { getDurationMinutes } from './dateUtils';

/**
 * Calculate time allocations from categorized events
 */
export function calculateTimeAllocations(
  events: CategorizedEvent[]
): TimeAllocation[] {
  // Group events by category and sum durations
  const categoryMinutes = new Map<Category, number>();
  const categoryCounts = new Map<Category, number>();

  events.forEach((event) => {
    // Skip uncategorized events
    if (event.category === Category.UNCATEGORIZED) return;

    const duration = getDurationMinutes(event.startTime, event.endTime);
    const currentMinutes = categoryMinutes.get(event.category) ?? 0;
    const currentCount = categoryCounts.get(event.category) ?? 0;

    categoryMinutes.set(event.category, currentMinutes + duration);
    categoryCounts.set(event.category, currentCount + 1);
  });

  // Calculate total minutes (excluding uncategorized)
  const totalMinutes = Array.from(categoryMinutes.values()).reduce(
    (sum, mins) => sum + mins,
    0
  );

  // Build allocations array
  const allocations: TimeAllocation[] = [];
  const categories: Category[] = [
    Category.WORK,
    Category.PLAY,
    Category.HEALTH,
    Category.ROMANCE,
    Category.STUDY,
  ];

  for (const category of categories) {
    const minutes = categoryMinutes.get(category) ?? 0;
    const count = categoryCounts.get(category) ?? 0;
    const percentage =
      totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;

    allocations.push({
      category,
      totalMinutes: minutes,
      percentage,
      eventCount: count,
    });
  }

  // Sort by percentage (highest first)
  return allocations.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Get total minutes from all categorized events
 */
export function getTotalMinutes(events: CategorizedEvent[]): number {
  return events
    .filter((e) => e.category !== Category.UNCATEGORIZED)
    .reduce((sum, event) => {
      return sum + getDurationMinutes(event.startTime, event.endTime);
    }, 0);
}

/**
 * Get the category with the most time
 */
export function getTopCategory(
  allocations: TimeAllocation[]
): TimeAllocation | null {
  const filtered = allocations.filter((a) => a.totalMinutes > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((max, curr) =>
    curr.totalMinutes > max.totalMinutes ? curr : max
  );
}

/**
 * Get the category with the least time (excluding zero)
 */
export function getBottomCategory(
  allocations: TimeAllocation[]
): TimeAllocation | null {
  const filtered = allocations.filter((a) => a.totalMinutes > 0);
  if (filtered.length === 0) return null;
  return filtered.reduce((min, curr) =>
    curr.totalMinutes < min.totalMinutes ? curr : min
  );
}

/**
 * Format minutes as hours string (e.g., "12.5 hrs" or "45 min")
 */
export function formatHoursFromMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = minutes / 60;
  if (hours === Math.floor(hours)) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  return `${hours.toFixed(1)} hrs`;
}

/**
 * Get count of categorized events (excluding uncategorized)
 */
export function getCategorizedEventCount(events: CategorizedEvent[]): number {
  return events.filter((e) => e.category !== Category.UNCATEGORIZED).length;
}

/**
 * Check if there's enough data to show the chart
 */
export function hasEnoughData(events: CategorizedEvent[]): boolean {
  return getCategorizedEventCount(events) > 0;
}
