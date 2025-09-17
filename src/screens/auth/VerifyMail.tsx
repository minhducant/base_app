/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, SafeAreaView, Text } from 'react-native';

import { AuthApi } from '@api/auth';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';
import Input from '@components/authentication/input';
import AuthButton from '@components/authentication/button';
import HeaderWithTitle from '@components/header/headerWithTitle';
import TemplateLogin from '@components/authentication/templateLogin';
import { authenticationStyle as styles } from '@styles/authentication.style';

function isValidEmail(email: string) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

const VerifyMailScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);

  const onVerify = async () => {
    dispatch(setIsLoading(true));
    const email = usernameRef.current?.value?.trim();
    if (isValidEmail(email)) {
      const data: any = await AuthApi.ForgotPassword({ email });
      if (data.code === 200) {
        navigation.navigate('VerifyCodeScreen', {
          email: email,
          type: 'forget',
        });
        dispatch(setIsLoading(false));
      } else {
        dispatch(setIsLoading(false));
        showMessage.fail(
          'Không có Email trùng với thông tin mà bạn đã cung cấp!',
        );
      }
    } else {
      dispatch(setIsLoading(false));
      showMessage.warning('Email không hợp lệ!');
    }
  };

  return (
    <TemplateLogin>
      <View style={styles.containLogin}>
        <HeaderWithTitle
          hasLeft={true}
          title={t('forgot_password')}
          hasRight={false}
        />
        <View style={styles.formAuth}>
          <Text style={styles.descriptionSecurity}>
            Vui lòng nhập địa chỉ email đã đăng ký để chúng tôi gửi liên kết đặt
            lại mật khẩu.
          </Text>
          <View style={{ width: '100%', marginTop: 20 }}>
            <Input
              autoFocus
              ref={usernameRef}
              returnKeyType="done"
              iconName="email-outline"
              onSubmitEditing={onVerify}
              placeholder={t('your_email')}
            />
          </View>
        </View>
        <SafeAreaView style={styles.registerArea}>
          <AuthButton title={t('verify')} onPress={onVerify} />
        </SafeAreaView>
      </View>
    </TemplateLogin>
  );
};

export default VerifyMailScreen;
