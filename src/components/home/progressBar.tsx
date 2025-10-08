import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import color from '@styles/color';

interface ProgressProps {
  current: number;
  max: number;
  height?: number;
  mainColor?: string;
  backgroundColor?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressProps> = ({
  current,
  max,
  height = 10,
  mainColor = color.MAIN,
  backgroundColor = '#E0E0E0',
  showLabel = false,
}) => {
  const progress = Math.min(current / max, 1); // chặn max = 100%
  const barColor = progress > 0.8 ? color.MONZA : mainColor;

  return (
    <View style={styles.container}>
      <View style={[styles.barBackground, { backgroundColor, height }]}>
        <View
          style={[
            styles.barFill,
            { width: `${progress * 100}%`, backgroundColor: barColor, height },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {Math.round(progress * 100)}% ({current}/{max})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barBackground: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 999,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'right',
    color: '#333',
  },
});

export default ProgressBar;
