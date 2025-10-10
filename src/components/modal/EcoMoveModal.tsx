import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import normalize from 'react-native-normalize';
import { useTranslation } from 'react-i18next';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

interface TripModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function EcoMoveModal({ visible, onClose }: TripModalProps) {
  const { t } = useTranslation();
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.tipTitle}>{t('eco_driving_tips_title')}</Text>
            <Text style={styles.tipDescription}>
              {t('eco_driving_tips_description')}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.viewUnderstood}
            >
              <Text style={styles.tipUnderstood}>{t('understood')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: normalize(12),
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  tipTitle: {
    fontFamily: themeStyle.FONT_BOLD,
    marginBottom: normalize(8),
    textAlign: 'center',
    padding: normalize(8),
    fontSize: 16,
  },
  tipDescription: {
    fontFamily: themeStyle.FONT_FAMILY,
    textAlign: 'justify',
    lineHeight: normalize(20),
  },
  tipUnderstood: {
    color: color.WHITE,
    fontFamily: themeStyle.FONT_BOLD,
  },
  viewUnderstood: {
    backgroundColor: color.MAIN,
    padding: normalize(10),
    marginTop: normalize(16),
    borderRadius: normalize(12),
    width: '40%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center',
  },
});
