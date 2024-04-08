import {DeviceInfo} from '../../../components/DeviceInfoList';
import {VCMetadata} from '../../../shared/VCMetadata';
import {VC} from '../../VerifiableCredential/VCMetaMachine/vc';
import {BLEError} from '../types';

export const RequestEvents = {
  ACCEPT: () => ({}),
  ACCEPT_AND_VERIFY: () => ({}),
  GO_TO_RECEIVED_VC_TAB: () => ({}),
  REJECT: () => ({}),
  CANCEL: () => ({}),
  RESET: () => ({}),
  DISMISS: () => ({}),
  VC_RECEIVED: (vc: VC) => ({vc}),
  ADV_STARTED: (openId4VpUri: string) => ({openId4VpUri}),
  CONNECTED: () => ({}),
  DISCONNECT: () => ({}),
  BLE_ERROR: (bleError: BLEError) => ({bleError}),
  EXCHANGE_DONE: (senderInfo: DeviceInfo) => ({senderInfo}),
  SCREEN_FOCUS: () => ({}),
  SCREEN_BLUR: () => ({}),
  BLUETOOTH_STATE_ENABLED: () => ({}),
  BLUETOOTH_STATE_DISABLED: () => ({}),
  NEARBY_ENABLED: () => ({}),
  NEARBY_DISABLED: () => ({}),
  STORE_READY: () => ({}),
  STORE_RESPONSE: (response: unknown) => ({response}),
  STORE_ERROR: (error: Error) => ({error}),
  RECEIVE_DEVICE_INFO: (info: DeviceInfo) => ({info}),
  RECEIVED_VCS_UPDATED: () => ({}),
  VC_RESPONSE: (vcMetadatas: VCMetadata[]) => ({vcMetadatas}),
  GOTO_SETTINGS: () => ({}),
  APP_ACTIVE: () => ({}),
  FACE_VALID: () => ({}),
  FACE_INVALID: () => ({}),
  RETRY_VERIFICATION: () => ({}),
  GOTO_HOME: () => ({}),
};
