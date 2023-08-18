import React from 'react';
import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { RootStackParamList } from './index';
import { ScanLayout } from '../screens/Scan/ScanLayout';
import { HistoryScreen } from '../screens/History/HistoryScreen';
import i18n from '../i18n';
import { Platform } from 'react-native';
import { HomeScreenLayout } from '../screens/HomeScreenLayout';

const home: TabScreen = {
  name: 'Home',
  component: HomeScreenLayout,
  icon: 'home',
  options: {
    headerTitle: '',
    headerShown: false,
  },
};
export const scan: TabScreen = {
  name: 'Scan',
  component: ScanLayout,
  icon: 'qr-code-scanner',
  options: {
    title: i18n.t('MainLayout:scan'),
    headerShown: false,
  },
};
const history: TabScreen = {
  name: 'History',
  component: HistoryScreen,
  icon: 'history',
  options: {
    title: i18n.t('MainLayout:history'),
    headerRight: null,
  },
};

export const mainRoutes: TabScreen[] = [];
mainRoutes.push(home);
mainRoutes.push(scan);
mainRoutes.push(history);

export type MainBottomTabParamList = {
  Home: {
    activeTab: number;
  };
  Scan: undefined;
  History: undefined;
};

export interface TabScreen {
  name: string;
  icon: string;
  component: React.FC;
  options?: BottomTabNavigationOptions;
}

export type MainRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList
>;

export type HomeRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList,
  'Home'
>;
