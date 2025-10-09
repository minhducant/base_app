import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import color from '@styles/color';
import { useTrip } from '@hooks/useTrip';
import { userStyle } from '@styles/user.style';
import { IconLibrary } from '@components/base';
import { convertMetersToKm } from '@utils/index';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const JournalScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { trips, loading, fetchTrips } = useTrip();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTrips({ page: 1, limit: 10 });
    }, [fetchTrips]),
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchTrips({ page: 1, limit: 10 });
    } finally {
      setRefreshing(false);
    }
  }, [fetchTrips]);

  const renderItem = ({ item, index, section }: any) => {
    const isLastItem =
      section.data.length === 1 || index === section.data.length - 1;
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.4}
        style={[userStyle.itemJournal, isLastItem && { borderBottomWidth: 0 }]}
      >
        <View style={userStyle.rowJournalLine}>
          <IconLibrary
            library="MaterialIcons"
            name="my-location"
            size={20}
            color={color.MAIN}
          />
          <Text style={userStyle.txtJournalTitle}>{item.origin_text}</Text>
        </View>
        <View style={userStyle.rowJournalLine}>
          <IconLibrary
            library="MaterialIcons"
            name="location-on"
            size={20}
            color={color.CRIMSON}
          />
          <Text style={userStyle.txtJournalTitle}>{item.destination_text}</Text>
        </View>
        <View style={userStyle.infoRow}>
          <View style={userStyle.infoItem}>
            <IconLibrary
              library="MaterialIcons"
              name="straighten"
              size={16}
              color={color.MAIN}
            />
            <View>
              <Text style={userStyle.infoLabel}>{t('distance')}</Text>
              <Text style={[userStyle.infoValue, { color: color.MAIN }]}>
                {convertMetersToKm(item?.distance, true)}
              </Text>
            </View>
          </View>
          <View style={userStyle.infoItem}>
            <IconLibrary
              library="MaterialCommunityIcons"
              name="clock-time-four-outline"
              size={16}
              color="#E9A100"
            />
            <View>
              <Text style={userStyle.infoLabel}>{t('duration')}</Text>
              <Text style={[userStyle.infoValue, { color: '#E9A100' }]}>
                {item?.duration || 0} {t('minute')}
              </Text>
            </View>
          </View>
          <View style={userStyle.infoItem}>
            <IconLibrary
              library="MaterialCommunityIcons"
              name="cloud-outline"
              size={16}
              color={color.CRIMSON}
            />
            <View>
              <Text style={userStyle.infoLabel}>{t('co2_estimate')}</Text>
              <Text style={[userStyle.infoValue, { color: color.CRIMSON }]}>
                {item?.co2
                  ? item?.co2.toFixed(2)
                  : item?.co2_estimated
                  ? item?.co2_estimated.toFixed(2)
                  : '0'}{' '}
                g
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar
        title={t('trip_journal')}
        hasActionLeft={true}
        actionLeft={() =>
          navigation.navigate('BottomTabs', { screen: 'UserScreen' })
        }
      />
      <View style={userStyle.container}>
        <SectionList
          sections={trips}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#ED2127']}
            />
          }
          ListEmptyComponent={() =>
            !loading ? (
              <View style={userStyle.viewEmpty}>
                <Text style={userStyle.txtEmpty}>{t('no_journal')}</Text>
              </View>
            ) : null
          }
          renderSectionHeader={({ section: { title } }) => (
            <View style={userStyle.headerJournal}>
              <Text style={userStyle.txtHeaderJournal}>{title}</Text>
            </View>
          )}
          renderItem={renderItem}
          ListFooterComponent={() =>
            loading ? (
              <ActivityIndicator size="large" color={color.MAIN} />
            ) : null
          }
          contentContainerStyle={
            trips.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
          }
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          onEndReached={() => {
            // if (!loading) {
            //   fetchTrips({ limit: 10, loadMore: true });
            // }
          }}
          onEndReachedThreshold={0.1}
          stickySectionHeadersEnabled
        />
        <TouchableOpacity
          style={userStyle.viewAdd}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('NoFooter', { screen: 'CreateJournalScreen' })
          }
        >
          <IconLibrary library="Feather" name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JournalScreen;
