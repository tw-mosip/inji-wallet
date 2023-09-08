import { useSelector } from '@xstate/react';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectCredentials,
  selectErrorMessage,
  selectIsDone,
  selectIsDownloadCredentials,
  selectIsIdle,
  selectIssuers,
  selectLoadingIssuers,
  selectStoring,
} from '../../machines/issuersMachine';
import { ActorRefFrom } from 'xstate';

export function useIssuerScreenController({ route, navigation }) {
  const service = route.params.service;

  return {
    issuers: useSelector(service, selectIssuers),
    errorMessage: useSelector(service, selectErrorMessage),
    isDownloadingCredentials: useSelector(service, selectIsDownloadCredentials),
    isDone: useSelector(service, selectIsDone),
    isIdle: useSelector(service, selectIsIdle),
    credential: useSelector(service, selectCredentials),
    isLoadingIssuers: useSelector(service, selectLoadingIssuers),
    isStoring: useSelector(service, selectStoring),

    CANCEL: () => service.send(IssuerScreenTabEvents.CANCEL()),
    SELECTED_ISSUER: (id) =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
    RESET_ERROR: () => service.send(IssuerScreenTabEvents.RESET_ERROR()),
    DOWNLOAD_ID: () => {
      service.send(IssuerScreenTabEvents.DOWNLOAD_ID());
      navigation.navigate('Home', { screen: 'HomeScreen' });
    },
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
