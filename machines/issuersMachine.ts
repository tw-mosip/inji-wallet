import { authorize } from 'react-native-app-auth';
import { assign, EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { Theme } from '../components/ui/styleUtils';
import { MY_VCS_STORE_KEY, VC_ITEM_STORE_KEY } from '../shared/constants';
import { request } from '../shared/request';
import { StoreEvents } from './store';
import { AppServices } from '../shared/GlobalContext';
import {
  createSignature,
  encodeB64,
  generateKeys,
  isCustomSecureKeystore,
} from '../shared/cryptoutil/cryptoUtil';
import SecureKeystore from 'react-native-secure-keystore';
import { KeyPair } from 'react-native-rsa-native';
import { ActivityLogEvents } from './activityLog';
import forge from 'node-forge';
import { log } from 'xstate/lib/actions';
import { VerifiableCredential } from '../types/vc';

const model = createModel(
  {
    issuers: [] as issuerType[],
    selectedIssuer: [] as issuerType[],
    tokenResponse: [] as [],
    errorMessage: null as string,
    credential: null as VerifiableCredential,
    serviceRefs: {} as AppServices,

    publicKey: null as string,
    privateKey: null as string,
  },
  {
    events: {
      DISMISS: () => ({}),
      SELECTED_ISSUER: (id: string) => ({ id }),
      DOWNLOAD_ID: () => ({}),
      COMPLETED: () => ({}),
      TRY_AGAIN: () => ({}),
      RESET_ERROR: () => ({}),
      CHECK_KEY_PAIR: () => ({}),
      CANCEL: () => ({}),
    },
  }
);

export const IssuerScreenTabEvents = model.events;
export const Issuer_Tab_Ref_Id = 'issuersMachine';

export const Issuers_Key_Ref = 'OpenId4VCI';
export const IssuersMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEtawK5gE6wLIEMBjAC2QDswA6AG1QBcBJNTHAYggHsLLY786qqDNjxFS3WrybCcAbQAMAXUSgADh1jI6yLipAAPRAEYA7PMomj8gJwAWeSYAcTgMy2TJgDQgAnsZPWlLYArC5GAEzWEfKRtka2AL4J3kIsoiTkVLBg1GCE2mRQ0iysACIA8gDqAHIAMuUAgqUA+gBqDA3NDKUKykgg6prauv2GCMHuFo7W8sET8i4x1uHefgimJpTWoRHWJrYuc9YAbEkpzCIEGdzZufnkRRdYrADKAKK1bwDCACpvLQwXi8AKpvABKvT0gy0OjIejGE02Thmc3si0iK18iEcRiC1nxJxR22OjhcZxAqUuYkyPByeQKjxkZUBuEBL0h-Whwzho0QiKmKPm6OWq0Q4X2QXkx3C0uCOKM0pcJnJlJwV3EWTp+WK2HYXCyfAElFV6Q1tLujCeHLUGhhI1AY2mx0oRmCxyMjgcJMi8VF6xM4Uo4QWRjc2xMcqVp2SFKepppqmwADMOFgALYNdB0Yip5AAL34sNYDWBPwAEuUwQwAFr-a0DW3c+HGBaOILHeSOWwkj3hYIKv34rYmY4TUeOZzSxzR84yePcRNYFPpzPZ3MF7msMHfN4MVr-Zo-coAaTe1XrXNhzfW4VvlEW3YVMRcexlfo2Wx2kX2h2C20SMYmuqNIwHQXxYJAYBkNo+DUAAYlgHBpjqzycDchqCHGwHcKB4GQdByCwQhSEoRejZXry6zuG2yy9scSq0bY75WEGMpytM+wONsZLkmQHAQHAehAdSFBQuR9oGIgAC0xx+jJKpYSJghkFoYlDBRDqIMctiUB2EyOPpMzhM4mJrH2gTLHs8jxI44T2K6ClzthVCSJac5qXaPKaQgtimWK1lBJExwzF24QuMGtgAbOaTOea9IPChHlNpRLi2ZQ-Zur5o7PlEslYggwa4r5JwBFlLijvsjkxUpcXak8SUaZJCARi4Lq2F28izGEna2e+dgugExwmKl7hmFKVVUtcVCLsuGZZjmWD5oWEmXhJYxWCxtkxGiRjLJYjh+oVgUlXYMrlcElWAYpU2ULhEECQRRGIch9WcuJXlNfECqBR6MTOHYZgHflwZtkNVkxGdrbhBNao1cgEC5A1a2IC1bUdV1VgTn5BV7JQWOksENhyk4RhJEkQA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: Issuer_Tab_Ref_Id,
    context: model.initialContext,
    initial: 'displayIssuers',
    tsTypes: {} as import('./issuersMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    states: {
      displayIssuers: {
        invoke: {
          src: 'downloadIssuersList',
          onDone: {
            actions: ['setIssuers'],
            target: 'selectingIssuer',
          },
          onError: {
            actions: ['setError'],
            target: 'error',
          },
        },
      },
      error: {
        on: {
          TRY_AGAIN: {
            actions: 'resetError',
            target: 'displayIssuers',
          },
          RESET_ERROR: {
            actions: 'resetError',
            target: 'idle',
          },
        },
      },
      selectingIssuer: {
        on: {
          DOWNLOAD_ID: {
            actions: sendParent('DOWNLOAD_ID'),
          },
          SELECTED_ISSUER: {
            target: 'downloadIssuerConfig',
          },
        },
      },
      downloadIssuerConfig: {
        invoke: {
          src: 'downloadIssuerConfig',
          onDone: {
            actions: 'setSelectedIssuers',
            target: 'performAuthorization',
          },
        },
      },
      performAuthorization: {
        invoke: {
          src: 'invokeAuthorization',
          onDone: {
            actions: ['setTokenResponse', 'getKeyPairFromStore', 'loadKeyPair'],
            target: 'checkKeyPair',
          },
          onError: {
            actions: [() => console.log('error in invokeAuth - ', event.data)],
            target: 'downloadCredentials',
          },
        },
      },
      checkKeyPair: {
        entry: [
          (context) =>
            log(
              'Reached CheckKeyPair context -> ',
              JSON.stringify(context, null, 4)
            ),
          send('CHECK_KEY_PAIR'),
        ],
        on: {
          CHECK_KEY_PAIR: [
            {
              cond: 'hasKeyPair',
              target: 'downloadCredentials',
            },
            {
              target: 'generateKeyPair',
            },
          ],
        },
      },
      generateKeyPair: {
        invoke: {
          src: 'generateKeyPair',
          onDone: [
            {
              actions: ['setPublicKey', 'setPrivateKey', 'storeKeyPair'],
              target: 'downloadCredentials',
            },
            {
              actions: ['setPublicKey', 'storeKeyPair'],
              cond: 'isCustomSecureKeystore',
              target: 'downloadCredentials',
            },
          ],
        },
      },
      downloadCredentials: {
        invoke: {
          src: 'downloadCredential',
          onDone: {
            actions: 'setCredential',
            target: 'verifyingCredential',
          },
        },
        on: {
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      verifyingCredential: {
        invoke: {
          src: 'verifyCredential',
          onDone: [
            {
              target: 'storing',
            },
          ],
          onError: [
            {
              actions: log((_, event) => (event.data as Error).message),
              //TODO: Move to state according to the required flow when verification of VC fails
              target: 'idle',
            },
          ],
        },
      },
      storing: {
        entry: [
          'storeVcMeta',
          'storeVcData',
          'storeVcsContext',
          'storeVcMetaContext',
          'logDownloaded',
        ],
      },
      idle: {
        entry: () => console.log('entered idle state'),
        on: {
          COMPLETED: {
            target: 'done',
          },
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      done: {
        entry: () => console.log('Reached done'),
        type: 'final',
      },
    },
  },
  {
    actions: {
      setIssuers: model.assign({
        issuers: (_, event) => event.data,
      }),

      setError: model.assign({
        errorMessage: (_, event) => {
          console.log('Error while fetching issuers ', event.data.message);
          return event.data.message === 'Network request failed'
            ? 'noInternetConnection'
            : 'generic';
        },
      }),

      resetError: model.assign({
        errorMessage: null,
      }),

      loadKeyPair: assign({
        publicKey: (_, event) => event.publicKey,
        privateKey: (context, event) =>
          event.privateKey ? event.privateKey : context.privateKey,
      }),
      getKeyPairFromStore: send(StoreEvents.GET(Issuers_Key_Ref), {
        to: (context) => context.serviceRefs.store,
      }),
      storeKeyPair: send(
        (context, event) => {
          return StoreEvents.SET(Issuers_Key_Ref, {
            publicKey: context.publicKey,
            privateKey: context.privateKey,
          });
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),
      storeVcMeta: send(
        (context) =>
          StoreEvents.PREPEND(MY_VCS_STORE_KEY, context?.credential.id),
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      storeVcData: send(
        (context) => {
          return StoreEvents.SET(context?.credential.id, context.credential);
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),
      storeVcMetaContext: send(
        (context) => {
          return {
            type: 'VC_ADDED',
            vcKey: context?.credential.id,
          };
        },
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),

      storeVcsContext: send(
        (context) => {
          return {
            type: 'VC_DOWNLOADED_FROM_OPENID4VCI',
            vcKey: context?.credential.id,
            vc: {
              credential: context.credential,
            },
          };
        },
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),

      setSelectedIssuers: model.assign({
        selectedIssuer: (_, event) => event.data,
      }),
      setTokenResponse: model.assign({
        tokenResponse: (_, event) => event.data,
      }),
      setCredential: model.assign({
        credential: (_, event) => event.data.credential,
      }),
      setPublicKey: assign({
        publicKey: (context, event) => {
          if (!isCustomSecureKeystore()) {
            return (event.data as KeyPair).public;
          }
          return event.data as string;
        },
      }),

      setPrivateKey: assign({
        privateKey: (context, event) => (event.data as KeyPair).private,
      }),

      logDownloaded: send(
        (context) => {
          const { credential } = context;
          return ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: credential.id,
            type: 'VC_DOWNLOADED',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: '',
          });
        },
        {
          to: (context) => context.serviceRefs.activityLog,
        }
      ),
    },
    services: {
      downloadIssuersList: async () => {
        const defaultIssuer = {
          id: 'UIN, VID, AID',
          displayName: 'Enter the mentioned ID and download your card',
          logoUrl: Theme.DigitIcon,
        };

        const response = await request('GET', '/residentmobileapp/issuers');
        return [defaultIssuer, ...response.response.issuers];
      },
      downloadIssuerConfig: async (_, event) => {
        const response = await request(
          'GET',
          `/residentmobileapp/issuers/${event.id}`
        );
        console.log(
          'Response from downloadIssuerConfig -> ',
          JSON.stringify(response, null, 4)
        );
        return response.response;
      },
      //todo mock changes has to be reverted
      downloadCredential: async (context) => {
        const proofJWT = await getJWT(context);
        const body = {
          format: 'ldp_vc',
          credential_definition: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            'type': ['VerifiableCredential', 'MOSIPVerifiableCredential'],
          },
          proof: {
            proof_type: 'jwt',
            jwt: proofJWT,
          },
        };

        console.log('downloadCredential body: ', JSON.stringify(body, null, 4));
        const response = await fetch(
          'https://api-internal.dev1.mosip.net/v1/esignet/vci/credential',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + context.tokenResponse?.accessToken,
            },
            body: JSON.stringify(body),
          }
        );
        const credential = await response.json();
        console.log(
          'Response from downloadCredential',
          JSON.stringify(credential, null, 4)
        );
        return JSON.stringify(credential, null, 4);

        // return {
        //   format: 'ldp_vc',
        //   credential: {
        //     'issuanceDate': '2023-08-28T10:26:58.953Z',
        //     'credentialSubject': {
        //       name: 'Person2',
        //       id: 'did:example:456',
        //       age: 32,
        //     },
        //     'id': 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba390413',
        //     'proof': {
        //       type: 'RsaSignature2018',
        //       created: '2023-08-28T10:26:58Z',
        //       proofPurpose: 'assertionMethod',
        //       verificationMethod:
        //         'https://esignet.dev1.mosip.net/v1/esignet/oauth/.well-known/jwks.json',
        //       jws: 'eyJ4NWMiOlsiTUlJRHZUQ0NBcVdnQXdJQkFnSUl2U1ZGWjBheVd1c3dEUVlKS29aSWh2Y05BUUVMQlFBd2R6RUxNQWtHQTFVRUJoTUNTVTR4Q3pBSkJnTlZCQWdNQWt0Qk1SSXdFQVlEVlFRSERBbENRVTVIUVV4UFVrVXhEVEFMQmdOVkJBb01CRWxKVkVJeEdqQVlCZ05WQkFzTUVVMVBVMGxRTFZSRlEwZ3RRMFZPVkVWU01Sd3dHZ1lEVlFRRERCTjNkM2N1Ylc5emFYQXVhVzhnS0ZKUFQxUXBNQjRYRFRJek1EY3hOREEwTVRJME5Gb1hEVEkyTURjeE16QTBNVEkwTkZvd2Z6RUxNQWtHQTFVRUJoTUNTVTR4Q3pBSkJnTlZCQWdNQWt0Qk1SSXdFQVlEVlFRSERBbENRVTVIUVV4UFVrVXhEVEFMQmdOVkJBb01CRWxKVkVJeEdqQVlCZ05WQkFzTUVVMVBVMGxRTFZSRlEwZ3RRMFZPVkVWU01TUXdJZ1lEVlFRRERCdDNkM2N1Ylc5emFYQXVhVzhnS0U5SlJFTmZVMFZTVmtsRFJTa3dnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDdXBUTkJSN2tiZkMwVjhGQk9uVmdqS2NnSVNWNEJlYldzbVFOdlRpTTRTbzRrZ09VOFRjZzFFUitRazUrL3Y2YzNOR1o4WnVBRjhveEVXNzV4czZsdE4yejZOSUEzUTlmRTZwWUpYZjlpeFBzT3pac241YmpZTUp3OEMxTm1FNVVpWWZ6UUNBUmg4ZFhZKzhlQTlXaWdvRHpDRklXZUFkYjMzWDRTODZ5aURzSXVZMVY4bXhBNFBXRVI5MjlTc2cvTm5yMDRaSGRGRmJjdFBMZm5HMXhKTWhlbFRjK3YwSDk1RndZNUNvdEtmaXBGeTZ3VVcxWkVKTDF1RGpuc2ZCcmdOSDFIYlR2WU96Uk55Vy9UdFFGSTc0eFNoUm9UaFlzOWdHY0hQRU5ob2Y4S1NQUlZ3Unp0UDdBV0ZKcUFLaEFuWEdtcll5RE9iVVpXYTJMY3p1b0xBZ01CQUFHalJUQkRNQklHQTFVZEV3RUIvd1FJTUFZQkFmOENBUUV3SFFZRFZSME9CQllFRkt6SnV5VXc5UlFmZmFKYU1OdlBNR1U1YlNSdE1BNEdBMVVkRHdFQi93UUVBd0lDaERBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQW1HRXplb2tWMHE2c05rcGJzbG5jbkZpN01hcDMzYkd2OTRWdldQZ0EyZkZxYzFPUXEvZkhZYXI4UzhoZ1FlcVFleUZGOFJRUGE4R2EvUkpmQTZhMFZTMjgwbk8zUS9JVEhmdUd6MWc2UU54Y2ZFMWQ1T09kUXdlMXNkQWJjNTNrQVg3WmFzVEV1YW03SUkxSC9PMHdmdEZXVTM2OW1BV1ZmbXAvOERDdEY3STZpcjg0U25QeU5GeElOaGdnU0x4cVBMR3VaREs4eGJ6MERzQjJlQmtsZitCK2R3VU00OENmd1Ezc0FGQnJVOGx4cXJVWE1LL2ZLVitCWkx5ZWM3KzdHMUo4dXB4VUdEdlZnV29BN2pmU3RBOGpkcVdOZmZpNjQrMUdVK0t0VmhhN1BqbnlhYmttTHdtbThUU1ZVSGV3WGExUDdQaXV6S2ZQSGx0b2lqR1F5dz09Il0sIng1dCNTMjU2IjoiQXBkZzZTNlJtamtpQmp2RVVZWUNhLUtGLXlySmJsNngxd3pLcmM0c210MCIsImtpZCI6IkdURVJDT212RDVQbFo2NWxvMk5hLTRVZGMyeGdBNkVrYUh1RXNuTWV2UkEiLCJhbGciOiJSUzI1NiJ9..crY546Ej4Dmp_TtFkDKaXJfLi5OSzv8UVQ3wXXnrV9aeq9i2g87T73wRFYrWFJbKbjm-YJUyNCTtDKPzR1o66BSuCdPFALG2VivdkEb_9AVqdg4hwVkcPhzqeXJgbQ5QEsxiNyUp51uCJNcJB5g7qXGK9AMVECalzcXkQyM_WdkIUWbX5eFiFKpg7jyK1Da-DhQlUqmTgm5WT_CTokY5QfeFk-MJ90OHQ5Af9144z_ZBPDVioOrx9Xhd3XNgqRvmS4zXvdDWXs2CR-bC0ufc7nklAgSHzJjchh6-rTFnrtM-E6vyAFvEOKQFbo-xz-rbrSM7Hd8GLavXYyCX9f1A3g',
        //     },
        //     'type': ['VerifiableCredential'],
        //     '@context': ['https://www.w3.org/2018/credentials/v1'],
        //     'issuer': 'did:example:123',
        //   },
        // };
      },
      invokeAuthorization: async (context) => {
        const response = await authorize(context.selectedIssuer);
        return response;
      },
      generateKeyPair: async (context) => {
        if (!isCustomSecureKeystore()) {
          return await generateKeys();
        }
        const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
        return SecureKeystore.generateKeyPair(
          Issuers_Key_Ref,
          isBiometricsEnabled,
          0
        );
        return context;
      },
      verifyCredential: async (context) => {
        //TODO: Verify the credental instead of sending true always
        // return verifyCredential(context.credential);
        return true;
      },
    },
    guards: {
      hasKeyPair: (context) => {
        return context.publicKey != null;
      },
      isCustomSecureKeystore: () => isCustomSecureKeystore(),
    },
  }
);

type State = StateFrom<typeof IssuersMachine>;

export function selectIssuers(state: State) {
  return state.context.issuers;
}

export function selectCredentials(state: State) {
  return state.context.credential;
}

export function selectErrorMessage(state: State) {
  return state.context.errorMessage;
}

export function selectIsDownloadCredentials(state: State) {
  return state.matches('downloadCredentials');
}

export function selectIsDone(state: State) {
  return state.matches('done');
}

export function selectIsIdle(state: State) {
  return state.matches('idle');
}

export function selectLoadingIssuers(state: State) {
  return state.matches('displayIssuers');
}

export function selectStoring(state: State) {
  return state.matches('storing');
}

interface issuerType {
  id: string;
  displayName: string;
  logoUrl: string;
}

export const getJWK = (publicKey) => {
  const publicKeyJWK = forge.pki.publicKeyFromPem(publicKey);
  const publicKeyBase64 = forge.util.encode64(publicKeyJWK);
  publicKeyBase64.alg = 'RS256';
  publicKeyBase64.use = 'sig';
  console.log('PublicKey from Pem -> ', JSON.stringify(publicKeyBase64));
  return publicKeyJWK;
};
export const getJWT = async (context) => {
  try {
    const header64 = encodeB64(
      JSON.stringify({
        alg: 'RS256',
        jwk: getJWK(context.publicKey),
        typ: 'openid4vci-proof+jwt',
      })
    );

    const payload64 = encodeB64(
      JSON.stringify({
        iss: context.selectedIssuer.clientId,
        nonce: context.tokenResponse.authorizeAdditionalParameters.nonce,
        aud: context.selectedIssuer.serviceConfiguration.authorizationEndpoint,
        iat: Math.floor(new Date().getTime() / 1000),
        exp: Math.floor(new Date().getTime() / 1000) + 18000,
      })
    );
    const preHash = header64 + '.' + payload64;

    const signature64 = await createSignature(context.privateKey, preHash, '');

    return header64 + '.' + payload64 + '.' + signature64;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
