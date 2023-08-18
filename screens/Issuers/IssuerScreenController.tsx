import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectIssuers,
} from '../../machines/issuersMachine';
import { useMachine, useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';

export function useIssuerScreenController({ route }) {
  const service = route.params.service;

  const issuers = useSelector(service, selectIssuers);
  return {
    issuers,
    DOWNLOAD_ID: () => service.send(IssuerScreenTabEvents.DOWNLOAD_ID()),
    SELECTED_ISSUER: (id) =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
  };
}

export interface IssuerModalProps {
  service?: ActorRefFrom<typeof IssuersMachine>;
  onPress?: () => void;
  isVisible?: boolean;
}
