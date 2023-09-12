import { assign, ErrorPlatformEvent, EventFrom, send, StateFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { AppServices } from '../../shared/GlobalContext';
import { VC, VerifiableCredential } from '../../types/vc';
import {
  generateKeys,
  isCustomSecureKeystore,
  WalletBindingResponse,
} from '../../shared/cryptoutil/cryptoUtil';
import { log } from 'xstate/lib/actions';
import { StoreEvents } from '../../machines/store';
import {
  HOST,
  MY_VCS_STORE_KEY,
  VC_ITEM_STORE_KEY,
} from '../../shared/constants';
import { OpenId4VCIProtocol } from '../../shared/openId4VCI/Utils';
import { VcEvents } from '../../machines/vc';
import { request } from '../../shared/request';
import i18n from '../../i18n';
import { KeyPair } from 'react-native-rsa-native';
import {
  getBindingCertificateConstant,
  savePrivateKey,
} from '../../shared/keystore/SecureKeystore';
import { ActivityLogEvents } from '../../machines/activityLog';
import SecureKeystore from 'react-native-secure-keystore';
import { verifyCredential } from '../../shared/vcjs/verifyCredential';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
    vcKey: '' as string,
    generatedOn: null as Date,
    credential: null as VerifiableCredential,
    isPinned: false,
    hashedId: '',

    publicKey: '',
    privateKey: '',
    myVcs: [] as string[],
    otp: '',
    otpError: '',
    idError: '',
    transactionId: '',
    bindingTransactionId: '',
    walletBindingResponse: null as WalletBindingResponse,
    walletBindingError: '',
  },
  {
    events: {
      KEY_RECEIVED: (key: string) => ({ key }),
      KEY_ERROR: (error: Error) => ({ error }),
      STORE_READY: () => ({}),
      DISMISS: () => ({}),
      CREDENTIAL_DOWNLOADED: (vc: VC) => ({ vc }),
      STORE_RESPONSE: (response: VC) => ({ response }),
      POLL: () => ({}),
      DOWNLOAD_READY: () => ({}),
      GET_VC_RESPONSE: (vc: VC) => ({ vc }),
      VERIFY: () => ({}),
      LOCK_VC: () => ({}),
      INPUT_OTP: (otp: string) => ({ otp }),
      REFRESH: () => ({}),
      REVOKE_VC: () => ({}),
      ADD_WALLET_BINDING_ID: () => ({}),
      CANCEL: () => ({}),
      CONFIRM: () => ({}),
      STORE_ERROR: (error: Error) => ({ error }),
      PIN_CARD: () => ({}),
      KEBAB_POPUP: () => ({}),
      SHOW_ACTIVITY: () => ({}),
      REMOVE: (vcKey: string) => ({ vcKey }),
    },
  }
);

export const VCItemEvents = model.events;

