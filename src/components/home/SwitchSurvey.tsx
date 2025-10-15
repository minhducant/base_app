import React from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import normalize from 'react-native-normalize';
import { t } from '@i18n/index';
import color from '@styles/color';
import themeStyle from '@styles/theme.style';

type TabType = 'survey' | 'rating';

interface SwitchSurveyProps {
  scrollX: Animated.Value;
  onChange: (value: TabType) => void;
  activeTab: TabType;
}

const SwitchSurvey: React.FC<SwitchSurveyProps> = ({
  scrollX,
  onChange,
  activeTab,
}) => {
  const translateX = scrollX.interpolate({
    inputRange: [0, Dimensions.get('screen').width],
    outputRange: [0, normalize(150)],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchWrapper}>
        <Animated.View
          style={[styles.slider, { transform: [{ translateX }] }]}
        />
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange('survey')}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, { color: color.BLACK }]}>
            {t('survey')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onChange('rating')}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, { color: color.BLACK }]}>
            {t('rating')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: normalize(10),
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.LIGHT_GRAY || '#EEE',
    borderRadius: normalize(12),
    overflow: 'hidden',
    width: normalize(300),
    height: normalize(30),
    position: 'relative',
    borderWidth: 1,
    borderColor: color.MAIN,
  },
  slider: {
    position: 'absolute',
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: color.MAIN,
    borderRadius: normalize(12),
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: themeStyle.FONT_FAMILY,
  },
});

export default SwitchSurvey;
