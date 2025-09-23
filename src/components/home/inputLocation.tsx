import React, { Ref } from 'react';
import normalize from 'react-native-normalize';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import COLORS from '@styles/color';
import theme from '@styles/theme.style';
import { IconLibrary } from '@components/base/iconLibrary';

interface InputProps {
  iconName: string;
  onFocus?: () => void;
  onPressIn?: () => void;
  returnKeyType?: any;
  placeholder?: any;
  onSubmitEditing?: any;
  ref: Ref<any>;
  autoFocus?: boolean;
  onChangeText?: (text: string) => void;
  actionLeft?: () => void;
  setDataAddress?: (data: any) => void;
}

const InputLocation: React.FC<InputProps> = React.forwardRef(
  (
    {
      iconName,
      onFocus = () => {},
      onPressIn = () => {},
      returnKeyType,
      placeholder,
      onSubmitEditing,
      autoFocus,
      onChangeText = () => {},
      actionLeft = () => {},
      setDataAddress = () => {},
    },
    ref,
  ) => {
    const textInputRef = React.useRef<any>(null);
    const [value, setValue] = React.useState('');
    const [isFocused, setIsFocused] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        textInputRef.current.focus();
      },
      clear: () => {
        textInputRef.current.clear();
      },
      setValue: (text: string) => {
        setValue(text);
      },
      value,
    }));

    return (
      <View
        style={[
          style.inputContainer,
          {
            alignItems: 'center',
            borderColor: isFocused ? COLORS.MAIN : COLORS.SILVER,
          },
        ]}
      >
        <TouchableOpacity onPress={() => actionLeft()}>
          <IconLibrary
            library="MaterialIcons"
            name={iconName}
            size={22}
            color={COLORS.MAIN}
            style={{
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          value={value}
          autoCorrect={false}
          onChangeText={setValue}
          onPressIn={() => onPressIn()}
          onFocus={() => {
            setIsFocused(true);
            onFocus();
          }}
          onChange={() => onChangeText(value)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          placeholderTextColor={COLORS.DUSTY_GRAY}
          autoCapitalize="none"
          style={{
            flex: 1,
            fontSize: 16,
            fontFamily: theme.FONT_FAMILY,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setValue(''), setDataAddress([]);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconLibrary
            library="AntDesign"
            name="close"
            style={{
              marginLeft: normalize(10),
              backgroundColor: 'transparent',
            }}
            size={22}
            color={COLORS.SILVERC4}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

const style = StyleSheet.create({
  label: {
    marginTop: normalize(16),
    fontSize: 14,
    fontFamily: theme.FONT_FAMILY,
  },
  inputContainer: {
    height: normalize(50),
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: normalize(10),
    marginTop: normalize(16),
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.SILVER,
    width: '100%',
    alignSelf: 'center',
  },
});

export default InputLocation;
