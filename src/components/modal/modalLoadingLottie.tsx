import React from 'react';
// import normalize from 'react-native-normalize';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, ActivityIndicator, Modal, View } from 'react-native';

import { setIsLoading } from '@stores/action';

const ModalLoadingLottie = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.user.isLoading);

  const handleCloseModal = () => {
    dispatch(setIsLoading(false));
  };

  return (
    <Modal
      visible={isLoading}
      transparent={true}
      animationType="fade"
      onDismiss={handleCloseModal}
    >
      <View style={stylesLoading.modalView}>
        <ActivityIndicator />
      </View>
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
