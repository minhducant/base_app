import { Text, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import normalize from 'react-native-normalize';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import color from '@styles/color';
import UserScreen from '@screens/user/User';
import HomeScreen from '@screens/home/Home';
import { useAsyncApp } from '@utils/asyncApp';
import { navigationStyle } from '@styles/navigation.style';
import { IconHome, IconMap, IconUser } from '@assets/icons';

import GoalScreen from '@screens/user/Goal';
import SurveyScreen from '@screens/home/Survey';
import ReportScreen from '@screens/user/Report';
import JournalScreen from '@screens/user/Journal';
import ProfileScreen from '@screens/user/Profile';
import SettingsScreen from '@screens/user/Settings';
import WaterPlantScreen from '@screens/home/WaterPlant';
import CreateJournalScreen from '@screens/user/CreateJournal';
import ChangePasswordScreen from '@screens/user/ChangePassword';
import ChangeLanguageScreen from '@screens/user/ChangeLanguage';
import SelectLocationScreen from '@screens/home/SelectLocation';
import SelectOriginDestination from '@screens/home/SelectOrigin';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = { headerShown: false };

function NoFooter() {
  const screens: any = [
    GoalScreen,
    SurveyScreen,
    ProfileScreen,
    ReportScreen,
    JournalScreen,
    SettingsScreen,
    WaterPlantScreen,
    CreateJournalScreen,
    ChangePasswordScreen,
    SelectLocationScreen,
    ChangeLanguageScreen,
  ];

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {screens.map((ScreenComponent: any, index: any) => (
        <Stack.Screen
          key={index}
          name={ScreenComponent.name}
          component={ScreenComponent}
        />
      ))}
    </Stack.Navigator>
  );
}

function BottomTabs() {
  const { t } = useTranslation();

  const tabScreens = [
    {
      name: 'HomeScreen',
      component: HomeScreen,
      label: t('home'),
      icon: IconHome,
    },
    {
      name: 'MapSreen',
      component: SelectOriginDestination,
      label: t('map'),
      icon: IconMap,
    },
    {
      name: 'UserScreen',
      component: UserScreen,
      label: t('account'),
      icon: IconUser,
    },
  ];

  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName="HomeScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: color.MAIN,
        tabBarInactiveTintColor: color.GRAYCHATEAU,
        tabBarStyle: {
          paddingBottom: Platform.OS === 'android' ? normalize(8) : 0,
          height: Platform.OS === 'android' ? normalize(55) : normalize(75),
        },
      })}
    >
      {tabScreens.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ color }) => <tab.icon fill={color} />,
            tabBarLabel: ({ color }) => (
              <Text style={[navigationStyle.txtBottonTab, { color }]}>
                {tab.label}
              </Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export const BottomTabsNavigator = () => {
  useAsyncApp();
  return (
    <Stack.Navigator
      initialRouteName="BottomTabs"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="NoFooter" component={NoFooter} />
    </Stack.Navigator>
  );
};
