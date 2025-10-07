import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  FlatList,
  ViewStyle,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import normalize from 'react-native-normalize';

import { TripApi } from '@api/trip';
import color from '@styles/color';
import themeStyle from '@styles/theme.style';
import { setIsLoading } from '@stores/action';
import { showMessage, calculateVehicleCO } from '@utils/index';

interface TripModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tripData: TripData) => void;
}

interface TripData {
  startPoint: string;
  endPoint: string;
  vehicle: string;
  fuelType: string;
}

const TripModal: React.FC<TripModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const GOONG_API_KEY = 'gwDzlAb8g0zJCMbZOpIZcZZC2c7jQcpmHqNYEqXu';
  const GOONG_API_KEY1 = '2yGbwvmxDzSnhqqU2nWLJdnY4LlozlWcLdg7GVtF';
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [selectedFuelType, setSelectedFuelType] = useState('gasoline');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>(
    [],
  );
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const destinationInputRef = useRef<TextInput>(null);
  const [selecting, setSelecting] = useState<'origin' | 'destination' | null>(
    null,
  );
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [originText, setOriginText] = useState('');
  const originInputRef = useRef<TextInput>(null);
  const [destinationText, setDestinationText] = useState('');
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [originQuery, setOriginQuery] = useState('');
  const [co2Emitted, setCo2Emitted] = useState(0);
  const [distance, setDistance] = useState(0);
  const [distanceText, setDistanceText] = useState('');

  const vehicles = [
    { key: 'bike', label: t('bike') },
    { key: 'car', label: t('car') },
    { key: 'truck', label: t('truck') },
    { key: 'bus', label: t('bus') },
  ];

  const fuelTypes = [
    { id: 'gasoline', name: 'Xăng', icon: '⛽' },
    { id: 'electric', name: 'Điện', icon: '🔋' },
  ];

  useEffect(() => {
    if (origin && destination) {
      fetchRoute(selectedVehicle);
    }
  }, [origin, destination]);

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
  const handleSubmit = async () => {
    const params = {
      origin,
      destination,
      distance,
      origin_text: originText,
      destination_text: destinationText,
      vehicle: selectedVehicle,
      co2_estimated: co2Emitted,
      status: 'ended',
    };
    if (
      !params.origin ||
      !params.destination ||
      !params.distance ||
      !params.co2_estimated
    ) {
      showMessage.warning(t('missing_fields'));
      return;
    }
    try {
      dispatch(setIsLoading(true));
      const res = await TripApi.createTrip(params);
      if (!res?.client_id) {
        showMessage.fail(t('cannot_create_trip'));
        return;
      }
      handleClose();
    } catch (err) {
      showMessage.fail(t('error_occurred'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

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

  const resetForm = () => {
    setStartPoint('');
    setEndPoint('');
    setSelectedVehicle('bike');
    setSelectedFuelType('gasoline');
    setOriginText('');
    setDestinationText('');
    setOriginQuery('');
    setDestinationQuery('');
    setOrigin(null);
    setDestination(null);
    setRouteCoords([]);
    setCurrentLocation(null);
    setDistance(0);
    setDistanceText('');
    setCo2Emitted(0);
  };

  const fetchRoute = async (vehicle: any) => {
    if (!origin || !destination) return;
    try {
      dispatch(setIsLoading(true));
      const res = await fetch(
        `https://rsapi.goong.io/Direction?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&vehicle=${vehicle}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      if (data?.routes?.length > 0) {
        const route = data.routes[0];
        setDistance(route.legs[0].distance.value);
        setDistanceText(route.legs[0].distance.text);
        const distanceKm = route.legs[0].distance.value / 1000;
        const estimates = calculateVehicleCO(vehicle, distanceKm);
        setCo2Emitted(estimates);
      } else {
      }
    } catch (err) {
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Thông tin chuyến đi</Text>

            {/* Điểm đi */}
            <Text style={styles.label}>Điểm đi</Text>
            <TextInput
              ref={originInputRef}
              style={styles.input}
              placeholderTextColor="#333"
              placeholder={t('select_departure')}
              onFocus={() => setSelecting('origin')}
              onChangeText={text => fetchOriginSuggestions(text)}
              value={selecting === 'origin' ? originQuery : originText}
            />

            {/* Điểm đến */}
            <Text style={styles.label}>Điểm đến</Text>
            <TextInput
              ref={destinationInputRef}
              style={styles.input}
              placeholderTextColor="#333"
              placeholder={t('select_destination')}
              onFocus={() => setSelecting('destination')}
              onChangeText={text => fetchDestinationSuggestions(text)}
              value={
                selecting === 'destination' ? destinationQuery : destinationText
              }
            />
            {selecting === 'destination' && destinationQuery.length > 0 && (
              <FlatList
                data={destinationSuggestions}
                style={{
                  position: 'absolute',
                  top: normalize(210),
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
            {selecting === 'origin' && originQuery.length > 0 && (
              <FlatList
                data={originSuggestions}
                style={{
                  position: 'absolute',
                  top: normalize(125),
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

            {/* Phương tiện */}
            <Text style={styles.label}>Chọn phương tiện</Text>
            <View style={styles.optionContainer}>
              {vehicles.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.key}
                  style={[
                    styles.optionItem,
                    selectedVehicle === vehicle.key && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedVehicle(vehicle.key as any);
                    fetchRoute(vehicle.key as any);
                  }}
                >
                  <Text style={styles.optionText}>{t(vehicle.key)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Loại nhiên liệu */}
            <Text style={styles.label}>Chọn loại nhiên liệu</Text>
            <View style={styles.optionContainer}>
              {fuelTypes.map(fuel => (
                <TouchableOpacity
                  key={fuel.id}
                  style={[
                    styles.optionItem,
                    selectedFuelType === fuel.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedFuelType(fuel.id)}
                >
                  <Text style={styles.optionIcon}>{fuel.icon}</Text>
                  <Text style={styles.optionText}>{fuel.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoTrip}>
                <Text style={styles.labelJournal}>{t('distance')}</Text>
                <Text style={styles.textValueJournal}>
                  {distanceText && distanceText}
                </Text>
              </View>
              <View style={styles.infoTrip}>
                <Text style={styles.labelJournal}>{t('co2_estimate')}</Text>
                <Text style={styles.textValueJournal}>
                  {co2Emitted ? `${Number(co2Emitted).toFixed(2)} g` : ''}
                </Text>
              </View>
            </View>
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Nhập</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    marginBottom: 8,
    color: '#333',
    fontFamily: themeStyle.FONT_BOLD,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
    marginTop: 16,
    color: '#333',
    fontFamily: themeStyle.FONT_BOLD,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius:  normalize(12),
    padding: normalize(10),
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    fontFamily: themeStyle.FONT_FAMILY,
  },
  optionContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: normalize(10),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    minWidth: '48%',
  },
  selectedOption: {
    borderColor: '#99EBD1',
    backgroundColor: '#E8F8F5',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontFamily: themeStyle.FONT_FAMILY,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center' as const,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600' as const,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#99EBD1',
    alignItems: 'center' as const,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600' as const,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
  } as ViewStyle,
  txtJournalTitle: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    marginLeft: normalize(8),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(8),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(6),
  },
  infoValue: {
    fontSize: 13,
    fontFamily: themeStyle.FONT_BOLD,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.DUSTY_GRAY,
  },
  infoTrip: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelJournal: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: normalize(16),
    fontFamily: themeStyle.FONT_FAMILY,
  },
  textValueJournal: {
    fontSize: 20,
    fontWeight: '600',
    color: color.MAIN,
    fontFamily: themeStyle.FONT_BOLD,
    marginTop: normalize(16),
  },
});

export default TripModal;
