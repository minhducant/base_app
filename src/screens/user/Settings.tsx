import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  Linking,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { showMessage } from '@utils/toast';
import { userStyle } from '@styles/user.style';
import { IconLibrary } from '@components/base';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const SettingsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.userInfo);

  const openNotificationSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      showMessage.fail(t('cannot_open_settings'));
    }
  };

  const openLocationSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('App-Prefs:Privacy&path=LOCATION');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      showMessage.fail(t('cannot_open_settings'));
    }
  };

  const listSetting = [
    {
      title: t('change_password'),
      screen: 'ChangePasswordScreen',
      icon: 'lock-closed',
      library: 'Ionicons',
    },
    {
      title: t('notifications'),
      screen: '',
      icon: 'notifications',
      library: 'Ionicons',
    },
    {
      title: t('location'),
      screen: '',
      icon: 'location',
      library: 'Ionicons',
    },
    {
      title: t('report_feedback'),
      screen: '',
      icon: 'warning',
      library: 'Ionicons',
    },
    {
      title: t('about_ecomove'),
      screen: '',
      icon: 'information-circle-sharp',
      library: 'Ionicons',
    },
  ];

  const renderItem = ({ item, index }: any) => {
    const onPress = async () => {
      if (item.icon === 'notifications') {
        openNotificationSettings();
        return;
      }
      if (item.icon === 'location') {
        openLocationSettings();
        return;
      }
      if (item.screen === 'ChangePasswordScreen') {
        if (user?.email && user.email.trim() !== '') {
          navigation.navigate('NoFooter', { screen: item.screen });
        } else {
          showMessage.help(t('forgot_password_email_only'));
        }
        return;
      }
      if (item.screen) {
        navigation.navigate('NoFooter', {
          screen: item.screen,
        });
      } else {
        showMessage.help(t('function_under_development'));
      }
    };

    return (
      <TouchableOpacity
        key={index}
        onPress={onPress}
        activeOpacity={0.7}
        style={userStyle.settingItem}
      >
        <IconLibrary
          library={item.library}
          name={item.icon}
          size={20}
          color={'#253255'}
        />
        <Text style={userStyle.txtSettingItem}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar title={t('settings')} />
      <FlatList
        data={listSetting}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
      />
    </View>
  );
};

export default SettingsScreen;
