import NetInfo from '@react-native-community/netinfo';
import fileStorage, {
  getBackupFilePath,
  unZipAndRemoveFile,
} from '../../../shared/fileStorage';
import Storage from '../../../shared/storage';

export const BackupRestoreServices = model => {
  return {
    checkInternet: async () => await NetInfo.fetch(),

    checkStorageAvailability: () => async () => {
      return await Storage.isMinimumLimitReached('minStorageRequired');
    },

    downloadLatestBackup: () => async () => {
      const backupFileName = await Cloud.downloadLatestBackup();
      if (backupFileName === null) {
        return new Error('unable to download backup file');
      }
      return backupFileName;
    },

    unzipBackupFile: context => async () => {
      return await unZipAndRemoveFile(context.fileName);
    },
    readBackupFile: context => async callback => {
      // trim extension
      context.fileName = context.fileName.endsWith('.injibackup')
        ? context.fileName.split('.injibackup')[0]
        : context.fileName;
      const dataFromBackupFile = await fileStorage.readFile(
        getBackupFilePath(context.fileName),
      );
      callback(model.events.DATA_FROM_FILE(dataFromBackupFile));
    },
  };
};
