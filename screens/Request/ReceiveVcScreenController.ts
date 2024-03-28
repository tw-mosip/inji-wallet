import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIncomingVc,
  selectIsAccepting,
  selectIsDisplayingIncomingVC,
  selectIsIncomingVp,
  selectIsReviewingInIdle,
  selectIsSavingFailedInIdle,
  selectSenderInfo,
} from '../../machines/bleShare/request/selectors';
import {RequestEvents} from '../../machines/bleShare/request/requestMachine';

export function useReceiveVcScreen() {
  const {appService} = useContext(GlobalContext);
  const requestService = appService.children.get('request');

  return {
    senderInfo: useSelector(requestService, selectSenderInfo),
    incomingVc: useSelector(requestService, selectIncomingVc),

    isIncomingVp: useSelector(requestService, selectIsIncomingVp),
    isReviewingInIdle: useSelector(requestService, selectIsReviewingInIdle),
    isAccepting: useSelector(requestService, selectIsAccepting),
    isDisplayingIncomingVC: useSelector(
      requestService,
      selectIsDisplayingIncomingVC,
    ),
    isSavingFailedInIdle: useSelector(
      requestService,
      selectIsSavingFailedInIdle,
    ),

    GO_TO_RECEIVED_VC_TAB: () =>
      requestService.send(RequestEvents.GO_TO_RECEIVED_VC_TAB()),
    CANCEL: () => requestService.send(RequestEvents.CANCEL()),
    DISMISS: () => requestService.send(RequestEvents.DISMISS()),
    RESET: () => requestService.send(RequestEvents.RESET()),
  };
}
