import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { colors } from '../constants/colors';

export function OfflineBanner(): React.JSX.Element | null {
  const [isOffline, setIsOffline] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);

      // Animate banner in/out
      Animated.spring(slideAnim, {
        toValue: offline ? 0 : -50,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    });

    return () => unsubscribe();
  }, [slideAnim]);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.bgPrimary,
  },
});
