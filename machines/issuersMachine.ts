import { authorize } from 'react-native-app-auth';
import { EventFrom, send, sendParent, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { Theme } from '../components/ui/styleUtils';
import { MY_VCS_STORE_KEY } from '../shared/constants';
import { request } from '../shared/request';
import { StoreEvents } from './store';
import { AppServices } from '../shared/GlobalContext';

const model = createModel(
  {
    issuers: [] as issuerType[],
    selectedIssuer: [] as issuerType[],
    tokenResponse: [] as [],
    errorMessage: null as string,
    credential: null as object,
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      DISMISS: () => ({}),
      SELECTED_ISSUER: (id: string) => ({ id }),
      DOWNLOAD_ID: () => ({}),
      COMPLETED: () => ({}),
      TRY_AGAIN: () => ({}),
      RESET_ERROR: () => ({}),
      CANCEL: () => ({}),
    },
  }
);

export const IssuerScreenTabEvents = model.events;
export const Issuer_Tab_Ref_Id = 'issuersMachine';
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
            actions: 'setTokenResponse',
            target: 'downloadCredentials',
          },
        },
      },
      downloadCredentials: {
        invoke: {
          src: 'downloadCredential',
          onDone: {
            actions: 'setCredential',
            target: 'storing',
          },
        },
        on: {
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      storing: {
        entry: [
          'storeVcMeta',
          'storeVcData',
          'storeVcsContext',
          'storeVcMetaContext',
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
        // const response = await fetch(
        //   'https://api-internal.dev1.mosip.net/v1/esignet/vci/credential',
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': 'Bearer ' + context.tokenResponse?.accessToken,
        //     },
        //     body: JSON.stringify({}),
        //   }
        // );
        // console.log('response', response);
        // const credential = await response.json();
        // console.log(
        //   'Response from downloadCredential',
        //   JSON.stringify(credential, null, 4)
        // );
        // return JSON.stringify(credential, null, 4);

        const creds = {
          format: 'ldp_vc',
          credential: {
            'issuanceDate': '2023-08-28T10:26:58.953Z',
            'credentialSubject': {
              name: 'Rolex',
              id: 'did:example:456',
              age: 30,
            },
            'id': 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba390356',
            'proof': {
              type: 'RsaSignature2018',
              created: '2023-08-28T10:26:58Z',
              proofPurpose: 'assertionMethod',
              verificationMethod:
                'https://esignet.dev1.mosip.net/v1/esignet/oauth/.well-known/jwks.json',
              jws: 'eyJ4NWMiOlsiTUlJRHZUQ0NBcVdnQXdJQkFnSUl2U1ZGWjBheVd1c3dEUVlKS29aSWh2Y05BUUVMQlFBd2R6RUxNQWtHQTFVRUJoTUNTVTR4Q3pBSkJnTlZCQWdNQWt0Qk1SSXdFQVlEVlFRSERBbENRVTVIUVV4UFVrVXhEVEFMQmdOVkJBb01CRWxKVkVJeEdqQVlCZ05WQkFzTUVVMVBVMGxRTFZSRlEwZ3RRMFZPVkVWU01Sd3dHZ1lEVlFRRERCTjNkM2N1Ylc5emFYQXVhVzhnS0ZKUFQxUXBNQjRYRFRJek1EY3hOREEwTVRJME5Gb1hEVEkyTURjeE16QTBNVEkwTkZvd2Z6RUxNQWtHQTFVRUJoTUNTVTR4Q3pBSkJnTlZCQWdNQWt0Qk1SSXdFQVlEVlFRSERBbENRVTVIUVV4UFVrVXhEVEFMQmdOVkJBb01CRWxKVkVJeEdqQVlCZ05WQkFzTUVVMVBVMGxRTFZSRlEwZ3RRMFZPVkVWU01TUXdJZ1lEVlFRRERCdDNkM2N1Ylc5emFYQXVhVzhnS0U5SlJFTmZVMFZTVmtsRFJTa3dnZ0VpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDdXBUTkJSN2tiZkMwVjhGQk9uVmdqS2NnSVNWNEJlYldzbVFOdlRpTTRTbzRrZ09VOFRjZzFFUitRazUrL3Y2YzNOR1o4WnVBRjhveEVXNzV4czZsdE4yejZOSUEzUTlmRTZwWUpYZjlpeFBzT3pac241YmpZTUp3OEMxTm1FNVVpWWZ6UUNBUmg4ZFhZKzhlQTlXaWdvRHpDRklXZUFkYjMzWDRTODZ5aURzSXVZMVY4bXhBNFBXRVI5MjlTc2cvTm5yMDRaSGRGRmJjdFBMZm5HMXhKTWhlbFRjK3YwSDk1RndZNUNvdEtmaXBGeTZ3VVcxWkVKTDF1RGpuc2ZCcmdOSDFIYlR2WU96Uk55Vy9UdFFGSTc0eFNoUm9UaFlzOWdHY0hQRU5ob2Y4S1NQUlZ3Unp0UDdBV0ZKcUFLaEFuWEdtcll5RE9iVVpXYTJMY3p1b0xBZ01CQUFHalJUQkRNQklHQTFVZEV3RUIvd1FJTUFZQkFmOENBUUV3SFFZRFZSME9CQllFRkt6SnV5VXc5UlFmZmFKYU1OdlBNR1U1YlNSdE1BNEdBMVVkRHdFQi93UUVBd0lDaERBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQVFFQW1HRXplb2tWMHE2c05rcGJzbG5jbkZpN01hcDMzYkd2OTRWdldQZ0EyZkZxYzFPUXEvZkhZYXI4UzhoZ1FlcVFleUZGOFJRUGE4R2EvUkpmQTZhMFZTMjgwbk8zUS9JVEhmdUd6MWc2UU54Y2ZFMWQ1T09kUXdlMXNkQWJjNTNrQVg3WmFzVEV1YW03SUkxSC9PMHdmdEZXVTM2OW1BV1ZmbXAvOERDdEY3STZpcjg0U25QeU5GeElOaGdnU0x4cVBMR3VaREs4eGJ6MERzQjJlQmtsZitCK2R3VU00OENmd1Ezc0FGQnJVOGx4cXJVWE1LL2ZLVitCWkx5ZWM3KzdHMUo4dXB4VUdEdlZnV29BN2pmU3RBOGpkcVdOZmZpNjQrMUdVK0t0VmhhN1BqbnlhYmttTHdtbThUU1ZVSGV3WGExUDdQaXV6S2ZQSGx0b2lqR1F5dz09Il0sIng1dCNTMjU2IjoiQXBkZzZTNlJtamtpQmp2RVVZWUNhLUtGLXlySmJsNngxd3pLcmM0c210MCIsImtpZCI6IkdURVJDT212RDVQbFo2NWxvMk5hLTRVZGMyeGdBNkVrYUh1RXNuTWV2UkEiLCJhbGciOiJSUzI1NiJ9..crY546Ej4Dmp_TtFkDKaXJfLi5OSzv8UVQ3wXXnrV9aeq9i2g87T73wRFYrWFJbKbjm-YJUyNCTtDKPzR1o66BSuCdPFALG2VivdkEb_9AVqdg4hwVkcPhzqeXJgbQ5QEsxiNyUp51uCJNcJB5g7qXGK9AMVECalzcXkQyM_WdkIUWbX5eFiFKpg7jyK1Da-DhQlUqmTgm5WT_CTokY5QfeFk-MJ90OHQ5Af9144z_ZBPDVioOrx9Xhd3XNgqRvmS4zXvdDWXs2CR-bC0ufc7nklAgSHzJjchh6-rTFnrtM-E6vyAFvEOKQFbo-xz-rbrSM7Hd8GLavXYyCX9f1A3g',
            },
            'type': ['VerifiableCredential'],
            '@context': 'https://www.w3.org/2018/credentials/v1',
            'issuer': 'did:example:123',
          },
        };
        return creds;
      },
      invokeAuthorization: async (context) => {
        const response = await authorize(context.selectedIssuer);
        return response;
      },
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
