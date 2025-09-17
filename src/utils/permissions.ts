import { Platform, Linking } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

const checkRequest = async (permission: any) => {
  try {
    const result = await check(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        break;
      case RESULTS.DENIED:
        if (Platform.OS === 'android') {
          await request(permission);
        }
        break;
      case RESULTS.LIMITED:
        await request(permission);
        break;
      case RESULTS.GRANTED:
        break;
      case RESULTS.BLOCKED:
        if (Platform.OS === 'android') {
          Linking.openSettings();
        }
        break;
    }
  } catch (error) {
    console.warn(error);
  }
};

export const checkUseLibrary = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    await checkRequest(permission);
  } catch (error) {
    console.warn(error);
  }
};

export const checkCamera = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    await checkRequest(permission);
  } catch (error) {
    console.warn(error);
  }
};

export const checkWriteFile = async () => {
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    await checkRequest(permission);
  } catch (error) {
    console.warn(error);
  }
};

export const checkAppTracking = async () => {
  try {
    if (Platform.OS === 'ios') {
      Settings.initializeSDK();
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (result === RESULTS.DENIED) {
        const newStatus = await request(
          PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
        );
        Settings.setAdvertiserTrackingEnabled(newStatus === RESULTS.GRANTED);
      } else {
        Settings.setAdvertiserTrackingEnabled(result === RESULTS.GRANTED);
      }
    } else {
      Settings.initializeSDK();
      Settings.setAdvertiserTrackingEnabled(true);
    }
  } catch (error) {}
};
