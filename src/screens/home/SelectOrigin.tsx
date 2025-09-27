import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import normalize from 'react-native-normalize';
import Geolocation from 'react-native-geolocation-service';
import BackgroundFetch from "react-native-background-fetch";
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundGeolocation from 'react-native-background-geolocation';

import color from '@styles/color';
import { TripApi } from '@api/trip';
import { useTrip } from '@hooks/useTrip';
import { setIsLoading } from '@stores/action';
import { mapStyle as styles } from '@styles/map.style';
import { IconLibrary } from '@components/base/iconLibrary';
import { useLocationPermission } from '@utils/permissions';
import { showMessage, calculateVehicleCO } from '@utils/index';

const GOONG_API_KEY = 'DkSBL9dah2pFOo3jb6zV1LdnzERvk6uLJTIjyryG';
const GOONG_API_KEY1 = 'ZvwsEuYSDZIusmqP31xt8jd3XIBF1rU0pF4gQwQV';

const SelectOriginDestination = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const watchId = useRef<number | null>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const originInputRef = useRef<TextInput>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const { status, checkPermission, openSettings } = useLocationPermission();
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selecting, setSelecting] = useState<'origin' | 'destination' | null>(
    null,
  );
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [co2Estimates, setCo2Estimates] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<
    'car' | 'motorcycle' | 'bus' | 'bike'
  >('car');
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [co2Emitted, setCo2Emitted] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { ongoingTrips, loading } = useTrip();

  useEffect(() => {
    if (ongoingTrips && Object.keys(ongoingTrips).length > 0) {
      setOrigin(ongoingTrips.origin);
      setDestination(ongoingTrips.destination);
      setOriginText(ongoingTrips.origin_text || '');
      setDestinationText(ongoingTrips.destination_text || '');
      setRouteCoords(ongoingTrips.coord || []);
      if (ongoingTrips.distance_text) {
        setDistanceText(ongoingTrips.distance_text);
      }
      if (ongoingTrips.duration_text) {
        setDurationText(ongoingTrips.duration_text);
      }
      if (ongoingTrips.status === 'ongoing') {
        setIsTracking(true);
        setStartTime(new Date(ongoingTrips.startTime));
        setTotalDistance(ongoingTrips.distance || 0);
        setCo2Emitted(ongoingTrips.co2 || 0);
      }
    }
  }, [ongoingTrips]);

  useEffect(() => {
    BackgroundGeolocation.onLocation(location => {
      const coords: [number, number] = [
        location.coords.longitude,
        location.coords.latitude,
      ];
      setCurrentLocation(coords);
      if (isTracking) {
        if (routeCoords.length > 0) {
          const lastCoord = routeCoords[routeCoords.length - 1];
          const distance = calculateDistance(lastCoord, coords);
          setTotalDistance(prev => prev + distance);
  
          const factor: Record<string, number> = {
            car: 120,
            motorcycle: 50,
            bus: 30,
            truck: 150,
          };
          setCo2Emitted(prev => prev + distance * factor[selectedVehicle]);
          TripApi.updateTrip(ongoingTrips._id, {
            coord: coords,
            distance: totalDistance + distance,
            co2: co2Emitted + distance * factor[selectedVehicle],
            updatedAt: new Date(),
          });
        }
        setRouteCoords(prev => [...prev, coords]);
      }
    });
    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        stopOnTerminate: false, 
        startOnBoot: true, 
      },
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start();
        }
      },
    );
    return () => {
      BackgroundGeolocation.removeAllListeners();
    };
  }, [isTracking, routeCoords, totalDistance, co2Emitted, selectedVehicle]);
  


  useEffect(() => {
    if (origin && destination && distanceText !== '') {
      const distanceKm = parseFloat(distanceText.replace(/[^0-9.]/g, '')) || 0;
      if (!distanceKm) return;
      const factors: Record<'car' | 'bike' | 'bus' | 'truck', number> = {
        car: 120,
        bike: 50,
        bus: 30,
        truck: 150,
      };
      const emissions = Object.entries(factors).map(([vehicle, factor]) => ({
        vehicle,
        co2: distanceKm * factor,
      }));
      const best = emissions.reduce((min, curr) =>
        curr.co2 < min.co2 ? curr : min,
      );
      const vehicleName: any = {
        car: t('car'),
        bike: t('bike'),
        bus: t('bus'),
        truck: t('truck'),
      };
      Alert.alert(
        t('transport_suggestion'),
        `${t('distance')} ${distanceKm.toFixed(2)} km.\n` +
          `${t('best_choice_to_reduce_co2')}: ${
            vehicleName[best.vehicle]
          } (${best.co2.toFixed(2)} g CO₂).`,
        [{ text: 'OK' }],
      );
    }
  }, [origin, destination, distanceText]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (status !== 'granted') {
        await checkPermission();
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCurrentLocation(coords);
        },
        error => {
          showMessage.fail(t('error_get_current_location'));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    fetchCurrentLocation();
  }, [status]);

  useEffect(() => {
    if (origin && destination) {
      fetchRoute(selectedVehicle);
    }
  }, [origin, destination]);

  const startTracking = async () => {
    if (!status || status !== 'granted') {
      openSettings();
      return;
    }
    try {
      dispatch(setIsLoading(true));
      const res = await TripApi.createTrip({
        origin,
        destination,
        distance: 0,
        origin_text: originText,
        destination_text: destinationText,
        vehicle: selectedVehicle,
        status: 'ongoing',
        coord: routeCoords,
      });
      if (!res?.client_id) {
        showMessage.fail(t('cannot_create_trip'));
        dispatch(setIsLoading(false));
        return;
      }
      setIsTracking(true);
      setStartTime(new Date());
      setCo2Estimates(0);
      setDurationText('0');
      setTotalDistance(0);
      setDistanceText('0');
      BackgroundGeolocation.start();
      Geolocation.watchPosition(
        (position: { coords: { longitude: number; latitude: number } }) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          setCurrentLocation(coords);
          if (routeCoords.length > 0) {
            const lastCoord = routeCoords[routeCoords.length - 1];
            const distance = calculateDistance(lastCoord, coords);
            setTotalDistance(prev => prev + distance);
            const factor: any = {
              car: 120,
              motorcycle: 50,
              bus: 30,
              bike: 0,
            };
            setCo2Emitted(prev => prev + distance * factor[selectedVehicle]);
          }
        },
        (error: any) => {},
        { enableHighAccuracy: true, distanceFilter: 10 },
      );
    } catch (err) {
      showMessage.fail(t('error_occurred'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const stopTracking = async () => {
    if (!ongoingTrips || !ongoingTrips._id) {
      showMessage.fail('Không có chuyến đi nào đang diễn ra');
      return;
    }
    dispatch(setIsLoading(true));
    const res: any = await TripApi.updateTrip(ongoingTrips._id, {
      endedAt: new Date(),
      status: 'ended',
    });
    if (res?.code === 200) {
      showMessage.success('Kết thúc chuyến đi thành công');
      setIsTracking(false);
      Geolocation.stopObserving();
      BackgroundGeolocation.stop();
    } else {
      showMessage.fail('Kết thúc chuyến đi thất bại');
    }
    dispatch(setIsLoading(false));
  };

  const calculateDistance = (
    coord1: [number, number],
    coord2: [number, number],
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);
    const lat1 = toRad(coord1[1]);
    const lat2 = toRad(coord2[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleEndTrip = () => {
    setIsTracking(false);
    Alert.alert(
      'Trip Ended',
      `Total Distance: ${totalDistance.toFixed(
        2,
      )} km\nCO₂ Emitted: ${co2Emitted.toFixed(2)}`,
    );
    setTotalDistance(0);
    setCo2Emitted(0);
    setRouteCoords([]);
    setOrigin(null);
    setDestination(null);
    setOriginText('');
    setDestinationText('');
  };

  const fetchSuggestions = async (text: string) => {
    setQuery(text);
    if (text.length < 2) return;
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${text}`,
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  const handleSelectSuggestion = async (
    placeId: string,
    description: string,
  ) => {
    setSuggestions([]);
    setSelecting(null);
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      const loc = data.result.geometry.location;
      const coords: [number, number] = [loc.lng, loc.lat];
      if (selecting === 'origin') {
        setOrigin(coords);
        setOriginText(data.result.formatted_address || description);
      } else if (selecting === 'destination') {
        setDestination(coords);
        setDestinationText(data.result.formatted_address || description);
      }
      setQuery('');
      setSelecting(null);
      setSuggestions([]);
    } catch (err) {
      console.error('Place detail error:', err);
    }
  };

  // Giải mã polyline
  const decodePolyline = (str: string, precision = 5) => {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates: [number, number][] = [],
      shift,
      result,
      byte,
      latitude_change,
      longitude_change,
      factor = Math.pow(10, precision);
    while (index < str.length) {
      shift = result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
      shift = result = 0;
      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;
      coordinates.push([lng / factor, lat / factor]);
    }
    return coordinates;
  };

  const fetchRoute = async (vehicle: any) => {
    if (!origin || !destination) return;
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Direction?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&vehicle=${vehicle}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      if (data?.routes?.length > 0) {
        const route = data.routes[0];
        console.log('route', route);
        const coords = decodePolyline(route.overview_polyline.points);
        setRouteCoords(coords);
        // Fit camera
        let minLng = Infinity,
          minLat = Infinity,
          maxLng = -Infinity,
          maxLat = -Infinity;
        coords.forEach(([lng, lat]) => {
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
        });
        if (cameraRef.current) {
          cameraRef.current.fitBounds(
            [minLng, minLat],
            [maxLng, maxLat],
            50,
            1000,
          );
        }
        if (!isTracking) {
          setDistanceText(route.legs[0].distance.text);
          setDurationText(route.legs[0].duration.text);
          // Ước tính CO₂
          const distanceKm = route.legs[0].distance.value / 1000;
          const estimates = calculateVehicleCO(vehicle, distanceKm);
          setCo2Estimates(estimates);
        }
      } else {
        console.warn('Không tìm thấy route');
      }
    } catch (err) {
      console.error('Route error:', err);
    }
  };

  const vehicles = [
    { key: 'car', label: t('car') },
    { key: 'bike', label: t('bike') },
    { key: 'truck', label: t('truck') },
    { key: 'bus', label: t('bus') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={color.MAIN} />
        </View>
      ) : (
        <>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={originInputRef}
              style={styles.input}
              editable={!isTracking}
              placeholder={t('select_departure')}
              value={selecting === 'origin' ? query : originText}
              onFocus={() => setSelecting('origin')}
              onChangeText={text => fetchSuggestions(text)}
            />
            {originText !== '' && !isTracking && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setOrigin(null);
                  setOriginText('');
                  setRouteCoords([]);
                  setDistanceText('');
                  setDurationText('');
                  setCo2Estimates(null);
                  originInputRef.current?.clear();
                }}
              >
                <Text style={styles.text}>✖</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={destinationInputRef}
              style={styles.input}
              editable={!isTracking}
              placeholder={t('select_destination')}
              value={selecting === 'destination' ? query : destinationText}
              onFocus={() => setSelecting('destination')}
              onChangeText={text => fetchSuggestions(text)}
            />
            {destinationText !== '' && !isTracking && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setDestination(null);
                  setDestinationText('');
                  setRouteCoords([]);
                  setDistanceText('');
                  setDurationText('');
                  setCo2Estimates(null);
                  destinationInputRef.current?.clear();
                }}
              >
                <Text style={styles.text}>✖</Text>
              </TouchableOpacity>
            )}
          </View>
          {selecting && (
            <FlatList
              data={suggestions}
              ListHeaderComponent={
                selecting === 'origin' ? (
                  <TouchableOpacity
                    style={styles.suggestionHeader}
                    onPress={() => {
                      if (currentLocation) {
                        setOrigin(currentLocation);
                        setOriginText(t('your_location'));
                        setSuggestions([]);
                        setSelecting(null);
                      } else {
                        showMessage.fail('Không lấy được vị trí hiện tại');
                      }
                    }}
                  >
                    <IconLibrary
                      library="MaterialIcons"
                      name="location-on"
                      size={20}
                      color="#333"
                    />
                    <Text style={[styles.text, { marginLeft: 8 }]}>
                      {t('your_location')}
                    </Text>
                  </TouchableOpacity>
                ) : null
              }
              style={{
                position: 'absolute',
                top: normalize(150),
                left: 10,
                right: 10,
                zIndex: 1,
                backgroundColor: '#fff',
                borderRadius: 5,
              }}
              keyExtractor={item => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() =>
                    handleSelectSuggestion(item.place_id, item.description)
                  }
                >
                  <Text style={styles.text}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <View style={styles.vehicleBar}>
            <FlatList
              horizontal
              data={vehicles}
              keyExtractor={item => item.key}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  disabled={isTracking}
                  style={[
                    styles.vehicleButton,
                    selectedVehicle === item.key && styles.vehicleButtonActive,
                    isTracking &&
                      selectedVehicle !== item.key && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    setSelectedVehicle(item.key as any);
                    fetchRoute(item.key as any);
                  }}
                >
                  <Text
                    style={[
                      {
                        color: selectedVehicle === item.key ? '#fff' : '#333',
                      },
                      styles.txtVehicle,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
          <View style={styles.mapContainer}>
            <MapboxGL.MapView
              style={styles.map}
              styleURL={`https://tiles.goong.io/assets/goong_map_web.json?api_key=${GOONG_API_KEY1}`}
            >
              <MapboxGL.Camera
                ref={cameraRef}
                zoomLevel={11}
                animationMode="none"
                animationDuration={0}
                centerCoordinate={currentLocation ?? undefined}
              />
              {currentLocation && (
                <MapboxGL.PointAnnotation
                  id="currentLocation"
                  coordinate={currentLocation}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: 'blue',
                      borderRadius: 10,
                    }}
                  />
                </MapboxGL.PointAnnotation>
              )}
              {origin && (
                <MapboxGL.PointAnnotation id="origin" coordinate={origin}>
                  <IconLibrary
                    library="FontAwesome"
                    name="map-marker"
                    size={30}
                    color={color.MAIN}
                  />
                </MapboxGL.PointAnnotation>
              )}
              {destination && (
                <MapboxGL.PointAnnotation
                  id="destination"
                  coordinate={destination}
                >
                  <IconLibrary
                    library="FontAwesome"
                    name="map-marker"
                    size={30}
                    color={color.MAIN}
                  />
                </MapboxGL.PointAnnotation>
              )}
              {routeCoords.length > 0 && (
                <MapboxGL.ShapeSource
                  id="routeSource"
                  shape={{
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: routeCoords,
                    },
                    properties: {},
                  }}
                >
                  <MapboxGL.LineLayer
                    id="routeLine"
                    style={{ lineColor: 'blue', lineWidth: 5 }}
                  />
                </MapboxGL.ShapeSource>
              )}
            </MapboxGL.MapView>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.text}>
              {t('distance')}: {distanceText || '0 km'}
            </Text>
            <Text style={styles.text}>
              {t('duration')}: {durationText || '0 phút'}
            </Text>
            <Text style={styles.text}>
              {t('co2_estimate')}: {co2Estimates?.toFixed(2) || 0} g
            </Text>
          </View>
          {!isTracking ? (
            <View style={styles.bottomButton}>
              <TouchableOpacity
                disabled={!origin || !destination}
                style={[
                  styles.startButton,
                  (!origin || !destination) && { opacity: 0.5 },
                ]}
                onPress={() => startTracking()}
              >
                <Text style={styles.buttonText}>{t('start_journey')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleEndTrip}
              >
                <Text style={styles.buttonText}>{t('reset')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.bottomButton}>
              <TouchableOpacity
                style={styles.endButton}
                onPress={() => stopTracking()}
              >
                <Text style={styles.buttonText}>{t('end_journey')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default SelectOriginDestination;
