import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { TimeAllocation, Category } from '../types';
import { formatHoursFromMinutes } from '../utils/timeCalculations';
import { colors } from '../constants/colors';

interface TimeAllocationChartProps {
  allocations: TimeAllocation[];
  totalMinutes: number;
  size?: number;
}

// Map categories to colors
const categoryColors: Record<Category, string> = {
  [Category.WORK]: colors.work,
  [Category.PLAY]: colors.play,
  [Category.HEALTH]: colors.health,
  [Category.ROMANCE]: colors.romance,
  [Category.STUDY]: colors.study,
  [Category.UNCATEGORIZED]: colors.uncategorized,
};

/**
 * Convert polar coordinates to cartesian
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Create donut segment path
 */
function createDonutSegment(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  // Handle full circle case
  if (endAngle - startAngle >= 359.99) {
    return `
      M ${cx - outerRadius} ${cy}
      A ${outerRadius} ${outerRadius} 0 1 0 ${cx + outerRadius} ${cy}
      A ${outerRadius} ${outerRadius} 0 1 0 ${cx - outerRadius} ${cy}
      M ${cx - innerRadius} ${cy}
      A ${innerRadius} ${innerRadius} 0 1 1 ${cx + innerRadius} ${cy}
      A ${innerRadius} ${innerRadius} 0 1 1 ${cx - innerRadius} ${cy}
      Z
    `;
  }

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}
    L ${innerEnd.x} ${innerEnd.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}
    Z
  `;
}

export function TimeAllocationChart({
  allocations,
  totalMinutes,
  size = 220,
}: TimeAllocationChartProps): React.JSX.Element {
  // Filter out categories with no time
  const chartData = allocations.filter((a) => a.totalMinutes > 0);

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={[styles.emptyChart, { width: size, height: size }]}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      </View>
    );
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 10;
  const innerRadius = outerRadius * 0.6;
  const gap = 2; // Gap between segments in degrees

  // Calculate angles for each segment
  let currentAngle = 0;
  const segments = chartData.map((allocation) => {
    const sweepAngle = (allocation.totalMinutes / totalMinutes) * 360 - gap;
    const segment = {
      ...allocation,
      startAngle: currentAngle,
      endAngle: currentAngle + sweepAngle,
      color: categoryColors[allocation.category],
    };
    currentAngle += sweepAngle + gap;
    return segment;
  });

  const centerText = formatHoursFromMinutes(totalMinutes);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G>
          {segments.map((segment) => (
            <Path
              key={segment.category}
              d={createDonutSegment(
                centerX,
                centerY,
                outerRadius,
                innerRadius,
                segment.startAngle,
                segment.endAngle
              )}
              fill={segment.color}
            />
          ))}
        </G>

        {/* Center text */}
        <SvgText
          x={centerX}
          y={centerY - 6}
          textAnchor="middle"
          fontSize={20}
          fontWeight="bold"
          fill={colors.textPrimary}
        >
          {centerText}
        </SvgText>
        <SvgText
          x={centerX}
          y={centerY + 14}
          textAnchor="middle"
          fontSize={11}
          fill={colors.textMuted}
        >
          tracked
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChart: {
    borderRadius: 999,
    backgroundColor: colors.bgSecondary,
    borderWidth: 3,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
