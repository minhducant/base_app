import { Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import color from '@styles/color';
import UserScreen from '@screens/user/User';
import HomeScreen from '@screens/home/index';
import { useAsyncApp } from '@utils/asyncApp';
import HistorySreen from '@screens/home/History';
import { navigationStyle } from '@styles/navigation.style';
import { IconHome, IconActivities, IconUser } from '@assets/icons';

import MapCheckScreen from '@screens/home/MapCheck';
import SelectLocationScreen from '@screens/home/SelectLocation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = { headerShown: false };

function NoFooter() {
  const screens: any = [MapCheckScreen, SelectLocationScreen];

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
      name: 'HistorySreen',
      component: HistorySreen,
      label: t('activity'),
      icon: IconActivities,
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
