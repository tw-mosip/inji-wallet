import { createModel } from 'xstate/lib/model';
import { EventFrom, sendParent, StateFrom } from 'xstate';
import { request } from '../shared/request';
import { authorize } from 'react-native-app-auth';
import { HOST } from '../shared/constants';

const defaultIssuer = [
  {
    id: 'UIN, VID, AID',
    displayName: 'Enter the mentioned ID and download your card',
    logoUrl: '',
  },
];

const model = createModel(
  {
    issuers: defaultIssuer as issuerType[],
    selectedIssuer: [] as issuerType[],
    tokenResponse: [] as [],
    errorMessage: null as string,
    credential: '' as string,
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
          },
        },
        on: {
          TRY_AGAIN: {
            target: 'displayIssuers',
            actions: 'resetError',
          },
          RESET_ERROR: {
            actions: 'resetError',
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
            target: 'idle',
          },
        },
        on: {
          CANCEL: {
            target: 'selectingIssuer',
          },
        },
      },
      storing: {},
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
        errorMessage: (_, event) =>
          event.data.message === 'Network request failed'
            ? 'noInternetConnection'
            : 'generic',
      }),

      resetError: model.assign({
        errorMessage: null,
      }),

      setSelectedIssuers: model.assign({
        selectedIssuer: (_, event) => event.data,
      }),
      setTokenResponse: model.assign({
        tokenResponse: (_, event) => event.data,
      }),
      setCredential: model.assign({
        credential: (_, event) => event.data,
      }),
    },
    services: {
      downloadIssuersList: async () => {
        const response = await request('GET', '/residentmobileapp/issuers');
        return [...defaultIssuer, ...response.response.issuers];
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
      downloadCredential: async (context) => {
        const response = await fetch(
          'https://api-internal.dev1.mosip.net/v1/esignet/vci/credential',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + context.tokenResponse?.accessToken,
            },
            body: JSON.stringify({}),
          }
        );
        console.log('response', response);
        const credential = await response.json();
        console.log(
          'Response from downloadCredential',
          JSON.stringify(credential, null, 4)
        );
        return JSON.stringify(credential, null, 4);
      },
      invokeAuthorization: async (context) => {
        const config = {
          redirectUrl: 'io.mosip.residentapp.inji://oauthredirect',
          // redirectUrl: 'io.mosip.residentapp://oauth',
          clientId: '7-j3xRzU3SODdoNgSGvO_cD8UijH3AIWRDAg1x-M',
          clientSecret: '',
          scopes: ['SampleVerifiableCredential_ldp'],
          additionalHeaders: { Accept: 'application/json' },
          serviceConfiguration: {
            authorizationEndpoint: 'https://esignet.dev1.mosip.net/authorize',
            tokenEndpoint: HOST + '/residentmobileapp/get-token',
          },
        };
        const response = await authorize(config);
        console.log(
          'Response from invokeAuthorization',
          JSON.stringify(response, null, 4)
        );
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

interface issuerType {
  id: string;
  displayName: string;
  logoUrl: string;
}
