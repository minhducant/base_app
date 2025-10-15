import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Text,
  View,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TripApi } from '@api/trip';
import { setIsLoading } from '@stores/action';
import { userStyle } from '@styles/user.style';
import { ActionButton } from '@components/home/actionButton';
import { showMessage, calculateVehicleCO } from '@utils/index';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const GOONG_API_KEY = 'gwDzlAb8g0zJCMbZOpIZcZZC2c7jQcpmHqNYEqXu';

const CreateJournalScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const originInputRef = useRef<TextInput>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const [originQuery, setOriginQuery] = useState('');
  const [originText, setOriginText] = useState('');
  const [co2Emitted, setCo2Emitted] = useState(0);
  const [distance, setDistance] = useState(0);
  const [distanceText, setDistanceText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [selectedType, setSelectedType] = useState('personal');
  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [selectedFuelType, setSelectedFuelType] = useState('gasoline');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>(
    [],
  );
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [selecting, setSelecting] = useState<'origin' | 'destination' | null>(
    null,
  );

  const vehicles = [
    { key: 'bike', label: t('bike') },
    { key: 'car', label: t('car') },
    { key: 'truck', label: t('truck') },
    { key: 'bus', label: t('bus') },
    { key: 'train', label: t('train') },
    { key: 'airplane', label: t('airplane') },
  ];

  const fuelTypes = [
    { key: 'gasoline', label: t('gasoline'), icon: '⛽' },
    { key: 'electric', label: t('electric'), icon: '🔋' },
  ];

  const tripType = [
    { key: 'personal', label: t('personal') },
    { key: 'business', label: t('business') },
  ];

  useEffect(() => {
    if (origin && destination) {
      fetchRoute(selectedVehicle, selectedFuelType);
    }
  }, [origin, destination]);

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
    }
  };

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
    } catch (err) {}
  };

  const fetchRoute = async (vehicle: any, fuel: any) => {
    if (!origin || !destination) return;
    try {
      dispatch(setIsLoading(true));
      const apiVehicleMap: Record<any, string> = {
        car: 'car',
        bus: 'car',
        train: 'car',
        airplane: 'car',
        bike: 'bike',
        walk: 'foot',
        truck: 'car',
        taxi: 'car',
      };
      const vehicleForApi = apiVehicleMap[vehicle] || 'car';
      const res = await fetch(
        `https://rsapi.goong.io/Direction?origin=${origin[1]},${origin[0]}&destination=${destination[1]},${destination[0]}&vehicle=${vehicleForApi}&api_key=${GOONG_API_KEY}`,
      );
      const data = await res.json();
      if (data?.routes?.length > 0) {
        const route = data.routes[0];
        setDistance(route.legs[0].distance.value);
        setDistanceText(route.legs[0].distance.text);
        const distanceKm = route.legs[0].distance.value / 1000;
        const estimates = calculateVehicleCO(vehicle, distanceKm, fuel);
        setCo2Emitted(estimates);
      } else {
      }
    } catch (err) {
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const onAddTrip = async () => {
    const params = {
      origin,
      destination,
      distance,
      type: selectedType,
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
      navigation.navigate('NoFooter', { screen: 'JournalScreen' });
    } catch (err) {
      showMessage.fail(t('error_occurred'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar title={t('add_trip')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={userStyle.viewCreateJournal}
      >
        <Text style={userStyle.labelJournal}>{t('departure')}</Text>
        <TextInput
          ref={originInputRef}
          style={userStyle.inputGoal}
          placeholderTextColor="#333"
          placeholder={t('select_departure')}
          onFocus={() => setSelecting('origin')}
          onChangeText={text => fetchOriginSuggestions(text)}
          value={selecting === 'origin' ? originQuery : originText}
        />
        <Text style={userStyle.labelJournal}>{t('destination')}</Text>
        <TextInput
          ref={destinationInputRef}
          style={userStyle.inputGoal}
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
            style={userStyle.destinationList}
            keyExtractor={item => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={userStyle.suggestionItem}
                onPress={() =>
                  handleSelectSuggestion(
                    item.place_id,
                    item.description,
                    'destination',
                  )
                }
              >
                <Text style={userStyle.text}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {selecting === 'origin' && originQuery.length > 0 && (
          <FlatList
            data={originSuggestions}
            style={userStyle.originList}
            keyExtractor={item => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={userStyle.suggestionItem}
                onPress={() =>
                  handleSelectSuggestion(
                    item.place_id,
                    item.description,
                    'origin',
                  )
                }
              >
                <Text style={userStyle.text}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <Text style={userStyle.labelJournal}>{t('select_transport')}</Text>
        <View style={userStyle.optionContainer}>
          {vehicles.map(vehicle => (
            <TouchableOpacity
              key={vehicle.key}
              style={[
                userStyle.optionItem,
                selectedVehicle === vehicle.key && userStyle.selectedOption,
              ]}
              onPress={() => {
                setSelectedVehicle(vehicle.key as any);
                fetchRoute(vehicle.key as any, selectedFuelType);
              }}
            >
              <Text style={userStyle.optionText}>{t(vehicle.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={userStyle.labelJournal}>{t('select_fuel_type')}</Text>
        <View style={userStyle.optionContainer}>
          {fuelTypes.map(fuel => (
            <TouchableOpacity
              key={fuel.key}
              style={[
                userStyle.optionItemFuel,
                selectedFuelType === fuel.key && userStyle.selectedOption,
              ]}
              onPress={() => {
                setSelectedFuelType(fuel.key as any);
                fetchRoute(selectedVehicle, fuel.key as any);
              }}
            >
              <Text style={userStyle.optionText}>
                {t(fuel.label)} {t(fuel.icon)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={userStyle.labelJournal}>{t('select_trip_type')}</Text>
        <View style={userStyle.optionContainer}>
          {tripType.map(type => (
            <TouchableOpacity
              key={type.key}
              style={[
                userStyle.optionItemFuel,
                selectedType === type.key && userStyle.selectedOption,
              ]}
              onPress={() => {
                setSelectedType(type.key as any);
              }}
            >
              <Text style={userStyle.optionText}>{t(type.label)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={userStyle.infoRow}>
          <View style={userStyle.infoTrip}>
            <Text style={userStyle.labelJournal}>{t('distance')}</Text>
            <Text style={userStyle.textValueJournal}>
              {distanceText && distanceText}
            </Text>
          </View>
          <View style={userStyle.infoTrip}>
            <Text style={userStyle.labelJournal}>{t('co2_estimate')}</Text>
            <Text style={userStyle.textValueJournal}>
              {co2Emitted ? `${Number(co2Emitted).toFixed(2)} g` : ''}
            </Text>
          </View>
        </View>
      </ScrollView>
      <SafeAreaView>
        <ActionButton title={t('add_trip')} onPress={onAddTrip} />
      </SafeAreaView>
    </View>
  );
};

export default CreateJournalScreen;
