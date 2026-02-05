import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { hapticButtonPress } from '../utils/haptics';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({
  message,
  onDismiss,
  onRetry,
}: ErrorBannerProps): React.JSX.Element {
  const handleDismiss = (): void => {
    hapticButtonPress();
    onDismiss?.();
  };

  const handleRetry = (): void => {
    hapticButtonPress();
    onRetry?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
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
    backgroundColor: colors.error + '20',
    borderWidth: 2,
    borderColor: colors.error,
    borderRadius: 2,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  message: {
    fontSize: 13,
    color: colors.error,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  retryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: 'bold',
  },
});
