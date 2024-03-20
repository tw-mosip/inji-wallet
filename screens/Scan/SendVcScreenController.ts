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
import {
  ScanEvents,
  scanMachine,
  selectIsFaceVerificationConsent,
} from '../../machines/bleShare/scan/scanMachine';
import {VCShareFlowType} from '../../shared/Utils';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {IReactStuff} from '../../shared/interfaces/IReactStuff';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

export function useSendVcScreen(
  scanService: ActorRef<any, any>,
  vcService: ActorRef<any, any>,
  reactStuff: IReactStuff,
) {
  const navigation = useNavigation<MyVcsTabNavigation>();

  const CANCEL = () => scanService.send(ScanEvents.CANCEL());

  // const [selectedIndex, setSelectedIndex] = useState<number>(null);
  const [selectedIndex, setSelectedIndex] = reactStuff.useState<number>(null);

  return {
    selectedIndex,
    TOGGLE_USER_CONSENT: () =>
      scanService.send(ScanEvents.TOGGLE_USER_CONSENT()),
    SELECT_VC_ITEM:
      (index: number) =>
      (vcRef: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => {
        setSelectedIndex(index);
        const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
        scanService.send(
          ScanEvents.SELECT_VC(vcData, VCShareFlowType.SIMPLE_SHARE),
        );
      },

    receiverInfo: reactStuff.useSelector(scanService, selectReceiverInfo),
    vcName: reactStuff.useSelector(scanService, selectVcName),
    shareableVcsMetadata: reactStuff.useSelector(
      vcService,
      selectShareableVcsMetadata,
    ),
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
    isFaceVerificationConsent: reactStuff.useSelector(
      scanService,
      selectIsFaceVerificationConsent,
    ),

    CANCEL,
    ACCEPT_REQUEST: () => scanService.send(ScanEvents.ACCEPT_REQUEST()),
    FACE_VERIFICATION_CONSENT: (isConsentGiven: boolean) =>
      scanService.send(ScanEvents.FACE_VERIFICATION_CONSENT(isConsentGiven)),
    VERIFY_AND_ACCEPT_REQUEST: () =>
      scanService.send(ScanEvents.VERIFY_AND_ACCEPT_REQUEST()),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    UPDATE_VC_NAME: (vcName: string) =>
      scanService.send(ScanEvents.UPDATE_VC_NAME(vcName)),
    FACE_VALID: () => scanService.send(ScanEvents.FACE_VALID()),
    FACE_INVALID: () => scanService.send(ScanEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => scanService.send(ScanEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
  };
}
