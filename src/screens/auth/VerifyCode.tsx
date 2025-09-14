/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {
  Cursor,
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {AuthApi} from '@api/auth';
import {showMessage} from '@utils/index';
import {setIsLoading} from '@stores/action';
import AuthButton from '@components/authentication/button';
import HeaderWithTitle from '@components/header/headerWithTitle';
import TemplateLogin from '@components/authentication/templateLogin';
import {authenticationStyle as styles} from '@styles/authentication.style';

const VerifyCodeScreen = ({navigation, route}: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const data: any = useRoute().params;
  const [code, setCode] = useState('');
  const ref = useBlurOnFulfill({ value: code, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      onVerifyOtp(code);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const onVerifyOtp = async (value?: any) => {
    dispatch(setIsLoading(true));
    const params = {
      code: value,
      email: route.params.email,
      client_code: route.params.client_code,
    };
    let res: any;
    if (route.params.type === 'regis') {
      res = await AuthApi.VerifyAcount(params);
    } else {
      res = await AuthApi.VerifyOtpForget(params);
    }
    if (res?.code === 200) {
      setCode('');
      dispatch(setIsLoading(false));
      showMessage.success(t('account_verification_success'));
      route.params.type === 'regis'
        ? navigation.replace('LoginScreen')
        : navigation.navigate('ForgetPassScreen', {
            ...params,
            code: value,
            type: 'forget',
            email: params.email,
            client_code: params?.client_code,
          });
    } else {
      setCode('');
      dispatch(setIsLoading(false));
      showMessage.fail(t('account_verification_failed'));
    }
  };

  const onResend = async () => {
    const val = {
      email: route.params.email,
      client_code: route.params.client_code,
    };
    if (!val.email) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.email);
    if (!isValidEmail) {
      showMessage.warning(t('invalid_email_format'));
      return;
    }
    dispatch(setIsLoading(true));
    const res: any = await AuthApi.ForgotPassword(val);
    if (res.code === 200) {
      dispatch(setIsLoading(false));
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t('email_verification_failed'));
    }
  };

  return (
    <TemplateLogin>
      <View style={styles.containLogin}>
        <HeaderWithTitle hasLeft={true} title={t('verify_email')} />
        <View style={[styles.formAuth, {alignItems: 'center'}]}>
          <Text style={styles.descriptionSecurity}>
            {t('enter_otp_sent_to_email')}
          </Text>
          <Text style={styles.descriptionSecurity}>{data.email}</Text>
          <CodeField
            ref={ref}
            {...props}
            value={code}
            autoFocus={true}
            cellCount={6}
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol ? '●' : isFocused ? <Cursor /> : null}
              </Text>
            )}
            onChangeText={setCode}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            rootStyle={styles.codeFieldRoot}
          />
        </View>
        {route.params.type === 'forget' && (
          <View style={styles.registerArea}>
            <TouchableOpacity onPress={() => onResend()}>
              <Text style={styles.txtRegister}>{t('resend_otp')}</Text>
            </TouchableOpacity>
          </View>
        )}
        <SafeAreaView style={styles.registerArea}>
          <AuthButton
            title={t('verify')}
            disable={code.length !== 6}
            onPress={() => onVerifyOtp(code)}
          />
        </SafeAreaView>
      </View>
    </TemplateLogin>
  );
};

export default VerifyCodeScreen;
