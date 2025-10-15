import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import normalize from 'react-native-normalize';

import { t } from '@i18n/index';
import color from '@styles/color';
import themeStyle from '@styles/theme.style';

const SwitchButton = ({ onChange, type }: any) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: type === 'personal' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [type]);

  const handleToggle = (value: React.SetStateAction<string>) => {
    onChange?.(value);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, normalize(140)], // độ dài trượt
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchWrapper}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateX }],
            },
          ]}
        />
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleToggle('personal')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.text,
              {
                color:
                  type === 'personal'
                    ? color.WHITE
                    : color.DUSTY_GRAY || '#777',
              },
            ]}
          >
            {t('personal')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleToggle('business')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.text,
              {
                color:
                  type === 'business'
                    ? color.WHITE
                    : color.DUSTY_GRAY || '#777',
              },
            ]}
          >
            {t('business')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: normalize(10),
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.LIGHT_GRAY || '#EEE',
    borderRadius: normalize(12),
    overflow: 'hidden',
    width: normalize(280),
    height: normalize(35),
    position: 'relative',
    borderWidth: 1,
    borderColor: color.MAIN,
  },
  slider: {
    position: 'absolute',
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: color.MAIN,
    borderRadius: normalize(12),
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: themeStyle.FONT_FAMILY,
  },
});

export default SwitchButton;
