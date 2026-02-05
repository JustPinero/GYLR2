import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../constants/colors';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  style?: ViewStyle;
}

export function FloatingActionButton({
  onPress,
  icon = '+',
  style,
}: FloatingActionButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel="Add new event"
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.accent,
    borderWidth: 3,
    borderColor: '#B8960D',
    alignItems: 'center',
    justifyContent: 'center',
    // Pixel art shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 6,
  },
  icon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.bgPrimary,
    marginTop: -2, // Visual centering
  },
});
