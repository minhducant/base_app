/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import normalize from 'react-native-normalize';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from '@i18n/index';
import color from '@styles/color';
import { USER_LANG } from '@utils/deviceLang';
import themeStyle from '@styles/theme.style';
import { DataLanguage } from '@utils/deviceLang';
export interface InputRef {
  getValue: () => any;
  setValue: (value: string) => any;
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export interface InputProps {
  disable?: boolean;
  title?: string;
  required?: boolean;
  valueInit?: string;
  placeholder?: string;
  titleSelect?: string;
  onSelected?: (item: any) => void;
}

export const InputLanguage = forwardRef<InputRef, InputProps>(
  ({ ...props }, ref) => {
    const inputRef = useRef<any>(null);
    const currentLanguage = i18n.language;
    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState<any>(
      DataLanguage.find(language => language.value === currentLanguage) || 'vi',
    );

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
    }));

    const onChange = async (item: any) => {
      if (item.value !== currentLanguage) {
        setValue(item);
        await AsyncStorage.setItem(USER_LANG, item.value);
        await i18n.changeLanguage(item.value);
        setIsFocus(false);
      }
    };

    const renderItem = (item: any) => {
      const Icon = item.icon;
      return (
        <View style={styles.itemContainer}>
          <Icon width={22} height={22} />
          <Text style={styles.itemText}>{item.label}</Text>
        </View>
      );
    };

    return (
      <View style={styles.inputContainer}>
        <Dropdown
          data={DataLanguage}
          ref={inputRef}
          labelField="label"
          valueField="value"
          onChange={onChange}
          value={value}
          activeColor={color.SILVER}
          maxHeight={normalize(300)}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          itemTextStyle={styles.textStyle}
          searchPlaceholder={props.titleSelect}
          selectedTextStyle={styles.textStyle}
          inputSearchStyle={styles.inputSearchStyle}
          placeholder={
            DataLanguage?.find(language => language.value === currentLanguage)
              ?.label
          }
          renderItem={renderItem}
          placeholderStyle={[styles.textStyle, { color: 'gray' }]}
          style={[styles.dropdown, isFocus && { borderColor: 'red' }]}
        />
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
    width: normalize(150),
    alignSelf: 'flex-end',
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
    // borderWidth: 0.5,
    borderRadius: normalize(5),
    overflow: 'hidden',
    paddingHorizontal: normalize(10),
    marginTop: normalize(10),
  },
  textStyle: {
    fontSize: 15,
    textAlign: 'right',
    marginRight: normalize(10),
    fontFamily: themeStyle.FONT_FAMILY,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  itemText: {
    fontSize: 15,
    textAlign: 'right',
    marginLeft: normalize(10),
    fontFamily: themeStyle.FONT_FAMILY,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
  },
});
