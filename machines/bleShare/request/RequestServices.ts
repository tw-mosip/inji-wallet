import {VerifierDataEvent} from '@mosip/tuvali/src/types/events';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  checkMultiple,
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';
import {androidVersion, isAndroid} from '../../../shared/constants';
import {subscribe} from '../../../shared/openIdBLE/verifierEventHandler';
import Storage from '../../../shared/storage';

export const RequestServices = (model, {verifier, EventTypes}) => ({
  disconnect: () => () => {
    try {
      verifier.disconnect();
    } catch (e) {
      // pass
    }
  },

  checkBluetoothService: () => callback => {
    const subscription = BluetoothStateManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        callback(model.events.BLUETOOTH_STATE_ENABLED());
      } else {
        callback(model.events.BLUETOOTH_STATE_DISABLED());
      }
    }, true);
    return () => subscription.remove();
  },

  requestBluetooth: () => callback => {
    BluetoothStateManager.requestToEnable()
      .then(() => callback(model.events.BLUETOOTH_STATE_ENABLED()))
      .catch(() => callback(model.events.BLUETOOTH_STATE_DISABLED()));
  },

  advertiseDevice: () => callback => {
    const openId4VpUri = verifier.startAdvertisement('OVPMOSIP');
    callback({type: 'ADV_STARTED', openId4VpUri});

    const statusCallback = (event: VerifierDataEvent) => {
      if (event.type === EventTypes.onSecureChannelEstablished) {
        callback({type: 'CONNECTED'});
      }
    };
    const subscription = subscribe(statusCallback);
    return () => subscription?.remove();
  },

  requestNearByDevicesPermission: () => callback => {
    requestMultiple([
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ])
      .then(response => {
        if (
          response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
            RESULTS.GRANTED &&
          response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED
        ) {
          callback(model.events.NEARBY_ENABLED());
        } else {
          callback(model.events.NEARBY_DISABLED());
        }
      })
      .catch(err => {
        callback(model.events.NEARBY_DISABLED());
      });
  },

  checkNearByDevicesPermission: () => callback => {
    if (isAndroid() && androidVersion >= 31) {
      const result = checkMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ])
        .then(response => {
          if (
            response[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] ===
              RESULTS.GRANTED &&
            response[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED
          ) {
            callback(model.events.NEARBY_ENABLED());
          } else {
            callback(model.events.NEARBY_DISABLED());
          }
        })
        .catch(err => {
          callback(model.events.NEARBY_DISABLED());
        });
    } else {
      callback(model.events.NEARBY_ENABLED());
    }
  },

  monitorConnection: () => callback => {
    const verifierErrorCodePrefix = 'TVV';
    const subscription = verifier.handleDataEvents(event => {
      if (event.type === EventTypes.onDisconnected) {
        callback({type: 'DISCONNECT'});
      }

      if (
        event.type === EventTypes.onError &&
        event.code.includes(verifierErrorCodePrefix)
      ) {
        callback({
          type: 'BLE_ERROR',
          bleError: {message: event.message, code: event.code},
        });
        console.error('BLE Exception: ' + event.message);
      }
    });

    return () => subscription.remove();
  },

  receiveVc: () => callback => {
    const statusCallback = (event: VerifierDataEvent) => {
      if (event.type === EventTypes.onDataReceived) {
        callback({type: 'VC_RECEIVED', vc: JSON.parse(event.data)});
      }
    };
    const subscription = subscribe(statusCallback);

    return () => subscription.remove();
  },

  sendVcResponse: (_context, _event, meta) => async () => {
    verifier.sendVerificationStatus(meta.data.status);
  },

  checkStorageAvailability: () => async () => {
    return Promise.resolve(Storage.isMinimumLimitReached('minStorageRequired'));
  },
});
