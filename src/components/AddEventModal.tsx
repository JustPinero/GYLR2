import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Category } from '../types';
import { getCategoryInfo, getSelectableCategories } from '../services/categorization';
import { addHours } from '../utils/dateUtils';
import { colors } from '../constants/colors';

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventData: EventFormData) => void;
  loading?: boolean;
}

export interface EventFormData {
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category: Category;
  description: string;
}

const initialFormData = (): EventFormData => {
  const now = new Date();
  // Round to next hour
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);

  return {
    title: '',
    date: now,
    startTime: now,
    endTime: addHours(now, 1),
    isAllDay: false,
    category: Category.UNCATEGORIZED,
    description: '',
  };
};

export function AddEventModal({
  visible,
  onClose,
  onSubmit,
  loading = false,
}: AddEventModalProps): React.JSX.Element {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const categories = getSelectableCategories();

  const resetForm = (): void => {
    setFormData(initialFormData());
    setErrors({});
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.category === Category.UNCATEGORIZED) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.isAllDay && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validate()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const updateField = <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const formatTimeForDisplay = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Simple time adjustment (for MVP - can be replaced with proper picker later)
  const adjustTime = (field: 'startTime' | 'endTime', minutes: number): void => {
    const current = formData[field];
    const newTime = new Date(current);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    updateField(field, newTime);

    // If adjusting start time, also adjust end time to maintain duration
    if (field === 'startTime') {
      const endTime = new Date(formData.endTime);
      endTime.setMinutes(endTime.getMinutes() + minutes);
      updateField('endTime', endTime);
    }
  };

  const adjustDate = (days: number): void => {
    const newDate = new Date(formData.date);
    newDate.setDate(newDate.getDate() + days);
    updateField('date', newDate);

    // Also adjust start and end times to new date
    const newStart = new Date(formData.startTime);
    newStart.setDate(newStart.getDate() + days);
    updateField('startTime', newStart);

    const newEnd = new Date(formData.endTime);
    newEnd.setDate(newEnd.getDate() + days);
    updateField('endTime', newEnd);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add New Event</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Title Input */}
            <View style={styles.field}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                value={formData.title}
                onChangeText={(text) => updateField('title', text)}
                placeholder="Event title"
                placeholderTextColor={colors.textMuted}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            {/* Date Selector */}
            <View style={styles.field}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustDate(-1)}
                >
                  <Text style={styles.adjustButtonText}>−</Text>
                </TouchableOpacity>
                <View style={styles.dateDisplay}>
                  <Text style={styles.dateText}>{formatDateForDisplay(formData.date)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.adjustButton}
                  onPress={() => adjustDate(1)}
                >
                  <Text style={styles.adjustButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* All Day Toggle */}
            <View style={styles.switchField}>
              <Text style={styles.label}>All day event</Text>
              <Switch
                value={formData.isAllDay}
                onValueChange={(value) => updateField('isAllDay', value)}
                trackColor={{ false: colors.bgTertiary, true: colors.accent + '60' }}
                thumbColor={formData.isAllDay ? colors.accent : colors.textMuted}
              />
            </View>

            {/* Time Selectors (hidden if all day) */}
            {!formData.isAllDay && (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>Start Time</Text>
                  <View style={styles.dateTimeRow}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => adjustTime('startTime', -30)}
                    >
                      <Text style={styles.adjustButtonText}>−</Text>
                    </TouchableOpacity>
                    <View style={styles.dateDisplay}>
                      <Text style={styles.dateText}>
                        {formatTimeForDisplay(formData.startTime)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => adjustTime('startTime', 30)}
                    >
                      <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>End Time</Text>
                  <View style={styles.dateTimeRow}>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => adjustTime('endTime', -30)}
                    >
                      <Text style={styles.adjustButtonText}>−</Text>
                    </TouchableOpacity>
                    <View style={[styles.dateDisplay, errors.endTime && styles.inputError]}>
                      <Text style={styles.dateText}>
                        {formatTimeForDisplay(formData.endTime)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.adjustButton}
                      onPress={() => adjustTime('endTime', 30)}
                    >
                      <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
                </View>
              </>
            )}

            {/* Category Selector */}
            <View style={styles.field}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const { icon, label, color } = getCategoryInfo(category);
                  const isSelected = formData.category === category;

                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        { borderColor: color },
                        isSelected && { backgroundColor: color + '30' },
                      ]}
                      onPress={() => updateField('category', category)}
                    >
                      <Text style={styles.categoryIcon}>{icon}</Text>
                      <Text style={[styles.categoryLabel, { color }]}>{label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {/* Description Input */}
            <View style={styles.field}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Add a description..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Adding...' : 'Add Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.bgPrimary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.border,
    maxHeight: '90%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  switchField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dateDisplay: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.bgSecondary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: '#B8960D',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.bgPrimary,
    textTransform: 'uppercase',
  },
});
