const LocalAuthentication = require('expo-local-authentication');

LocalAuthentication.hasHardwareAsync = jest.fn(() => Promise.resolve(true));
LocalAuthentication.supportedAuthenticationTypesAsync = jest.fn(() =>
  Promise.resolve(['fingerprint']),
);
LocalAuthentication.authenticateAsync = jest.fn(() =>
  Promise.resolve({success: true}),
);

export default LocalAuthentication;
