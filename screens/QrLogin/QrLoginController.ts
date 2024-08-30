import {useSelector} from '@xstate/react';
import {useContext, useState} from 'react';
import {ActorRefFrom} from 'xstate';
import {QrLoginEvents} from '../../machines/QrLogin/QrLoginMachine';
import {
  selectClientName,
  selectErrorMessage,
  selectEssentialClaims,
  selectIsFaceVerificationConsent,
  selectIsInvalidIdentity,
  selectIsisVerifyingIdentity,
  selectIsLinkTransaction,
  selectIsloadMyVcs,
  selectIsRequestConsent,
  selectIsSendingAuthenticate,
  selectIsSendingConsent,
  selectIsSharing,
  selectIsShowError,
  selectIsShowingVcList,
  selectIsVerifyingSuccesful,
  selectIsWaitingForData,
  selectLinkTransactionResponse,
  selectLogoUrl,
  selectDomainName,
  selectVoluntaryClaims,
  selectCredential,
  selectVerifiableCredentialData,
  selectIsCheckFaceAuthConsent,
} from '../../machines/QrLogin/QrLoginSelectors';
import {selectBindedVcsMetadata} from '../../machines/VerifiableCredential/VCMetaMachine/VCMetaSelectors';
import {GlobalContext} from '../../shared/GlobalContext';
import {QrLoginProps} from './QrLogin';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootRouteProps} from '../../routes';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {VCItemMachine} from '../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

export function useQrLogin({service}: QrLoginProps) {
  const {appService} = useContext(GlobalContext);
  const service1 = appService.children.get('QrLogin')!!;
  const navigation = useNavigation<MyVcsTabNavigation>();

  const vcMetaService = appService.children.get('vcMeta')!!;
  const [selectedIndex, setSelectedIndex] = useState<number>(null);
  return {
    isFaceVerificationConsent: useSelector(
      service1,
      selectIsFaceVerificationConsent,
    ),
    linkTransactionResponse: useSelector(
      service1,
      selectLinkTransactionResponse,
    ),
    shareableVcsMetadata: useSelector(vcMetaService, selectBindedVcsMetadata),
    verifiableCredentialData: useSelector(
      service1,
      selectVerifiableCredentialData,
    ),
    domainName: useSelector(service1, selectDomainName),
    logoUrl: useSelector(service1, selectLogoUrl),
    essentialClaims: useSelector(service1, selectEssentialClaims),
    voluntaryClaims: useSelector(service1, selectVoluntaryClaims),
    clientName: useSelector(service1, selectClientName),
    error: useSelector(service1, selectErrorMessage),
    selectCredential: useSelector(service1, selectCredential),
    isWaitingForData: useSelector(service1, selectIsWaitingForData),
    isShowingVcList: useSelector(service1, selectIsShowingVcList),
    isLinkTransaction: useSelector(service1, selectIsLinkTransaction),
    isLoadingMyVcs: useSelector(service1, selectIsloadMyVcs),
    isRequestConsent: useSelector(service1, selectIsRequestConsent),
    isShowingError: useSelector(service1, selectIsShowError),
    isSendingAuthenticate: useSelector(service1, selectIsSendingAuthenticate),
    isSendingConsent: useSelector(service1, selectIsSendingConsent),
    isVerifyingIdentity: useSelector(service1, selectIsisVerifyingIdentity),
    isInvalidIdentity: useSelector(service1, selectIsInvalidIdentity),
    isVerifyingSuccesful: useSelector(service1, selectIsVerifyingSuccesful),
    isCheckFaceAuthConsent: useSelector(service1, selectIsCheckFaceAuthConsent),
    isShare: useSelector(service1, selectIsSharing),
    selectedIndex,
    SELECT_CONSENT: (value: boolean, claim: string) => {
      service1.send(QrLoginEvents.TOGGLE_CONSENT_CLAIM(value, claim));
    },
    SELECT_VC_ITEM:
      (index: number) => (vcRef: ActorRefFrom<typeof VCItemMachine>) => {
        setSelectedIndex(index);
        const vcData = vcRef.getSnapshot().context;
        service1.send(QrLoginEvents.SELECT_VC(vcData));
      },
    FACE_VERIFICATION_CONSENT: (isDoNotAskAgainChecked: boolean) =>
      service1.send(
        QrLoginEvents.FACE_VERIFICATION_CONSENT(isDoNotAskAgainChecked),
      ),
    DISMISS: () => service1.send(QrLoginEvents.DISMISS()),
    SCANNING_DONE: (qrCode: string) =>
      service1.send(QrLoginEvents.SCANNING_DONE(qrCode)),
    CONFIRM: () => service1.send(QrLoginEvents.CONFIRM()),
    VERIFY: () => service1.send(QrLoginEvents.VERIFY()),
    CANCEL: () => service1.send(QrLoginEvents.CANCEL()),
    FACE_VALID: () => service1.send(QrLoginEvents.FACE_VALID()),
    FACE_INVALID: () => service1.send(QrLoginEvents.FACE_INVALID()),
    RETRY_VERIFICATION: () => service1.send(QrLoginEvents.RETRY_VERIFICATION()),
    GO_TO_HOME: () => {
      navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    },
  };
}
