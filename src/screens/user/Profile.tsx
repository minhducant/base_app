import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, TouchableOpacity } from 'react-native';

import { AuthApi } from '@api/auth';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';
import { userStyle } from '@styles/user.style';
import { getUserInfo } from '@stores/user/store';
import { InputText, InputSelect } from '@components/base';
import { ActionButton } from '@components/home/actionButton';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

function isValidEmail(email: string) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

const ProfileScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.userInfo);
  const userLabel = {
    name: {
      valueInit: user.name,
      title: t('full_name'),
      placeholder: `${t('input')} ${t('full_name').toLowerCase()}`,
      required: true,
    },
    phone: {
      valueInit: user.phone,
      title: t('phone_number'),
      placeholder: `${t('input')} ${t('phone_number').toLowerCase()}`,
      keyboardType: 'number-pad',
    },
    email: {
      valueInit: user.email,
      title: t('email'),
      placeholder: `${t('input')} ${t('email').toLowerCase()}`,
    },
    organization: {
      valueInit: user.organization,
      title: t('organization'),
      placeholder: `${t('select')} ${t('organization').toLowerCase()}`,
      titleSelect: `${t('search')} ${t('organization').toLowerCase()} ...`,
      data: [],
    },
  };
  const formRef = useRef<any>({ ...userLabel });

  const onUpdateAccount = async () => {
    const params = {
      phone: formRef.current.phone.getValue().trim() || '',
      email: formRef.current.email.getValue().trim() || '',
      name: formRef.current.name.getValue().trim() || '',
    };
    if (!params.name) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    if (params.email && !isValidEmail(params.email)) {
      showMessage.warning(t('invalid_email_format'));
      return;
    }
    dispatch(setIsLoading(true));
    const res: any = await AuthApi.UpdateUserInfo(user._id, params);
    if (res.code === 200) {
      await dispatch(getUserInfo());
      dispatch(setIsLoading(false));
      navigation.goBack();
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t(res.mess));
    }
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar title={t('update_account')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={userStyle.viewCreateJournal}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FastImage
            style={userStyle.fastImage}
            source={
              user?.image_url
                ? { uri: user.image_url, priority: FastImage.priority.normal }
                : require('@assets/images/avatar.png')
            }
            resizeMode={FastImage.resizeMode.cover}
          />
          <InputText
            {...userLabel.name}
            autoCapitalize="words"
            ref={(ref: any) => (formRef.current.name = ref)}
          />
          <InputText
            {...userLabel.email}
            autoCapitalize="none"
            keyboardType="email-address"
            ref={(ref: any) => (formRef.current.email = ref)}
          />
          <InputText
            {...userLabel.phone}
            keyboardType="number-pad"
            ref={(ref: any) => (formRef.current.phone = ref)}
          />
          <InputSelect
            {...userLabel.organization}
            ref={(ref: any) => (formRef.current.organization = ref)}
          />
        </TouchableOpacity>
      </ScrollView>
      <SafeAreaView>
        <ActionButton title={t('update_account')} onPress={onUpdateAccount} />
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
