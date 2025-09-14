import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthApi } from '@api/auth';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';
import { InputText } from '@components/base/index';
import AuthButton from '@components/authentication/button';
import { getRegisterLabel } from '@components/authentication/authLabel';
import { authenticationStyle as styles } from '@styles/authentication.style';

function isValidEmail(email: string) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

export default function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const registerLabel = getRegisterLabel(t);
  const formRef = useRef<any>({ ...registerLabel });

  const onRegis = async () => {
    const params = {
      phone: formRef.current.phone.getValue().trim() || '',
      email: formRef.current.email.getValue().trim() || '',
      name: formRef.current.name_mobile.getValue().trim() || '',
      password: formRef.current.password.getValue().trim() || '',
      re_password: formRef.current.re_password.getValue().trim() || '',
    };
    if (
      !params.name ||
      !params.email ||
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
    if (!isValidEmail(params.email)) {
      showMessage.warning(t('invalid_email_format'));
      return;
    }
    dispatch(setIsLoading(true));
    const data: any = await AuthApi.Signup(params);
    if (data.code === 200) {
      dispatch(setIsLoading(false));
      navigation.navigate('VerifyCodeScreen', {
        email: params.email,
        type: 'regis',
      });
      // navigation.navigate('VerifyCodeScreen')
    } else {
      dispatch(setIsLoading(false));
      if (data.mess === 'EMAIL_ALREADY_EXIT') {
        showMessage.fail(t(data.mess));
        return;
      }
      showMessage.fail(t('account_registration_failed'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleRegister}>{t('register_account')}</Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollView}
        >
          <InputText
            {...registerLabel.name_mobile}
            autoCapitalize="words"
            ref={(ref: any) => (formRef.current.name_mobile = ref)}
          />
          <InputText
            {...registerLabel.email}
            autoCapitalize="none"
            keyboardType="email-address"
            ref={(ref: any) => (formRef.current.email = ref)}
          />
          <InputText
            {...registerLabel.phone}
            keyboardType="number-pad"
            ref={(ref: any) => (formRef.current.phone = ref)}
          />
          <InputText
            {...registerLabel.password}
            secureTextEntry
            autoCapitalize="none"
            ref={(ref: any) => (formRef.current.password = ref)}
          />
          <InputText
            {...registerLabel.re_password}
            secureTextEntry
            autoCapitalize="none"
            ref={(ref: any) => (formRef.current.re_password = ref)}
          />
        </ScrollView>
        <AuthButton title={t('register')} onPress={onRegis} />
        <View style={styles.registerArea}>
          <Text style={styles.txtNewTo}>{t('do_have_an_account')}</Text>
          <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
            <Text style={styles.txtRegister}>{t('sign_in')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
