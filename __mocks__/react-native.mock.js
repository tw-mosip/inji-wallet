jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');

  // Mock the NativeModules module
  ReactNative.NativeModules = {
    // Mock the CameraRoll module
    CameraRoll: {
      getPhotos: jest.fn(),
    },
    CameraModule: {
      capturePhoto: jest.fn(),
    },
    LocationModule: {
      getCurrentLocation: jest.fn(),
    },
    NativeEventEmitter: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  };

  return ReactNative;
});
