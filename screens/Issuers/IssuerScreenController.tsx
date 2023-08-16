import {
  IssuerScreenTabEvents,
  IssuersMachine,
  selectIsPerformAuthorization,
  selectIssuers,
} from '../../machines/issuersMachine';
import { useMachine, useSelector } from '@xstate/react';
import { MyVcsTabEvents, MyVcsTabMachine } from '../Home/MyVcsTabMachine';

export function useIssuerScreenController() {
  const [, , service] = useMachine(IssuersMachine);

  const isPerformingAuthorization = useSelector(
    service,
    selectIsPerformAuthorization
  );
  const issuers = useSelector(service, selectIssuers);

  return {
    issuers,
    isPerformingAuthorization,
    DOWNLOAD_VIA_ID: () => {
      console.log('IssuersScreenController DONWLOAD_VIA_ID');
      return service.send(IssuerScreenTabEvents.DOWNLOAD_VIA_ID());
    },
    SELECTED_ISSUER: (id) =>
      service.send(IssuerScreenTabEvents.SELECTED_ISSUER(id)),
    DISMISS: () => service.send(IssuerScreenTabEvents.DISMISS()),
  };
}
