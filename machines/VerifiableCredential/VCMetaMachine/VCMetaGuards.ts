import {isSignedInResult} from '../../../shared/CloudBackupAndRestoreUtils';

export const VCMetaGaurds = () => {
  return {
    isSignedIn: (_context, event) =>
      (event.data as isSignedInResult).isSignedIn,
  };
};
