import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface UncategorizedBannerProps {
  count: number;
  onPress: () => void;
  onDismiss?: () => void;
}

export function UncategorizedBanner({
  count,
  onPress,
  onDismiss,
}: UncategorizedBannerProps): React.JSX.Element | null {
  if (count === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.text}>
          {count} event{count !== 1 ? 's' : ''} need{count === 1 ? 's' : ''} categorization
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>Categorize</Text>
        </TouchableOpacity>
        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.warning + '20',
    borderWidth: 2,
    borderColor: colors.warning,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.warning,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CC8800',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.bgPrimary,
    textTransform: 'uppercase',
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
});
