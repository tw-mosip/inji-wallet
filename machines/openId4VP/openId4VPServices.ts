import {fetchKeyPair} from '../../shared/cryptoutil/cryptoUtil';
import {__AppId} from '../../shared/GlobalVariables';
import {OpenID4VP} from '../../shared/openId4VP/OpenID4VP';

export const openId4VPServices = () => {
  const trustedVerifiersList = [
    {
      client_id: 'https://injiverify.dev2.mosip.net',
      response_uri: [
        'https://injiverify.qa-inji.mosip.net/redirect',
        'https://injiverify.dev2.mosip.net/redirect',
      ],
    },
    {
      client_id: 'https://injiverify.dev1.mosip.net',
      response_uri: [
        'https://injiverify.qa-inji.mosip.net/redirect',
        'https://injiverify.dev1.mosip.net/redirect',
      ],
    },
  ];
  return {
    getAuthenticationResponse: (context: any) => async () => {
      OpenID4VP.initialize();
      const serviceRes = await OpenID4VP.authenticateVerifier(
        context.encodedAuthorizationRequest,
        trustedVerifiersList,
      );
      return serviceRes;
    },

    getKeyPair: async (context: any) => {
      if (!!(await fetchKeyPair(context.keyType)).publicKey) {
        return await fetchKeyPair(context.keyType);
      }
    },

    getSelectedKey: async (context: any) => {
      return await fetchKeyPair(context.keyType);
    },

    sendVP: (context: any) => async () => {
      const vpToken = await OpenID4VP.constructVerifiablePresentationToken(
        context.selectedVCs,
      );

      const proofJWT = await OpenID4VP.constructProofJWS(
        context.publicKey,
        context.privateKey,
        JSON.parse(vpToken),
        context.keyType,
      );

      const vpResponseMetadata = {
        jws: proofJWT,
        signatureAlgorithm: 'RsaSignature2018',
        publicKey: context.publicKey,
        domain: 'OpenId4Vp',
      };
      return await OpenID4VP.shareVerifiablePresentation(
        vpResponseMetadata,
      );
    },
  };
};
