// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]': {
      type: 'done.invoke.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.existingState.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]': {
      type: 'error.platform.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    addWalletBindnigId: 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
    generateKeyPair: 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
    isUserSignedAlready: 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
    requestBindingOtp:
      | 'done.invoke.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
    updatePrivateKey: 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    verifyCredential: 'done.invoke.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
  };
  missingImplementations: {
    actions: 'clearTransactionId';
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    clearOtp:
      | 'DISMISS'
      | 'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
    clearTransactionId: 'DISMISS';
    closeViewVcModal: 'CLOSE_VC_MODAL' | 'STORE_RESPONSE';
    logVCremoved:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
    logWalletBindingFailure:
      | 'error.platform.vc-item-openid4vci.existingState.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    logWalletBindingSuccess:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    removeVcItem: 'CONFIRM';
    removedVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'DISMISS' | 'xstate.init';
    resetIsVerified: 'error.platform.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
    resetVerificationBannerStatus: 'DISMISS_VERIFICATION_IN_PROGRESS_BANNER';
    sendActivationFailedEndEvent:
      | 'DISMISS'
      | 'error.platform.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    sendActivationStartEvent: 'CONFIRM';
    sendActivationSuccessEvent:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    sendBackupEvent: 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
    sendVcUpdated: 'PIN_CARD' | 'STORE_RESPONSE';
    sendWalletBindingSuccess: 'SHOW_BINDING_STATUS';
    setContext: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setEmail:
      | 'done.invoke.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
    setGeneratedOn: 'GET_VC_RESPONSE';
    setIsVerified: 'done.invoke.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
    setOtp: 'INPUT_OTP';
    setPhoneNumber:
      | 'done.invoke.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]';
    setPinCard: 'PIN_CARD';
    setPrivateKey: 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
    setTempWalletBindingResponse: 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
    setThumbprintForWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    setVcKey: 'REMOVE';
    setVcMetadata: 'UPDATE_VC_METADATA';
    setVerifiableCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    setVerificationStatus: 'STORE_RESPONSE';
    setWalletBindingError:
      | 'error.platform.vc-item-openid4vci.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.addKeyPair:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    setWalletBindingId:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    storeContext:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
    updateVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.updatingPrivateKey:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasCredential: 'GET_VC_RESPONSE';
    isCustomSecureKeystore:
      | 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
    isPendingVerificationError: 'error.platform.vc-item-openid4vci.verifyState.verifyingCredential:invocation[0]';
    isSignedIn: 'done.invoke.vc-item-openid4vci.existingState.kebabPopUp.triggerAutoBackup:invocation[0]';
  };
  eventsCausingServices: {
    addWalletBindnigId: 'done.invoke.vc-item-openid4vci.existingState.addKeyPair:invocation[0]';
    generateKeyPair: 'INPUT_OTP';
    isUserSignedAlready: 'STORE_RESPONSE';
    requestBindingOtp: 'CONFIRM' | 'RESEND_OTP';
    updatePrivateKey: 'done.invoke.vc-item-openid4vci.existingState.addingWalletBindingId:invocation[0]';
    verifyCredential: 'VERIFY';
  };
  matchesStates:
    | 'existingState'
    | 'existingState.acceptingBindingOtp'
    | 'existingState.acceptingBindingOtp.idle'
    | 'existingState.acceptingBindingOtp.resendOTP'
    | 'existingState.addKeyPair'
    | 'existingState.addingWalletBindingId'
    | 'existingState.checkingStore'
    | 'existingState.checkingVc'
    | 'existingState.idle'
    | 'existingState.kebabPopUp'
    | 'existingState.kebabPopUp.idle'
    | 'existingState.kebabPopUp.removeWallet'
    | 'existingState.kebabPopUp.removingVc'
    | 'existingState.kebabPopUp.showActivities'
    | 'existingState.kebabPopUp.triggerAutoBackup'
    | 'existingState.pinCard'
    | 'existingState.requestingBindingOtp'
    | 'existingState.showBindingWarning'
    | 'existingState.showingWalletBindingError'
    | 'existingState.updatingContextVariables'
    | 'existingState.updatingPrivateKey'
    | 'verifyState'
    | 'verifyState.handleVerificationResponse'
    | 'verifyState.idle'
    | 'verifyState.verifyingCredential'
    | {
        existingState?:
          | 'acceptingBindingOtp'
          | 'addKeyPair'
          | 'addingWalletBindingId'
          | 'checkingStore'
          | 'checkingVc'
          | 'idle'
          | 'kebabPopUp'
          | 'pinCard'
          | 'requestingBindingOtp'
          | 'showBindingWarning'
          | 'showingWalletBindingError'
          | 'updatingContextVariables'
          | 'updatingPrivateKey'
          | {
              acceptingBindingOtp?: 'idle' | 'resendOTP';
              kebabPopUp?:
                | 'idle'
                | 'removeWallet'
                | 'removingVc'
                | 'showActivities'
                | 'triggerAutoBackup';
            };
        verifyState?:
          | 'handleVerificationResponse'
          | 'idle'
          | 'verifyingCredential';
      };
  tags: never;
}
