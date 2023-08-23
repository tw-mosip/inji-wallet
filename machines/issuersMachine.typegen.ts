// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    'done.invoke.issuersMachine.displayIssuers:invocation[0]': {
      type: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]': {
      type: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.issuersMachine.performAuthorization:invocation[0]': {
      type: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.issuersMachine.displayIssuers:invocation[0]': {
      type: 'error.platform.issuersMachine.displayIssuers:invocation[0]';
      data: unknown;
    };
    'xstate.init': { type: 'xstate.init' };
  };
  'invokeSrcNameMap': {
    downloadIssuerConfig: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
    downloadIssuersList: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    invokeAuthorization: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    resetError: 'RESET_ERROR' | 'TRY_AGAIN';
    setError: 'error.platform.issuersMachine.displayIssuers:invocation[0]';
    setIssuers: 'done.invoke.issuersMachine.displayIssuers:invocation[0]';
    setSelectedIssuers: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
    setTokenResponse: 'done.invoke.issuersMachine.performAuthorization:invocation[0]';
  };
  'eventsCausingDelays': {};
  'eventsCausingGuards': {};
  'eventsCausingServices': {
    downloadIssuerConfig: 'SELECTED_ISSUER';
    downloadIssuersList: 'TRY_AGAIN' | 'xstate.init';
    invokeAuthorization: 'done.invoke.issuersMachine.downloadIssuerConfig:invocation[0]';
  };
  'matchesStates':
    | 'displayIssuers'
    | 'done'
    | 'downloadIssuerConfig'
    | 'idle'
    | 'performAuthorization'
    | 'selectingIssuer';
  'tags': never;
}
