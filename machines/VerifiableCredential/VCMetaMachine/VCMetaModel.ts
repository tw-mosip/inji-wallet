import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {VCMetaEvents} from './VCMetaEvents';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from './vc';

export const VCMetamodel = createModel(
  {
    serviceRefs: {} as AppServices,
    myVcs: [] as VCMetadata[],
    receivedVcs: [] as VCMetadata[],
    vcs: {} as Record<string, VC>,
    inProgressVcDownloads: new Set<string>(), //VCDownloadInProgress
    areAllVcsDownloaded: false as boolean,
    walletBindingSuccess: false,
    tamperedVcs: [] as VCMetadata[],
    downloadingFailedVcs: [] as VCMetadata[], //VCDownloadFailed
    verificationErrorMessage: '' as string,
  },
  {
    events: VCMetaEvents,
  },
);
