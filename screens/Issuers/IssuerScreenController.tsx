import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectCredentials,
  selectErrorMessage,
  selectIsDone,
  selectIsDownloadCredentials,
  selectIsIdle,
  selectIssuers,
} from '../../machines/issuersMachine';

export function useIssuerScreenController({ route, navigation }) {
  const service = route.params.service;

  const issuers = useSelector(service, selectIssuers);
  const credential = useSelector(service, selectCredentials);
  const errorMessage = useSelector(service, selectErrorMessage);
  const isDownloadingCredentials = useSelector(
    service,
    selectIsDownloadCredentials
  );
  const isDone = useSelector(service, selectIsDone);
  const isIdle = useSelector(service, selectIsIdle);
  return {
    issuers,
    errorMessage,
    isDownloadingCredentials,
    isDone,
    isIdle,
    credential,
    CANCEL: () => service.send(IssuerScreenTabEvents.CANCEL()),
    DOWNLOAD_ID: () => {
      service.send(IssuerScreenTabEvents.DOWNLOAD_ID());
      navigation.navigate('Home', { screen: 'HomeScreen' });
    },
    SELECTED_ISSUER: (id) =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
    RESET_ERROR: () => service.send(IssuerScreenTabEvents.RESET_ERROR()),
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
