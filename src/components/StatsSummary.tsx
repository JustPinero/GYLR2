import { View, Text, StyleSheet } from 'react-native';
import { TimeAllocation, TimePeriod } from '../types';
import { getCategoryInfo } from '../services/categorization';
import { formatHoursFromMinutes } from '../utils/timeCalculations';
import { colors } from '../constants/colors';

interface StatsSummaryProps {
  totalMinutes: number;
  topCategory: TimeAllocation | null;
  bottomCategory: TimeAllocation | null;
  timePeriod: TimePeriod;
  eventCount: number;
}

const periodLabels: Record<TimePeriod, string> = {
  day: "Today's",
  week: "This Week's",
  month: "This Month's",
  year: "This Year's",
};

export function StatsSummary({
  totalMinutes,
  topCategory,
  bottomCategory,
  timePeriod,
  eventCount,
}: StatsSummaryProps): React.JSX.Element {
  const topInfo = topCategory ? getCategoryInfo(topCategory.category) : null;
  const bottomInfo = bottomCategory ? getCategoryInfo(bottomCategory.category) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 {periodLabels[timePeriod]} Summary</Text>

      <View style={styles.divider} />

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatHoursFromMinutes(totalMinutes)}
          </Text>
          <Text style={styles.statLabel}>Total Tracked</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{eventCount}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
      </View>

      {topCategory && bottomCategory && topCategory.category !== bottomCategory.category && (
        <>
          <View style={styles.divider} />

          <View style={styles.categoryStats}>
            <View style={styles.categoryStatItem}>
              <Text style={styles.categoryStatLabel}>Most Time</Text>
              <View style={styles.categoryStatValue}>
                <Text style={styles.categoryIcon}>{topInfo?.icon}</Text>
                <Text style={[styles.categoryName, { color: topInfo?.color }]}>
                  {topInfo?.label}
                </Text>
                <Text style={styles.categoryPercent}>
                  {topCategory.percentage}%
                </Text>
              </View>
            </View>

            <View style={styles.categoryStatItem}>
              <Text style={styles.categoryStatLabel}>Least Time</Text>
              <View style={styles.categoryStatValue}>
                <Text style={styles.categoryIcon}>{bottomInfo?.icon}</Text>
                <Text style={[styles.categoryName, { color: bottomInfo?.color }]}>
                  {bottomInfo?.label}
                </Text>
                <Text style={styles.categoryPercent}>
                  {bottomCategory.percentage}%
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  categoryStats: {
    gap: 12,
  },
  categoryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryStatLabel: {
    fontSize: 12,
    color: colors.textMuted,
    width: 70,
  },
  categoryStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
  },
  categoryPercent: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textSecondary,
    width: 35,
    textAlign: 'right',
  },
});
