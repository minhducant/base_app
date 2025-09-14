import React, {useRef, useCallback, useState} from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

const AnimatedTab = ({labelTab, onChangeTab}: any) => {
  const t = useTranslation().t;

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const [tabWidths, setTabWidths] = useState<number[]>([]);

  const handleTabPress = useCallback(
    (index: number) => {
      const leftOffset = tabWidths.slice(0, index).reduce((a, b) => a + b, 0);
      Animated.timing(indicatorPosition, {
        toValue: leftOffset,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setActiveIndex(index);
      onChangeTab(labelTab[index]);
      scrollRef.current?.scrollTo({
        x: Math.max(leftOffset - 100, 0),
        animated: true,
      });
    },
    [indicatorPosition, onChangeTab, tabWidths],
  );

  const handleLayoutTab = (e: LayoutChangeEvent, index: number) => {
    const {width} = e.nativeEvent.layout;
    setTabWidths(prev => {
      const updated = [...prev];
      updated[index] = width;
      return updated;
    });
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}>
        {labelTab.map((label: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(index)}
            onLayout={e => handleLayoutTab(e, index)}
            style={styles.tab}>
            <Text
              style={[
                styles.txtTab,
                activeIndex === index && styles.activeTabText,
              ]}>
              {t(label?.short_name)}
            </Text>
          </TouchableOpacity>
        ))}

        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidths[activeIndex] || 0,
              transform: [{translateX: indicatorPosition}],
            },
          ]}
        />
      </ScrollView>
    </View>
  );
};

export default AnimatedTab;

const styles = StyleSheet.create({
  tabs: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtTab: {
    fontSize: 14,
    textAlign: 'center',
    color: color.BOULDER,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  activeTabText: {
    color: color.BLACK,
    fontFamily: themeStyle.FONT_BOLD,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: color.MAIN,
  },
});
