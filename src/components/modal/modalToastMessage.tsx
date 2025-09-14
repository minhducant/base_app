import React, {useState, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Text,
  Platform,
  PanResponder,
  TouchableOpacity,
  InteractionManager,
  DeviceEventEmitter,
} from 'react-native';
import Animated, {
  withDelay,
  withTiming,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
  runOnJS, // Import runOnJS
} from 'react-native-reanimated';
import normalize from 'react-native-normalize';

import {
  IconClose,
  HelpToast,
  FailToast,
  SuccessToast,
  WarningToast,
} from '@assets/icons';
import {toastStyle as styles} from '@styles/toast.style';

const TOAST_DURATION = 2000;

const ToastMessage = () => {
  const [showingState, setShowingState] = useState(false);
  const toastBottomAnimation = useSharedValue(-100);
  const [toastOptions, setToastOptions] = useState<any>({});
  const BOTTOM_VALUE = Platform.OS === 'ios' ? normalize(60) : normalize(20);

  const showToastMessage = useCallback(
    (options: any) => {
      setToastOptions(options);
      setShowingState(true); 
      toastBottomAnimation.value = withSequence(
        withTiming(BOTTOM_VALUE),
        withDelay(
          TOAST_DURATION,
          withTiming(normalize(-150), undefined, finished => {
            if (finished) {
              runOnJS(setShowingState)(false);
            }
          }),
        ),
      );
    },
    [BOTTOM_VALUE, toastBottomAnimation],
  );

  useLayoutEffect(() => {
    const toastListener = DeviceEventEmitter.addListener(
      'SHOW_TOAST_MESSAGE',
      showToastMessage,
    );
    return () => {
      toastListener.remove();
    };
  });

  useLayoutEffect(() => {
    const toastListener = DeviceEventEmitter.addListener(
      'HIDE_TOAST_MESSAGE',
      hideToast,
    );
    return () => {
      toastListener.remove();
    };
  });

  const animatedTopStyles = useAnimatedStyle(() => {
    return {
      bottom: toastBottomAnimation.value,
    };
  });

  const hideToast = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      toastBottomAnimation.value = withTiming(
        normalize(-150),
        undefined,
        finished => {
          if (finished) {
            runOnJS(setShowingState)(false); // Sử dụng runOnJS để cập nhật state
          }
        },
      );
    });
  }, [toastBottomAnimation]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (gestureState.dy > 0) {
        hideToast();
      }
    },
    onPanResponderRelease: () => {},
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.toastContainer, animatedTopStyles]}>
      {showingState && ( // Hiển thị toast dựa trên showingState
        <>
          {toastOptions.type === 'success' ? (
            <SuccessToast />
          ) : toastOptions.type === 'fail' ? (
            <FailToast />
          ) : toastOptions.type === 'warning' ? (
            <WarningToast />
          ) : (
            <HelpToast />
          )}
          <View style={styles.toastMessageContainer}>
            <Text style={styles.toastTitle}>
              {toastOptions.type === 'success'
                ? 'Well done!'
                : toastOptions.type === 'fail'
                ? 'Oh snap!'
                : toastOptions.type === 'warning'
                ? 'Warning!'
                : 'Hi there!'}
            </Text>
            <Text style={styles.toastMessage} numberOfLines={2}>
              {toastOptions.message}
            </Text>
          </View>
          <TouchableOpacity
            onPress={hideToast}
            activeOpacity={0.7}
            style={styles.closeIcon}>
            <IconClose />
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  );
};

export default ToastMessage;
