export const BackupRestoreEvents = {
  BACKUP_RESTORE: () => ({}),
  DOWNLOAD_UNSYNCED_BACKUP_FILES: () => ({}),
  DISMISS: () => ({}),
  DISMISS_SHOW_RESTORE_IN_PROGRESS: () => ({}),
  STORE_RESPONSE: (response: unknown) => ({response}),
  STORE_ERROR: (error: Error, requester?: string) => ({error, requester}),
  DATA_FROM_FILE: (dataFromBackupFile: {}) => ({dataFromBackupFile}),
};
