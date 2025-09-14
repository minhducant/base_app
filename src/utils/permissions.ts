import {Platform, Linking} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

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
