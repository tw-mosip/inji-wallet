import { NativeModules, NativeEventEmitter } from 'react-native';
import { __AppId } from '../GlobalVariables';
import { constructProofJWT } from '../openId4VCI/Utils';
import { issuerType } from '../../machines/Issuers/IssuersMachine';

const emitter = new NativeEventEmitter(NativeModules.InjiVciClient);

export class VciClient {
  static get client() {
    const nativeClient = NativeModules.InjiVciClient;
    nativeClient.init(__AppId.getValue());
    return nativeClient;
  }

  static async fetchCredentialOfferIssuer(credentialOffer: any) {
    return await VciClient.client.fetchCredentialOffer(credentialOffer);
  }

  static async downloadCredentialViaPreAuth(issuerMetaData: Object, publicKey: string, privateKey: string, keyType: KeyType, issuer:issuerType) {
    const listener = emitter.addListener('onRequestProof', async event => {
      const { accessToken,cNonce } = event;

      const jwt = await constructProofJWT(publicKey, privateKey, accessToken,issuer, keyType, cNonce);
      await NativeModules.InjiVciClient.sendProofFromJS(jwt);

      listener.remove();
    });

    const credentialResponse = await VciClient.client.downloadCredentialViaPreAuth(issuerMetaData, '');
    return JSON.parse(credentialResponse);
  }

  static async downloadCredential(
    issuerMetaData: Object,
    jwtProof: string,
    accessToken: string,
  ) {
    const credentialResponse = await VciClient.client.requestCredential(
      issuerMetaData,
      jwtProof,
      accessToken,
    );
    return JSON.parse(credentialResponse);
  }
}
