import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Check if haptics are available (iOS and some Android devices)
const isHapticsAvailable = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Light haptic feedback for button presses
 */
export async function hapticButtonPress(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Selection haptic for picker/toggle changes
 */
export async function hapticSelection(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.selectionAsync();
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Medium haptic for significant actions (pull to refresh, etc.)
 */
export async function hapticMedium(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Heavy haptic for important confirmations
 */
export async function hapticHeavy(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Success notification haptic
 */
export async function hapticSuccess(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Error notification haptic
 */
export async function hapticError(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Silently fail if haptics not supported
  }
}

/**
 * Warning notification haptic
 */
export async function hapticWarning(): Promise<void> {
  if (!isHapticsAvailable) return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Silently fail if haptics not supported
  }
}
