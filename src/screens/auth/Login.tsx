import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Text, View, Keyboard, TouchableOpacity } from 'react-native';

import { AuthApi } from '@api/auth';
import { IconLibrary } from '@components/base';
import Input from '@components/authentication/input';
import { showMessage, setStorage } from '@utils/index';
import AuthButton from '@components/authentication/button';
import { setAppStatus, setIsLoading } from '@stores/action';
import TemplateLogin from '@components/authentication/templateLogin';
import { InputLanguage } from '@components/authentication/inputLanguage';
import { IconGoogle, IconFacebook, DefaltLogo } from '@assets/icons/index';
import { authenticationStyle as styles } from '@styles/authentication.style';

export default function Login({ navigation }: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const onLogin = async () => {
    Keyboard.dismiss();
    dispatch(setIsLoading(true));
    const email = usernameRef.current?.value?.trim();
    const password = passwordRef.current?.value?.trim();
    if (!email || !password) {
      dispatch(setIsLoading(false));
      showMessage.fail(t('email_or_password_is_invalid'));
      return;
    }
    const data: any = await AuthApi.Login({ password, email });
    if (data?.code === 200) {
      if (data?.data?.first_login) {
        navigation.navigate('SecurityScreen', {
          client_code: email,
        });
        dispatch(setIsLoading(false));
        return;
      }
      await setStorage('accessToken', data?.data?.accessToken);
      await setStorage('refreshToken', data?.data?.refreshToken);
      dispatch(setIsLoading(false));
      dispatch(setAppStatus(3));
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t('login_failed'));
    }
  };

  const onLoginFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        return;
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        return;
      }
      let accessToken: any = data.accessToken;
      dispatch(setIsLoading(true));
      const dataLogin = await AuthApi.LoginFacebook({ accessToken });
      if (dataLogin?.data?.accessToken && dataLogin?.data?.refreshToken) {
        await setStorage('accessToken', dataLogin.data.accessToken);
        await setStorage('refreshToken', dataLogin.data.refreshToken);
        dispatch(setAppStatus(3));
      } else {
        showMessage.fail(t('login_failed'));
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Facebook login error:', error);
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const onLoginGoogle = async () => {};

  const onLoginGust = async () => {
    dispatch(setAppStatus(3));
  };

  return (
    <TemplateLogin>
      <SafeAreaView style={styles.containerSpanish}>
        <View style={styles.formLogin}>
          <InputLanguage />
          <DefaltLogo />
          <Text style={styles.titleAuth}>{t('sign_in')}</Text>
          <Input
            ref={usernameRef}
            returnKeyType="next"
            iconName="email-outline"
            placeholder={t('email_mkh')}
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          <Input
            ref={passwordRef}
            returnKeyType="done"
            iconName="lock-outline"
            placeholder={t('password')}
            onSubmitEditing={onLogin}
            password
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('VerifyMailScreen')}
          >
            <Text style={styles.txtForgetPass}>{t('forgot_password')}?</Text>
          </TouchableOpacity>
          <AuthButton title={t('sign_in')} onPress={onLogin} />
          <Text style={styles.txtLoginWith}>{t('login_with')}</Text>
          <View style={styles.loginWith}>
            <TouchableOpacity
              onPress={onLoginGoogle}
              activeOpacity={0.5}
              style={styles.buttonLoginWith}
            >
              <IconGoogle />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLoginFacebook}
              activeOpacity={0.5}
              style={[styles.buttonLoginWith]}
            >
              <IconFacebook />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onLoginGust}
              activeOpacity={0.5}
              style={[styles.buttonLoginWith]}
            >
              <IconLibrary
                library="AntDesign"
                name={'arrowright'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.registerArea}>
          <Text style={styles.txtNewTo}>{t('do_not_have_an_account')}</Text>
          <TouchableOpacity
            onPress={() => navigation.replace('RegisterScreen')}
          >
            <Text style={styles.txtRegister}>{t('register_now')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TemplateLogin>
  );
}
