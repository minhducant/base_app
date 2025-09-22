import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { setAppStatus } from '@stores/action';
import { checkAppTracking } from '@utils/permissions';
import { navigationRef } from '@navigation/rootNavigation';
import { BottomTabsNavigator } from '@navigation/bottomTab';

import LoginScreen from '@screens/auth/Login';
import RegisterScreen from '@screens/auth/Register';
import ResetPassScreen from '@screens/auth/ResetPass';
import VerifyMailScreen from '@screens/auth/VerifyMail';
import VerifyCodeScreen from '@screens/auth/VerifyCode';
import ForgetPassScreen from '@screens/auth/ForgetPass';

const AuthStackNav = createStackNavigator();
const NativeStack = createNativeStackNavigator();

const APP_STATUS = { SPANISH: 0, ONBOARDING: 1, AUTH: 2, APP: 3 };

const AuthStack = () => (
  <AuthStackNav.Navigator
    initialRouteName="LoginScreen"
    screenOptions={{ headerShown: false }}
  >
    <AuthStackNav.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStackNav.Screen name="ResetPassScreen" component={ResetPassScreen} />
    <AuthStackNav.Screen name="RegisterScreen" component={RegisterScreen} />
    <AuthStackNav.Screen name="ForgetPassScreen" component={ForgetPassScreen} />
    <AuthStackNav.Screen name="VerifyMailScreen" component={VerifyMailScreen} />
    <AuthStackNav.Screen name="VerifyCodeScreen" component={VerifyCodeScreen} />
  </AuthStackNav.Navigator>
);

export const AppNavigation = () => {
  const dispatch = useDispatch();
  const { appStatus, isFirstUse } = useSelector((state: any) => state.user);

  useEffect(() => {
    checkAppTracking();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <NativeStack.Navigator screenOptions={{ headerShown: false }}>
        {appStatus === APP_STATUS.SPANISH && (
          <NativeStack.Screen name="SpanishScreen" component={() => null} />
        )}
        {appStatus === APP_STATUS.ONBOARDING && (
          <NativeStack.Screen name="OnboardingScreen" component={() => null} />
        )}
        {appStatus === APP_STATUS.AUTH && (
          <NativeStack.Screen name="AuthStack" component={AuthStack} />
        )}
        {appStatus === APP_STATUS.APP && (
          <NativeStack.Screen
            name="HomeScreen"
            component={BottomTabsNavigator}
          />
        )}
      </NativeStack.Navigator>
    </NavigationContainer>
  );
};
