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
    borderRadius: 2,
    borderWidth: 3,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: colors.border,
  },
  buttonFirst: {
    // No special radius for pixel style
  },
  buttonLast: {
    borderRightWidth: 0,
  },
  buttonSelected: {
    backgroundColor: colors.accent,
    // Pixel-style inset effect
    borderTopColor: '#FFE066',
    borderLeftColor: '#FFE066',
    borderBottomColor: '#B8960D',
    borderRightColor: '#B8960D',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonTextSelected: {
    color: colors.bgPrimary,
  },
});
