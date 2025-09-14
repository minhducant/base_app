/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, TouchableOpacity, Animated} from 'react-native';

import {authenticationStyle as styles} from '@styles/authentication.style';

const AuthButton = ({onPress = () => {}, disable = false, title = ''}) => {
  const [animation] = useState(new Animated.Value(1));

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{scale: animation}],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      activeOpacity={0.8}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{width: '100%'}}>
      <Animated.View style={[styles.authButton(disable), animatedStyle]}>
        <Text style={styles.textButton}>{title} </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AuthButton;
