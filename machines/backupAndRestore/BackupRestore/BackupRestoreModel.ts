import {createModel} from 'xstate/lib/model';
import {AppServices} from '../../../shared/GlobalContext';
import {BackupRestoreEvents} from './BackupRestoreEvents';

export const BackupRestoreModel = createModel(
  {
    serviceRefs: {} as AppServices,
    fileName: '',
    dataFromBackupFile: {},
    errorReason: '' as string,
    showRestoreInProgress: false as boolean,
  },
  {
    events: BackupRestoreEvents,
  },
);
