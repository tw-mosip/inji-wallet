// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.app.init.injiProps:invocation[0]': {
      type: 'done.invoke.app.init.injiProps:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.app.init.injiProps:invocation[0]': {
      type: 'error.platform.app.init.injiProps:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    checkFocusState: 'done.invoke.app.ready.focus:invocation[0]';
    checkNetworkState: 'done.invoke.app.ready.network:invocation[0]';
    getAppInfo: 'done.invoke.app.init.info:invocation[0]';
    getBackendInfo: 'done.invoke.app.init.devinfo:invocation[0]';
    updateInjiProps: 'done.invoke.app.init.injiProps:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    forwardToServices: 'ACTIVE' | 'INACTIVE' | 'OFFLINE' | 'ONLINE';
    loadCredentialRegistryHostFromStorage: 'READY';
    loadCredentialRegistryInConstants: 'STORE_RESPONSE';
    logServiceEvents:
      | 'done.invoke.app.init.injiProps:invocation[0]'
      | 'error.platform.app.init.injiProps:invocation[0]';
    logStoreEvents: 'xstate.init';
    requestDeviceInfo: 'REQUEST_DEVICE_INFO';
    setAppInfo: 'APP_INFO_RECEIVED';
    setBackendInfo: 'BACKEND_INFO_RECEIVED';
    spawnServiceActors:
      | 'done.invoke.app.init.injiProps:invocation[0]'
      | 'error.platform.app.init.injiProps:invocation[0]';
    spawnStoreActor: 'xstate.init';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    checkFocusState: 'BACKEND_INFO_RECEIVED';
    checkNetworkState: 'BACKEND_INFO_RECEIVED';
    getAppInfo: 'READY';
    getBackendInfo: 'APP_INFO_RECEIVED';
    updateInjiProps: 'STORE_RESPONSE';
  };
  'matchesStates':
    | 'init'
    | 'init.credentialRegistry'
    | 'init.devinfo'
    | 'init.info'
    | 'init.injiProps'
    | 'init.services'
    | 'init.store'
    | 'ready'
    | 'ready.focus'
    | 'ready.focus.active'
    | 'ready.focus.checking'
    | 'ready.focus.inactive'
    | 'ready.network'
    | 'ready.network.checking'
    | 'ready.network.offline'
    | 'ready.network.online'
    | {
        init?:
          | 'credentialRegistry'
          | 'devinfo'
          | 'info'
          | 'injiProps'
          | 'services'
          | 'store';
        ready?:
          | 'focus'
          | 'network'
          | {
              focus?: 'active' | 'checking' | 'inactive';
              network?: 'checking' | 'offline' | 'online';
            };
      };
  'tags': never;
}
