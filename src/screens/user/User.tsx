import {
  View,
  Text,
  Platform,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import color from '@styles/color';
import { onLogout } from '@utils/logout';
import { userStyle } from '@styles/user.style';
import { IconLibrary } from '@components/base/index';
import { ActionButton } from '@components/home/actionButton';

const getAppVersion = () => {
  if (Platform.OS === 'ios') {
    return (
      NativeModules.SettingsManager?.settings?.CFBundleShortVersionString ??
      '1.0.0'
    );
  } else if (Platform.OS === 'android') {
    return NativeModules?.AppInfo?.versionName ?? '1.0.0';
  }
  return '1.0.0';
};

export default function UserScreen({ navigation }: any) {
  const { t } = useTranslation();
  const appVersion = getAppVersion();
  const user = useSelector((state: any) => state.user.userInfo);

  return (
    <LinearGradient
      end={{ x: 0, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={userStyle.container}
      colors={['#99EBD1', '#FBFBFC']}
    >
      <SafeAreaView>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={userStyle.scrollViewContent}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('NoFooter', {
                screen: 'ProfileScreen',
              })
            }
          >
            <FastImage
              style={userStyle.fastImage}
              source={
                user?.image_url
                  ? { uri: user.image_url, priority: FastImage.priority.normal }
                  : require('@assets/images/avatar.png')
              }
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={userStyle.viewEditIcon}>
              <IconLibrary
                library="MaterialIcons"
                name="edit"
                size={16}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
          <Text style={userStyle.txtName}>{user?.name}</Text>
          <Text style={userStyle.titleFunction}>{t('trip')}</Text>
          <View style={userStyle.functionCard}>
            <TouchableOpacity
              style={userStyle.functionItem}
              onPress={() =>
                navigation.navigate('NoFooter', {
                  screen: 'JournalScreen',
                })
              }
            >
              <IconLibrary
                library="Octicons"
                name="history"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('trip_journal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={userStyle.functionItem}
              onPress={() =>
                navigation.navigate('NoFooter', {
                  screen: 'GoalScreen',
                })
              }
            >
              <IconLibrary
                library="Entypo"
                name="flag"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('monthly_goal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={userStyle.functionItem}
              onPress={() =>
                navigation.navigate('NoFooter', {
                  screen: 'ReportScreen',
                })
              }
            >
              <IconLibrary
                library="MaterialIcons"
                name="insert-chart-outlined"
                size={24}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('emission_report')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={userStyle.titleFunction}>{t('utilities')}</Text>
          <View style={userStyle.functionCard}>
            <TouchableOpacity
              style={userStyle.functionItem}
              onPress={() =>
                navigation.navigate('NoFooter', {
                  screen: 'ChangeLanguageScreen',
                })
              }
            >
              <IconLibrary
                library="FontAwesome"
                name="language"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('app_language')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={userStyle.functionItem}
              onPress={() =>
                navigation.navigate('NoFooter', {
                  screen: 'SettingsScreen',
                })
              }
            >
              <IconLibrary
                library="Ionicons"
                name="settings-outline"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('settings')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={userStyle.functionItem}>
              <IconLibrary
                library="FontAwesome5"
                name="file-alt"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('terms_policies')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={userStyle.functionItem}>
              <IconLibrary
                library="FontAwesome5"
                name="headset"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('support_center')}</Text>
            </TouchableOpacity>
          </View>
          <ActionButton title={t('sign_out')} onPress={onLogout} />
          <Text style={[userStyle.txtVerion]}>
            {t('version')}: {appVersion}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
