import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import mockedConstants from 'react-native.mock';
import mockArgon2 from 'react-native-argon2.mock';
import mockLocalAuthentication from 'expo-local-authentication.mock';
import mockRNLocalize from 'react-native-localize.mock';
import mockGenSecureRandom from 'react-native-securerandom.mock';
import mockReactNativeKeychain from 'react-native-keychain.mock';
import mockRNSecureKeyStore from 'react-native-secure-key-store.mock';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native', () => require('react-native.mock.js'));

jest.mock('expo-constants', () => mockedConstants);

jest.mock('react-native-argon2', () => mockArgon2);

jest.mock('react-native-securerandom', () => mockGenSecureRandom);

jest.mock('expo-local-authentication', () => mockLocalAuthentication);

jest.mock('react-native-rsa-native', () =>
  require('react-native-rsa-native.mock.js'),
);

jest.mock('telemetry-sdk', () => require('telemetry-sdk.mock.js'));

jest.mock('react-native-localize', () => mockRNLocalize);

jest.mock('expo-localization', () => require('expo-localization.mock.js'));

// jest.mock('./locales/en.json', () => require('en.mock.json'));

jest.mock('iso-639-3', () => {
  iso6393To1: jest.fn();
});

jest.mock('react-native-keychain', () => mockReactNativeKeychain);

jest.mock('react-native-secure-key-store', () => mockRNSecureKeyStore);

jest.mock('react-native-fs', () => require('react-native-fs.mock'));

jest.mock('react-native-zip-archive', () =>
  require('react-native-zip-archive.mock'),
);

jest.mock('react-native-biometrics-changed');

jest.mock('@react-navigation/native');

jest.mock('@mosip/tuvali');

jest.mock('react-native-bluetooth-state-manager');

jest.mock('react-native-permissions');

jest.mock('react-native-linear-gradient', () => (LinearGradient = jest.fn()));

jest.mock('expo-camera', () => {
  Camera = jest.fn();
});

jest.mock('base58-universal/main', () => require('base58-universal-main.js'));