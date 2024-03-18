import {StateFrom} from 'xstate';
import {EsignetMosipVCItemMachine} from './EsignetMosipVCItem/EsignetMosipVCItemMachine';
import {ExistingMosipVCItemMachine} from './ExistingMosipVCItem/ExistingMosipVCItemMachine';

type State = StateFrom<
  typeof ExistingMosipVCItemMachine & typeof EsignetMosipVCItemMachine
>;

export function selectVerifiableCredential(state: State) {
  return state.context.verifiableCredential;
}

export function selectKebabPopUp(state: State) {
  return state.context.isMachineInKebabPopupState;
}

export function selectContext(state: State) {
  return state.context;
}

export function selectGeneratedOn(state: State) {
  return state.context.generatedOn;
}

export function selectWalletBindingSuccess(state: State) {
  return state.context.walletBindingSuccess;
}

export function selectIsPhoneNumber(state: State) {
  return state.context.phoneNumber;
}

export function selectIsEmail(state: State) {
  return state.context.email;
}

export function selectEmptyWalletBindingId(state: State) {
  var val = state.context.walletBindingResponse
    ? state.context.walletBindingResponse.walletBindingId
    : undefined;
  return val == undefined || val == null || val.length <= 0 ? true : false;
}

export function selectWalletBindingError(state: State) {
  return state.context.walletBindingError;
}

export function selectBindingAuthFailedError(state: State) {
  return state.context.bindingAuthFailedMessage;
}

export function selectAcceptingBindingOtp(state: State) {
  return state.matches('existingState.acceptingBindingOtp');
}

export function selectKebabPopUpShowWalletBindingError(state: State) {
  return state.matches('existingState.showingWalletBindingError');
}

export function selectWalletBindingInProgress(state: State) {
  return state.matches('existingState.requestingBindingOtp') ||
    state.matches('existingState.addingWalletBindingId') ||
    state.matches('existingState.addKeyPair') ||
    state.matches('existingState.updatingPrivateKey')
    ? true
    : false;
}

export function selectBindingWarning(state: State) {
  return state.matches('existingState.showBindingWarning');
}

export function selectRemoveWalletWarning(state: State) {
  return state.matches('existingState.kebabPopUp.removeWallet');
}

export function selectIsPinned(state: State) {
  return state.context.vcMetadata.isPinned;
}

export function selectOtpError(state: State) {
  return state.context.otpError;
}

export function selectShowActivities(state: State) {
  return state.matches('existingState.kebabPopUp.showActivities');
}

export function selectShowWalletBindingError(state: State) {
  return state.matches('existingState.showingWalletBindingError');
}

export function selectVerificationBannerStatus(state: State) {
  return state.context.verificationBannerStatus;
}
