import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Modal} from 'react-native-paper';
import LottieView from 'lottie-react-native';
import normalize from 'react-native-normalize';
import {useSelector, useDispatch} from 'react-redux';

import {setIsLoading} from '@stores/action';

const ModalLoadingLottie = () => {
  const dispatch = useDispatch();
  const lottieRef = useRef<any>(null);
  const isLoading = useSelector((state: any) => state.Config.isLoading);

  useEffect(() => {
    if (isLoading) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [isLoading]);

  const handleCloseModal = () => {
    dispatch(setIsLoading(false));
  };

  return (
    <Modal
      contentContainerStyle={stylesLoading.modal}
      visible={isLoading}
      onDismiss={handleCloseModal}>
      <LottieView
        ref={lottieRef}
        source={require('@assets/lottie/Animation.json')}
        style={stylesLoading.lottieView}
      />
    </Modal>
  );
};

export default ModalLoadingLottie;

const stylesLoading = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 10,
  },
  lottieView: {
    width: normalize(60),
    height: normalize(60),
  },
});
