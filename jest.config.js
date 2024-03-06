const {defaults: tsjPreset} = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
      babelConfig: true,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '\\.snap$'],
  cacheDirectory: '.jest/cache',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest'],
    '^.+\\.jsx?$': 'babel-jest',
  },
  // This line should be kept even with nothing to be ignored, otherwise the transform will not take place.
  // Not quite sure about the reason.
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-native|react-native|react-native-argon2|@react-navigation|react-native-elements|react-native-size-matters|react-native-ratings|expo-constants)/).*/',
    'node_modules/(?!(react-native|@react-native|react-native-biometrics-changed)/)',
  ],
  setupFiles: [
    'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/react-native.mock.js',
    'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/expo-constants.mock.js',
    'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/react-native-argon2.mock.js',
    'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/jest.setup.js',
  ],
  // Enable code coverage
  collectCoverage: true,

  // Specify where to collect coverage from
  collectCoverageFrom: [
    'src/**/*.js', // Adjust the path based on your project structure
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^\\.\\/locales\\/en\\.json$':
      'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/en.mock.json',
    '^@digitalbazaar/rsa-verification-key-2018$':
      'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/rsa-verification-key-2018.js',
    '^react-native-biometrics-changed$':
      'C:/Users/srika/Desktop/tw-mosip/inji/__mocks__/react-native-biometrics-changed.js',
  },
};
