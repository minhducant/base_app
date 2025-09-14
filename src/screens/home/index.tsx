/* eslint-disable react-native/no-inline-styles */
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

import { onLogout } from '@utils/logout';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={onLogout}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
