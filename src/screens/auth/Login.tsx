/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Text, View, Keyboard, TouchableOpacity } from 'react-native';

import { AuthApi } from '@api/auth';
// import { IconLibrary } from '@components/base';
import Input from '@components/authentication/input';
import { showMessage, setStorage } from '@utils/index';
import AuthButton from '@components/authentication/button';
import { setAppStatus, setIsLoading } from '@stores/action';
// import { IconGoogle, IconFacebook } from '@assets/icons/index';
import TemplateLogin from '@components/authentication/templateLogin';
import { InputLanguage } from '@components/authentication/inputLanguage';
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

  // const onLoginFacebook = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       'public_profile',
  //       'email',
  //     ]);
  //     if (result.isCancelled) {
  //       return;
  //     }
  //     const data = await AccessToken.getCurrentAccessToken();
  //     if (!data) {
  //       return;
  //     }
  //     let accessToken: any = data.accessToken;
  //     console.log(JSON.stringify(data, null, 2));
  //     dispatch(setIsLoading(true));
  //     const dataLogin = await AuthApi.LoginFacebook({ accessToken });
  //     if (dataLogin?.data?.accessToken && dataLogin?.data?.refreshToken) {
  //       await setStorage('accessToken', dataLogin.data.accessToken);
  //       await setStorage('refreshToken', dataLogin.data.refreshToken);
  //       dispatch(setAppStatus(3));
  //     } else {
  //       showMessage.fail(t('login_failed'));
  //     }
  //   } catch (error) {
  //     if (__DEV__) {
  //       console.error('Facebook login error:', error);
  //     }
  //   } finally {
  //     dispatch(setIsLoading(false));
  //   }
  // };

  // const onLoginGoogle = async () => {};

  // const onLoginGust = async () => {
  //   dispatch(setAppStatus(3));
  // };

  return (
    <TemplateLogin>
      <SafeAreaView style={styles.containerSpanish}>
        <View style={styles.formLogin}>
          <InputLanguage />
          <FastImage
            style={{ width: 150, height: 150, alignSelf: 'center' }}
            source={require('@assets/images/app_logo.jpeg')}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={styles.titleAuth}>{t('welcome_back')}</Text>
          <Text style={styles.subTitleAuth}>{t('please_login_below')}</Text>
          <View style={styles.registerArea}>
            <Text style={styles.txtNewTo}>{t('no_account')}?</Text>
            <TouchableOpacity
              onPress={() => navigation.replace('RegisterScreen')}
            >
              <Text style={styles.txtRegister}>{t('sign_up')}</Text>
            </TouchableOpacity>
          </View>
          <Input
            ref={usernameRef}
            returnKeyType="next"
            iconName="email-outline"
            placeholder={t('email')}
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
          <AuthButton title={t('sign_in')} onPress={onLogin} />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('VerifyMailScreen')}
          >
            <Text style={styles.txtForgetPass}>{t('forgot_password')}?</Text>
          </TouchableOpacity>
          {/* <Text style={styles.txtLoginWith}>{t('login_with')}</Text>
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
          </View> */}
        </View>
      </SafeAreaView>
    </TemplateLogin>
  );
}
