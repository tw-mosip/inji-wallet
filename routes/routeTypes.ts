import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from './index';
import {MainBottomTabParamList} from "./mainBottomTabParamList";

export type MainRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList
>;

export type HomeRouteProps = BottomTabScreenProps<
  MainBottomTabParamList & RootStackParamList,
  'home'
>;
