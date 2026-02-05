import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { TabNavigator } from './src/navigation';
import { AuthScreen } from './src/screens';
import { useAppSelector, useAppDispatch } from './src/hooks';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  setAuthenticated,
  setTokens,
  setUserInfo,
  setAuthLoading,
} from './src/store/settingsSlice';
import { loadStoredMappings } from './src/store/categoriesSlice';
import { getStoredTokens, getStoredUserInfo, isTokenExpired, refreshAccessToken } from './src/services/googleAuth';
import { colors } from './src/constants/colors';

// Navigation theme
const navigationTheme = {
  dark: true,
  colors: {
    primary: colors.accent,
    background: colors.bgPrimary,
    card: colors.bgSecondary,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.error,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '900' as const,
    },
  },
};

function AppContent(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async (): Promise<void> => {
    try {
      const tokens = await getStoredTokens();

      if (!tokens) {
        dispatch(setAuthLoading(false));
        return;
      }

      // Check if token is expired
      if (isTokenExpired(tokens)) {
        // Try to refresh
        if (tokens.refreshToken) {
          const newTokens = await refreshAccessToken(tokens.refreshToken);
          if (newTokens) {
            dispatch(setTokens({
              accessToken: newTokens.accessToken,
              refreshToken: newTokens.refreshToken ?? null,
              expiresAt: newTokens.expiresAt,
            }));
            dispatch(setAuthenticated({ isAuthenticated: true, email: null }));

            // Get user info
            const userInfo = await getStoredUserInfo();
            if (userInfo) {
              dispatch(setUserInfo({ email: userInfo.email, name: userInfo.name ?? null }));
            }

            // Load stored category mappings
            dispatch(loadStoredMappings());
          } else {
            // Refresh failed, user needs to re-auth
            dispatch(setAuthLoading(false));
          }
        } else {
          dispatch(setAuthLoading(false));
        }
      } else {
        // Token still valid
        dispatch(setTokens({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken ?? null,
          expiresAt: tokens.expiresAt,
        }));
        dispatch(setAuthenticated({ isAuthenticated: true, email: null }));

        // Get user info
        const userInfo = await getStoredUserInfo();
        if (userInfo) {
          dispatch(setUserInfo({ email: userInfo.email, name: userInfo.name ?? null }));
        }

        // Load stored category mappings
        dispatch(loadStoredMappings());
      }
    } catch (error) {
      console.error('Error checking stored auth:', error);
      dispatch(setAuthLoading(false));
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Show main app
  return (
    <NavigationContainer theme={navigationTheme}>
      <TabNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
