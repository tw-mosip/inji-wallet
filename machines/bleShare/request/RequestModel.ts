import {EmitterSubscription} from 'react-native';
import {createModel} from 'xstate/lib/model';
import {DeviceInfo} from '../../../components/DeviceInfoList';
import {AppServices} from '../../../shared/GlobalContext';
import {VC} from '../../VerifiableCredential/VCMetaMachine/vc';
import {ActivityLogType} from '../../activityLog';
import {BLEError} from '../types';
import {RequestEvents} from './RequestEvents';

export const RequestModel = createModel(
  {
    serviceRefs: {} as AppServices,
    senderInfo: {} as DeviceInfo,
    receiverInfo: {} as DeviceInfo,
    incomingVc: {} as VC,
    openId4VpUri: '',
    bleError: {} as BLEError,
    loggers: [] as EmitterSubscription[],
    receiveLogType: '' as ActivityLogType,
    readyForBluetoothStateCheck: false,
  },
  {
    events: RequestEvents,
  },
);
