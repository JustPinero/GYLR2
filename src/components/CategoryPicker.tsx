import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { Category, CategorizedEvent } from '../types';
import { getCategoryInfo, getSelectableCategories } from '../services/categorization';
import { colors } from '../constants/colors';

interface CategoryPickerProps {
  visible: boolean;
  event: CategorizedEvent | null;
  onSelect: (category: Category, remember: boolean) => void;
  onClose: () => void;
}

export function CategoryPicker({
  visible,
  event,
  onSelect,
  onClose,
}: CategoryPickerProps): React.JSX.Element {
  const [remember, setRemember] = useState(true);
  const categories = getSelectableCategories();

  const handleSelect = (category: Category): void => {
    onSelect(category, remember);
  };

  if (!event) return <></>;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Categorize Event</Text>
              </View>

              {/* Event Title */}
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  "{event.title}"
                </Text>
              </View>

              {/* Category Buttons */}
              <View style={styles.categoriesContainer}>
                {categories.map((category) => {
                  const { icon, label, color } = getCategoryInfo(category);
                  const isSelected = event.category === category;

                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        { borderColor: color },
                        isSelected && { backgroundColor: color + '30' },
                      ]}
                      onPress={() => handleSelect(category)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryIcon}>{icon}</Text>
                      <Text style={[styles.categoryLabel, { color }]}>
                        {label}
                      </Text>
                      {isSelected && (
                        <View style={[styles.selectedIndicator, { backgroundColor: color }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Remember Toggle */}
              <View style={styles.rememberContainer}>
                <Text style={styles.rememberLabel}>
                  Remember for similar events
                </Text>
                <Switch
                  value={remember}
                  onValueChange={setRemember}
                  trackColor={{ false: colors.bgTertiary, true: colors.accent + '60' }}
                  thumbColor={remember ? colors.accent : colors.textMuted}
                />
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.border,
    width: '100%',
    maxWidth: 340,
    // Pixel art shadow
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 0,
    elevation: 8,
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
  eventInfo: {
    padding: 16,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 10,
  },
  categoryButton: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.bgPrimary,
    position: 'relative',
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  rememberLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: colors.border,
  },
  cancelText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
