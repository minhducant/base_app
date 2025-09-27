import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';

import {
  IconChat,
  IconBook,
  IconGame,
  IconWallet,
  SurveyVector,
  QuestionVector,
} from '@assets/icons';
import { useWeather } from '@hooks/useWeather';
import { homeStyle } from '@styles/home.style';
import { useLocationPermission } from '@utils/permissions';

export default function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const refreshControl = useRef<boolean>(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { location } = useLocationPermission();
  const user = useSelector((state: any) => state.user.userInfo);
  const { weather, loadWeather } = useWeather(
    location?.latitude,
    location?.longitude,
  );

  const onRefresh = () => {
    refreshControl.current = true;
    loadWeather()
      .then(() => {
        refreshControl.current = false;
      })
      .catch(() => {
        refreshControl.current = false;
      });
  };

  return (
    <LinearGradient
      end={{ x: 0, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={homeStyle.container}
      colors={['#99EBD1', '#FBFBFC']}
    >
      <SafeAreaView>
        <ScrollView
          onScroll={e => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          style={homeStyle.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={['#ED2127']}
              onRefresh={onRefresh}
              refreshing={refreshControl.current}
            />
          }
        >
          <View style={homeStyle.viewTitleHome}>
            <View>
              <Text style={homeStyle.txtTitleHome}>{t('hello')}</Text>
              <Text style={homeStyle.txtName}>{user?.name}</Text>
            </View>
            <FastImage
              style={{ width: 100, height: 100 }}
              source={require('@assets/images/app_logo_removebg.png')}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={homeStyle.weatherCard}>
            {weather?.current?.condition?.icon ? (
              <FastImage
                source={{ uri: `https:${weather.current.condition.icon}` }}
                style={{ width: 75, height: 75 }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Image
                source={require('@assets/images/rain.png')}
                style={{ width: 60, height: 60 }}
              />
            )}
            <Text style={homeStyle.weatherTemp}>
              {weather?.current?.temp_c || 0}°
            </Text>
            <View style={{ marginTop: 10 }}>
              <Text style={homeStyle.weatherDetail}>
                {weather?.location?.name || ''}
              </Text>
              <Text style={homeStyle.weatherDetail}>
                {t('wind')}: {weather?.current?.wind_kph || 0} kph
              </Text>
              <Text style={homeStyle.weatherDetail}>
                {t('humidity')}: {weather?.current?.humidity || 0} %
              </Text>
              <Text style={homeStyle.weatherDetail}>
                AQI: {weather?.current?.air_quality?.co}
              </Text>
            </View>
          </View>
          <View style={homeStyle.actionRow}>
            <TouchableOpacity style={homeStyle.actionItem}>
              <View style={homeStyle.iconActionItem}>
                <IconChat />
              </View>
              <Text style={homeStyle.txtActionItem}>{t('chat')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyle.actionItem}>
              <View style={homeStyle.iconActionItem}>
                <IconGame />
              </View>
              <Text style={homeStyle.txtActionItem}>{t('game')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyle.actionItem}>
              <View style={homeStyle.iconActionItem}>
                <IconBook />
              </View>
              <Text style={homeStyle.txtActionItem}>
                {t('eco_driving_tips')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyle.actionItem}>
              <View style={homeStyle.iconActionItem}>
                <IconWallet />
              </View>
              <Text style={homeStyle.txtActionItem}>{t('wallet')}</Text>
            </TouchableOpacity>
          </View>
          <View style={homeStyle.surveyCard}>
            <SurveyVector />
            <View>
              <Text style={homeStyle.surveyTitle}>{t('survey_corner')}</Text>
              <Text style={homeStyle.surveyDesc}>
                {t('always_listen_support')}
              </Text>
              <TouchableOpacity>
                <Text style={homeStyle.surveyLink}>{t('do_survey_now')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={homeStyle.questionCard}>
            <QuestionVector />
            <View>
              <Text style={homeStyle.surveyTitle}>
                {t('today_trip_question')}
              </Text>
              <Text style={[homeStyle.surveyDesc, { marginTop: 8 }]}>
                {t('today_trip_request')}
              </Text>
            </View>
          </View>
          <View style={homeStyle.banner}>
            <Text style={homeStyle.bannerText}>ECOMOVE</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
