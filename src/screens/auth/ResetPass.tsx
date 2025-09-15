/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useRoute} from '@react-navigation/native';
import {
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {AuthApi} from '@api/auth';
import {showMessage} from '@utils/index';
import {setIsLoading} from '@stores/action';
import Input from '@components/authentication/input';
import AuthButton from '@components/authentication/button';
import HeaderWithTitle from '@components/header/headerWithTitle';
import TemplateLogin from '@components/authentication/templateLogin';
import {authenticationStyle as styles} from '@styles/authentication.style';

const ResetPassScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);
  const params: any = useRoute().params;

  const onVerify = async () => {
    const value = {
      client_code: params?.params?.client_code || '',
      email: usernameRef.current?.value?.trim() || '',
    };
    if (!value.email) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email);
    if (!isValidEmail) {
      showMessage.warning(t('invalid_email_format'));
      return;
    }
    dispatch(setIsLoading(true));
    const data: any = await AuthApi.ForgotPassword(value);
    if (data.code === 200) {
      dispatch(setIsLoading(false));
      navigation.navigate('VerifyCodeScreen', {
        ...params,
        type: 'forget',
        email: value.email,
        client_code: value?.client_code,
      });
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t('email_verification_failed'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TemplateLogin>
        <SafeAreaView style={styles.container}>
          <HeaderWithTitle
            hasLeft={true}
            hasRight={false}
            title={t('verify_email')}
          />
          <Text style={styles.descriptionSecurity}>
            {t('enter_email_to_receive_otp')}
          </Text>
          <View style={[styles.formLogin, {marginTop: 30}]}>
            <Input
              ref={usernameRef}
              returnKeyType="done"
              iconName="email-outline"
              placeholder={t('email')}
              onSubmitEditing={() => onVerify()}
            />
          </View>
          <SafeAreaView style={styles.registerArea}>
            <AuthButton title={t('next')} onPress={onVerify} />
          </SafeAreaView>
        </SafeAreaView>
      </TemplateLogin>
    </KeyboardAvoidingView>
  );
};

export default ResetPassScreen;
