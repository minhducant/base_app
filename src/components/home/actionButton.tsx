import React from 'react';
import normalize from 'react-native-normalize';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const ActionButton = ({ title, onPress, disable = false }: any) => {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={onPress}
      style={[
        styles.button,
        disable ? styles.buttonDisabled : styles.buttonActive,
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 14,
    color: color.WHITE,
    textAlign: 'center',
    fontFamily: themeStyle.FONT_BOLD,
  },
  button: {
    marginTop: normalize(16),
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    marginHorizontal: normalize(20),
  },
  buttonActive: {
    backgroundColor: color.MAIN,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
    opacity: 0.6,
  },
});
