import {StateFrom} from 'xstate';
import {vcMetaMachine} from './VCMetaMachine';
import {VCMetadata} from '../../../shared/VCMetadata';

type State = StateFrom<typeof vcMetaMachine>;

export function selectMyVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs;
}

export function selectShareableVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs.filter(
    vcMetadata =>
      state.context.vcs[vcMetadata.getVcKey()]?.credential != null ||
      state.context.vcs[vcMetadata.getVcKey()]?.verifiableCredential != null,
  );
}

export function selectReceivedVcsMetadata(state: State): VCMetadata[] {
  return state.context.receivedVcs;
}

export function selectIsRefreshingMyVcs(state: State) {
  return state.matches('ready.myVcs.refreshing');
}

export function selectIsRefreshingReceivedVcs(state: State) {
  return state.matches('ready.receivedVcs.refreshing');
}

export function selectAreAllVcsDownloaded(state: State) {
  return state.context.areAllVcsDownloaded;
}

/*
  this methods returns all the binded vc's in the wallet.
 */
export function selectBindedVcsMetadata(state: State): VCMetadata[] {
  return state.context.myVcs.filter(vcMetadata => {
    const walletBindingResponse =
      state.context.vcs[vcMetadata.getVcKey()]?.walletBindingResponse;
    return (
      !isEmpty(walletBindingResponse) &&
      !isEmpty(walletBindingResponse?.walletBindingId)
    );
  });
}

export function selectInProgressVcDownloads(state: State) {
  return state.context.inProgressVcDownloads;
}

function isEmpty(object) {
  return object == null || object == '' || object == undefined;
}

export function selectWalletBindingSuccess(state: State) {
  return state.context.walletBindingSuccess;
}

export function selectIsTampered(state: State) {
  return state.matches('tamperedVCs');
}

export function selectDownloadingFailedVcs(state: State) {
  return state.context.downloadingFailedVcs;
}

export function selectMyVcs(state: State) {
  return state.context.vcs;
}

export function selectVerificationErrorMessage(state: State) {
  return state.context.verificationErrorMessage;
}
