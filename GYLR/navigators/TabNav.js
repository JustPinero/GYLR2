import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import ScheduleNav from './ScheduleNav'

const TabNav = TabNavigator(
  {
    Schedule: { screen: ScheduleNav},
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'ScheduleNav') {
          iconName = `ios-globe${focused ? '' : '-outline'}`;
        }
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white'
      }
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default TabNav;
