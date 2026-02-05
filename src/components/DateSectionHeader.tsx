import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface DateSectionHeaderProps {
  date: Date;
  eventCount: number;
  isToday?: boolean;
}

export function DateSectionHeader({
  date,
  eventCount,
  isToday = false,
}: DateSectionHeaderProps): React.JSX.Element {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.container, isToday && styles.containerToday]}>
      <View style={styles.dateInfo}>
        <Text style={styles.icon}>📅</Text>
        <View>
          <Text style={[styles.dayName, isToday && styles.todayText]}>
            {isToday ? 'Today' : dayName}
          </Text>
          <Text style={styles.monthDay}>
            {isToday ? `${dayName}, ${monthDay}` : monthDay}
          </Text>
        </View>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>
          {eventCount} event{eventCount !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgSecondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
  },
  containerToday: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '15',
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  dayName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  todayText: {
    color: colors.accent,
  },
  monthDay: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: colors.bgTertiary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  countText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
