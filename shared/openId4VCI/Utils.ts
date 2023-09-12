import { ENABLE_OPENID_FOR_VC } from 'react-native-dotenv';

export const OpenId4VCIProtocol = 'OpenId4VCI';
export const isVCFromOpenId4VCI = (vcKey: string) => {
  return vcKey?.indexOf('urn') !== -1;
};

export const isOpenId4VCIEnabled = () => {
  return ENABLE_OPENID_FOR_VC === 'true';
};
