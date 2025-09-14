/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  TextStyle,
  TextInput,
  StyleSheet,
  StyleProp,
  TextInputProps,
} from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export interface InputRef {
  getValue: () => any;
  setValue: (value: string) => any;
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export interface InputProps extends TextInputProps {
  title: string;
  required?: boolean;
  valueInit?: string;
  placeholder?: string;
  disable?: boolean;
  style?: StyleProp<TextStyle>;
  multiline?: boolean;
}

export const InputText = forwardRef<InputRef, InputProps>(
  ({style, ...props}, ref) => {
    const inputRef = useRef<TextInput>(null);
    const [value, setValue] = useState(props.valueInit || '');

    useImperativeHandle(ref, () => ({
      ...inputRef.current,
      getValue: () => value,
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear() {
        setValue('');
      },
      setValue(vl: string) {
        setValue(vl);
      },
      value,
    }));

    return (
      <View style={styles.inputContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {props.title}
            {props.required && <Text style={{color: 'red'}}>{' *'}</Text>} :
          </Text>
        </View>
        <View style={styles.inputButton}>
          <TextInput
            multiline={props.multiline}
            editable={!props.disable}
            ref={inputRef}
            value={value}
            secureTextEntry={
              props.secureTextEntry ? props.secureTextEntry : undefined
            }
            textAlignVertical="top"
            onChangeText={setValue}
            autoCapitalize={
              props.autoCapitalize ? props.autoCapitalize : undefined
            }
            keyboardType={props.keyboardType ? props.keyboardType : undefined}
            placeholder={props.placeholder}
            style={[
              styles.input,
              style,
              {height: props.multiline ? normalize(130) : normalize(40)},
            ]}
            {...props}
          />
        </View>
      </View>
    );
  },
);

const styles: any = StyleSheet.create({
  inputContainer: {
    marginTop: normalize(10),
    marginHorizontal: normalize(16),
    overflow: 'hidden',
  },
  input: {
    backgroundColor: color.WHITE,
    color: color.BLACK,
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  inputButton: {
    backgroundColor: color.WHITE,
    minHeight: normalize(40),
    borderRadius: normalize(8),
    overflow: 'hidden',
    paddingHorizontal: normalize(10),
    borderWidth: 1,
    borderColor: color.SILVER,
  },
  title: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  titleContainer: {
    paddingVertical: normalize(10),
  },
});