export const VCItemMachine = model.createMachine(
  {
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./VCItemMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    on: {
      REFRESH: {
        target: '.checkingStore',
      },
    },
    description: 'VC',
    id: 'vc-item-openid4vci',
    initial: 'checkingVc',
    states: {
      checkingVc: {
        entry: ['requestVcContext'],
        description: 'Fetch the VC data from the Memory.',
        on: {
          GET_VC_RESPONSE: [
            {
              actions: ['setCredential'],
              cond: 'hasCredential',
              target: 'checkingVerificationStatus',
            },
            {
              target: 'checkingStore',
            },
          ],
        },
      },
      checkingStore: {
        entry: 'requestStoredContext',
        description: 'Check if VC data is in secured local storage.',
        on: {
          STORE_RESPONSE: {
            actions: ['setCredential', 'updateVc'],
            target: 'checkingVerificationStatus',
          },
        },
      },
      verifyingCredential: {
        invoke: {
          src: 'verifyCredential',
          onDone: [
            {
              actions: ['markVcValid', 'storeContext', 'updateVc'],
              target: 'idle',
            },
          ],
          onError: [
            {
              actions: log((_, event) => (event.data as Error).message),
              target: 'idle',
            },
          ],
        },
      },
      checkingVerificationStatus: {
        description:
          'Check if VC verification is still valid. VCs stored on the device must be re-checked once every [N] time has passed.',
        always: [
          {
            cond: 'isVcValid',
            target: 'idle',
          },
          {
            target: 'verifyingCredential',
          },
        ],
      },
      showBindingWarning: {
        on: {
          CONFIRM: {
            target: 'requestingBindingOtp',
          },
          CANCEL: {
            target: 'idle',
          },
        },
      },
      requestingBindingOtp: {
        invoke: {
          src: 'requestBindingOtp',
          onDone: [
            {
              target: 'acceptingBindingOtp',
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          ],
        },
      },
      showingWalletBindingError: {
        on: {
          CANCEL: {
            target: 'idle',
            actions: 'setWalletBindingErrorEmpty',
          },
        },
      },
      acceptingBindingOtp: {
        entry: ['clearOtp'],
        on: {
          INPUT_OTP: {
            target: 'addKeyPair',
            actions: ['setOtp'],
          },
          DISMISS: {
            target: 'idle',
            actions: ['clearOtp', 'clearTransactionId'],
          },
        },
      },
      addKeyPair: {
        invoke: {
          src: 'generateKeyPair',
          onDone: [
            {
              cond: 'isCustomSecureKeystore',
              target: 'addingWalletBindingId',
              actions: ['setPublicKey'],
            },
            {
              target: 'addingWalletBindingId',
              actions: ['setPublicKey', 'setPrivateKey'],
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          ],
        },
      },
      addingWalletBindingId: {
        invoke: {
          src: 'addWalletBindnigId',
          onDone: [
            {
              cond: 'isCustomSecureKeystore',
              target: 'idle',
              actions: [
                'setWalletBindingId',
                'setThumbprintForWalletBindingId',
                'storeContext',
                'updateVc',
                'setWalletBindingErrorEmpty',
                'logWalletBindingSuccess',
              ],
            },
            {
              target: 'updatingPrivateKey',
              actions: [
                'setWalletBindingId',
                'setThumbprintForWalletBindingId',
              ],
            },
          ],
          onError: [
            {
              actions: ['setWalletBindingError', 'logWalletBindingFailure'],
              target: 'showingWalletBindingError',
            },
          ],
        },
      },
      updatingPrivateKey: {
        invoke: {
          src: 'updatePrivateKey',
          onDone: {
            actions: [
              'storeContext',
              'updatePrivateKey',
              'updateVc',
              'setWalletBindingErrorEmpty',
              'logWalletBindingSuccess',
            ],
            target: 'idle',
          },
          onError: {
            actions: ['setWalletBindingError', 'logWalletBindingFailure'],
            target: 'showingWalletBindingError',
          },
        },
      },
      idle: {
        on: {
          VERIFY: {
            target: 'verifyingCredential',
          },
          DISMISS: {
            target: 'checkingVc',
          },
          KEBAB_POPUP: {
            target: 'kebabPopUp',
          },
          ADD_WALLET_BINDING_ID: {
            target: 'showBindingWarning',
          },
          PIN_CARD: {
            target: 'pinCard',
            actions: 'setPinCard',
          },
        },
      },
      pinCard: {
        entry: 'storeContext',
        on: {
          STORE_RESPONSE: {
            actions: ['sendVcUpdated', 'VcUpdated'],
            target: 'idle',
          },
        },
      },
      kebabPopUp: {
        on: {
          DISMISS: {
            target: 'idle',
          },
          ADD_WALLET_BINDING_ID: {
            target: '#vc-item-openid4vci.kebabPopUp.showBindingWarning',
          },
          PIN_CARD: {
            target: '#vc-item-openid4vci.pinCard',
            actions: 'setPinCard',
          },
          SHOW_ACTIVITY: {
            target: '#vc-item-openid4vci.kebabPopUp.showActivities',
          },
          REMOVE: {
            actions: 'setVcKey',
            target: '#vc-item-openid4vci.kebabPopUp.removeWallet',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          showBindingWarning: {
            on: {
              CONFIRM: {
                target: '#vc-item-openid4vci.kebabPopUp.requestingBindingOtp',
              },
              CANCEL: {
                target: '#vc-item-openid4vci.kebabPopUp',
              },
            },
          },
          requestingBindingOtp: {
            invoke: {
              src: 'requestBindingOtp',
              onDone: [
                {
                  target: '#vc-item-openid4vci.kebabPopUp.acceptingBindingOtp',
                  actions: [log('accceptingOTP')],
                },
              ],
              onError: [
                {
                  actions: 'setWalletBindingError',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          showingWalletBindingError: {
            on: {
              CANCEL: {
                target: '#vc-item-openid4vci.kebabPopUp',
                actions: 'setWalletBindingErrorEmpty',
              },
            },
          },
          acceptingBindingOtp: {
            entry: ['clearOtp'],
            on: {
              INPUT_OTP: {
                target: '#vc-item-openid4vci.kebabPopUp.addKeyPair',
                actions: ['setOtp'],
              },
              DISMISS: {
                target: '#vc-item-openid4vci.kebabPopUp',
                actions: ['clearOtp', 'clearTransactionId'],
              },
            },
          },
          addKeyPair: {
            invoke: {
              src: 'generateKeyPair',
              onDone: [
                {
                  cond: 'isCustomSecureKeystore',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.addingWalletBindingId',
                  actions: ['setPublicKey'],
                },
                {
                  target:
                    '#vc-item-openid4vci.kebabPopUp.addingWalletBindingId',
                  actions: ['setPublicKey', 'setPrivateKey'],
                },
              ],
              onError: [
                {
                  actions: 'setWalletBindingError',
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          addingWalletBindingId: {
            invoke: {
              src: 'addWalletBindnigId',
              onDone: [
                {
                  cond: 'isCustomSecureKeystore',
                  target: '#vc-item-openid4vci.kebabPopUp',
                  actions: [
                    'setWalletBindingId',
                    'setThumbprintForWalletBindingId',
                    'storeContext',
                    'updateVc',
                    'setWalletBindingErrorEmpty',
                    'logWalletBindingSuccess',
                  ],
                },
                {
                  target: '#vc-item-openid4vci.kebabPopUp.updatingPrivateKey',
                  actions: [
                    'setWalletBindingId',
                    'setThumbprintForWalletBindingId',
                  ],
                },
              ],
              onError: [
                {
                  actions: ['setWalletBindingError', 'logWalletBindingFailure'],
                  target:
                    '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
                },
              ],
            },
          },
          updatingPrivateKey: {
            invoke: {
              src: 'updatePrivateKey',
              onDone: {
                actions: [
                  'storeContext',
                  'updatePrivateKey',
                  'updateVc',
                  'setWalletBindingErrorEmpty',
                  'logWalletBindingSuccess',
                ],
                target: '#vc-item-openid4vci.kebabPopUp',
              },
              onError: {
                actions: 'setWalletBindingError',
                target:
                  '#vc-item-openid4vci.kebabPopUp.showingWalletBindingError',
              },
            },
          },
          showActivities: {
            on: {
              DISMISS: '#vc-item-openid4vci.kebabPopUp',
            },
          },
          removeWallet: {
            on: {
              CONFIRM: {
                target: 'removingVc',
              },
              CANCEL: {
                target: 'idle',
              },
            },
          },
          removingVc: {
            entry: 'removeVcItem',
            on: {
              STORE_RESPONSE: {
                actions: ['removedVc', 'logVCremoved'],
                target: '#vc-item-openid4vci',
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      requestVcContext: send(
        (context) => ({
          type: 'GET_VC_ITEM',
          vcKey: context.vcKey,
          protocol: OpenId4VCIProtocol,
        }),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),
      requestStoredContext: send(
        (context) => {
          return StoreEvents.GET(context.vcKey);
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),
      updateVc: send(
        (context) => {
          const { credential } = context;
          return { type: 'VC_DOWNLOADED_FROM_OPENID4VCI', credential };
        },
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),
      setCredential: model.assign({
        credential: (_, event) => {
          if (event.type === 'GET_VC_RESPONSE') {
            return event.vc;
          }
          return event.response.credential === undefined
            ? event?.response
            : event?.response.credential;
        },
      }),

      markVcValid: assign((context) => {
        return {
          ...context,
          isVerified: true,
          lastVerifiedOn: Date.now(),
        };
      }),
      storeContext: send(
        (context) => {
          const { serviceRefs, ...data } = context;
          data.credentialRegistry = HOST;
          return StoreEvents.SET(context.vcKey, data);
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),
      setPinCard: assign((context) => {
        return {
          ...context,
          isPinned: !context.isPinned,
        };
      }),
      VcUpdated: send(
        (context) => {
          const { serviceRefs, ...vc } = context;
          return { type: 'VC_UPDATE', vc };
        },
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),

      sendVcUpdated: send(
        (_context, event) =>
          VcEvents.VC_UPDATED(VC_ITEM_STORE_KEY(event.response) as string),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),
      setWalletBindingError: assign({
        walletBindingError: (context, event) =>
          i18n.t(`errors.genericError`, {
            ns: 'common',
          }),
      }),
      setWalletBindingErrorEmpty: assign({
        walletBindingError: () => '',
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

      updatePrivateKey: assign({
        privateKey: () => '',
      }),
      setWalletBindingId: assign({
        walletBindingResponse: (context, event) =>
          event.data as WalletBindingResponse,
      }),
      setThumbprintForWalletBindingId: send(
        (context) => {
          const { walletBindingResponse } = context;
          const walletBindingIdKey = getBindingCertificateConstant(
            walletBindingResponse.walletBindingId
          );
          return StoreEvents.SET(
            walletBindingIdKey,
            walletBindingResponse.thumbprint
          );
        },
        {
          to: (context) => context.serviceRefs.store,
        }
      ),

      removedVc: send(
        () => ({
          type: 'REFRESH_MY_VCS',
        }),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),

      logWalletBindingSuccess: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: context.vcKey,
            type: 'WALLET_BINDING_SUCCESSFULL',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: context.id,
          }),
        {
          to: (context) => context.serviceRefs.activityLog,
        }
      ),

      logWalletBindingFailure: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: context.vcKey,
            type: 'WALLET_BINDING_FAILURE',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: context.id,
          }),
        {
          to: (context) => context.serviceRefs.activityLog,
        }
      ),
      setOtp: model.assign({
        otp: (_, event) => event.otp,
      }),

      setOtpError: assign({
        otpError: (_context, event) =>
          (event as ErrorPlatformEvent).data.message,
      }),

      clearOtp: assign({ otp: '' }),
      removeVcItem: send(
        (_context, event) => {
          return StoreEvents.REMOVE(MY_VCS_STORE_KEY, _context.vcKey);
        },
        { to: (context) => context.serviceRefs.store }
      ),

      logVCremoved: send(
        (context) =>
          ActivityLogEvents.LOG_ACTIVITY({
            _vcKey: context.vcKey,
            type: 'VC_REMOVED',
            timestamp: Date.now(),
            deviceName: '',
            vcLabel: context.id,
          }),
        {
          to: (context) => context.serviceRefs.activityLog,
        }
      ),
    },

    services: {
      //todo mock has to be reverted to verify the credential properly.
      verifyCredential: async (context) => {
        return true;
        //return verifyCredential(context.credential);
      },
      updatePrivateKey: async (context) => {
        const hasSetPrivateKey: boolean = await savePrivateKey(
          context.walletBindingResponse.walletBindingId,
          context.privateKey
        );
        if (!hasSetPrivateKey) {
          throw new Error('Could not store private key in keystore.');
        }
        return '';
      },
      addWalletBindnigId: async (context) => {
        const response = await request(
          'POST',
          '/residentmobileapp/wallet-binding',
          {
            requestTime: String(new Date().toISOString()),
            request: {
              authFactorType: 'WLA',
              format: 'jwt',
              individualId: context.id,
              transactionId: context.transactionId,
              publicKey: context.publicKey,
              challengeList: [
                {
                  authFactorType: 'OTP',
                  challenge: context.otp,
                  format: 'alpha-numeric',
                },
              ],
            },
          }
        );
        const certificate = response.response.certificate;
        await savePrivateKey(
          getBindingCertificateConstant(context.id),
          certificate
        );

        const walletResponse: WalletBindingResponse = {
          walletBindingId: response.response.encryptedWalletBindingId,
          keyId: response.response.keyId,
          thumbprint: response.response.thumbprint,
          expireDateTime: response.response.expireDateTime,
        };
        return walletResponse;
      },
      generateKeyPair: async (context) => {
        if (!isCustomSecureKeystore()) {
          return await generateKeys();
        }
        const isBiometricsEnabled = SecureKeystore.hasBiometricsEnabled();
        return SecureKeystore.generateKeyPair(
          context.id,
          isBiometricsEnabled,
          0
        );
      },
      requestBindingOtp: async (context) => {
        const response = await request(
          'POST',
          '/residentmobileapp/binding-otp',
          {
            requestTime: String(new Date().toISOString()),
            request: {
              individualId: context.id,
              otpChannels: ['EMAIL', 'PHONE'],
            },
          }
        );
        if (response.response == null) {
          throw new Error('Could not process request');
        }
      },
      requestOtp: async (context) => {
        try {
          return request('POST', '/residentmobileapp/req/otp', {
            individualId: context.id,
            individualIdType: context.idType,
            otpChannel: ['EMAIL', 'PHONE'],
            transactionID: context.transactionId,
          });
        } catch (error) {
          console.error(error);
        }
      },
    },

    guards: {
      hasCredential: (_, event) => {
        const vc = event.type === 'GET_VC_RESPONSE' ? event.vc : event.response;
        return vc != null;
      },

      isVcValid: (context) => {
        return context.isVerified;
      },
      isCustomSecureKeystore: () => isCustomSecureKeystore(),
    },
  }
);

export const createVCItemMachine = (
  serviceRefs: AppServices,
  vcKey: string
) => {
  return VCItemMachine.withContext({
    ...VCItemMachine.context,
    serviceRefs,
    vcKey,
  });
};

type State = StateFrom<typeof VCItemMachine>;

export function selectCredentials(state: State) {
  return state.context.credential;
}

export function selectContext(state: State) {
  return state.context;
}

export function selectGeneratedOn(state: State) {
  return new Date(state.context.generatedOn).toLocaleDateString();
}
