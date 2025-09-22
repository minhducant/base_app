import { useCallback, useEffect, useState } from 'react';
import { Platform, Linking } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

export type LocationPermissionStatus =
  | 'unavailable'
  | 'denied'
  | 'limited'
  | 'granted'
  | 'blocked'
  | 'loading';

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

const getLocationPermission = () => {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  }
  return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
};

export const useLocationPermission = () => {
  const [status, setStatus] = useState<LocationPermissionStatus>('loading');

  const checkPermission = useCallback(async () => {
    try {
      const permission = getLocationPermission();
      const result = await check(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          setStatus('unavailable');
          break;
        case RESULTS.DENIED:
          const reqResult = await request(permission);
          setStatus(reqResult as LocationPermissionStatus);
          break;
        case RESULTS.LIMITED:
          setStatus('limited');
          break;
        case RESULTS.GRANTED:
          setStatus('granted');
          break;
        case RESULTS.BLOCKED:
          setStatus('blocked');
          break;
      }
    } catch (err) {
      console.warn('Location permission error:', err);
      setStatus('unavailable');
    }
  }, []);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { status, checkPermission, openSettings };
};
