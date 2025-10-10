import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthApi } from '@api/auth';
import { showMessage } from '@utils/toast';
import { setIsLoading } from '@stores/action';
import { userStyle } from '@styles/user.style';
import Input from '@components/authentication/input';
import { ActionButton } from '@components/home/actionButton';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$@%])[A-Za-z\d!$@%]{8,}$/;

const ChangePasswordScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.userInfo);
  const oldPasswordRef = useRef<any>(null);
  const newPasswordRef = useRef<any>(null);
  const reNewPasswordRef = useRef<any>(null);

  const onChangePassword = async () => {
    const oldPassword = oldPasswordRef.current?.value?.trim();
    const newPassword = newPasswordRef.current?.value?.trim();
    const reNewPassword = reNewPasswordRef.current?.value?.trim();
    if (!oldPassword || !newPassword || !reNewPassword) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    if (newPassword !== reNewPassword) {
      showMessage.warning(t('password_mismatch'));
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      showMessage.warning(t('password_requirement'));
      return;
    }
    try {
      dispatch(setIsLoading(true));
      const res: any = await AuthApi.ChangePassword({
        email: user.email,
        password: oldPassword,
        newPassword: newPassword,
      });
      if (res?.code === 200) {
        showMessage.success(t('change_password_success'));
        navigation.goBack();
      } else {
        showMessage.fail(t(res.mess));
      }
    } catch (error: any) {
      showMessage.fail(t('change_password_failed'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar title={t('change_password')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={userStyle.viewCreateJournal}
      >
        <Text style={userStyle.titleChangePassword}>
          {t('password_requirement')}
        </Text>
        <Input
          ref={oldPasswordRef}
          returnKeyType="done"
          iconName="lock-outline"
          placeholder={t('current_password')}
          onSubmitEditing={() => newPasswordRef.current.focus()}
        />
        <Input
          ref={newPasswordRef}
          returnKeyType="done"
          iconName="lock-outline"
          placeholder={t('new_password')}
          onSubmitEditing={() => reNewPasswordRef.current.focus()}
        />
        <Input
          ref={reNewPasswordRef}
          returnKeyType="done"
          iconName="lock-outline"
          placeholder={t('confirm_new_password')}
          onSubmitEditing={onChangePassword}
        />
      </ScrollView>
      <SafeAreaView>
        <ActionButton title={t('change_password')} onPress={onChangePassword} />
      </SafeAreaView>
    </View>
  );
};

export default ChangePasswordScreen;
