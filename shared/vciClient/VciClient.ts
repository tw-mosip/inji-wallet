import {NativeModules, NativeEventEmitter} from 'react-native';
import {__AppId} from '../GlobalVariables';

const emitter = new NativeEventEmitter(NativeModules.InjiVciClient);

let listenerAttached = false;
if (!listenerAttached) {
  emitter.addListener('onRequestProof', async event => {
    const {accessToken} = event;
    const jwt = `accessToken${accessToken}jvjvhjvhjvhjvhv`; // actual signer logic here
    await NativeModules.InjiVciClient.sendProofFromJS(jwt);
  });
  listenerAttached = true;
}

export class VciClient {
  static get client() {
    const nativeClient = NativeModules.InjiVciClient;
    nativeClient.init(__AppId.getValue());
    return nativeClient;
  }

  static fetchCredentialOfferIssuer(credentialOffer: any) {
    return VciClient.client.fetchCredentialOfferIssuer(credentialOffer);
  }

  static async downloadCredentialViaPreAuth(issuerMetaData: Object) {
    const credentialResponse =
      await VciClient.client.requestCredentialByPreAuthFlow(issuerMetaData);
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
