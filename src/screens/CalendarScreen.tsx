import { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks';
import {
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
  fetchCalendarEvents,
} from '../store/eventsSlice';
import {
  selectAccessToken,
  selectTimePeriod,
} from '../store/settingsSlice';
import { CategorizedEvent, Category } from '../types';
import { formatDateShort, formatTime, formatDuration, getDurationMinutes } from '../utils/dateUtils';
import { colors } from '../constants/colors';

// Category color mapping
const categoryColors: Record<Category, string> = {
  [Category.WORK]: colors.work,
  [Category.PLAY]: colors.play,
  [Category.HEALTH]: colors.health,
  [Category.ROMANCE]: colors.romance,
  [Category.STUDY]: colors.study,
  [Category.UNCATEGORIZED]: colors.uncategorized,
};

export function CalendarScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectAllEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const accessToken = useAppSelector(selectAccessToken);
  const timePeriod = useAppSelector(selectTimePeriod);

  const loadEvents = useCallback(() => {
    if (accessToken) {
      dispatch(fetchCalendarEvents({ accessToken, timePeriod }));
    }
  }, [dispatch, accessToken, timePeriod]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const renderEvent = ({ item }: { item: CategorizedEvent }): React.JSX.Element => (
    <EventCard event={item} />
  );

  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>No Events</Text>
      <Text style={styles.emptySubtitle}>
        No events found for this {timePeriod}.{'\n'}
        Pull down to refresh.
      </Text>
    </View>
  );

  const renderError = (): React.JSX.Element => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (error && events.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Events</Text>
        <Text style={styles.headerSubtitle}>
          {events.length} event{events.length !== 1 ? 's' : ''} this {timePeriod}
        </Text>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          events.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadEvents}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

interface EventCardProps {
  event: CategorizedEvent;
}

function EventCard({ event }: EventCardProps): React.JSX.Element {
  const categoryColor = categoryColors[event.category];
  const duration = getDurationMinutes(event.startTime, event.endTime);

  return (
    <View style={styles.eventCard}>
      <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {event.title}
        </Text>
        <View style={styles.eventDetails}>
          {event.isAllDay ? (
            <Text style={styles.eventTime}>All day</Text>
          ) : (
            <Text style={styles.eventTime}>
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </Text>
          )}
          <Text style={styles.eventDuration}>{formatDuration(duration)}</Text>
        </View>
        <Text style={styles.eventDate}>{formatDateShort(event.startTime)}</Text>
      </View>
      <View style={styles.categoryBadge}>
        <Text style={[styles.categoryText, { color: categoryColor }]}>
          {event.category.toUpperCase()}
        </Text>
        {!event.categoryConfirmed && (
          <Text style={styles.unconfirmedIndicator}>?</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
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
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#B8960D',
  },
  retryButtonText: {
    color: colors.bgPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryIndicator: {
    width: 6,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 12,
  },
  eventDuration: {
    fontSize: 12,
    color: colors.textMuted,
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  categoryBadge: {
    padding: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  unconfirmedIndicator: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
