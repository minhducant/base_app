import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import { useDispatch } from 'react-redux';
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

const MapCheckScreen = ({ navigation, route }: any) => {
  const params = route.params || {};
  const mapRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [mode, setMode] = useState<
    'driving' | 'walking' | 'bicycling' | 'transit'
  >('driving');

  useEffect(() => {
    getRoute();
  }, [mode]);

  const getRoute = async () => {
    dispatch(setIsLoading(true));
    try {
      const res: any = await mapApi.getRoute(
        {
          lat: params?.from?.latitude,
          lng: params?.from?.longitude,
        },
        {
          lat: params?.to?.latitude,
          lng: params?.to?.longitude,
        },
        mode,
      );
      console.log('route', res);
      dispatch(setIsLoading(false));
    } catch (error) {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <>
      <HeaderWithTitle hasLeft={true} title={t('choose_route')} />
      <TemplateLogin>
        <View style={homeStyle.container}>
          <MapView
            ref={mapRef}
            mapType="hybrid"
            style={homeStyle.mapCheck}
            initialRegion={{
              latitude: params?.from?.latitude,
              longitude: params?.from?.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showsUserLocation={true}
          >
            {/* <Marker coordinate={params?.from} title="Điểm đi" />
            <Marker coordinate={params?.to} title="Điểm đến" /> */}
          </MapView>
          <SafeAreaView>
            <ActionButton title={t('start_journey')} onPress={() => {}} />
          </SafeAreaView>
        </View>
      </TemplateLogin>
    </>
  );
};

export default MapCheckScreen;
