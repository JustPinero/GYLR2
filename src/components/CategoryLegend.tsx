import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TimeAllocation, Category } from '../types';
import { getCategoryInfo } from '../services/categorization';
import { formatHoursFromMinutes } from '../utils/timeCalculations';
import { colors } from '../constants/colors';

interface CategoryLegendProps {
  allocations: TimeAllocation[];
  onCategoryPress?: (category: Category) => void;
}

export function CategoryLegend({
  allocations,
  onCategoryPress,
}: CategoryLegendProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {allocations.map((allocation) => (
        <LegendItem
          key={allocation.category}
          allocation={allocation}
          onPress={onCategoryPress ? () => onCategoryPress(allocation.category) : undefined}
        />
      ))}
    </View>
  );
}

interface LegendItemProps {
  allocation: TimeAllocation;
  onPress?: () => void;
}

function LegendItem({ allocation, onPress }: LegendItemProps): React.JSX.Element {
  const { icon, label, color } = getCategoryInfo(allocation.category);
  const hasTime = allocation.totalMinutes > 0;

  const content = (
    <View style={[styles.item, !hasTime && styles.itemEmpty]}>
      <View style={styles.leftSection}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.label, !hasTime && styles.labelEmpty]}>
          {label}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.percentage, !hasTime && styles.valueEmpty]}>
          {allocation.percentage}%
        </Text>
        <Text style={[styles.hours, !hasTime && styles.valueEmpty]}>
          {formatHoursFromMinutes(allocation.totalMinutes)}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    borderWidth: 3,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  itemEmpty: {
    opacity: 0.5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  labelEmpty: {
    color: colors.textMuted,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
    width: 45,
    textAlign: 'right',
  },
  hours: {
    fontSize: 13,
    color: colors.textSecondary,
    width: 70,
    textAlign: 'right',
  },
  valueEmpty: {
    color: colors.textMuted,
  },
});
