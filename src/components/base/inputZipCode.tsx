import React, {
  useState,
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
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

export type ZipCodeInputRef = {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
  blur: () => void;
  clear: () => void;
};

export interface InputProps extends TextInputProps {
  title: string;
  required?: boolean;
  valueInit?: string;
  placeholder?: string;
  disable?: boolean;
  style?: StyleProp<TextStyle>;
  multiline?: boolean;
  onSearch?: any;
}

const ZipCodeInput = forwardRef<ZipCodeInputRef, InputProps>((props, ref) => {
  const lastSearched = useRef<string>('');
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const [zipPart1, setZipPart1] = useState('');
  const [zipPart2, setZipPart2] = useState('');

  useEffect(() => {
    if (props.valueInit) {
      const [part1 = '', part2 = ''] = props.valueInit.split('-');
      setZipPart1(part1);
      setZipPart2(part2);
    }
  }, [props.valueInit]);

  useEffect(() => {
    const fullZip = `${zipPart1}-${zipPart2}`;
    const isComplete = zipPart1.length + zipPart2.length === 7;
    if (isComplete && fullZip !== lastSearched.current) {
      props.onSearch?.(fullZip);
      lastSearched.current = fullZip;
    }
  }, [zipPart1, zipPart2]);

  const handleZipPart1 = (text: string) => {
    if (/^\d{0,3}$/.test(text)) {
      setZipPart1(text);
      if (text.length === 3) {
        inputRef2.current?.focus();
      }
    }
  };

  const handleZipPart2 = (text: string) => {
    if (/^\d{0,4}$/.test(text)) {
      setZipPart2(text);
      if (text === '') {
        inputRef1.current?.focus();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    getValue: () => `${zipPart1}-${zipPart2}`,
    setValue: (value: string) => {
      const [part1 = '', part2 = ''] = value.split('-');
      setZipPart1(part1);
      setZipPart2(part2);
    },
    focus: () => inputRef1.current?.focus(),
    blur: () => {
      inputRef1.current?.blur();
      inputRef2.current?.blur();
    },
    clear: () => {
      setZipPart1('');
      setZipPart2('');
    },
  }));

  return (
    <View style={styles.inputContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {props.title}
          {props.required && <Text style={{color: 'red'}}>{' *'}</Text>} :
        </Text>
      </View>
      <View style={[styles.inputButton]}>
        <View style={[styles.zipBox, {flex: 2.5}]}>
          <TextInput
            ref={inputRef1}
            style={[styles.input]}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="000"
            value={zipPart1}
            onChangeText={handleZipPart1}
            {...props}
          />
        </View>
        <View style={styles.hyphenContainer}>
          <Text style={styles.hyphenText}>-</Text>
        </View>
        <View style={[styles.zipBox, {flex: 4}]}>
          <TextInput
            ref={inputRef2}
            style={[styles.input]}
            keyboardType="number-pad"
            maxLength={4}
            placeholder="0000"
            value={zipPart2}
            onChangeText={handleZipPart2}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: normalize(10),
    marginHorizontal: normalize(16),
    overflow: 'hidden',
  },
  zipBox: {
    flex: 1,
    backgroundColor: color.WHITE,
    borderWidth: 1,
    borderColor: color.SILVER,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    minHeight: normalize(40),
  },
  inputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    paddingVertical: 0,
  },
  title: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  titleContainer: {
    paddingVertical: normalize(10),
  },
  hyphenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(8),
  },
  hyphenText: {
    fontSize: 20,
    color: color.BLACK,
    fontFamily: themeStyle.FONT_FAMILY,
  },
});

export default ZipCodeInput;
