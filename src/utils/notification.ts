import {Linking} from 'react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

import {showMessage, LogTelegram} from '@utils/index';

export async function getFcmToken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      // LogTelegram(fcmToken);
      // console.log('[fcmToken]', fcmToken);
      return fcmToken;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function deleteToken() {
  messaging()
    .deleteToken()
    .catch(error => {
      console.log('[FCM Service] Delete token error ', error);
    });
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
  }
}

export async function notificationListener() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification background', remoteMessage.notification);
    notifee.incrementBadgeCount();
  });
  messaging().onMessage(async (message: any) => {
    console.log('Đức', JSON.stringify(message, null, 2));
    // await showMessage.success(message.data.body);
    notifee.incrementBadgeCount();
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification', remoteMessage.notification);
      }
    });
}

const config = {
  screens: {},
};

export const linkingNotification = {
  config,
  prefixes: ['', ''],
  subscribe(listener: any) {
    const onReceiveURL = ({url}: any) => listener(url);
    Linking.addEventListener('url', onReceiveURL);
    const HandleLink = (data: any) => {
      if (data) {
      }
    };
    const unsubscribe = messaging().onMessage(async message => {
      //   console.log('onMessage', message);
      const data = message?.data;
      if (data) {
      }
    });
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      message => {
        HandleLink(message?.data);
      },
    );
    messaging()
      .getInitialNotification()
      .then(message => {
        const data = message?.data;
        if (data) {
        }
      });
    return () => {
      unsubscribeNotification();
      unsubscribe();
    };
  },
};
