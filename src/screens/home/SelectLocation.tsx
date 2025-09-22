import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import color from '@styles/color';
import { homeStyle } from '@styles/home.style';
import { IconLibrary } from '@components/base/iconLibrary';
import InputLocation from '@components/home/inputLocation';
import HeaderWithTitle from '@components/header/headerWithTitle';
import TemplateLogin from '@components/authentication/templateLogin';

const SelectLocationScreen = () => {
  const { t } = useTranslation();
  const toLocation = useRef<any>(null);
  const fromLocation = useRef<any>(null);
  const [dataAddress, setDataAddress] = useState([]);

  return (
    <>
      <HeaderWithTitle hasLeft={true} title={t('enter_from_to')} />
      <TemplateLogin>
        <View style={homeStyle.container}>
          <InputLocation
            ref={fromLocation}
            iconName="location-pin"
            placeholder={t('departure')}
            returnKeyType="search"
            onChangeText={() => {}}
            onSubmitEditing={() => {}}
          />
          <InputLocation
            ref={toLocation}
            iconName="my-location"
            placeholder={t('destination')}
            returnKeyType="search"
            autoFocus={false}
            onChangeText={() => {}}
            onSubmitEditing={() => {}}
          />
          <FlatList
            data={dataAddress}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={homeStyle.addressItem}>
                <></>
              </View>
            )}
          />
          <SafeAreaView>
            <TouchableOpacity
              activeOpacity={0.7}
              style={homeStyle.viewChooseFromMap}
            >
              <IconLibrary name="map" size={22} color={color.MAIN} />
              <Text style={homeStyle.txtChoseFromMap}>
                {t('choose_from_map')}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </TemplateLogin>
    </>
  );
};

export default SelectLocationScreen;
