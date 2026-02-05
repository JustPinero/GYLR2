import { useMemo } from 'react';
import { useAppSelector } from './useRedux';
import { selectAllEvents } from '../store/eventsSlice';
import { TimeAllocation } from '../types';
import {
  calculateTimeAllocations,
  getTotalMinutes,
  getTopCategory,
  getBottomCategory,
  hasEnoughData,
} from '../utils/timeCalculations';

export interface UseTimeAllocationResult {
  allocations: TimeAllocation[];
  totalMinutes: number;
  topCategory: TimeAllocation | null;
  bottomCategory: TimeAllocation | null;
  isEmpty: boolean;
  categorizedEventCount: number;
}

/**
 * Hook for computing time allocations from events
 * Memoized for performance
 */
export function useTimeAllocation(): UseTimeAllocationResult {
  const events = useAppSelector(selectAllEvents);

  return useMemo(() => {
    const allocations = calculateTimeAllocations(events);
    const totalMinutes = getTotalMinutes(events);
    const topCategory = getTopCategory(allocations);
    const bottomCategory = getBottomCategory(allocations);
    const isEmpty = !hasEnoughData(events);
    const categorizedEventCount = events.filter(
      (e) => e.category !== 'uncategorized'
    ).length;

    return {
      allocations,
      totalMinutes,
      topCategory,
      bottomCategory,
      isEmpty,
      categorizedEventCount,
    };
  }, [events]);
}
