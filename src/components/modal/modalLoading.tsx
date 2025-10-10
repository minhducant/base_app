import React from 'react';
// import normalize from 'react-native-normalize';
import { useSelector, useDispatch } from 'react-redux';
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';

import COLORS from '@styles/color';
import { setIsLoading } from '@stores/action';

const ModalLoading = () => {
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
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={stylesLoading.centeredView}>
          <View style={stylesLoading.modalView}>
            <ActivityIndicator size="large" color={COLORS.MAIN} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalLoading;

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // làm nền mờ
  },
});
