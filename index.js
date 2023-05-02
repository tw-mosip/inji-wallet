import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { inspect } from 'react-native-flipper-xstate';

import App from './App';

// eslint-disable-next-line no-undef
if (__DEV__) {
  inspect();
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
