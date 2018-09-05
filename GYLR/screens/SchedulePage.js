import React, { Component } from 'react';
import {Animated, View, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Text} from 'react-native';

export default class SchedulePage extends Component {

  render() {
    const { navigate } = this.props.navigation;
    return (
          <View style={styles.schedulepage}>
            <Text> SCHEDULE PAGE </Text>
          </View>
    );
  }
}



var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  schedulepage:{
    width: width,
    height: height
  }
});
