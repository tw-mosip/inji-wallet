import {
  ActorRefFrom,
  DoneInvokeEvent,
  EventFrom,
  send,
  sendParent,
  StateFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';
import { StoreEvents, StoreResponseEvent } from '../../machines/store';
import { VcEvents } from '../../machines/vc';
import { vcItemMachine } from '../../machines/vcItem';
import { AppServices } from '../../shared/GlobalContext';
import {
  MY_VCS_STORE_KEY,
  ONBOARDING_STATUS_STORE_KEY,
} from '../../shared/constants';
import { AddVcModalMachine } from './MyVcs/AddVcModalMachine';
import { GetVcModalMachine } from './MyVcs/GetVcModalMachine';
import Storage from '../../shared/storage';

const model = createModel(
  {
    serviceRefs: {} as AppServices,
  },
  {
    events: {
      REFRESH: () => ({}),
      VIEW_VC: (vcItemActor: ActorRefFrom<typeof vcItemMachine>) => ({
        vcItemActor,
      }),
      DISMISS: () => ({}),
      STORE_RESPONSE: (response?: unknown) => ({ response }),
      STORE_ERROR: (error: Error) => ({ error }),
      ADD_VC: () => ({}),
      GET_VC: () => ({}),
      STORAGE_AVAILABLE: () => ({}),
      STORAGE_UNAVAILABLE: () => ({}),
      ONBOARDING_DONE: () => ({}),
      IS_TAMPERED: () => ({}),
    },
  }
);

export const MyVcsTabEvents = model.events;

type ViewVcEvent = EventFrom<typeof model, 'VIEW_VC'>;

export const MyVcsTabMachine = model.createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCeA1AxrAKgQwCMA6TACzEwGsBLAOygHlaCB7PAJwjqgGUAXPHwCusAMQ8cDAEoBRAPqyeABQYA5HjIDaABgC6iUAAcWsan2otaBkAA9EANgBMAGhCpEAFidEA7AE5tbQBGewAOJwBmUL97AF9Y1zQsXEIScipuJlYOLnp+QRFxSVkFGWU1DU0g-SQQY1NzS2s7BAjAoiCPUI9HAFZ7CPttHzCfV3cEINDHIl6PQO0IuZ6pmPjEjGx8Yktszm5RABkASQk5U54AVRkpHh0aoxMzCytalsdFohjtPx8++x62ic9nGDn8Xz8ESCUS69h8vQR6xASS2qV2bH29FEAEEACK4uToADC92s9WeTTeiA+ES+Q1+-0BwNBCACtJG9l6fl6-kGfg8ESRKJSO2YGNyUFEagAQgxsVJccdVABxOS4tRaPRkp6NV6gFpBSF0n5-fpMxwgtyIXqhWlzQKOPyhBFDIKOIWbEVEAA21FgfGOsFgQjA7DEEEsYCIdAAbixKFG-cHQ7BkHgyHQwKTauTdc1qUsiB4-CWfCEglNHKFQmMrZNi70IVCfD5htoee6EsjPdsfX6A0GQ2HRIqeMgLtnHg0XvmEI5C8XS+XK9XaxMgnNacWoc7DdE-NCPcle3gIBAsGkKJR+Cx2HgYKII7RE7Q4wmiMKT2eL2Qrze7zACCxiwmCCC89yTnUOozlSCBlj4vihNC86GrCIwsk6Mw+AK0LTFWcL2EER6osQp7npgl5UP+95gI+kbRq+8ZRp+qRkT+6TXnwt40UBjGgbqEHVNq06UvqiCdAMRCEWWvxwhEAT9Cy4QzNuG5AhEAojMRXpsRR-rcTAhzUAAtmYUhgOm5AQCOpzjjwdxajm0GibY4leLS0mGiMPjye2loTE6QREI4OGOo6MQ+X42m9tQEDerReIEsSkG5jBYlwS4dYhNWRaQp0FqOpyTrRaksXxaI6DHDIADqhIko5U4UnqrmTNoXSzPObRltlhGhCyG7eK2JYOm69gxIKXYscQZW0cqMg4HVKXOc1BptaEHURF1FZhL1-Wth4swChafxDDaRGTT2pVxbRJxnBc1y3EtIkrQWjaLr8y7TKu-UeB4b15Q64QRH0HgldN12iKccg4NiyBKDcMi4k9TWztC4IrAeVa9Butp9Vl-S0to4RIW1nIaTWYNEDG1BgAA7twWA2WOE4NVBz2zphwU8q2EQjL0izTP12MzB8mEaVWv2-JTZEM5gdHPgxb5Rti36YMgLAQHg3rI3msG-P1kIIapnTA66E0bMerFnrLTN2Q5DxsyjsEnbMTi-b0bSbYEfgso4IS0iFwMSR8Zbm92lukdb9AXvp7AHBI0jyIoKjqJqDupS5LRQkF9I7vYnJjTWa7UuFRDBPn8kAvzkLS1HUAx1xcdYgnJQ3FI0g62lLXZ1JPx5wXTotr7fvsgKizYTjAq1xKMd4NT9AAGJ4NQ8XWaOdud5niAu-0IV-Z7bQ-MP0K+GP1Yj-ncQXRHRAy9HFG6TwQiYJgcCwAAZkI3q2yz6fLbOO83b70WIfH2dZ5x+ybEENqLZhjzkpjAPg5h77yxfErIgyowB8CwOrTW2tWYZxeggGs9hcp+wtKEImcx-LUmLAhP2MQwjBA9toEKCCsHIPrnLdev9hJO3StA9qvROrDG2uEKY-VOQHTalCAIHgRibSnkiWgGs4DWCmnw3W6UAC0NCEA8l8AEYI84jr8g0pTX8GR6BZHFNwfIwh4BOXZrBHoP1GyOkCDjGsws+iU3RDkbgmiu4tB5BhIICFerZXgtMEIlNfT+kDMmMMQSt4IDGj9dswUcJdGgT4JC8i4n9kSUOWADEzApKIRWYukwPZ+FPlCBEiwPaumnlgCps4ogIWiECBEe95F-SUv0XKDTuQBGgRTa+JFb6q0opxAyYB2kuMLN0zkwjfr9N6BhAUUD+bQL8I4MsvRWl6UbjRIypk+DmUspARZAiGHGkhHIqE8lqmBXqW6fZJY4QeHOhbKZM1bktX2doXw3N+gIh5MEIIkiDzDPyk4GIXJQiU2pnTWWgKDThIQiWEO0QlhLE2fjC0wVITzmwvOYI1Zp7oqcfwlqxZ+qUJmCWYGrClgAmdKDSZOk64XlpsvThC9bwxkwAAaTABMRqWigXVMNPyJsoiC70mpffIgsdAm0ulZizKExHAfAOiy9szp+bySityr8M89Jz24EvFeNzNXBM8EaTo3Q2qyRAdUv2Xhhmk26MIqhKquFqutYvZeq9ozXQxdaH5HQujzDoUMTanrOoKoOU6AEHJA0Xkfs-V+QZP7eijfoissbXUJo9b7YGKkAbyNbH8MOU0iCIM4W0h1qSKwIiLMIp0yk-ZAllYRdkpLoiGg7OwpBssiD8ueIvYVYqJVFrdJ8P6jpqxOD7XCPa7VHTA33iDH5yL4ixCAA */
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./MyVcsTabMachine.typegen').Typegen0,
    schema: {
      context: model.initialContext,
      events: {} as EventFrom<typeof model>,
    },
    id: 'MyVcsTab',
    initial: 'checkingOnboardingStatus',
    states: {
      checkingOnboardingStatus: {
        entry: ['getOnboardingStatus'],
        on: {
          STORE_RESPONSE: [
            { cond: 'isOnboardingDone', target: 'idle' },
            { target: 'onboarding' },
          ],
        },
      },
      onboarding: {
        on: {
          ADD_VC: [
            {
              target: 'addVc',
              actions: ['completeOnboarding'],
            },
          ],
          ONBOARDING_DONE: {
            target: 'idle',
            actions: ['completeOnboarding'],
          },
        },
      },
      addVc: {
        initial: 'checkStorage',
        states: {
          checkStorage: {
            invoke: {
              src: 'checkStorageAvailability',
              onDone: [
                {
                  cond: 'isMinimumStorageLimitReached',
                  target: 'storageLimitReached',
                },
                {
                  target: '#MyVcsTab.addingVc',
                },
              ],
            },
          },
          storageLimitReached: {
            on: {
              DISMISS: '#idle',
            },
          },
        },
      },
      idle: {
        id: 'idle',
        on: {
          ADD_VC: 'addVc',
          VIEW_VC: 'viewingVc',
          GET_VC: 'gettingVc',
          IS_TAMPERED: {
            target: 'idle',
            actions: ['resetIsTampered', 'refreshMyVc'],
          },
        },
      },
      viewingVc: {
        entry: ['viewVcFromParent'],
        on: {
          DISMISS: 'idle',
        },
      },
      addingVc: {
        invoke: {
          id: 'AddVcModal',
          src: AddVcModalMachine,
          onDone: '.storing',
        },
        on: {
          DISMISS: 'idle',
        },
        initial: 'waitingForvcKey',
        states: {
          waitingForvcKey: {},
          storing: {
            entry: ['storeVcItem'],
            on: {
              STORE_RESPONSE: {
                target: 'addVcSuccessful',
                actions: ['sendVcAdded'],
              },
              STORE_ERROR: {
                target: '#MyVcsTab.addingVc.savingFailed',
              },
            },
          },
          savingFailed: {
            initial: 'idle',
            states: {
              idle: {},
            },
            on: {
              DISMISS: '#idle',
            },
          },
          addVcSuccessful: {
            on: {
              DISMISS: '#idle',
            },
          },
        },
      },
      gettingVc: {
        invoke: {
          id: 'GetVcModal',
          src: GetVcModalMachine,
          onDone: 'addingVc',
        },
        on: {
          DISMISS: 'idle',
        },
        initial: 'waitingForvcKey',
        states: {
          waitingForvcKey: {},
        },
      },
    },
  },
  {
    services: {
      checkStorageAvailability: () => async () => {
        return Promise.resolve(
          Storage.isMinimumLimitReached('minStorageRequired')
        );
      },
    },

    actions: {
      refreshMyVc: send((_context, event) => VcEvents.REFRESH_MY_VCS(), {
        to: (context) => context.serviceRefs.vc,
      }),

      resetIsTampered: send(() => StoreEvents.RESET_IS_TAMPERED(), {
        to: (context) => context.serviceRefs.store,
      }),

      viewVcFromParent: sendParent((_context, event: ViewVcEvent) =>
        model.events.VIEW_VC(event.vcItemActor)
      ),

      getOnboardingStatus: send(
        () => StoreEvents.GET(ONBOARDING_STATUS_STORE_KEY),
        { to: (context) => context.serviceRefs.store }
      ),

      completeOnboarding: send(
        () => StoreEvents.SET(ONBOARDING_STATUS_STORE_KEY, true),
        { to: (context) => context.serviceRefs.store }
      ),

      storeVcItem: send(
        (_context, event) => {
          return StoreEvents.PREPEND(
            MY_VCS_STORE_KEY,
            (event as DoneInvokeEvent<string>).data
          );
        },
        { to: (context) => context.serviceRefs.store }
      ),

      sendVcAdded: send(
        (_context, event) => VcEvents.VC_ADDED(event.response as string),
        {
          to: (context) => context.serviceRefs.vc,
        }
      ),
    },

    guards: {
      isOnboardingDone: (_context, event: StoreResponseEvent) => {
        return event.response === true;
      },

      isMinimumStorageLimitReached: (_context, event) => Boolean(event.data),
    },
  }
);

export function createMyVcsTabMachine(serviceRefs: AppServices) {
  return MyVcsTabMachine.withContext({
    ...MyVcsTabMachine.context,
    serviceRefs,
  });
}

type State = StateFrom<typeof MyVcsTabMachine>;

export function selectAddVcModal(state: State) {
  return state.children.AddVcModal as ActorRefFrom<typeof AddVcModalMachine>;
}

export function selectGetVcModal(state: State) {
  return state.children.GetVcModal as ActorRefFrom<typeof GetVcModalMachine>;
}

export function selectIsOnboarding(state: State) {
  return state.matches('onboarding');
}

export function selectIsStoring(state: State) {
  return state.matches('addingVc.storing');
}

export function selectIsRequestSuccessful(state: State) {
  return state.matches('addingVc.addVcSuccessful');
}

export function selectIsSavingFailedInIdle(state: State) {
  return state.matches('addingVc.savingFailed.idle');
}

export function selectIsMinimumStorageLimitReached(state: State) {
  return state.matches('addVc.storageLimitReached');
}
