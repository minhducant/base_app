import React from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import normalize from 'react-native-normalize';

import Colors from '@styles/color';
import theme from '@styles/theme.style';
import {openDrawer, navigate} from '@navigation/rootNavigation';

interface HeaderProps {
  title: string;
}

const statusBarHeight = StatusBar.currentHeight;

export default function HeaderBottomTab({title = ''}: HeaderProps) {
  const {t} = useTranslation();

  const onNavigateNotification = () => {
    navigate('NotificationsScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        barStyle="dark-content"
        backgroundColor={'transparent'}
      />
      {/* <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <IconMenu />
      </TouchableOpacity> */}
      <Text style={styles.title} numberOfLines={1}>
        {t(title)}
      </Text>
      {/* <TouchableOpacity
        style={styles.menuButton}
        onPress={onNavigateNotification}>
        <IconNotification />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: Platform.OS === 'android' ? statusBarHeight : normalize(50),
    paddingBottom: normalize(10),
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.FONT_BOLD,
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.BLACK,
    marginTop: normalize(12),
  },
  menuButton: {
    marginTop: Platform.OS === 'android' ? normalize(10) : 0,
    width: normalize(36),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(36),
    backgroundColor: '#FFFFFF70',
    borderRadius: normalize(8),
  },
});
