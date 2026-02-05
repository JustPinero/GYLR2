import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { CalendarScreen, LifeScreen, SettingsScreen } from '../screens';
import { colors } from '../constants/colors';
import type { RootTabParamList } from '../types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bgSecondary,
          borderBottomWidth: 2,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 2,
          borderTopColor: colors.border,
          paddingTop: 6,
          paddingBottom: 6,
          height: 65,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color }) => (
            <TabIcon label="📅" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Life"
        component={LifeScreen}
        options={{
          title: 'Life Panel',
          tabBarLabel: 'Life',
          tabBarIcon: ({ color }) => (
            <TabIcon label="📊" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabIcon label="⚙️" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

interface TabIconProps {
  label: string;
  color: string;
}

function TabIcon({ label }: TabIconProps): React.JSX.Element {
  return (
    <View style={iconStyles.container}>
      <Text style={iconStyles.emoji}>{label}</Text>
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
  },
});
