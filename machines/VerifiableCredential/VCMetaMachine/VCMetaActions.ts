import {send} from 'xstate';
import {BackupEvents} from '../../backupAndRestore/backup';
import {respond} from 'xstate/lib/actions';
import {VCMetadata, parseMetadatas} from '../../../shared/VCMetadata';
import {
  MY_VCS_STORE_KEY,
  RECEIVED_VCS_STORE_KEY,
} from '../../../shared/constants';
import {StoreEvents} from '../../store';
import {ActivityLogEvents} from '../../activityLog';
import {ActivityLog} from '../../../components/ActivityLogEvent';

export const VCMetaActions = model => {
  return {
    sendBackupEvent: send(BackupEvents.DATA_BACKUP(true), {
      to: context => context.serviceRefs.backup,
    }),

    getVcItemResponse: respond((context, event) => {
      return {
        type: 'GET_VC_RESPONSE',
        response: context.vcs[VCMetadata.fromVC(event.vcMetadata)?.getVcKey()],
      };
    }),

    loadMyVcs: send(StoreEvents.GET(MY_VCS_STORE_KEY), {
      to: context => context.serviceRefs.store,
    }),

    loadReceivedVcs: send(StoreEvents.GET(RECEIVED_VCS_STORE_KEY), {
      to: context => context.serviceRefs.store,
    }),

    setMyVcs: model.assign({
      myVcs: (_context, event) => {
        return parseMetadatas((event.response || []) as object[]);
      },
    }),

    setReceivedVcs: model.assign({
      receivedVcs: (_context, event) => {
        return parseMetadatas((event.response || []) as object[]);
      },
    }),

    setTamperedVcs: model.assign({
      tamperedVcs: (context, event) => [event.VC, ...context.tamperedVcs],
    }),

    setDownloadingFailedVcs: model.assign({
      downloadingFailedVcs: (context, event) => [
        ...context.downloadingFailedVcs,
        event.vcMetadata,
      ],
    }),

    setVerificationErrorMessage: model.assign({
      verificationErrorMessage: (context, event) => event.errorMessage,
    }),

    resetVerificationErrorMessage: model.assign({
      verificationErrorMessage: (_context, event) => '',
    }),

    resetDownloadFailedVcs: model.assign({
      downloadingFailedVcs: (context, event) => [],
    }),

    setDownloadedVc: (context, event) => {
      const vcMetaData = event.vcMetadata ? event.vcMetadata : event.vc;
      const vcUniqueId = VCMetadata.fromVC(vcMetaData).getVcKey();
      context.vcs[vcUniqueId] = event.vc;
    },

    addVcToInProgressDownloads: model.assign({
      inProgressVcDownloads: (context, event) => {
        let paresedInProgressList: Set<string> = context.inProgressVcDownloads;
        const newVcRequestID = event.requestId;
        const newInProgressList = paresedInProgressList.add(newVcRequestID);
        return newInProgressList;
      },
    }),

    removeVcFromInProgressDownlods: model.assign({
      inProgressVcDownloads: (context, event) => {
        let updatedInProgressList: Set<string> = context.inProgressVcDownloads;
        if (!event.vcMetadata) {
          return updatedInProgressList;
        }
        const removeVcRequestID = event.vcMetadata.requestId;
        updatedInProgressList.delete(removeVcRequestID);

        return updatedInProgressList;
      },
      areAllVcsDownloaded: context => {
        if (context.inProgressVcDownloads.size == 0) {
          return true;
        }
        return false;
      },
    }),

    resetInProgressVcsDownloaded: model.assign({
      areAllVcsDownloaded: () => false,
      inProgressVcDownloads: new Set<string>(),
    }),

    setUpdatedVcMetadatas: send(
      _context => {
        return StoreEvents.SET(MY_VCS_STORE_KEY, _context.myVcs);
      },
      {to: context => context.serviceRefs.store},
    ),

    prependToMyVcs: model.assign({
      myVcs: (context, event) => [event.vcMetadata, ...context.myVcs],
    }),

    removeVcFromMyVcs: model.assign({
      myVcs: (context, event) =>
        context.myVcs.filter((vc: VCMetadata) => !vc.equals(event.vcMetadata)),
    }),

    removeDownloadingFailedVcsFromMyVcs: model.assign({
      myVcs: (context, event) =>
        context.myVcs.filter(
          value =>
            !context.downloadingFailedVcs.some(item => item?.equals(value)),
        ),
    }),

    removeDownloadFailedVcsFromStorage: send(
      context => {
        return StoreEvents.REMOVE_ITEMS(
          MY_VCS_STORE_KEY,
          context.downloadingFailedVcs.map(m => m.getVcKey()),
        );
      },
      {
        to: context => context.serviceRefs.store,
      },
    ),

    logTamperedVCsremoved: send(
      context => ActivityLogEvents.LOG_ACTIVITY(ActivityLog.logTamperedVCs()),
      {
        to: context => context.serviceRefs.activityLog,
      },
    ),

    updateMyVcs: model.assign({
      myVcs: (context, event) => [
        ...getUpdatedVCMetadatas(context.myVcs, event.vcMetadata),
      ],
    }),

    setWalletBindingSuccess: model.assign({
      walletBindingSuccess: true,
    }),
    resetWalletBindingSuccess: model.assign({
      walletBindingSuccess: false,
    }),
  };

  function getUpdatedVCMetadatas(
    existingVCMetadatas: VCMetadata[],
    updatedVcMetadata: VCMetadata,
  ) {
    const isPinStatusUpdated = updatedVcMetadata.isPinned;

    return existingVCMetadatas.map(value => {
      if (value.equals(updatedVcMetadata)) {
        return updatedVcMetadata;
      } else if (isPinStatusUpdated) {
        return new VCMetadata({...value, isPinned: false});
      } else {
        return value;
      }
    });
  }
};
