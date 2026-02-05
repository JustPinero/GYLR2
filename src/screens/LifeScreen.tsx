import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch, useTimeAllocation } from '../hooks';
import {
  selectTimePeriod,
  selectJudgePersonality,
  selectAccessToken,
  setTimePeriod,
} from '../store/settingsSlice';
import { fetchCalendarEvents, selectEventsLoading } from '../store/eventsSlice';
import {
  TimePeriodSelector,
  TimeAllocationChart,
  CategoryLegend,
  StatsSummary,
  JudgmentCard,
  PixelButton,
} from '../components';
import { TimePeriod } from '../types';
import { colors } from '../constants/colors';

export function LifeScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const timePeriod = useAppSelector(selectTimePeriod);
  const personality = useAppSelector(selectJudgePersonality);
  const accessToken = useAppSelector(selectAccessToken);
  const loading = useAppSelector(selectEventsLoading);

  const {
    allocations,
    totalMinutes,
    topCategory,
    bottomCategory,
    isEmpty,
    categorizedEventCount,
  } = useTimeAllocation();

  // Placeholder state for judgment (will be replaced in Phase 6)
  const [judgment, setJudgment] = useState<string | null>(null);
  const [judgmentLoading, setJudgmentLoading] = useState(false);

  const handleTimePeriodChange = (period: TimePeriod): void => {
    dispatch(setTimePeriod(period));
  };

  const handleRefresh = useCallback(() => {
    if (accessToken) {
      dispatch(fetchCalendarEvents({ accessToken, timePeriod }));
    }
  }, [dispatch, accessToken, timePeriod]);

  const handleRequestJudgment = (): void => {
    // Placeholder - will be replaced with Claude API call in Phase 6
    setJudgmentLoading(true);
    setTimeout(() => {
      setJudgment(
        "Looks like you're spending most of your time on work. Classic. " +
        "Maybe consider that 'Play' category once in a while? Just a thought."
      );
      setJudgmentLoading(false);
    }, 1500);
  };

  const handleGoToCalendar = (): void => {
    navigation.navigate('Calendar' as never);
  };

  // Empty state when no categorized events
  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Life Panel</Text>
        </View>

        <View style={styles.selectorContainer}>
          <TimePeriodSelector
            selected={timePeriod}
            onSelect={handleTimePeriodChange}
          />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Data Yet</Text>
          <Text style={styles.emptySubtitle}>
            Categorize your calendar events to see{'\n'}
            your time breakdown and get roasted.
          </Text>
          <View style={styles.emptyButton}>
            <PixelButton
              title="Go to Calendar"
              onPress={handleGoToCalendar}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Life Panel</Text>
        <Text style={styles.headerSubtitle}>
          How you spend your time
        </Text>
      </View>

      {/* Time Period Selector */}
      <View style={styles.selectorContainer}>
        <TimePeriodSelector
          selected={timePeriod}
          onSelect={handleTimePeriodChange}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Pie Chart */}
        <View style={styles.chartContainer}>
          <TimeAllocationChart
            allocations={allocations}
            totalMinutes={totalMinutes}
            size={200}
          />
        </View>

        {/* Category Legend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Breakdown</Text>
          <CategoryLegend allocations={allocations} />
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <StatsSummary
            totalMinutes={totalMinutes}
            topCategory={topCategory}
            bottomCategory={bottomCategory}
            timePeriod={timePeriod}
            eventCount={categorizedEventCount}
          />
        </View>

        {/* Judgment Card */}
        <View style={styles.section}>
          <JudgmentCard
            judgment={judgment}
            loading={judgmentLoading}
            onRequestJudgment={handleRequestJudgment}
            personality={personality}
            disabled={isEmpty}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 8,
  },
});
