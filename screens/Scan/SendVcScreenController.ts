import {ActorRef, ActorRefFrom} from 'xstate';
import {selectShareableVcsMetadata} from '../../machines/VCItemMachine/vc';
import {ExistingMosipVCItemMachine} from '../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {
  selectIsSelectingVc,
  selectReceiverInfo,
  selectSelectedVc,
  selectVcName,
} from '../../machines/bleShare/scan/selectors';
import {
  selectIsCancelling,
  selectIsInvalidIdentity,
  selectIsVerifyingIdentity,
} from '../../machines/bleShare/commonSelectors';
// import {VCShareFlowType} from '../../shared/Utils';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {IReactStuff} from '../../shared/interfaces/IReactStuff';
import {ScanMachineEvents} from "../../shared/interfaces/StateMachineEvents";
import {IPlatformDependentActions} from "../../shared/interfaces/IPlatformDependentActions";

export function useSendVcScreen(
  scanService: ActorRef<any, any>,
  vcService: ActorRef<any, any>,
  reactStuff: IReactStuff,
  platformDependentActions: IPlatformDependentActions
) {

  const CANCEL = () => scanService.send(ScanMachineEvents.CANCEL());

  // const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedIndex, setSelectedIndex] = reactStuff.useState<number>(null);

  return {
    selectedIndex,
    TOGGLE_USER_CONSENT: () =>
      scanService.send(ScanMachineEvents.TOGGLE_USER_CONSENT()),

    receiverInfo: reactStuff.useSelector(scanService, selectReceiverInfo),
    vcName: reactStuff.useSelector(scanService, selectVcName),
    selectedVc: reactStuff.useSelector(scanService, selectSelectedVc),

    isSelectingVc: reactStuff.useSelector(scanService, selectIsSelectingVc),
    isVerifyingIdentity: reactStuff.useSelector(
      scanService,
      selectIsVerifyingIdentity,
    ),
    isInvalidIdentity: reactStuff.useSelector(
      scanService,
      selectIsInvalidIdentity,
    ),
    isCancelling: reactStuff.useSelector(scanService, selectIsCancelling),
    isFaceVerificationConsent: platformDependentActions.isFaceVerificationConsent,

    CANCEL,
    ACCEPT_REQUEST: () => scanService.send(ScanMachineEvents.ACCEPT_REQUEST()),
    FACE_VERIFICATION_CONSENT: (isConsentGiven: boolean) =>
      scanService.send(ScanMachineEvents.FACE_VERIFICATION_CONSENT(isConsentGiven)),
    VERIFY_AND_ACCEPT_REQUEST: () =>
      scanService.send(ScanMachineEvents.VERIFY_AND_ACCEPT_REQUEST()),
    DISMISS: () => scanService.send(ScanMachineEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanMachineEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => scanService.send(ScanMachineEvents.FACE_VALID()),
    FACE_INVALID: () => scanService.send(ScanMachineEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => scanService.send(ScanMachineEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      platformDependentActions.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'})
    },

    // React Native stuff - return to this
    // shareableVcsMetadata: reactStuff.useSelector(
    //     vcService,
    //     selectShareableVcsMetadata,
    // ),
    SELECT_VC_ITEM: platformDependentActions.SELECT_VC_ITEM
  };
}

