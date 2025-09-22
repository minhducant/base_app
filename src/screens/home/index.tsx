import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

import { homeStyle } from '@styles/home.style';
import { endOngoingTrips } from '@stores/action';
import { useLocationPermission } from '@utils/permissions';
import { ActionButton } from '@components/home/actionButton';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const ongoingTrips = useSelector((state: any) =>
    state?.trip?.trip?.filter((t: any) => t.status === 'ongoing'),
  );
  const { status, checkPermission, openSettings } = useLocationPermission();
  const [region, setRegion] = useState<any>({});

  // const ongoingTrips = [
  //   {
  //     id: 'trip-phenikaa-jwmarriott',
  //     from: {
  //       name: 'Bệnh viện Đại học Phenikaa',
  //       lat: 20.980527,
  //       lng: 105.789991,
  //     },
  //     to: {
  //       name: 'JW Marriott Hotel Hanoi',
  //       lat: 21.016886,
  //       lng: 105.781167,
  //     },
  //     distance: 6.8, // km (ước lượng Google Maps)
  //     duration: 18, // phút
  //     transportation: 'car',
  //     co2: 1.35, // kg CO2 (fake theo hệ số ô tô ~0.2 kg/km)
  //     startedAt: new Date().toISOString(),
  //     status: 'ongoing',
  //   },
  // ];
  const trip = ongoingTrips[0];

  useEffect(() => {
    if (status === 'granted') {
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setRegion((prev: any) => ({
            ...prev,
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            coordinate: new AnimatedRegion({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }),
            time: 0,
            distance: 0,
            heading: 0,
          }));
        },
        err => {
          console.warn('Geolocation error:', err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  }, [status]);

  return (
    <SafeAreaView style={homeStyle.container}>
      <View style={homeStyle.viewTitleHome}>
        <Text style={homeStyle.txtTitleHome}>{t('map')} &</Text>
        <Text style={homeStyle.txtTitleHome}>{t('co2_estimate')}</Text>
      </View>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {status === 'loading' ? (
          <ActivityIndicator size="large" style={{ marginTop: 50 }} />
        ) : (
          <MapView
            ref={mapRef}
            mapType="hybrid"
            region={region}
            style={homeStyle.mapHome}
            showsUserLocation={status === 'granted'}
          >
            {/* <Marker
              draggable
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
              }}
              // onDragEnd={
              //   (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
              // }
              title={'Test Marker'}
            /> */}
          </MapView>
        )}
      </ScrollView>
      <ActionButton
        title={ongoingTrips.length > 0 ? t('end_journey') : t('start_journey')}
        onPress={() => {
          ongoingTrips.length > 0
            ? {}
            : navigation.navigate('NoFooter', {
                screen: 'SelectLocationScreen',
              });
        }}
      />
    </SafeAreaView>
  );
}
