import React, { Component } from 'react';
import {Animated, View, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Text} from 'react-native';

export default class SplashPage extends Component {

  render() {
    const { navigate } = this.props.navigation;
    return (
          <View style={styles.splashscreen}>
            <Text> Hello World </Text>
          </View>
    );
  }
}



var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  splashscreen:{
    width: width,
    height: height
  }
});
