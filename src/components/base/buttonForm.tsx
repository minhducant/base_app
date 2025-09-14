import React from 'react';
import {
  Text,
  ViewStyle,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

interface ActionItem {
  title: string;
  onPress: any;
  customStyle?: ViewStyle;
}

interface Props {
  actions: ActionItem[];
}

export const BottomForm = ({actions}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      {actions.map((action, index) => {
        const isEven = index % 2 === 0;
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={action.onPress}
            style={[
              styles.button,
              action.customStyle,
              {
                marginLeft: !isEven ? 0 : normalize(20),
                borderColor: isEven ? color.MAIN : '#D1D5DB',
                backgroundColor: isEven ? color.MAIN : color.WHITE,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {
                  color: isEven ? color.WHITE : color.MAIN,
                },
              ]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(10),
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
    backgroundColor: color.MAIN,
    paddingVertical: normalize(10),
    borderRadius: normalize(8),
    marginTop: normalize(10),
    marginHorizontal: normalize(20),
  },
  text: {
    fontSize: 14,
    color: color.WHITE,
    textAlign: 'center',
    fontFamily: themeStyle.FONT_BOLD,
  },
});
