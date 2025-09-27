import * as React from 'react';
import { useTranslation } from 'react-i18next';
import normalize from 'react-native-normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import i18n from '@i18n/index';
import color from '@styles/color';
import themeStyle from '@styles/theme.style';
import { USER_LANG, DataLanguage } from '@utils/deviceLang';
import HeaderWithTitle from '@components/header/headerWithTitle';
import { IconLibrary } from '@components/base/iconLibrary';

const ChangeLanguageScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  const onChangeLanguage = async (item: any) => {
    await i18n.changeLanguage(item);
    await AsyncStorage.setItem(USER_LANG, item);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderWithTitle title={t('app_language')} />
      <View style={{ paddingTop: normalize(8) }}>
        {DataLanguage.map(lang => {
          return (
            <TouchableOpacity
              onPress={() => onChangeLanguage(lang.value)}
              key={lang.value}
              style={[
                styles.itemLang,
                {
                  borderColor:
                    lang.value === currentLanguage
                      ? color.MAIN
                      : color.LIGHT_GRAY,
                },
              ]}
            >
              <Text style={styles.title}>{lang.label}</Text>
              {lang.value === currentLanguage && (
                <IconLibrary
                  library="Octicons"
                  name="check-circle-fill"
                  size={22}
                  color={color.MAIN}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {
    color: 'blue',
    fontSize: 20,
  },
  title: {
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    fontSize: 15,
  },
  itemLang: {
    borderWidth: 2,
    padding: normalize(16),
    margin: normalize(8),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: normalize(16),
    backgroundColor: color.LIGHT_GRAY,
    justifyContent: 'space-between',
  },
});

export default ChangeLanguageScreen;
