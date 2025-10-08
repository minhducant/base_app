/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import normalize from 'react-native-normalize';
import {View, Text, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export interface InputRef {
  getValue: () => any;
  setValue: (value: string) => any;
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export interface InputProps {
  search?: boolean;
  disable?: boolean;
  data: any;
  title?: string;
  required?: boolean;
  valueInit?: string;
  placeholder?: string;
  titleSelect?: string;
  onSelected?: (item: any) => void;
  dropdownPosition?: 'auto' | 'bottom' | 'top';
}

export const InputSelect = forwardRef<InputRef, InputProps>(
  ({...props}, ref) => {
    const inputRef = useRef<any>(null);
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState<any>(props.valueInit || null);

    useImperativeHandle(ref, () => ({
      ...inputRef.current,
      getValue: () => value,
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear() {
        setValue('');
      },
      setValue(item: any) {
        setValue(item);
        setIsFocus(false);
        props.onSelected && props.onSelected(item);
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
          <Dropdown
            search={props.search}
            data={props.data || []}
            ref={inputRef}
            value={value}
            labelField="name"
            valueField="_id"
            onChange={item => {
              setValue(item);
              setIsFocus(false);
              props.onSelected && props.onSelected(item);
            }}
            disable={props.disable}
            activeColor={color.SILVER}
            maxHeight={normalize(300)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            itemTextStyle={styles.textStyle}
            searchPlaceholder={props.titleSelect}
            selectedTextStyle={styles.textStyle}
            showsVerticalScrollIndicator={false}
            inputSearchStyle={styles.inputSearchStyle}
            dropdownPosition={props?.dropdownPosition || 'auto'}
            placeholder={!isFocus ? props.placeholder : '...'}
            placeholderStyle={[styles.textStyle, {color: 'gray'}]}
            style={[styles.dropdown, isFocus && {borderColor: color.MAIN}]}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    height: normalize(40),
    backgroundColor: color.WHITE,
    color: color.BLACK,
  },
  inputContainer: {
    marginTop: normalize(10),
    marginHorizontal: normalize(16),
    overflow: 'hidden',
  },
  title: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  titleContainer: {
    paddingVertical: normalize(10),
  },
  dropdown: {
    height: normalize(45),
    borderColor: color.SILVER,
    borderWidth: 1.25,
    borderRadius: normalize(8),
    overflow: 'hidden',
    paddingHorizontal: normalize(10),
    marginTop: normalize(10),
  },
  textStyle: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
});
