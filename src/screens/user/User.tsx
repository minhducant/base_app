import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

import { onLogout } from '@utils/logout';
import { userStyle } from '@styles/user.style';
import { setIsLoading } from '@stores/action';
import { ActionButton } from '@components/home/actionButton';
import HeaderBottomTab from '@components/header/headerBottomTab';

export default function UserScreen() {
  const userInfo = useSelector((state: any) => state.user.userInfo);

  return (
    <View>
      <HeaderBottomTab title="account" />
      <View style={userStyle.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ActionButton title="Đăng xuất" onPress={onLogout} />
        </ScrollView>
      </View>
    </View>
  );
}
