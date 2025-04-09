import NetInfo from '@react-native-community/netinfo';
import {NativeModules} from 'react-native';
import {authorize} from 'react-native-app-auth';
import Cloud from '../../shared/CloudBackupAndRestoreUtils';
import {CACHED_API} from '../../shared/api';
import {
  fetchKeyPair,
  generateKeyPair,
} from '../../shared/cryptoutil/cryptoUtil';
import {
  constructAuthorizationConfiguration,
  constructIssuerMetaData,
  constructProofJWT,
  hasKeyPair,
  updateCredentialInformation,
  vcDownloadTimeout,
  verifyCredentialData,
} from '../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {VciClient} from '../../shared/vciClient/VciClient';
import {issuerType} from './IssuersMachine';

export const IssuersService = () => {
  return {
    isUserSignedAlready: () => async () => {
      return await Cloud.isSignedInAlready();
    },
    downloadIssuersList: async () => {
      const trustedIssuersList = await CACHED_API.fetchIssuers();
      return trustedIssuersList;
    },
    checkInternet: async () => await NetInfo.fetch(),
    fetchCredentialOfferIssuer: async (context: any): Promise<issuerType> => {
      console.log('event ::', context.qrData);
      const credentialOfferJson = await VciClient.fetchCredentialOfferIssuer(
        context.qrData,
      );
      console.log('credentialOfferIssuerJson ::', credentialOfferJson);
      const credentialOffer= JSON.parse(
        credentialOfferJson,
      ) as issuerType
      credentialOffer.credential_issuer_host=credentialOffer.credential_issuer
      return credentialOffer;
    },
    getAuthFlowType: async (context: any) => {
      if (context.selectedIssuer?.grants) {
        console.log('grants ::', context.selectedIssuer.grants);
        return context.selectedIssuer.grants;
      } else {
        return [];
      }
    },
    downloadIssuerWellknown: async (context: any) => {
      console.log('selectedIssuer ::', context.selectedIssuer);
      const wellknownResponse = await CACHED_API.fetchIssuerWellknownConfig(
        context.selectedIssuer.id,
        context.selectedIssuer.credential_issuer_host
          ? context.selectedIssuer.credential_issuer_host
          : context.selectedIssuer.credential_issuer,
      );
      return wellknownResponse;
    },
    downloadCredentialTypes: async (context: any) => {
      const credentialTypes = [];
      const selectedIssuer = context.selectedIssuer;

      const keys =
        selectedIssuer.credential_configuration_ids ??
        Object.keys(selectedIssuer.credential_configurations_supported);

      for (const key of keys) {
        if (selectedIssuer.credential_configurations_supported[key]) {
          credentialTypes.push({
            id: key,
            ...selectedIssuer.credential_configurations_supported[key],
          });
        }
      }

      if (credentialTypes.length === 0) {
        throw new Error(
          `No credential type found for issuer ${selectedIssuer.issuer_id}`,
        );
      }
      console.log('credentialTypes ::', credentialTypes);
      return credentialTypes;
    },
    fetchAuthorizationEndpoint: async (context: any) => {
      const wellknownResponse = context.selectedIssuerWellknownResponse;
      const authorizationServers =
        wellknownResponse['authorization_servers'] || [];
      const credentialIssuer = wellknownResponse['credential_issuer'];
      const grants = context.selectedIssuer?.grants || {};

      // 1. Decide flow: prefer auth_code flow
      const flow = grants['authorization_code']
        ? 'authorization_code'
        : 'urn:ietf:params:oauth:grant-type:pre-authorized_code';

      const grantObject = grants[flow];
      const directAuthServer = grantObject?.authorization_server;

      if (directAuthServer) {
        const metadata =
          await CACHED_API.fetchIssuerAuthorizationServerMetadata(
            directAuthServer,
          );
          console.log('metadata ::', metadata);
        return metadata;
      }
      console.log('authorizationServers ::', authorizationServers);
      const serversToCheck =
        authorizationServers.length > 0
          ? authorizationServers
          : [credentialIssuer];
      for (const server of serversToCheck) {
        const metadata =
          await CACHED_API.fetchIssuerAuthorizationServerMetadata(server);
        if (
          (
            metadata['grant_types_supported'] || [
              'authorization_code',
              'implicit',
            ]
          ).some(grant => [flow].includes(grant))
        )
          console.log('metadata ::', metadata);
        return metadata;
      }

      throw new Error('Authorization endpoint discovery failed');
    },

    downloadCredential: async (context: any) => {
      const downloadTimeout = await vcDownloadTimeout();
      var credential;
      if (
        context.selectedIssuer.grants?.[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]
      ) {
        credential = await VciClient.downloadCredentialViaPreAuth(
          constructIssuerMetaData(
            context.selectedIssuer,
            context.selectedCredentialType,
            downloadTimeout,
          ),
          context.publicKey,
          context.privateKey,
          context.keyType,
          context.selectedIssuer,
        );
      } else {
        const accessToken: string = context.tokenResponse?.accessToken;
        const proofJWT = await constructProofJWT(
          context.publicKey,
          context.privateKey,
          accessToken,
          context.selectedIssuer,
          context.keyType,
        );
        credential = await VciClient.downloadCredential(
          constructIssuerMetaData(
            context.selectedIssuer,
            context.selectedCredentialType,
            downloadTimeout,
          ),
          proofJWT,
          accessToken,
        );

        console.info(
          `VC download via ${context.selectedIssuerId} is successful`,
        );
      }
      return await updateCredentialInformation(context, credential);
    },
    invokeAuthorization: async (context: any) => {
      sendImpressionEvent(
        getImpressionEventData(
          TelemetryConstants.FlowType.vcDownload,
          context.selectedIssuer.issuer_id +
            TelemetryConstants.Screens.webViewPage,
        ),
      );
      if (
        !context.selectedIssuer.grants?.[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]
      ) {
        console.log('selectedIssuer ::', context.selectedIssuer.token_endpoint);
        return await authorize(
          constructAuthorizationConfiguration(
            context.selectedIssuer,
            context.selectedCredentialType.scope,
          ),
        );
      } else return [];
    },

    getKeyOrderList: async () => {
      const {RNSecureKeystoreModule} = NativeModules;
      const keyOrder = JSON.parse(
        (await RNSecureKeystoreModule.getData('keyPreference'))[1],
      );
      console.log('keyOrder ::', keyOrder);
      return keyOrder;
    },

    generateKeyPair: async (context: any) => {
      const keypair = await generateKeyPair(context.keyType);
      return keypair;
    },

    getKeyPair: async (context: any) => {
      console.log('keyType ::', context.keyType);
      if (context.keyType === '') {
        throw new Error('key type not found');
      } else if (!!(await hasKeyPair(context.keyType))) {
        return await fetchKeyPair(context.keyType);
      }
    },

    getSelectedKey: async (context: any) => {
      return context.keyType;
    },

    verifyCredential: async (context: any) => {
      const verificationResult = await verifyCredentialData(
        context.verifiableCredential?.credential,
        context.selectedCredentialType.format,
        context.selectedIssuerId,
      );
      if (!verificationResult.isVerified) {
        throw new Error(verificationResult.verificationErrorCode);
      }
      return verificationResult;
    },
  };
};
