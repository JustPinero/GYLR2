import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CalendarScreen, LifeScreen } from '../screens';
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
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
          // TODO: Add pixel art calendar icon
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
          // TODO: Add pixel art life/chart icon
          tabBarIcon: ({ color }) => (
            <TabIcon label="📊" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Temporary icon component until pixel art icons are added
import { Text, View, StyleSheet } from 'react-native';

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
    fontSize: 24,
  },
});
