import { useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';
import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectErrorMessage,
  selectIsError,
  selectIssuers,
} from '../../machines/issuersMachine';

export function useIssuerScreenController({ route }) {
  const service = route.params.service;

  const issuers = useSelector(service, selectIssuers);
  const isError = useSelector(service, selectIsError);
  const errorMessage = useSelector(service, selectErrorMessage);
  return {
    issuers,
    isError,
    errorMessage,
    DOWNLOAD_ID: () => service.send(IssuerScreenTabEvents.DOWNLOAD_ID()),
    SELECTED_ISSUER: (id) =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
    TRY_AGAIN: () => service.send(IssuerScreenTabEvents.TRY_AGAIN()),
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
