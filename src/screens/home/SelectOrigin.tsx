import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import normalize from 'react-native-normalize';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundGeolocation from 'react-native-background-geolocation';

import color from '@styles/color';
import { TripApi } from '@api/trip';
import { useTrip } from '@hooks/useTrip';
import { LogTelegram } from '@utils/telegram';
import { setIsLoading } from '@stores/action';
import { mapStyle as styles } from '@styles/map.style';
import { IconLibrary } from '@components/base/iconLibrary';
import { useLocationPermission } from '@utils/permissions';
import { showMessage, calculateVehicleCO } from '@utils/index';

const GOONG_API_KEY = 'gwDzlAb8g0zJCMbZOpIZcZZC2c7jQcpmHqNYEqXu';
const GOONG_API_KEY1 = '2yGbwvmxDzSnhqqU2nWLJdnY4LlozlWcLdg7GVtF';
MapboxGL.setAccessToken(GOONG_API_KEY1);

const SelectOriginDestination = () => {
  // UI state
  const [isTracking, setIsTracking] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const alertShownRef = useRef(false);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  // them xe
  const [vehicleFuelType, setVehicleFuelType] = useState<
    'gasoline' | 'electric'
  >('gasoline');

  // Trip state
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [co2Emitted, setCo2Emitted] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distanceText, setDistanceText] = useState('');
  const [durationText, setDurationText] = useState('');
  const [co2Estimates, setCo2Estimates] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<
    'car' | 'motorcycle' | 'bus' | 'bike'
  >('car');

  // Search state (separate for origin/destination)
  const [originQuery, setOriginQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>(
    [],
  );
  const [selecting, setSelecting] = useState<'origin' | 'destination' | null>(
    null,
  );

  // Hooks and refs
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const originInputRef = useRef<TextInput>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const { status, checkPermission, openSettings } = useLocationPermission();
  const { ongoingTrips } = useTrip();
  const ongoingTripsRef = useRef(ongoingTrips);

  // Fit camera to route coordinates (same logic as fetchRoute)
  const fitRouteCameraToCoords = (coords: [number, number][]) => {
    if (!coords || coords.length === 0) return;
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
    const deltaLng = Math.abs(maxLng - minLng);
    const deltaLat = Math.abs(maxLat - minLat);
    let padding = 50;
    if (deltaLng < 0.001 && deltaLat < 0.001) {
      padding = 0;
    } else if (deltaLng < 0.003 && deltaLat < 0.003) {
      padding = 10;
    } else if (deltaLng < 0.01 && deltaLat < 0.01) {
      padding = 30;
    } else if (deltaLng < 0.05 && deltaLat < 0.05) {
      padding = 100;
    }
    // Chỉ fit camera khi chưa tracking
    if (!isTracking && cameraRef.current) {
      cameraRef.current.fitBounds(
        [minLng, minLat],
        [maxLng, maxLat],
        padding,
        1000,
      );
      if (deltaLng < 0.002 && deltaLat < 0.002) {
        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;
        setTimeout(() => {
          cameraRef.current?.setCamera({
            centerCoordinate: [centerLng, centerLat],
            zoomLevel: 17,
            animationDuration: 800,
          });
        }, 1100); // delay để fitBounds xong mới setCamera
      }
    }
  };

  // Helper: Reset all state to initial
  const resetAllState = () => {
    setOrigin(null);
    setDestination(null);
    setOriginText('');
    setDestinationText('');
    setRouteCoords([]);
    setDistanceText('');
    setDurationText('');
    setCo2Estimates(null);
    setTotalDistance(0);
    setCo2Emitted(0);
    setStartTime(null);
    setOriginQuery('');
    setOriginSuggestions([]);
    setDestinationQuery('');
    setDestinationSuggestions([]);
    setSelecting(null);
    setIsTracking(false);
    // setCurrentLocation(null);
  };

  useEffect(() => {
    ongoingTripsRef.current = ongoingTrips;
  }, [ongoingTrips]);

  // Chỉ update center khi tracking, không set lại zoomLevel để tránh zoom in/out liên tục
  useEffect(() => {
    if (
      isTracking &&
      currentLocation &&
      cameraRef.current &&
      hasMovedFromOrigin(currentLocation, origin)
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation,
        animationDuration: 800,
      });
    }
  }, [isTracking, currentLocation, origin]);
  // ...existing code...

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
    // Listener khi có location mới
    // Lưu vị trí trước đó để tính quãng đường thực tế khi tracking
    const prevLocationRef = { current: null as [number, number] | null };
    const onLocation = BackgroundGeolocation.onLocation(location => {
      const coords: [number, number] = [
        location.coords.longitude,
        location.coords.latitude,
      ];
      setCurrentLocation(coords);
      if (isTracking) {
        // Tính quãng đường thực tế đã đi
        let added = 0;
        if (prevLocationRef.current) {
          added = calculateDistance(prevLocationRef.current, coords);
        }
        prevLocationRef.current = coords;
        // Cộng dồn quãng đường
        setTotalDistance(prev => {
          const newTotal = prev + added;
          // Tính CO2
          const factor: Record<string, number> = {
            car: 120,
            motorcycle: 50,
            bus: 30,
            truck: 150,
          };
          const co2 = newTotal * factor[selectedVehicle];
          setCo2Emitted(co2);
          setCo2Estimates(co2);
          setDistanceText(`${newTotal.toFixed(2)} km`);
          // Duration thực tế
          if (startTime) {
            const now = new Date();
            const diff = (now.getTime() - startTime.getTime()) / 1000; // giây
            let durationStr = '';
            if (diff < 60) durationStr = `${Math.round(diff)} giây`;
            else if (diff < 3600)
              durationStr = `${Math.floor(diff / 60)} phút ${Math.round(
                diff % 60,
              )} giây`;
            else
              durationStr = `${Math.floor(diff / 3600)} giờ ${Math.floor(
                (diff % 3600) / 60,
              )} phút`;
            setDurationText(durationStr);
          }
          // Kiểm tra đến đích
          if (destination) {
            const toRad = (value: number) => (value * Math.PI) / 180;
            const R = 6371; // km
            const dLat = toRad(destination[1] - coords[1]);
            const dLon = toRad(destination[0] - coords[0]);
            const lat1 = toRad(coords[1]);
            const lat2 = toRad(destination[1]);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) *
                Math.sin(dLon / 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = R * c * 1000; // mét
            if (dist < 100) {
              setIsTracking(false);
              stopTracking();
              setShowSummaryModal(true);
              return newTotal;
            }
          }
          return newTotal;
        });
      } else if (origin && destination && routeCoords.length > 1) {
        // Khi KHÔNG tracking: cập nhật distance, duration, co2_estimate dựa trên routeCoords (tuyến đường đã chọn)
        let total = 0;
        for (let i = 1; i < routeCoords.length; i++) {
          total += calculateDistance(routeCoords[i - 1], routeCoords[i]);
        }
        setTotalDistance(total);
        setDistanceText(`${total.toFixed(2)} km`);
        // Tính CO2
        const factor: Record<string, number> = {
          car: 120,
          motorcycle: 50,
          bus: 30,
          truck: 150,
        };
        const co2 = total * factor[selectedVehicle];
        setCo2Emitted(co2);
        setCo2Estimates(co2);
        // Duration: giả lập 30km/h
        const duration = (total / 30) * 60; // phút
        setDurationText(`${Math.round(duration)} phút`);
      }
    });
    // Config
    BackgroundGeolocation.ready(
      {
        desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        distanceFilter: 0, // luôn nhận update
        locationUpdateInterval: 5000, // 5s 1 lần
        fastestLocationUpdateInterval: 2000, // 2s/lần
        stopOnTerminate: false, // app kill vẫn chạy
        startOnBoot: true, // reboot máy vẫn chạy
        foregroundService: true, // Android giữ service chạy nền
        enableHeadless: true, // Android cho phép chạy khi app kill
      },
      state => {
        if (!state.enabled) {
          BackgroundGeolocation.start();
        }
      },
    );
    return () => {
      onLocation.remove();
      BackgroundGeolocation.removeAllListeners();
    };
  }, [routeCoords, selectedVehicle, startTime, ongoingTrips]);

  useEffect(() => {
    if (
      !isTracking &&
      origin &&
      destination &&
      distanceText !== '' &&
      !alertShownRef.current
    ) {
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
        `${t('distance')} ${distanceText} \n` +
          `${t('best_choice_to_reduce_co2')}: ${
            vehicleName[best.vehicle]
          } (${best.co2.toFixed(2)} g CO₂).`,
        [{ text: 'OK' }],
      );
      alertShownRef.current = true;
    }
    // Reset lại khi chọn lại route mới hoặc reset
    if (!isTracking && (!origin || !destination || distanceText === '')) {
      alertShownRef.current = false;
    }
  }, [origin, destination, distanceText, isTracking]);

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
          console.log('Current location:', position);
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

  // Add useEffect to follow user when tracking
  // Chỉ follow user khi đang tracking và user đã di chuyển khỏi origin
  const hasMovedFromOrigin = (
    currentLocation: [number, number] | null,
    origin: [number, number] | null,
  ) => {
    if (!currentLocation || !origin) return false;
    // Nếu khác biệt > 1m mới follow (giảm nhảy camera do sai số GPS)
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // m
    const dLat = toRad(currentLocation[1] - origin[1]);
    const dLon = toRad(currentLocation[0] - origin[0]);
    const lat1 = toRad(origin[1]);
    const lat2 = toRad(currentLocation[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist > 1;
  };

  useEffect(() => {
    if (
      isTracking &&
      currentLocation &&
      cameraRef.current &&
      hasMovedFromOrigin(currentLocation, origin)
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: currentLocation,
        animationDuration: 800,
      });
    }
  }, [isTracking, currentLocation, origin]);

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
      setCurrentTripId(res._id || res.client_id);
      setIsTracking(true);
      if (origin) {
        setCurrentLocation(origin);
      }
      setStartTime(new Date());
      setCo2Estimates(0);
      setDurationText('0');
      setTotalDistance(0);
      setDistanceText('0');
      BackgroundGeolocation.start();
    } catch (err) {
      showMessage.fail(t('error_occurred'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const stopTracking = async () => {
    const tripId = currentTripId || ongoingTrips?._id;

    if (!tripId) {
      showMessage.fail('Không có chuyến đi nào đang diễn ra');
      return;
    }
    dispatch(setIsLoading(true));
    const res: any = await TripApi.updateTrip(tripId, {
      endedAt: new Date(),
      status: 'ended',
    });
    if (res?.code === 200) {
      showMessage.success('Kết thúc chuyến đi thành công');
      setIsTracking(false);
      setShowSummaryModal(true);
      Geolocation.stopObserving();
      BackgroundGeolocation.stop();
    } else {
      showMessage.fail('Kết thúc chuyến đi thất bại');
    }
    dispatch(setIsLoading(false));
    resetAllState();
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
    // setDistanceText('');
    // setDurationText('');
    // setCo2Estimates(null);
    // setOriginText('');
    // setDestinationText('');
    resetAllState();
  };

  // Fetch suggestions for origin
  const fetchOriginSuggestions = async (text: string) => {
    setOriginQuery(text);
    if (text.length < 2) {
      setOriginSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${text}`,
      );
      const data = await res.json();
      setOriginSuggestions(data.predictions || []);
    } catch (err) {
      setOriginSuggestions([]);
      console.error('Autocomplete error:', err);
    }
  };

  // Fetch suggestions for destination
  const fetchDestinationSuggestions = async (text: string) => {
    setDestinationQuery(text);
    if (text.length < 2) {
      setDestinationSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_API_KEY}&input=${text}`,
      );
      const data = await res.json();
      setDestinationSuggestions(data.predictions || []);
    } catch (err) {
      setDestinationSuggestions([]);
      console.error('Autocomplete error:', err);
    }
  };

  // Handle select suggestion for origin or destination
  const handleSelectSuggestion = async (
    placeId: string,
    description: string,
    type: 'origin' | 'destination',
  ) => {
    if (type === 'origin') {
      setOriginSuggestions([]);
    } else {
      setDestinationSuggestions([]);
    }
    setSelecting(null);
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      const loc = data.result.geometry.location;
      const coords: [number, number] = [loc.lng, loc.lat];
      if (type === 'origin') {
        setOrigin(coords);
        setOriginText(data.result.formatted_address || description);
        setOriginQuery('');
        setOriginSuggestions([]);
      } else if (type === 'destination') {
        setDestination(coords);
        setDestinationText(data.result.formatted_address || description);
        setDestinationQuery('');
        setDestinationSuggestions([]);
      }
      setSelecting(null);
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

  const selectCurrent = async () => {
    if (!currentLocation) {
      return showMessage.fail('Không lấy được vị trí hiện tại');
    }
    try {
      const [lng, lat] = currentLocation;
      setOrigin(currentLocation);
      const res = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      const address = data?.results?.[0]?.formatted_address ?? 'Không xác định';
      setOriginText(address);
      // setSuggestions([]); // obsolete after refactor
      setSelecting(null);
    } catch (error) {
      showMessage.fail('Không thể lấy địa chỉ từ vị trí hiện tại');
    }
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
        // Tính khoảng cách lat/lng
        const deltaLng = Math.abs(maxLng - minLng);
        const deltaLat = Math.abs(maxLat - minLat);
        // Nếu khoảng cách nhỏ, giảm padding để zoom to bản đồ hơn
        let padding = 50;
        if (deltaLng < 0.001 && deltaLat < 0.001) {
          padding = 0; // cực gần, zoom sát nhất
        } else if (deltaLng < 0.003 && deltaLat < 0.003) {
          padding = 10;
        } else if (deltaLng < 0.01 && deltaLat < 0.01) {
          padding = 30;
        } else if (deltaLng < 0.05 && deltaLat < 0.05) {
          padding = 100;
        }
        // Chỉ fit camera khi chưa tracking
        if (!isTracking && cameraRef.current) {
          cameraRef.current.fitBounds(
            [minLng, minLat],
            [maxLng, maxLat],
            padding,
            1000,
          );
          // Nếu rất gần, zoom cực sát vào trung điểm
          if (deltaLng < 0.002 && deltaLat < 0.002) {
            const centerLng = (minLng + maxLng) / 2;
            const centerLat = (minLat + maxLat) / 2;
            setTimeout(() => {
              cameraRef.current?.setCamera({
                centerCoordinate: [centerLng, centerLat],
                zoomLevel: 17,
                animationDuration: 800,
              });
            }, 1100); // delay để fitBounds xong mới setCamera
          }
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
          <View style={styles.rowWrapper}>
            <View style={styles.iconColumn}>
              <IconLibrary
                library="MaterialIcons"
                name="my-location"
                size={22}
                color={color.MAIN}
                style={{ marginBottom: normalize(8) }}
              />
              <IconLibrary
                library="MaterialIcons"
                name="more-vert"
                size={22}
                color="#555"
                style={{ marginBottom: normalize(8) }}
              />
              <IconLibrary
                library="MaterialIcons"
                name="location-on"
                size={22}
                color={color.CRIMSON}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={originInputRef}
                  style={styles.input}
                  editable={!isTracking}
                  placeholderTextColor="#333"
                  placeholder={t('select_departure')}
                  onFocus={() => setSelecting('origin')}
                  onChangeText={text => fetchOriginSuggestions(text)}
                  value={selecting === 'origin' ? originQuery : originText}
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
                  placeholderTextColor="#333"
                  placeholder={t('select_destination')}
                  onFocus={() => setSelecting('destination')}
                  onChangeText={text => fetchDestinationSuggestions(text)}
                  value={
                    selecting === 'destination'
                      ? destinationQuery
                      : destinationText
                  }
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
            </View>
          </View>
          {selecting === 'origin' && (
            <FlatList
              data={originSuggestions}
              ListHeaderComponent={
                <TouchableOpacity
                  style={styles.suggestionHeader}
                  onPress={selectCurrent}
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
              }
              style={{
                position: 'absolute',
                top: normalize(100),
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
                    handleSelectSuggestion(
                      item.place_id,
                      item.description,
                      'origin',
                    )
                  }
                >
                  <Text style={styles.text}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {selecting === 'destination' && destinationQuery.length > 0 && (
            <FlatList
              data={destinationSuggestions}
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
                    handleSelectSuggestion(
                      item.place_id,
                      item.description,
                      'destination',
                    )
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
                animationMode="none"
                animationDuration={0}
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
                    library="MaterialIcons"
                    name="my-location"
                    size={28}
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
                    library="MaterialIcons"
                    name="location-on"
                    size={28}
                    color={color.CRIMSON}
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
          <View style={styles.resultBoxRow}>
            {origin && destination && (
              <View
                style={{
                  width: '35%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 4,
                  }}
                >
                  <IconLibrary
                    library="MaterialCommunityIcons"
                    name={
                      vehicleFuelType === 'electric' ? 'car-electric' : 'car'
                    }
                    size={22}
                    color={vehicleFuelType === 'electric' ? color.MAIN : '#888'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color:
                        vehicleFuelType === 'electric' ? color.MAIN : '#333',
                      marginRight: 8,
                    }}
                  >
                    {vehicleFuelType === 'electric' ? 'Điện' : 'Xăng'}
                  </Text>
                  <Switch
                    value={vehicleFuelType === 'electric'}
                    onValueChange={val =>
                      setVehicleFuelType(val ? 'electric' : 'gasoline')
                    }
                    thumbColor={
                      vehicleFuelType === 'electric' ? color.MAIN : '#ccc'
                    }
                    trackColor={{ false: '#ccc', true: color.MAIN }}
                  />
                </View>
              </View>
            )}
            <View style={styles.resultCol}>
              <IconLibrary
                library="MaterialIcons"
                name="straighten"
                size={22}
                color={color.MAIN}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[styles.text, { color: color.MAIN, fontWeight: 'bold' }]}
              >
                {distanceText || '0 km'}
              </Text>
              <Text style={[styles.text, { fontSize: 12, color: '#888' }]}>
                {t('distance')}
              </Text>
            </View>
            <View style={styles.resultCol}>
              <IconLibrary
                library="MaterialIcons"
                name="schedule"
                size={22}
                color={color.ORANGE}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.text,
                  { color: color.ORANGE, fontWeight: 'bold' },
                ]}
              >
                {durationText || '0 phút'}
              </Text>
              <Text style={[styles.text, { fontSize: 12, color: '#888' }]}>
                {t('duration')}
              </Text>
            </View>
            <View style={styles.resultCol}>
              <IconLibrary
                library="MaterialCommunityIcons"
                name="cloud-outline"
                size={22}
                color={color.CRIMSON}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={[
                  styles.text,
                  { color: color.CRIMSON, fontWeight: 'bold' },
                ]}
              >
                {co2Estimates?.toFixed(2) || 0} g
              </Text>
              <Text style={[styles.text, { fontSize: 12, color: '#888' }]}>
                {t('co2_estimate')}
              </Text>
            </View>
          </View>
          // ...existing code...
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
          {showSummaryModal && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999,
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 24,
                  minWidth: 260,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}
                >
                  {t('end_journey') || 'Tổng kết'}
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 8 }}>{`Bạn đã đi ${(
                  totalDistance || 0
                ).toFixed(2)} km`}</Text>
                <Text
                  style={{ fontSize: 16, marginBottom: 16 }}
                >{`Tiêu thụ hết ${(co2Emitted || 0).toFixed(2)} g CO₂`}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: color.MAIN,
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                  }}
                  onPress={() => setShowSummaryModal(false)}
                >
                  <Text
                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                  >
                    Đóng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default SelectOriginDestination;
