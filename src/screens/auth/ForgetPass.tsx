/* eslint-disable react-native/no-inline-styles */
import React, {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

import {AuthApi} from '@api/auth';
import {showMessage} from '@utils/index';
import {setIsLoading} from '@stores/action';
import Input from '@components/authentication/input';
import AuthButton from '@components/authentication/button';
import HeaderWithTitle from '@components/header/headerWithTitle';
import {authenticationStyle as styles} from '@styles/authentication.style';

const ForgetPassScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const passwordRef = useRef<any>(null);
  const rePasswordRef = useRef<any>(null);

  const onVerify = async () => {
    const params: any = {
      code: route.params.code || '',
      email: route.params.email || '',
      client_code: route.params.client_code || '',
      password: passwordRef?.current?.value?.trim() || '',
      re_password: rePasswordRef?.current?.value?.trim() || '',
    };
    if (
      !params.email ||
      !params.code ||
      !params.password ||
      !params.re_password
    ) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    if (params.password !== params.re_password) {
      showMessage.warning(t('password_mismatch'));
      return;
    }
    if (params.password.length < 8) {
      showMessage.warning(t('password_too_short'));
      return;
    }
    dispatch(setIsLoading(true));
    const data: any = await AuthApi.ChangePasswordByCode(params);
    if (data.code === 200) {
      dispatch(setIsLoading(false));
      showMessage.success(t('password_update_success'));
      navigation.replace('LoginScreen');
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t('update_password_failed'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <HeaderWithTitle hasLeft={true} title={t('change_password')} />
        <Text style={[styles.descriptionSecurity, {marginHorizontal: 16}]}>
          {t('enter_new_password_instruction')}
        </Text>
        <View style={[styles.formLogin, {marginTop: 30}]}>
          <Input
            password
            ref={passwordRef}
            returnKeyType="next"
            iconName="lock-outline"
            placeholder={t('new_password')}
            onSubmitEditing={() => rePasswordRef.current.focus()}
          />
          <Input
            password
            ref={rePasswordRef}
            returnKeyType="next"
            iconName="lock-outline"
            placeholder={t('confirm_password')}
            onSubmitEditing={() => onVerify()}
          />
        </View>
        <SafeAreaView style={styles.registerArea}>
          <AuthButton title={t('send')} onPress={onVerify} />
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassScreen;
