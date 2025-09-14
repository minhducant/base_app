import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';
import {IconLibrary} from '@components/base/index';

export interface InputRef {
  getValue: () => any;
}

export interface InputProps {
  title: string;
  valueInit?: string;
  placeholder?: string;
}

export const InputCheckbox = forwardRef<InputRef, InputProps>(
  ({...props}, ref) => {
    const [isSelected, setSelection] = useState<any>(props.valueInit || false);

    useImperativeHandle(ref, () => ({
      getValue: () => isSelected,
    }));

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.inputContainer}
        onPress={() => setSelection(!isSelected)}>
        <View>
          <IconLibrary
            library="MaterialIcons"
            name={isSelected ? 'check-box' : 'check-box-outline-blank'}
            size={30}
            color={color.MAIN}
          />
        </View>
        <Text style={styles.title}>{props.title}</Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: normalize(20),
    marginHorizontal: normalize(10),
    marginLeft: normalize(16),
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
    marginLeft: normalize(10),
  },
});
