import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimePeriod } from '../types';
import { colors } from '../constants/colors';

interface TimePeriodSelectorProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

export function TimePeriodSelector({
  selected,
  onSelect,
}: TimePeriodSelectorProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {periods.map((period, index) => {
        const isSelected = selected === period.value;
        const isFirst = index === 0;
        const isLast = index === periods.length - 1;

        return (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.button,
              isSelected && styles.buttonSelected,
              isFirst && styles.buttonFirst,
              isLast && styles.buttonLast,
            ]}
            onPress={() => onSelect(period.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                isSelected && styles.buttonTextSelected,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  buttonFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  buttonLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderRightWidth: 0,
  },
  buttonSelected: {
    backgroundColor: colors.accent,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonTextSelected: {
    color: colors.bgPrimary,
    fontWeight: 'bold',
  },
});
