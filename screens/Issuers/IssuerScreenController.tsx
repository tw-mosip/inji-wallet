import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectIssuers,
} from '../../machines/issuersMachine';
import { useMachine, useSelector } from '@xstate/react';
import { ActorRefFrom } from 'xstate';

export function useIssuerScreenController({ route }) {
  const service = route.params.service;

  console.log('Inside useIssuersSCreen Controller', route);
  console.log('Inside useIssuersSCreen Controller service', service);
  const issuers = useSelector(service, selectIssuers);

  return {
    issuers,
    DOWNLOAD_VIA_ID: () => {
      console.log('IssuersScreenController DONWLOAD_VIA_ID');
      return service.send(IssuerScreenTabEvents.DOWNLOAD_VIA_ID());
    },
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
