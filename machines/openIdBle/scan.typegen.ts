// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  'internalEvents': {
    '': { type: '' };
    'done.invoke.QrLogin': {
      type: 'done.invoke.QrLogin';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.scan.reviewing.creatingVp:invocation[0]': {
      type: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#scan.connecting.inProgress';
    };
    'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo': {
      type: 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    };
    'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection': {
      type: 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    };
    'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress': {
      type: 'xstate.after(SHARING_TIMEOUT)#scan.reviewing.sendingVc.inProgress';
    };
    'xstate.init': { type: 'xstate.init' };
    'xstate.stop': { type: 'xstate.stop' };
  };
  'invokeSrcNameMap': {
    checkBluetoothPermission: 'done.invoke.scan.checkBluetoothPermission.checking:invocation[0]';
    checkBluetoothState:
      | 'done.invoke.scan.checkBluetoothState.checking:invocation[0]'
      | 'done.invoke.scan.recheckBluetoothState.checking:invocation[0]';
    checkLocationPermission: 'done.invoke.scan.checkingLocationService.checkingPermission:invocation[0]';
    checkLocationStatus: 'done.invoke.scan.checkingLocationService.checkingStatus:invocation[0]';
    checkNearByDevicesPermission: 'done.invoke.scan.checkNearbyDevicesPermission.checking:invocation[0]';
    createVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    disconnect: 'done.invoke.scan.clearingConnection:invocation[0]';
    discoverDevice: 'done.invoke.scan.connecting:invocation[0]';
    exchangeDeviceInfo: 'done.invoke.scan.exchangingDeviceInfo:invocation[0]';
    monitorConnection: 'done.invoke.scan:invocation[0]';
    requestBluetooth: 'done.invoke.scan.checkBluetoothState.requesting:invocation[0]';
    requestNearByDevicesPermission: 'done.invoke.scan.checkNearbyDevicesPermission.requesting:invocation[0]';
    sendDisconnect: 'done.invoke.scan.reviewing.cancelling:invocation[0]';
    sendVc: 'done.invoke.scan.reviewing.sendingVc:invocation[0]';
  };
  'missingImplementations': {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  'eventsCausingActions': {
    clearCreatedVp:
      | ''
      | 'BLE_ERROR'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    clearReason:
      | ''
      | 'BLE_ERROR'
      | 'DISCONNECT'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'SCREEN_FOCUS'
      | 'xstate.stop';
    clearScannedQrParams:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    logFailedVerification: 'FACE_INVALID';
    logShared: 'VC_ACCEPTED';
    openAppPermission: 'GOTO_SETTINGS';
    openBluetoothSettings: 'GOTO_SETTINGS';
    openSettings: 'LOCATION_REQUEST';
    registerLoggers:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    removeLoggers:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'SCREEN_BLUR'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection'
      | 'xstate.init';
    requestSenderInfo: 'SCAN';
    requestToEnableLocation: 'LOCATION_DISABLED' | 'LOCATION_REQUEST';
    resetShouldVerifyPresence: 'CANCEL' | 'EXCHANGE_DONE';
    sendScanData: 'SCAN';
    setChildRef:
      | 'CONNECTION_DESTROYED'
      | 'DISMISS'
      | 'xstate.after(DESTROY_TIMEOUT)#scan.clearingConnection';
    setConnectionParams: 'SCAN';
    setCreatedVp: 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
    setLinkCode: 'SCAN';
    setReadyForBluetoothStateCheck: 'BLUETOOTH_PERMISSION_ENABLED';
    setReason: 'UPDATE_REASON';
    setReceiverInfo: 'EXCHANGE_DONE';
    setScannedQrParams: 'SCAN';
    setSelectedVc: 'SELECT_VC';
    setSenderInfo: 'RECEIVE_DEVICE_INFO';
    setShareLogTypeUnverified: 'ACCEPT_REQUEST';
    setShareLogTypeVerified: 'FACE_VALID';
    storeLoginItem: 'done.invoke.QrLogin';
    storingActivityLog: 'STORE_RESPONSE';
    toggleShouldVerifyPresence: 'TOGGLE_USER_CONSENT';
  };
  'eventsCausingDelays': {
    CONNECTION_TIMEOUT:
      | 'CONNECTED'
      | 'RECEIVE_DEVICE_INFO'
      | 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    DESTROY_TIMEOUT: '' | 'DISMISS' | 'LOCATION_ENABLED';
    SHARING_TIMEOUT:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
  };
  'eventsCausingGuards': {
    isIOS: 'START_PERMISSION_CHECK';
    isQrLogin: 'SCAN';
    isQrOffline: 'SCAN';
    isQrOnline: 'SCAN';
    uptoAndroid11: '' | 'START_PERMISSION_CHECK';
  };
  'eventsCausingServices': {
    QrLogin: 'SCAN';
    checkBluetoothPermission: '' | 'NEARBY_ENABLED' | 'START_PERMISSION_CHECK';
    checkBluetoothState: '' | 'APP_ACTIVE';
    checkLocationPermission: 'APP_ACTIVE' | 'LOCATION_ENABLED';
    checkLocationStatus: '';
    checkNearByDevicesPermission: 'APP_ACTIVE' | 'START_PERMISSION_CHECK';
    createVp: never;
    disconnect: '' | 'DISMISS' | 'LOCATION_ENABLED';
    discoverDevice: 'RECEIVE_DEVICE_INFO';
    exchangeDeviceInfo:
      | 'CONNECTED'
      | 'xstate.after(CONNECTION_TIMEOUT)#scan.exchangingDeviceInfo';
    monitorConnection: 'xstate.init';
    requestBluetooth: 'BLUETOOTH_STATE_DISABLED';
    requestNearByDevicesPermission: 'NEARBY_DISABLED';
    sendDisconnect: 'CANCEL';
    sendVc:
      | 'ACCEPT_REQUEST'
      | 'FACE_VALID'
      | 'done.invoke.scan.reviewing.creatingVp:invocation[0]';
  };
  'matchesStates':
    | 'bluetoothDenied'
    | 'bluetoothPermissionDenied'
    | 'checkBluetoothPermission'
    | 'checkBluetoothPermission.checking'
    | 'checkBluetoothPermission.enabled'
    | 'checkBluetoothState'
    | 'checkBluetoothState.checking'
    | 'checkBluetoothState.enabled'
    | 'checkBluetoothState.requesting'
    | 'checkNearbyDevicesPermission'
    | 'checkNearbyDevicesPermission.checking'
    | 'checkNearbyDevicesPermission.enabled'
    | 'checkNearbyDevicesPermission.requesting'
    | 'checkingLocationService'
    | 'checkingLocationService.checkingPermission'
    | 'checkingLocationService.checkingStatus'
    | 'checkingLocationService.denied'
    | 'checkingLocationService.disabled'
    | 'checkingLocationService.requestingToEnable'
    | 'clearingConnection'
    | 'connecting'
    | 'connecting.inProgress'
    | 'connecting.timeout'
    | 'disconnected'
    | 'exchangingDeviceInfo'
    | 'exchangingDeviceInfo.inProgress'
    | 'exchangingDeviceInfo.timeout'
    | 'findingConnection'
    | 'handlingBleError'
    | 'inactive'
    | 'invalid'
    | 'nearByDevicesPermissionDenied'
    | 'preparingToConnect'
    | 'recheckBluetoothState'
    | 'recheckBluetoothState.checking'
    | 'recheckBluetoothState.enabled'
    | 'reviewing'
    | 'reviewing.accepted'
    | 'reviewing.cancelling'
    | 'reviewing.creatingVp'
    | 'reviewing.invalidIdentity'
    | 'reviewing.navigatingToHome'
    | 'reviewing.rejected'
    | 'reviewing.selectingVc'
    | 'reviewing.sendingVc'
    | 'reviewing.sendingVc.inProgress'
    | 'reviewing.sendingVc.sent'
    | 'reviewing.sendingVc.timeout'
    | 'reviewing.verifyingIdentity'
    | 'showQrLogin'
    | 'showQrLogin.idle'
    | 'showQrLogin.navigatingToHome'
    | 'showQrLogin.storing'
    | 'startPermissionCheck'
    | {
        checkBluetoothPermission?: 'checking' | 'enabled';
        checkBluetoothState?: 'checking' | 'enabled' | 'requesting';
        checkNearbyDevicesPermission?: 'checking' | 'enabled' | 'requesting';
        checkingLocationService?:
          | 'checkingPermission'
          | 'checkingStatus'
          | 'denied'
          | 'disabled'
          | 'requestingToEnable';
        connecting?: 'inProgress' | 'timeout';
        exchangingDeviceInfo?: 'inProgress' | 'timeout';
        recheckBluetoothState?: 'checking' | 'enabled';
        reviewing?:
          | 'accepted'
          | 'cancelling'
          | 'creatingVp'
          | 'invalidIdentity'
          | 'navigatingToHome'
          | 'rejected'
          | 'selectingVc'
          | 'sendingVc'
          | 'verifyingIdentity'
          | { sendingVc?: 'inProgress' | 'sent' | 'timeout' };
        showQrLogin?: 'idle' | 'navigatingToHome' | 'storing';
      };
  'tags': never;
}
