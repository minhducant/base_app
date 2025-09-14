import React from 'react';
import normalize from 'react-native-normalize';
import {SafeAreaView, Text, StyleSheet, TouchableOpacity} from 'react-native';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const BottomButton = ({title, onPress}: any) => {
  return (
    <SafeAreaView style={styles.viewButton}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.buttonBuy}
        activeOpacity={0.7}>
        <Text style={styles.txtBuy}>{title}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewButton: {
    flexDirection: 'row',
    marginBottom: normalize(5),
  },
  txtBuy: {
    fontSize: 14,
    color: color.WHITE,
    textAlign: 'center',
    fontFamily: themeStyle.FONT_BOLD,
  },
  buttonBuy: {
    flex: 1,
    backgroundColor: color.MAIN,
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    marginHorizontal: normalize(20),
  },
});
