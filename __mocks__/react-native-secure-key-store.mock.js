const RNSecureKeyStore = require('react-native-secure-key-store');

const mockSet = jest.fn();
const mockGet = jest.fn();
const mockRemove = jest.fn();

RNSecureKeyStore.set = mockSet;
RNSecureKeyStore.get = mockGet;
RNSecureKeyStore.remove = mockRemove;

export default RNSecureKeyStore;
