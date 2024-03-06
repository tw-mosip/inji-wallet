const ReactNativeKeychain = require('react-native-keychain');

const mockSetGenericPassword = jest.fn();
const mockGetGenericPassword = jest.fn();
const mockResetGenericPassword = jest.fn();

ReactNativeKeychain.setGenericPassword = mockSetGenericPassword;
ReactNativeKeychain.getGenericPassword = mockGetGenericPassword;
ReactNativeKeychain.resetGenericPassword = mockResetGenericPassword;

export default ReactNativeKeychain;
