// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    '': {type: ''};
    'done.invoke.checkStatus': {
      type: 'done.invoke.checkStatus';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.downloadCredential': {
      type: 'done.invoke.downloadCredential';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.addKeyPair:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.existingState.verifyingCredential:invocation[0]': {
      type: 'done.invoke.vc-item.existingState.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.vc-item.verifyState.verifyingCredential:invocation[0]': {
      type: 'done.invoke.vc-item.verifyState.verifyingCredential:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.checkStatus': {
      type: 'error.platform.checkStatus';
      data: unknown;
    };
    'error.platform.downloadCredential': {
      type: 'error.platform.downloadCredential';
      data: unknown;
    };
    'error.platform.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]': {
      type: 'error.platform.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.addKeyPair:invocation[0]': {
      type: 'error.platform.vc-item.existingState.addKeyPair:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.addingWalletBindingId:invocation[0]': {
      type: 'error.platform.vc-item.existingState.addingWalletBindingId:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]': {
      type: 'error.platform.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.requestingBindingOtp:invocation[0]': {
      type: 'error.platform.vc-item.existingState.requestingBindingOtp:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.updatingPrivateKey:invocation[0]': {
      type: 'error.platform.vc-item.existingState.updatingPrivateKey:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.existingState.verifyingCredential:invocation[0]': {
      type: 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'error.platform.vc-item.verifyState.verifyingCredential:invocation[0]': {
      type: 'error.platform.vc-item.verifyState.verifyingCredential:invocation[0]';
      data: unknown;
    };
    'xstate.init': {type: 'xstate.init'};
  };
  invokeSrcNameMap: {
    addWalletBindnigId: 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]';
    checkDownloadExpiryLimit: 'done.invoke.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    checkStatus: 'done.invoke.checkStatus';
    downloadCredential: 'done.invoke.downloadCredential';
    generateKeyPair: 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]';
    isUserSignedAlready:
      | 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]'
      | 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
    loadDownloadLimitConfig: 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    requestBindingOtp:
      | 'done.invoke.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]';
    updatePrivateKey: 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    verifyCredential:
      | 'done.invoke.vc-item.existingState.verifyingCredential:invocation[0]'
      | 'done.invoke.vc-item.verifyState.verifyingCredential:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    addVcToInProgressDownloads: 'STORE_RESPONSE';
    clearOtp:
      | ''
      | 'CANCEL'
      | 'DISMISS'
      | 'GET_VC_RESPONSE'
      | 'SHOW_BINDING_STATUS'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]'
      | 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
    clearTransactionId:
      | ''
      | 'CANCEL'
      | 'DISMISS'
      | 'GET_VC_RESPONSE'
      | 'SHOW_BINDING_STATUS'
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
    closeViewVcModal: 'CLOSE_VC_MODAL' | 'STORE_RESPONSE';
    incrementDownloadCounter:
      | 'POLL'
      | 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    logDownloaded: 'STORE_RESPONSE';
    logVCremoved:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]';
    logWalletBindingFailure:
      | 'error.platform.vc-item.existingState.addKeyPair:invocation[0]'
      | 'error.platform.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item.existingState.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item.existingState.updatingPrivateKey:invocation[0]';
    logWalletBindingSuccess:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    refreshMyVcs:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]';
    removeVcFromInProgressDownloads: 'STORE_RESPONSE';
    removeVcItem: 'CONFIRM';
    removeVcMetaDataFromStorage:
      | 'STORE_ERROR'
      | 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]';
    removeVcMetaDataFromVcMachine: 'DISMISS';
    requestStoredContext: 'GET_VC_RESPONSE' | 'REFRESH';
    requestVcContext: 'DISMISS' | 'xstate.init';
    resetIsVerified:
      | 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item.verifyState.verifyingCredential:invocation[0]';
    resetVerificationBannerStatus: 'DISMISS_VERIFICATION_STATUS_BANNER';
    sendActivationFailedEndEvent:
      | 'DISMISS'
      | 'error.platform.vc-item.existingState.updatingPrivateKey:invocation[0]';
    sendActivationStartEvent: 'CONFIRM';
    sendActivationSuccessEvent:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    sendBackupEvent:
      | 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]'
      | 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
    sendDownloadLimitExpire:
      | 'FAILED'
      | 'error.platform.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    sendTamperedVc: 'TAMPERED_VC';
    sendTelemetryEvents: 'STORE_RESPONSE';
    sendVcUpdated: 'PIN_CARD' | 'STORE_RESPONSE';
    sendVerificationError: 'STORE_RESPONSE';
    sendWalletBindingSuccess: 'SHOW_BINDING_STATUS';
    setCredential:
      | 'CREDENTIAL_DOWNLOADED'
      | 'GET_VC_RESPONSE'
      | 'STORE_RESPONSE';
    setDownloadInterval: 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    setEmail:
      | 'done.invoke.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]';
    setIsVerified:
      | 'done.invoke.vc-item.existingState.verifyingCredential:invocation[0]'
      | 'done.invoke.vc-item.verifyState.verifyingCredential:invocation[0]';
    setMaxDownloadCount: 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    setOtp: 'INPUT_OTP';
    setPhoneNumber:
      | 'done.invoke.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'done.invoke.vc-item.existingState.requestingBindingOtp:invocation[0]';
    setPinCard: 'PIN_CARD';
    setPrivateKey: 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]';
    setPublicKey: 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]';
    setTempWalletBindingResponse: 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]';
    setThumbprintForWalletBindingId:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    setVcKey: 'REMOVE';
    setVcMetadata: 'UPDATE_VC_METADATA';
    setVerificationStatus: 'SET_VERIFICATION_STATUS' | 'STORE_RESPONSE';
    setWalletBindingError:
      | 'error.platform.vc-item.existingState.acceptingBindingOtp.resendOTP:invocation[0]'
      | 'error.platform.vc-item.existingState.addKeyPair:invocation[0]'
      | 'error.platform.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'error.platform.vc-item.existingState.requestingBindingOtp:invocation[0]'
      | 'error.platform.vc-item.existingState.updatingPrivateKey:invocation[0]';
    setWalletBindingErrorEmpty:
      | 'CANCEL'
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    setWalletBindingId:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    storeContext:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]'
      | 'done.invoke.vc-item.existingState.verifyingCredential:invocation[0]'
      | 'done.invoke.vc-item.verifyState.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]'
      | 'error.platform.vc-item.verifyState.verifyingCredential:invocation[0]';
    updatePrivateKey:
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    updateVc:
      | 'STORE_RESPONSE'
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]'
      | 'done.invoke.vc-item.existingState.updatingPrivateKey:invocation[0]';
    updateVerificationErrorMessage: 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]';
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    hasCredential: 'GET_VC_RESPONSE' | 'STORE_RESPONSE';
    isCustomSecureKeystore:
      | 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]'
      | 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]';
    isDownloadAllowed: 'POLL';
    isPendingVerificationError: 'error.platform.vc-item.existingState.verifyingCredential:invocation[0]';
    isSignedIn:
      | 'done.invoke.vc-item.existingState.kebabPopUp.removingVc.triggerAutoBackup:invocation[0]'
      | 'done.invoke.vc-item.existingState.verifyingCredential.triggerAutoBackupForVcDownload:invocation[0]';
  };
  eventsCausingServices: {
    addWalletBindnigId: 'done.invoke.vc-item.existingState.addKeyPair:invocation[0]';
    checkDownloadExpiryLimit:
      | 'POLL'
      | 'done.invoke.vc-item.existingState.checkingServerData.loadDownloadLimitConfig:invocation[0]';
    checkStatus: 'done.invoke.vc-item.existingState.checkingServerData.verifyingDownloadLimitExpiry:invocation[0]';
    downloadCredential: 'DOWNLOAD_READY';
    generateKeyPair: 'INPUT_OTP';
    isUserSignedAlready: 'STORE_RESPONSE';
    loadDownloadLimitConfig: 'STORE_ERROR' | 'STORE_RESPONSE';
    requestBindingOtp: 'CONFIRM' | 'RESEND_OTP';
    updatePrivateKey: 'done.invoke.vc-item.existingState.addingWalletBindingId:invocation[0]';
    verifyCredential: 'CREDENTIAL_DOWNLOADED' | 'VERIFY';
  };
  matchesStates:
    | 'existingState'
    | 'existingState.acceptingBindingOtp'
    | 'existingState.acceptingBindingOtp.idle'
    | 'existingState.acceptingBindingOtp.resendOTP'
    | 'existingState.addKeyPair'
    | 'existingState.addingWalletBindingId'
    | 'existingState.checkingServerData'
    | 'existingState.checkingServerData.checkingStatus'
    | 'existingState.checkingServerData.downloadingCredential'
    | 'existingState.checkingServerData.loadDownloadLimitConfig'
    | 'existingState.checkingServerData.savingFailed'
    | 'existingState.checkingServerData.savingFailed.idle'
    | 'existingState.checkingServerData.savingFailed.viewingVc'
    | 'existingState.checkingServerData.verifyingDownloadLimitExpiry'
    | 'existingState.checkingStore'
    | 'existingState.checkingVc'
    | 'existingState.handleVCVerificationFailure'
    | 'existingState.idle'
    | 'existingState.kebabPopUp'
    | 'existingState.kebabPopUp.idle'
    | 'existingState.kebabPopUp.removeWallet'
    | 'existingState.kebabPopUp.removingVc'
    | 'existingState.kebabPopUp.removingVc.triggerAutoBackup'
    | 'existingState.kebabPopUp.showActivities'
    | 'existingState.pinCard'
    | 'existingState.requestingBindingOtp'
    | 'existingState.showBindingWarning'
    | 'existingState.showingWalletBindingError'
    | 'existingState.updatingContextVariables'
    | 'existingState.updatingPrivateKey'
    | 'existingState.verifyingCredential'
    | 'existingState.verifyingCredential.idle'
    | 'existingState.verifyingCredential.triggerAutoBackupForVcDownload'
    | 'verifyState'
    | 'verifyState.idle'
    | 'verifyState.verifyingCredential'
    | {
        existingState?:
          | 'acceptingBindingOtp'
          | 'addKeyPair'
          | 'addingWalletBindingId'
          | 'checkingServerData'
          | 'checkingStore'
          | 'checkingVc'
          | 'handleVCVerificationFailure'
          | 'idle'
          | 'kebabPopUp'
          | 'pinCard'
          | 'requestingBindingOtp'
          | 'showBindingWarning'
          | 'showingWalletBindingError'
          | 'updatingContextVariables'
          | 'updatingPrivateKey'
          | 'verifyingCredential'
          | {
              acceptingBindingOtp?: 'idle' | 'resendOTP';
              checkingServerData?:
                | 'checkingStatus'
                | 'downloadingCredential'
                | 'loadDownloadLimitConfig'
                | 'savingFailed'
                | 'verifyingDownloadLimitExpiry'
                | {savingFailed?: 'idle' | 'viewingVc'};
              kebabPopUp?:
                | 'idle'
                | 'removeWallet'
                | 'removingVc'
                | 'showActivities'
                | {removingVc?: 'triggerAutoBackup'};
              verifyingCredential?: 'idle' | 'triggerAutoBackupForVcDownload';
            };
        verifyState?: 'idle' | 'verifyingCredential';
      };
  tags: never;
}
