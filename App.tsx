import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { TabNavigator } from './src/navigation';
import { colors } from './src/constants/colors';

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
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
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
        }}
      >
        <TabNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </Provider>
  );
}
