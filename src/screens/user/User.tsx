import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import color from '@styles/color';
import { onLogout } from '@utils/logout';
import { userStyle } from '@styles/user.style';
import { IconLibrary } from '@components/base/index';
import { ActionButton } from '@components/home/actionButton';

export default function UserScreen({ navigation }: any) {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user.userInfo);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.WHITE }}>
      <View style={[userStyle.container, { flex: 1 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={userStyle.scrollViewContent}
        >
          <TouchableOpacity>
            <FastImage
              style={userStyle.fastImage}
              source={require('@assets/images/avatar.png')}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
          <Text style={userStyle.txtName}>{user?.name}</Text>
          <Text style={userStyle.titleFunction}>{t('trip')}</Text>
          <View style={userStyle.functionCard}>
            <TouchableOpacity style={userStyle.functionItem}>
              <IconLibrary
                library="Octicons"
                name="history"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('trip_history')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={userStyle.functionItem}>
              <IconLibrary
                library="Feather"
                name="users"
                size={20}
                color={color.MAIN}
              />
              <Text style={userStyle.txtFunction}>{t('refer_friends')}</Text>
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
            <TouchableOpacity style={userStyle.functionItem}>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
