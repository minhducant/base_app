import React from 'react';
import {
  View,
  Text,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import normalize from 'react-native-normalize';
import { useNavigation } from '@react-navigation/native';

import Colors from '@styles/color';
import theme from '@styles/theme.style';
import { IconLibrary } from '@components/base/iconLibrary';

interface HeaderProps {
  iconName?: string;
  title: string;
  hasLeft?: boolean;
  hasRight?: boolean;
  hasDelete?: boolean;
  hasFilter?: boolean;
  hasActionLeft?: boolean;
  clickIcon?: () => void;
  onPressLeft?: () => void;
  renderRight?: () => any;
  actionLeft?: () => void;
  onFilter?: () => void;
  onDelete?: () => void;
}

interface NavigationProps {
  navigate: (route: string, params?: { screen: string; params: any }) => void;
  canGoBack(): () => void;
  goBack: () => void;
}

export default function HeaderBackStatusBar({
  title = '',
  hasLeft = true,
  hasRight = false,
  hasActionLeft = false,
  actionLeft = () => {},
}: HeaderProps) {
  const navigation: NavigationProps = useNavigation();

  const _onGoBack = () => {
    hasActionLeft
      ? actionLeft()
      : navigation.canGoBack()
      ? navigation.goBack()
      : null;
  };



  const onGoHome = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.upperHeader}>
            <View style={styles.viewBack}>
              {hasLeft && (
                <TouchableOpacity onPress={_onGoBack}>
                  <IconLibrary
                    library="Ionicons"
                    name="chevron-back"
                    size={25}
                    color={Colors.BLACK}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {hasRight ? (
              <TouchableOpacity onPress={onGoHome} style={styles.viewBack}>
                <IconLibrary
                  library="AntDesign"
                  name="home"
                  size={20}
                  color={Colors.BLACK}
                />
              </TouchableOpacity>
            ): (<View style={styles.viewBack}/>)}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.WHITE,
  },
  header: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: normalize(16),
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // paddingBottom: normalize(10),
  },
  upperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(40),
  },
  viewBack: {
    width: normalize(28, 'height'),
    height: normalize(28, 'height'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: normalize(10),
    borderColor: '#F3F4F6',
    marginRight: normalize(8),
  },
  title: {
    fontSize: 16,
    fontFamily: theme.FONT_BOLD,
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.BLACK,
  },
  cartContainer: {
    width: normalize(28, 'height'),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(45),
    marginBottom: normalize(10),
  },
  txtNumProduct: {
    fontSize: 14,
    fontFamily: theme.FONT_FAMILY,
    color: Colors.WHITE,
  },
  numProduct: {
    backgroundColor: Colors.MAIN,
    position: 'absolute',
    zIndex: 2,
    paddingHorizontal: normalize(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    right: normalize(10),
    bottom: normalize(20),
    width: normalize(20),
    height: normalize(20),
  },
});
