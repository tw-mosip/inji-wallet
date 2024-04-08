import {NetInfoState} from '@react-native-community/netinfo';

export const BackupRestoreGuards = () => {
  return {
    isInternetConnected: (_, event) =>
      !!(event.data as NetInfoState).isConnected,
    isMinimumStorageRequiredForBackupRestorationReached: (_context, event) =>
      Boolean(event.data),
  };
};
