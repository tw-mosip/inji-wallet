import {EventFrom, send, sendParent} from 'xstate';
import {IssuersModel} from './IssuersModel';
import {IssuersActions} from './IssuersActions';
import {IssuersService} from './IssuersService';
import {IssuersGuards} from './IssuersGuards';
import {CredentialTypes} from '../VerifiableCredential/VCMetaMachine/vc';

const model = IssuersModel;

export const IssuerScreenTabEvents = model.events;
export const Issuer_Tab_Ref_Id = 'issuersMachine';

export const IssuersMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEtawK5gE6wLIEMBjAC2QDswA6CVABwBt8BPASTUxwGIIB7Cy8gDceAayqoM2PEVL8asBszaScCIT0L4ALsj4BtAAwBdQ0cShaPWMh19zIAB6IALAEYAnJWfuAzM4BsAKwAHN7BwQDsfgA0IEyIAEw+Ea6UBgkRwT7uEekGrhHOAL5FsRIc0iTkVPKKrOxSnNhYPFiUiloAZq0AtgINOARVcnSM9SqwamTCmrZkpqb2ltZz9k4Izgme3n5Boe7hUc6x8QgJ3gZpgT6BgRH+yYWBJWUDlbJUza2cACoASgBNAD6AEEAOIglgAOUWSBAyxsujIaxcWy8vgCITCkRicUSIQSlGyCQMETu7n84QKLxA5SkQw+lC+WF+gNBEOhelcZjhCNWcPWrgSJ0QQppdMGMmqTKwLRZ-2B4MhMISPIsVkRdgFooMvjS-jc9wezl1ARFZwiCUClFcN3czmcKWuPnFbwZ0uZnD+AFEAMren5A71-P4AeT+sPVKyRKIQrgMwX8lASCWCgVcgW8lt15oyEU8CSCloz6WcN38rom7v4sDA9DAhB0ZCgyg4nAAIqGAOpQgAyoZB7aBLHbkfhGv5oHWPgMBmclEigQM-lTVpyc9z+R8yfzriyPhTS4zlYq1aotfrjfILYGnH9ve9AGEft6hyxfb6AKrBsd8mPahBAmFPEEB8VwhS8XVkgKA5dXcE96SlGs6wbJsbxUO9HxBKEgUfH1229KEfhYEFeyBUMADEKODIEAEU-lw0MCN-Cd-1AU4EnA7d-AKRNkgNc4fFidZOP8S5gncQIKXcOchVcYpSlpN0kPPTQyEfLBIDAMgdHwehQ06TpsForBHx4CAwE4ejGIIoFfSwqEoVfFjoy1KdEBuec7WSQJzQdRM0gpUIUzEpJnkUiV3mlIytBIDStJ05A9IMoysFbbBuD4cRplEcRlOGKgYrizSLMS5LDOwdKsCmGZtCRBZjCWVi3McRAlwiNIAkXPyV1SMkZ3cEL0huBDJQKygiuIeLSt0-SKrS29mXaRgul6foqxUiawFiqaSu02aUsqgYao0Or9GMFzNWRAD2s6ykyT8sl5xNDEhrC0aorkHgAHcyHoHh8AgKquzregRDIH6yEy-h1DEdbT023hfv+wHgdB8HIZO2Z6ouxreWa673I2CDMiFXyQOcNNPAOQp-EtUKRoi-LGSRv6AaBgYQfoMGId+ppZVaZbtG6LA+kis9qEhlGOZULmecx9RsfOkw8ajK7YzcQlSatPz3EGygDWg+nhvC14NvG1npem-akvoH4mFoOBoey4Q4fFxGpfZ62yrth24Cxs75lxtVx1cwnWsAvcF28h6QPTK1kz1iljfepnzZZz3Ae92b7cd2BnYEHK3eZ6VLa9vafdz-3FcDhZuSasPY3TYJo6knzzSAmcF0yXU3sZs2EYtzOIGz22q-zpaOhFsWS6+5Hy4SnO-cmGu5gakO-xa9Zm9b3xY9OICZKJHvBsLE2Polsus4rpe89ZRUORhVXQ-Vm6o6yNv97azZtwMPw-D7qbJS6dpQXlQteUeekq6cAco+b0vZLqTgjgeTww0yxf0jgnLYes6Zn1TgPRC40wFXmbJA32js7zwKfC+IceFXyEWIqRIEPwAQAAVvSILYsgtEaD25xz3B1fMOCU792AYPRkMAtAgnQFoYgFF-rfWgbwGGRc8ogP4JI6Rsj5E-SrgHNewcG6vyJj4HwSZghznuuTA+WwkzJAsafBmQD3bjU0TIuRCilFZULq7NR4jpRuO0Z4v2+icYmHrvjRuAFTHmMsd1OOJpUiSV6iI5xs8qCBI8bov2-M5RC1WqLeGhCJHbS0VkxRITV5hM4VvDyZiFxxIwZmHiXhAgpLwaIlxjJJplNaMgAAXoHb0ZAICWHIFoAusM-HFOittEgvSsADKGSMsZOlQnKxqeHbes4Db5DaTrECABaNcF9No9PcX0wZcxhmjJ4OM3Jgsp5rS6bMnaCylnXJWXctZVSNnP03lstqOyxIZhXNYxAhyZwRFOeNc5sjLnLNueMmUcp77smVJs+wpw-CbEoFJSkmwOlmgjnuTw7Vghkxhd0uZxB3lXKRDc1ZWgUXfB9P6QMwYwwRn+QTWMpK8WkgpQc7F2R5z4uCkSisad-H8BIA2EQLAdLYAoBM5RLtcqUDlYQBVSqsAqsxQBDMQFKCWikrqTM2QhT+HNPGDwRIyy3HCGuNMwQqXSi1TqrQyrtqTNUZq4g8rFVer1dtLkG9eUAWCGiIU7hwLLjtKFG1tpLhbFJP4XwGQeJljdbKgN2qg3eomZPFa09-WBt1fqnlUSiZCoNnxYsYlO7BHNLGluzg2neCkrkW0GQc1UEdlgaedLA6+t8UUsajIB1DouYs+lfB1lBxVuG6tEcgJJlcOm2NGRO6pncOaMF6IN0rkdEee0fb2jYGnfC2dI7i3C2eeki9g7ejDrmAu9eRikHbw3TaTdQoyRJF3eaClNpIhbBuKmmSERoXSpmfwKdL6Z0fKRA8toTzCkvPg5exD17kPzt+YusNn6uHb3qRuvW-6d0SRtckecFiZzpkKOBGDBCJ3SgQ6LV9KG70FJnuo-t2HONIbnWQd9F1VTEdqaBPUNxQXCohZTMl56xBMAIGQfAMAej7UoLWLQvoUKNkgAAaTAEwUdGrMNUBU2pjTYAtM6R09tfTl4vUQBM0wMTS7JOAtAl3fMVi-JJDFUFQlTjlOmZs5p7TunnOoWM6Z1D+TS2WcoNZ-A6mosOZiwZ1z7nPMGpMX5oKGCywmhtIUZOHS0n8dSxF9Ltn7PMske51h+BkBYAoi0Ho7nYBaFaJZNVPiLOPrSxluz2nmumda+1zrPBuumd6-1-LVbjHILAia+Me9wUbD8JcAo3hcFhdg2x-go2GsTe2i1trHWus9b65pRL6G+Myqs3VsbjXKCTaYNNm7c27tLYIx+yJq3pzrZSFBErc5rTitC2gqVrHPqvdU-VzLTXLtTeu7N+bTBFsPZ48lkbb3zsOa+z9rH-3NL5YiWrL9dS+qbb4divWHUYd9wCOF5H72LtaCuzN27C37uWXxw+mrZ3UeffR99zH-OceC-yxJ4HtPfP04h9t7IOQ8UhbZ-DsRcGkeRfGw59AtZTLpcIKDSAAAhXQWmtCLMIGipUnIVtK4PNaOmxW1f2jJVryVHODcfeN9gR8ZuLcQGt3N7a9uvR+gDEGEM4YCvcPd-5+JTP8ia4Jdr-3KPDdo4oFgbQYBecskG1M8diPauc+J-n7AReS-LeXSDlwsbkxe+8JniVDN2fHcr1fEeN9bb5zL36lL-eyErxykrQjLuSMuDuPqS0FILUUjAttziAUbgJj-j4LIhQFII8vsPCfj2S0i5e5Lee19F5D8b95jWC-lxL6CGWVfGZcwZBbpSDNGZNhUnPePoPnpBPALGhmfhho+oATfsAVTk3krvGJTESAULYivg8LmLGn1INB4I6BmKYgAcfkAfQCAXkk9hXkflfgPtAUQfLnAXPnGHOC3GBM-qgUJCBANF-pYvaE6Hgb3uQWzNfjNEPjAthHAggrPlJg6B1E-iga-g8O-iBAItuH4FkB4LvtBvJPgRQRPpQEHqbmQObtzFbjblHsgA7gqOis7rQS1BxOmJcDcGmGBHOPcM2sngbKnmSJofwZQYIcAToSbiHvoWHhHrbtHmynHpyonuIT5m7m4Z7rmAEISPYdcAgc4eeoINgMgJ0EwBAoQeZsXDVukYslkTkVQXfornQXGp4FGrcJaJsLgWmJuAFBuvvlkOcEcC6LwZtIUZkdkaQrkcLhAQURkcUX0aUYDoYuUVJpUQuFaHcOcJxNcA0SBCmAYNaPmOmOmnxCSAeGkcMb0VAGQqfveoMRft0SMQcYQbAffoatsUgVkOuAaP4JSJuLvr+i0QeI6P-OesQOlhAPWAAGqPj-HDGmGBwURtb0DoAPZhGBj-HBgsAUTAgRHcpWHRFzj6jyaARSTzjgTnCHbnydFEL3bXh5HTInbnjEnNhlE04VGWiEhBAFDpryR7gfy5gzjbjyRRoWKpjxiRDnrIB-GWSPihi4CsIPg0JJ6CgHqbB-xbCphRACIf5lYGhcnpAUoJgsa67kkCCCnCFQiiGSmijSnbFyk4iKnLG2ipA3BSSph-xtI7E0gQwWTwBwiWbXFEyHIUjmiHJ3BJhJwHAOGfEpAAGjBKBvDukRyWi5htIdQmgpj5jQYUjxg64pbMgRnrAOILg5Ccl0yOi+Dr49yBRZ5+6EmMjEJoRVTpmii7hEhUhtKZhyTHAWm2gGy8QPD3CbDZqlmgJqRkKHRYAmRmQWRVkIAGDmi0aXC6jFnd4pmPqTR9nzSVmTE+ZjlsGxqoK+4zmeHSxozcwYy-QjmrmnBuAHhFld4EmH4exaGEHjyHl+R+DWhTnnn4JamV7lklE+HkJgB3kUyOpnmw4vkpaZI6IVKOw-nHnpqEis5VbnpwrEAIqfJIo6QjmHKUzekOipDeBJznCazBSwU0pcZ8CMrfLMoCn1jgV1IJj-nZ7dn8BwUIUMpfLIppnLmxhHkeQOhQWblw7noeoFohpaAjkdl1rtmiSrFJAuGnD9SBSZj5D748S3DnocY9CEXhwAoazASnC2h+BeBRqbH5Czh0yakpZi554oVoVsFLgtz4rtS2hkgbodGXnjSmUfbZYubxanA0lSbsWgT4rUUllOWMguXc4l7k4C79YUWgTQYs7cVBazmi5E7i66EBEGH1jh7GF26mGRXZBST+Vbm0X6654fYwAF714Y7taRUvTbjQX5WBWlwEFUEuleU+aoWSWJBP51qSROryQpCOWvl8FWyEGwA6nkWsUAQ+VJBkgLghDJFOGUjbkLyfnDXJWh6GHpWR6ZWECRVWjxhEgzWOGOjzUFWUBnH7FkIjnf5t4hAPEBDPEWmUgiX3A8kPAxLfG-EAlAkgnT7gnICQmaTmVtUbCRDzhPkAWdKPq47XgjmWlJiGiirMnhA3A2p6zbhckyRgTeBbChD8mCnQ1r5pDQari5BSTckf46W3WJgpjKHBnHVqrQ01m74Ur1mazyQf4-pbCOi6j7bpjtolAlBAA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: Issuer_Tab_Ref_Id,
    context: model.initialContext,
    initial: 'displayIssuers',
    tsTypes: {} as import('./IssuersMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    states: {
      displayIssuers: {
        description: 'displays the issuers downloaded from the server',
        invoke: {
          src: 'downloadIssuersList',
          onDone: {
            actions: [
              'sendImpressionEvent',
              'setIssuers',
              'resetLoadingReason',
            ],
            target: 'selectingIssuer',
          },
          onError: {
            //loadingReason is not reset here so that we go to previous(Home) screen on back button press of error screen
            actions: ['setError'],
            target: 'error',
          },
        },
      },
      error: {
        description: 'reaches here when any error happens',
        on: {
          TRY_AGAIN: [
            {
              description: 'not fetched issuers yet',
              cond: 'shouldFetchIssuersAgain',
              actions: ['setLoadingReasonAsDisplayIssuers', 'resetError'],
              target: 'displayIssuers',
            },
            {
              description:
                'error is OIDC_CONFIG_ERROR_PREFIX or REQUEST_TIMEDOUT',
              cond: 'canSelectIssuerAgain',
              actions: 'resetError',
              target: 'selectingIssuer',
            },
            {
              description:
                'issuers config is available and downloading credentials is retriable',
              actions: ['setLoadingReasonAsSettingUp', 'resetError'],
              target: 'downloadIssuerWellknown',
            },
          ],
          RESET_ERROR: {
            actions: 'resetError',
            target: 'selectingIssuer',
          },
        },
      },
      selectingIssuer: {
        description: 'waits for the user to select any issuer',
        on: {
          DOWNLOAD_ID: {
            actions: sendParent('DOWNLOAD_ID'),
          },
          SELECTED_ISSUER: {
            actions: [
              'setSelectedIssuerId',
              'setLoadingReasonAsSettingUp',
              'setSelectedIssuers',
            ],
            target: 'downloadIssuerWellknown',
          },
          SCAN_CREDENTIAL_OFFER_QR_CODE: {
            target: 'scanCredentialOfferQrCode',
          },
        },
      },
      scanCredentialOfferQrCode: {
        description: 'waits for the user to scan Qr Code',
        on: {
          QR_CODE_SCANNED: [
            {
              actions: [model.assign({
                qrData: (_, event) => event.data, 
              }),"setLoadingReasonAsSettingUp"],
              target: 'fetchCredentialOfferIssuer',
            },
          ],
        },
      },

      fetchCredentialOfferIssuer: {
        description:
          'sends qr data to VCI library to get the credential offer issuer',
        invoke: {
          src: 'fetchCredentialOfferIssuer',
          onDone: {
            actions: ["setLoadingReasonAsSettingUp","setCredentialOfferIssuer"],
            target: 'downloadIssuerWellknown',
          },
          onError: {
            actions: 'setError',
            target: 'selectingIssuer',
          },
        },
      },
      downloadIssuerWellknown: {
        description: 'fetches the wellknown of the selected issuer',
        invoke: {
          src: 'downloadIssuerWellknown',
          onDone: {
            actions: [
              'updateIssuerFromWellknown',
              'updateSelectedIssuerWellknownResponse',
            ],
            target: 'downloadCredentialTypes',
          },
          onError: {
            actions: ['setNetworkOrTechnicalError', 'resetLoadingReason'],
            target: 'error',
          },
        },
      },
      downloadCredentialTypes: {
        description:
          'downloads the credentials supported from the selected issuer',
        on: {
          TRY_AGAIN: {
            actions: ['downloadIssuerWellknown'],
            target: 'idle',
          },
        },
        invoke: {
          src: 'downloadCredentialTypes',
          onDone: [
            { 
              actions: 'setSupportedCredentialTypes',
              target: 'fetchAuthorizationEndpoint',
            },
            {
              target: 'checkInternet',
            },
          ],
          onError: {
            actions: [
              'setCredentialTypeListDownloadFailureError',
              'resetLoadingReason',
            ],
            target: 'error',
          },
        },
      },
      selectingCredentialType: {
        on: {
          CANCEL: {
            target: 'displayIssuers',
          },
          SELECTED_CREDENTIAL_TYPE: [
            {
              actions: 'setSelectedCredentialType',
              target: 'performAuthorization',
            },
          ],
        },
      },
      getAuthFlowType: {
        invoke: {
          src: 'getAuthFlowType',
          onDone: [
            {
              cond: 'isPreAuthFlow',
              actions: 'setPreAuthFlowCredentialType',
              target: 'keyManagement',
            },
            {
              target: 'selectingCredentialType',
            },
          ],
          onError: {
            actions: ['setError', 'resetLoadingReason'],
            target: 'error',
          },
        },
      },
      fetchAuthorizationEndpoint: {
        invoke: {
          src: 'fetchAuthorizationEndpoint',
          onDone: [
            {
              actions: 'updateAuthorizationEndpoint',
              target: 'getAuthFlowType',
            },
          ],
          onError: {
            actions: ['setError', 'resetLoadingReason'],
            target: '.error',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          error: {
            on: {
              TRY_AGAIN: [
                {
                  description:
                    'issuer and credential type is selected by the user',
                  actions: ['setLoadingReasonAsSettingUp', 'resetError'],
                  target: '#issuersMachine.fetchAuthorizationEndpoint',
                },
              ],
              RESET_ERROR: [
                {
                  description:
                    'issuer and credential type is selected by the user',
                  actions: ['setLoadingReasonAsSettingUp', 'resetError'],
                  target: '#issuersMachine.selectingCredentialType',
                },
              ],
            },
          },
        },
      },
      checkInternet: {
        description: 'checks internet before opening the web view',
        invoke: {
          src: 'checkInternet',
          id: 'checkInternet',
          onDone: [
            {
              cond: 'isInternetConnected',
              target: 'performAuthorization',
            },
            {
              actions: ['setNoInternet', 'resetLoadingReason'],
              target: 'error',
            },
          ],
          onError: {
            actions: () =>
              console.error('Error Occurred while checking Internet'),
            target: 'error',
          },
        },
      },
      performAuthorization: {
        invoke: {
          src: 'invokeAuthorization',
          onDone: {
            actions: ['setTokenResponse', 'setLoadingReasonAsSettingUp'],
            target: 'keyManagement',
          },
          onError: [
            {
              cond: 'isOIDCflowCancelled',
              actions: ['handleOIDCFlowCancelled'],
              target: 'selectingIssuer',
            },
            {
              cond: 'isOIDCConfigError',
              actions: ['setOIDCConfigError'],
              target: 'error',
            },
            {
              target: 'error',
            },
          ],
        },
      },
      keyManagement: {
        initial: 'setSelectedKey',
        states: {
          setSelectedKey: {
            invoke: {
              src: 'getKeyOrderList',
              onDone: {
                actions: ['setSelectedKey'],
                target: 'getKeyPairFromKeystore',
              },
              onError: {
                actions: [
                  'resetSelectedCredentialType',
                  'setError',
                  'resetLoadingReason',
                  'sendDownloadingFailedToVcMeta',
                  (_, event) =>
                    console.error(
                      'Error Occurred while getting key order - ',
                      event.data,
                    ),
                ],
                target: '#issuersMachine.selectingIssuer',
              },
            },
          },
          getKeyPairFromKeystore: {
            invoke: {
              src: 'getKeyPair',
              onDone: {
                actions: ['loadKeyPair'],
                target: '#issuersMachine.downloadCredentials',
              },
              onError: [
                {
                  cond: 'hasUserCancelledBiometric',
                  target: 'userCancelledBiometric',
                },
                {
                  cond: 'isKeyTypeNotFound',
                  actions: [
                    'resetSelectedCredentialType',
                    'setError',
                    'resetLoadingReason',
                    'sendDownloadingFailedToVcMeta',
                    (_, event) =>
                      console.error(
                        'Error Occurred while getting keypair from keystore - ',
                        event.data,
                      ),
                  ],
                  target: '#issuersMachine.selectingIssuer',
                },
                {
                  target: 'generateKeyPair',
                },
              ],
            },
          },
          userCancelledBiometric: {
            on: {
              TRY_AGAIN: {
                target: 'getKeyPairFromKeystore',
              },
              RESET_ERROR: {
                actions: 'resetLoadingReason',
                target: '#issuersMachine.selectingIssuer',
              },
            },
          },
          generateKeyPair: {
            description:
              'if keypair is not generated, new one is created and stored',
            invoke: {
              src: 'generateKeyPair',
              onDone: [
                {
                  actions: [
                    'setPublicKey',
                    'setPrivateKey',
                    'setLoadingReasonAsDownloadingCredentials',
                    'storeKeyPair',
                  ],
                  target: '#issuersMachine.downloadCredentials',
                },
              ],
            },
          },
        },
      },
      downloadCredentials: {
        description: 'credential is downloaded from the selected issuer',
        entry: ['setLoadingReasonAsDownloadingCredentials'],
        invoke: {
          src: 'downloadCredential',
          onDone: {
            actions: ['setVerifiableCredential', 'setCredentialWrapper'],
            target: 'verifyingCredential',
          },
          onError: [
            {
              cond: 'hasUserCancelledBiometric',
              target: '.userCancelledBiometric',
            },
            {
              cond: 'isGenericError',
              target: 'selectingIssuer',
              actions: [
                'resetSelectedCredentialType',
                'setError',
                'resetLoadingReason',
                'sendDownloadingFailedToVcMeta',
              ],
            },
            {
              actions: ['setError', 'resetLoadingReason'],
              target: 'error',
            },
          ],
        },
        on: {
          CANCEL: {
            target: 'selectingIssuer',
            actions: 'resetSelectedCredentialType',
          },
        },
        initial: 'idle',
        states: {
          idle: {},
          userCancelledBiometric: {
            on: {
              TRY_AGAIN: [
                {
                  actions: ['setLoadingReasonAsDownloadingCredentials'],
                  target: '#issuersMachine.downloadCredentials',
                },
              ],
              RESET_ERROR: {
                actions: 'resetLoadingReason',
                target: '#issuersMachine.selectingIssuer',
              },
            },
          },
        },
      },
      verifyingCredential: {
        description:
          'once the credential is downloaded, it is verified before saving',
        invoke: {
          src: 'verifyCredential',
          onDone: [
            {
              actions: ['sendSuccessEndEvent', 'setVerificationResult'],
              target: 'storing',
            },
          ],
          onError: [
            {
              cond: 'isVerificationPendingBecauseOfNetworkIssue',
              actions: ['resetLoadingReason', 'resetVerificationResult'],
              target: 'storing',
            },
            {
              actions: [
                'resetLoadingReason',
                'sendErrorEndEvent',
                'updateVerificationErrorMessage',
              ],
              target: 'handleVCVerificationFailure',
            },
          ],
        },
      },

      handleVCVerificationFailure: {
        on: {
          RESET_VERIFY_ERROR: {
            actions: ['resetVerificationErrorMessage'],
          },
        },
      },

      storing: {
        description: 'all the verified credential is stored.',
        entry: [
          'setVCMetadata',
          'setMetadataInCredentialData',
          'storeVerifiableCredentialMeta',
          'storeVerifiableCredentialData',
          'storeVcsContext',
          'storeVcMetaContext',
          'logDownloaded',
        ],
        invoke: {
          src: 'isUserSignedAlready',
          onDone: {
            cond: 'isSignedIn',
            actions: ['sendBackupEvent'],
          },
        },
      },
      idle: {
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
        type: 'final',
      },
    },
  },
  {
    actions: IssuersActions(model),
    services: IssuersService(),
    guards: IssuersGuards(),
  },
);

export interface logoType {
  url: string;
  alt_text: string;
}

export interface displayType {
  name: string;
  locale: string;
  language: string;
  logo: logoType;
  background_color: string;
  background_image: string;
  text_color: string;
  title: string;
  description: string;
}

export interface issuerType {
  issuer_id: string;
  credential_issuer: string;
  protocol: string;
  client_id: string;
  '.well-known': string;
  redirect_uri: string;
  token_endpoint: string;
  proxy_token_endpoint: string;
  credential_endpoint: string;
  credential_audience: string;
  credential_configurations_supported: object;
  display: [displayType];
  credentialTypes: [CredentialTypes];
  authorizationEndpoint: string;
  grants: object;
  credential_issuer_host: string;
}
