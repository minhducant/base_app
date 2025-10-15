import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Easing,
  Animated,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { t } from '@i18n/index';
import { IconWallet } from '@assets/icons';
import { homeStyle } from '@styles/home.style';

export default function WaterPlantScreen() {
  const navigation = useNavigation();
  const [waterCount, setWaterCount] = useState(0);
  const rainAnim = useRef(new Animated.Value(0)).current;
  const plantScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleWaterPlant = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    startRainEffect();
    animateProgress(newCount);
    if (newCount % 10 === 0) {
      animatePlantGrowth(newCount);
    }
  };

  const startRainEffect = () => {
    rainAnim.setValue(0);
    Animated.timing(rainAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const animateProgress = (count: number) => {
    Animated.timing(progressAnim, {
      toValue: count,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const animatePlantGrowth = (count: number) => {
    const level = Math.floor(count / 10);
    const targetScale = Math.min(1 + level * 0.2, 3);
    Animated.spring(plantScale, {
      toValue: targetScale,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const rainOpacity = rainAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, 1, 1, 0],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={homeStyle.container}>
      <ImageBackground
        style={homeStyle.bgWaterPlant}
        source={require('@assets/images/game.png')}
      >
        <Animated.View
          style={[
            {
              opacity: rainOpacity,
              transform: [{ translateY: -20 }],
            },
            homeStyle.rain,
          ]}
        >
          <Image
            source={require('@assets/images/rain.gif')}
            style={{
              width: '100%',
              height: '50%',
              resizeMode: 'cover',
            }}
          />
        </Animated.View>
        <TouchableOpacity
          style={homeStyle.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={homeStyle.backText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={homeStyle.walletButton}>
          <IconWallet />
        </TouchableOpacity>
        <View style={homeStyle.plantContainer}>
          <Animated.Text
            style={{
              fontSize: 80,
              transform: [
                { scale: plantScale },
                {
                  translateY: plantScale.interpolate({
                    inputRange: [1, 3],
                    outputRange: [0, -30],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}
          >
            🌱
          </Animated.Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={homeStyle.waterButton}
          onPress={handleWaterPlant}
        >
          <Text style={homeStyle.waterText}>{t('water_plants')}</Text>
        </TouchableOpacity>
        <View style={homeStyle.progressContainer}>
          <Animated.View
            style={[homeStyle.progressBar, { width: progressWidth }]}
          />
          <Text style={homeStyle.progressText}>
            💧 {waterCount} {t('water_drops_used')}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
