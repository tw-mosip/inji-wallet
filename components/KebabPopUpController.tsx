import {useSelector} from '@xstate/react';
import {ActorRefFrom} from 'xstate';
import {
  selectAcceptingBindingOtp,
  selectBindingAuthFailedError,
  selectBindingWarning,
  selectIsCommunicationDetails,
  selectIsPinned,
  selectKebabPopUp,
  selectRemoveWalletWarning,
  selectShowActivities,
  selectWalletBindingResponse,
  selectShowWalletBindingError,
  selectWalletBindingInProgress,
} from '../machines/VCItemMachine/VCItemSelectors';
import {selectActivities} from '../machines/activityLog';
import {GlobalContext} from '../shared/GlobalContext';
import {useContext} from 'react';
import {VCMetadata} from '../shared/VCMetadata';
import {ScanEvents} from '../machines/bleShare/scan/scanMachine';
import {BOTTOM_TAB_ROUTES, ScanStackParamList} from '../routes/routesConstants';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {MainBottomTabParamList} from '../routes/main';
import {selectIsScanning} from '../machines/bleShare/scan/selectors';
import {
  VCItemEvents,
  VCItemMachine,
} from '../machines/VCItemMachine/VCItemMachine';
import {selectError} from '../machines/biometrics';

type ScanLayoutNavigation = NavigationProp<
  ScanStackParamList & MainBottomTabParamList
>;

export function useKebabPopUp(props) {
  const service = props.service as ActorRefFrom<typeof VCItemMachine>;
  const navigation = useNavigation<ScanLayoutNavigation>();
  const vcEvents = VCItemEvents;
  const {appService} = useContext(GlobalContext);
  const activityLogService = appService.children.get('activityLog')!!;
  const scanService = appService.children.get('scan')!!;

  return {
    service: props.service as ActorRefFrom<typeof VCItemMachine>,
    navigation: useNavigation<ScanLayoutNavigation>(),
    vcEvents: VCItemEvents,
    isScanning: useSelector(scanService, selectIsScanning),
    activities: useSelector(activityLogService, selectActivities),
    isPinned: useSelector(service, selectIsPinned),
    isBindingWarning: useSelector(service, selectBindingWarning),
    isRemoveWalletWarning: useSelector(service, selectRemoveWalletWarning),
    isAcceptingOtpInput: useSelector(service, selectAcceptingBindingOtp),
    isWalletBindingError: useSelector(service, selectShowWalletBindingError),
    walletBindingResponse: useSelector(service, selectWalletBindingResponse),
    otpError: useSelector(service, selectError),
    walletBindingError: useSelector(service, selectError),
    bindingAuthFailedError: useSelector(service, selectBindingAuthFailedError),
    isKebabPopUp: useSelector(service, selectKebabPopUp),
    isShowActivities: useSelector(service, selectShowActivities),
    communicationDetails: useSelector(service, selectIsCommunicationDetails),
    walletBindingInProgress: useSelector(
      service,
      selectWalletBindingInProgress,
    ),
    PIN_CARD: () => service.send(vcEvents.PIN_CARD()),
    KEBAB_POPUP: () => service.send(vcEvents.KEBAB_POPUP()),
    ADD_WALLET_BINDING_ID: () => service.send(vcEvents.ADD_WALLET_BINDING_ID()),
    CONFIRM: () => service.send(vcEvents.CONFIRM()),
    REMOVE: (vcMetadata: VCMetadata) =>
      service.send(vcEvents.REMOVE(vcMetadata)),
    DISMISS: () => service.send(vcEvents.DISMISS()),
    CANCEL: () => service.send(vcEvents.CANCEL()),
    SHOW_ACTIVITY: () => service.send(vcEvents.SHOW_ACTIVITY()),
    INPUT_OTP: (otp: string) => service.send(vcEvents.INPUT_OTP(otp)),
    RESEND_OTP: () => service.send(vcEvents.RESEND_OTP()),
    GOTO_SCANSCREEN: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.share);
    },
    SELECT_VC_ITEM: (
      vcRef: ActorRefFrom<typeof VCItemMachine>,
      flowType: string,
    ) => {
      const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
      scanService.send(ScanEvents.SELECT_VC(vcData, flowType));
    },
  };
}
