import React, {Ref} from 'react';
import normalize from 'react-native-normalize';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

import COLORS from '@styles/color';
import theme from '@styles/theme.style';
import {IconLibrary} from '@components/base/iconLibrary';

interface InputProps {
  iconName: string;
  password?: boolean;
  onFocus?: () => void;
  onPressIn?: () => void;
  returnKeyType?: any;
  placeholder?: any;
  onSubmitEditing?: any;
  ref: Ref<any>;
  autoFocus?: boolean;
}

const Input: React.FC<InputProps> = React.forwardRef(
  (
    {
      iconName,
      password,
      onFocus = () => {},
      onPressIn = () => {},
      returnKeyType,
      placeholder,
      onSubmitEditing,
      autoFocus,
    },
    ref,
  ) => {
    const textInputRef = React.useRef<any>(null);
    const [value, setValue] = React.useState('');
    const [hidePassword, setHidePassword] = React.useState(password);

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        textInputRef.current.focus();
      },
      clear: () => {
        textInputRef.current.clear();
      },
      value,
      clearValue,
    }));

    const clearValue = () => {
      setValue('');
    };

    return (
      <View>
        <View
          style={[
            style.inputContainer,
            {
              alignItems: 'center',
            },
          ]}>
          <IconLibrary
            library="MaterialCommunityIcons"
            name={iconName}
            size={22}
            color={COLORS.MAIN}
            style={{
              marginRight: 10,
            }}
          />
          <TextInput
            ref={textInputRef}
            value={value}
            autoCorrect={false}
            onChangeText={setValue}
            onPressIn={() => onPressIn()}
            onFocus={() => {
              onFocus();
            }}
            autoFocus={autoFocus}
            onSubmitEditing={onSubmitEditing}
            placeholder={placeholder}
            returnKeyType={returnKeyType}
            secureTextEntry={hidePassword}
            autoCapitalize="none"
            style={{
              // color: COLORS.darkBlue,
              flex: 1,
              fontSize: 16,
              fontFamily: theme.FONT_FAMILY,
            }}
          />
          {password && (
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <IconLibrary
                library="MaterialCommunityIcons"
                name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                style={{
                  marginLeft: normalize(10),
                  backgroundColor: 'transparent',
                }}
                size={22}
                color={COLORS.BLACK}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
);

const style = StyleSheet.create({
  label: {
    marginBottom: normalize(10),
    fontSize: 14,
    fontFamily: theme.FONT_FAMILY,
  },
  inputContainer: {
    height: normalize(50),
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: normalize(10),
    marginBottom: normalize(20),
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.SILVER,
    width: '100%',
    alignSelf: 'center',
  },
});

export default Input;
