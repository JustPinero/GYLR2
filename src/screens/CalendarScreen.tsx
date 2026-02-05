import { useEffect, useCallback, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../hooks';
import {
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
  selectEventsCreating,
  selectUncategorizedEvents,
  fetchCalendarEvents,
  updateEventCategory,
  createCalendarEvent,
} from '../store/eventsSlice';
import {
  selectAccessToken,
  selectTimePeriod,
  setTimePeriod,
} from '../store/settingsSlice';
import { saveMapping } from '../store/categoriesSlice';
import {
  CategoryPicker,
  UncategorizedBanner,
  CategoryBadge,
  TimePeriodSelector,
  DateSectionHeader,
  FloatingActionButton,
  AddEventModal,
} from '../components';
import type { EventFormData } from '../components';
import { CategorizedEvent, Category, TimePeriod } from '../types';
import { extractPattern } from '../services/categorization';
import {
  formatTime,
  formatDuration,
  getDurationMinutes,
  isToday,
  getDateKey,
} from '../utils/dateUtils';
import { colors } from '../constants/colors';

// Section type for SectionList
interface EventSection {
  date: string;
  displayDate: Date;
  isToday: boolean;
  data: CategorizedEvent[];
}

// Group events by date
function groupEventsByDate(events: CategorizedEvent[]): EventSection[] {
  const groups = new Map<string, CategorizedEvent[]>();

  events.forEach((event) => {
    const dateKey = getDateKey(event.startTime);
    const existing = groups.get(dateKey) ?? [];
    groups.set(dateKey, [...existing, event]);
  });

  return Array.from(groups.entries())
    .map(([dateKey, data]) => {
      const displayDate = new Date(dateKey + 'T12:00:00');
      return {
        date: dateKey,
        displayDate,
        isToday: isToday(displayDate),
        data: data.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
      };
    })
    .sort((a, b) => a.displayDate.getTime() - b.displayDate.getTime());
}

export function CalendarScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectAllEvents);
  const uncategorizedEvents = useAppSelector(selectUncategorizedEvents);
  const loading = useAppSelector(selectEventsLoading);
  const creating = useAppSelector(selectEventsCreating);
  const error = useAppSelector(selectEventsError);
  const accessToken = useAppSelector(selectAccessToken);
  const timePeriod = useAppSelector(selectTimePeriod);

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<CategorizedEvent | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Group events by date
  const sections = useMemo(() => groupEventsByDate(events), [events]);

  const loadEvents = useCallback(() => {
    if (accessToken) {
      dispatch(fetchCalendarEvents({ accessToken, timePeriod }));
    }
  }, [dispatch, accessToken, timePeriod]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Reset banner dismissed state when uncategorized count changes
  useEffect(() => {
    if (uncategorizedEvents.length > 0) {
      setBannerDismissed(false);
    }
  }, [uncategorizedEvents.length]);

  const handleTimePeriodChange = (period: TimePeriod): void => {
    dispatch(setTimePeriod(period));
  };

  const handleEventPress = (event: CategorizedEvent): void => {
    setSelectedEvent(event);
    setPickerVisible(true);
  };

  const handleCategorySelect = (category: Category, remember: boolean): void => {
    if (!selectedEvent) return;

    dispatch(updateEventCategory({
      eventId: selectedEvent.id,
      category,
    }));

    if (remember) {
      const pattern = extractPattern(selectedEvent.title);
      if (pattern) {
        dispatch(saveMapping({ pattern, category }));
      }
    }

    setPickerVisible(false);
    setSelectedEvent(null);
  };

  const handlePickerClose = (): void => {
    setPickerVisible(false);
    setSelectedEvent(null);
  };

  const handleBannerPress = (): void => {
    if (uncategorizedEvents.length > 0) {
      const firstUncategorized = uncategorizedEvents[0];
      if (firstUncategorized) {
        setSelectedEvent(firstUncategorized);
        setPickerVisible(true);
      }
    }
  };

  const handleBannerDismiss = (): void => {
    setBannerDismissed(true);
  };

  const handleAddPress = (): void => {
    setAddModalVisible(true);
  };

  const handleAddModalClose = (): void => {
    setAddModalVisible(false);
  };

  const handleAddEventSubmit = async (formData: EventFormData): Promise<void> => {
    if (!accessToken) {
      Alert.alert('Error', 'Not authenticated');
      return;
    }

    try {
      await dispatch(createCalendarEvent({
        accessToken,
        title: formData.title,
        description: formData.description || undefined,
        startTime: formData.startTime,
        endTime: formData.endTime,
        isAllDay: formData.isAllDay,
        category: formData.category,
      })).unwrap();

      setAddModalVisible(false);
      Alert.alert('Success', 'Event created successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const renderSectionHeader = ({ section }: { section: EventSection }): React.JSX.Element => (
    <DateSectionHeader
      date={section.displayDate}
      eventCount={section.data.length}
      isToday={section.isToday}
    />
  );

  const renderEvent = ({ item }: { item: CategorizedEvent }): React.JSX.Element => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  const renderEmptyState = (): React.JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>No Events</Text>
      <Text style={styles.emptySubtitle}>
        No events found for this {timePeriod}.{'\n'}
        Tap + to add a new event.
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Events</Text>
        <Text style={styles.headerSubtitle}>
          {events.length} event{events.length !== 1 ? 's' : ''} this {timePeriod}
        </Text>
      </View>

      {/* Time Period Selector */}
      <View style={styles.selectorContainer}>
        <TimePeriodSelector
          selected={timePeriod}
          onSelect={handleTimePeriodChange}
        />
      </View>

      {/* Uncategorized Banner */}
      {!bannerDismissed && (
        <UncategorizedBanner
          count={uncategorizedEvents.length}
          onPress={handleBannerPress}
          onDismiss={handleBannerDismiss}
        />
      )}

      {/* Events List */}
      <SectionList
        sections={sections}
        renderItem={renderEvent}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          sections.length === 0 && styles.listContentEmpty,
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
        stickySectionHeadersEnabled={false}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddPress} />

      {/* Category Picker Modal */}
      <CategoryPicker
        visible={pickerVisible}
        event={selectedEvent}
        onSelect={handleCategorySelect}
        onClose={handlePickerClose}
      />

      {/* Add Event Modal */}
      <AddEventModal
        visible={addModalVisible}
        onClose={handleAddModalClose}
        onSubmit={handleAddEventSubmit}
        loading={creating}
      />
    </SafeAreaView>
  );
}

interface EventCardProps {
  event: CategorizedEvent;
  onPress: () => void;
}

function EventCard({ event, onPress }: EventCardProps): React.JSX.Element {
  const duration = getDurationMinutes(event.startTime, event.endTime);

  return (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
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
      </View>
      <View style={styles.categoryContainer}>
        <CategoryBadge
          category={event.category}
          confirmed={event.categoryConfirmed}
          size="small"
          showIcon={true}
          showLabel={false}
        />
      </View>
    </TouchableOpacity>
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
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
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
    marginBottom: 8,
    overflow: 'hidden',
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 10,
  },
  eventDuration: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.bgTertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
