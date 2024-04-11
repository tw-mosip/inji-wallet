import {useSelector} from '@xstate/react';
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {selectShareableVcsMetadata} from '../../machines/VerifiableCredential/VCMetaMachine/VCMetaMachine';
import {GlobalContext} from '../../shared/GlobalContext';
import {
  selectIsInvalid,
  selectIsLocationDenied,
  selectIsLocationDisabled,
  selectIsQrLoginStoring,
  selectIsScanning,
  selectIsShowQrLogin,
  selectQrLoginRef,
} from '../../machines/bleShare/scan/selectors';
import {
  selectIsBluetoothDenied,
  selectIsBluetoothPermissionDenied,
  selectIsNearByDevicesPermissionDenied,
  selectIsStartPermissionCheck,
  selectReadyForBluetoothStateCheck,
} from '../../machines/bleShare/commonSelectors';
import {selectIsMinimumStorageRequiredForAuditEntryLimitReached} from '../../machines/bleShare/scan/scanMachine';
import {BOTTOM_TAB_ROUTES} from '../../routes/routesConstants';
import {MainBottomTabParamList} from '../../routes/main';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ScanEvents} from '../../machines/bleShare/scan/ScanModel';

export function useScanScreen() {
  const {t} = useTranslation('ScanScreen');
  const {appService} = useContext(GlobalContext);
  const scanService = appService.children.get('scan')!!;
  const vcMetaService = appService.children.get('vcMeta')!!;

  const shareableVcsMetadata = useSelector(
    vcMetaService,
    selectShareableVcsMetadata,
  );

  const isLocationDisabled = useSelector(scanService, selectIsLocationDisabled);
  const isLocationDenied = useSelector(scanService, selectIsLocationDenied);
  const isReadyForBluetoothStateCheck = useSelector(
    scanService,
    selectReadyForBluetoothStateCheck,
  );
  const isStartPermissionCheck = useSelector(
    scanService,
    selectIsStartPermissionCheck,
  );
  const isNearByDevicesPermissionDenied = useSelector(
    scanService,
    selectIsNearByDevicesPermissionDenied,
  );
  const isBluetoothPermissionDenied = useSelector(
    scanService,
    selectIsBluetoothPermissionDenied,
  );
  const isBluetoothDenied = useSelector(scanService, selectIsBluetoothDenied);
  const locationError = {message: '', button: ''};
  const isMinimumStorageRequiredForAuditEntryLimitReached = useSelector(
    scanService,
    selectIsMinimumStorageRequiredForAuditEntryLimitReached,
  );

  if (isLocationDisabled) {
    locationError.message = t('errors.locationDisabled.message');
    locationError.button = t('errors.locationDisabled.button');
  } else if (isLocationDenied) {
    locationError.message = t('errors.locationDenied.message');
    locationError.button = t('errors.locationDenied.button');
  }
  type ScanScreenNavigation = NavigationProp<MainBottomTabParamList>;
  const navigation = useNavigation<ScanScreenNavigation>();
  const GOTO_HOME = () => navigation.navigate(BOTTOM_TAB_ROUTES.home);
  return {
    locationError,
    isEmpty: !shareableVcsMetadata.length,
    isBluetoothPermissionDenied,
    isNearByDevicesPermissionDenied,
    isLocationDisabled,
    isLocationDenied,
    isBluetoothDenied,
    isStartPermissionCheck,
    isReadyForBluetoothStateCheck,
    isMinimumStorageRequiredForAuditEntryLimitReached,
    isScanning: useSelector(scanService, selectIsScanning),
    selectIsInvalid: useSelector(scanService, selectIsInvalid),
    isQrLogin: useSelector(scanService, selectIsShowQrLogin),
    isQrLoginstoring: useSelector(scanService, selectIsQrLoginStoring),
    isQrRef: useSelector(scanService, selectQrLoginRef),
    LOCATION_REQUEST: () => scanService.send(ScanEvents.LOCATION_REQUEST()),
    GOTO_SETTINGS: () => scanService.send(ScanEvents.GOTO_SETTINGS()),
    DISMISS: () => scanService.send(ScanEvents.DISMISS()),
    START_PERMISSION_CHECK: () =>
      scanService.send(ScanEvents.START_PERMISSION_CHECK()),
    SCAN: (qrCode: string) => scanService.send(ScanEvents.SCAN(qrCode)),
    GOTO_HOME,
  };
}
