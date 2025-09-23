import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@i18n/index';
import color from '@styles/color';
import { mapApi } from '@api/map';
import { showMessage } from '@utils/index';
import { homeStyle } from '@styles/home.style';
import { setIsLoading, addTrip } from '@stores/action';
import { IconLibrary } from '@components/base/iconLibrary';
import InputLocation from '@components/home/inputLocation';
import { useLocationPermission } from '@utils/permissions';
import { ActionButton } from '@components/home/actionButton';
import HeaderWithTitle from '@components/header/headerWithTitle';
import TemplateLogin from '@components/authentication/templateLogin';

const LATITUDE_DELTA = 0.04;
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectLocationScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const toLocation = useRef<any>(null);
  const fromLocation = useRef<any>(null);
  const { status } = useLocationPermission();
  const [to, setTo] = useState<any>({});
  const [from, setFrom] = useState<any>({});
  const [dataAddress, setDataAddress] = useState([]);
  const [focusField, setFocusField] = useState<'from' | 'to' | null>('to');

  useEffect(() => {
    if (status === 'granted') {
      handleGetCurrentLocation();
    }
  }, [status]);

  const handleGetCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        async pos => {
          dispatch(setIsLoading(true));
          try {
            const { latitude, longitude } = pos.coords;
            const res: any = await mapApi.getDirection(latitude, longitude);
            if (res?.place_id) {
              const address = res?.formatted_address;
              fromLocation?.current?.setValue(t("current_location"));
              setFrom((prev: any) => ({
                ...prev,
                latitude,
                longitude,
                name: address,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
                coordinate: new AnimatedRegion({
                  latitude,
                  longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }),
                time: 0,
                distance: 0,
                heading: 0,
              }));
              toLocation?.current?.focus();
            }
          } catch (apiErr) {
          } finally {
            dispatch(setIsLoading(false));
          }
        },
        err => {
          dispatch(setIsLoading(false));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (outerErr) {
      dispatch(setIsLoading(false));
    }
  };

  const handleSearch = async (text: string) => {
    if (text.length > 2) {
      try {
        const res: any = await mapApi.getLocationByAddress(text);
        console.log('res', res);
        if (res.status === 'OK') {
          setDataAddress(res?.results || []);
        }
      } catch (e) {}
    } else {
      setDataAddress([]);
    }
  };

  const handleSelectAddress = (item: any) => {
    const { lat, lng } = item.geometry.location;
    const address = item.formatted_address;
    const locationData = {
      latitude: lat,
      longitude: lng,
      name: address,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      coordinate: new AnimatedRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      place_id: item.place_id,
    };
    if (focusField === 'from') {
      fromLocation?.current?.setValue(address);
      setFrom(locationData);
    } else if (focusField === 'to') {
      toLocation?.current?.setValue(address);
      setTo(locationData);
    }
    setDataAddress([]);
  };

  const createTrip = () => {
    if (!to?.name || !from?.name) {
      showMessage.warning(t('please_select_from_to'));
      return;
    }
    navigation.navigate('NoFooter', {
      screen: 'MapCheckScreen',
      params: { from, to },
    });
  };

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
            onChangeText={handleSearch}
            setDataAddress={setDataAddress}
            onFocus={() => setFocusField('from')}
            actionLeft={handleGetCurrentLocation}
            onSubmitEditing={(e: { nativeEvent: { text: string } }) =>
              handleSearch(e.nativeEvent.text)
            }
          />
          <InputLocation
            ref={toLocation}
            iconName="my-location"
            placeholder={t('destination')}
            returnKeyType="search"
            onChangeText={handleSearch}
            setDataAddress={setDataAddress}
            onFocus={() => setFocusField('to')}
            onSubmitEditing={(e: { nativeEvent: { text: string } }) =>
              handleSearch(e.nativeEvent.text)
            }
          />
          <FlatList
            data={dataAddress}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }: any) => (
              <TouchableOpacity
                key={index}
                style={homeStyle.addressItem}
                onPress={() => handleSelectAddress(item)}
              >
                <IconLibrary
                  size={22}
                  library="MaterialIcons"
                  name={'location-pin'}
                  color={color.MAIN}
                />
                <View>
                  <Text style={homeStyle.titleAddressItem}>
                    {item.formatted_address}
                  </Text>
                </View>
              </TouchableOpacity>
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
            <ActionButton title={t('start')} onPress={createTrip} />
          </SafeAreaView>
        </View>
      </TemplateLogin>
    </>
  );
};

export default SelectLocationScreen;
