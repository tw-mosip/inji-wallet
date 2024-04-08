import {Linking} from 'react-native';
import {getDeviceNameSync} from 'react-native-device-info';
import {send} from 'xstate';
import {RECEIVED_VCS_STORE_KEY} from '../../../shared/constants';
import {getIdType} from '../../../shared/openId4VCI/Utils';
import {TelemetryConstants} from '../../../shared/telemetry/TelemetryConstants';
import {
  getEndEventData,
  getErrorEventData,
  getImpressionEventData,
  getStartEventData,
  sendEndEvent,
  sendErrorEvent,
  sendImpressionEvent,
  sendStartEvent,
} from '../../../shared/telemetry/TelemetryUtils';
import {VCMetadata} from '../../../shared/VCMetadata';
import {ActivityLogEvents} from '../../activityLog';
import {StoreEvents} from '../../store';
import {VcMetaEvents} from '../../VerifiableCredential/VCMetaMachine/VCMetaMachine';

export const RequestActions = (model, {verifier}) => ({
  openAppPermission: () => {
    Linking.openSettings();
  },

  setReadyForBluetoothStateCheck: model.assign({
    readyForBluetoothStateCheck: () => true,
  }),

  setIncomingVc: model.assign({
    incomingVc: (_context, event) => event.vc,
  }),

  setOpenID4VpUri: model.assign({
    openId4VpUri: (_context, event) => {
      return event.openId4VpUri;
    },
  }),

  setSenderInfo: model.assign({
    senderInfo: () => {
      return {name: 'Wallet', deviceName: 'Wallet', deviceId: ''};
    },
  }),

  setReceiverInfo: model.assign({
    receiverInfo: () => {
      return {name: 'Verifier', deviceName: 'Verifier', deviceId: ''};
    },
  }),

  setBleError: model.assign({
    bleError: (_context, event) => event.bleError,
  }),

  registerLoggers: model.assign({
    loggers: () => {
      if (__DEV__) {
        return [
          verifier.handleDataEvents(event => {
            console.log(
              getDeviceNameSync(),
              '<Receiver.Event>',
              JSON.stringify(event).slice(0, 100),
            );
          }),
        ];
      } else {
        return [];
      }
    },
  }),

  removeLoggers: model.assign({
    loggers: ({loggers}) => {
      loggers?.forEach(logger => logger.remove());
      return null;
    },
  }),

  prependReceivedVcMetadata: send(
    (context: any) => {
      if (context.incomingVc) {
        context.incomingVc.vcMetadata.timestamp = Date.now();
      }
      return StoreEvents.PREPEND(
        RECEIVED_VCS_STORE_KEY,
        VCMetadata.fromVC(context.incomingVc?.vcMetadata),
      );
    },
    {to: context => context.serviceRefs.store},
  ),

  removeReceivedVcMetadataFromStorage: send(
    (context: any) => {
      return StoreEvents.REMOVE_VC_METADATA(
        RECEIVED_VCS_STORE_KEY,
        VCMetadata.fromVC(context.incomingVc?.vcMetadata).getVcKey(),
      );
    },
    {to: context => context.serviceRefs.store},
  ),

  storeVc: send(
    (context: any) =>
      StoreEvents.SET(
        VCMetadata.fromVC(context.incomingVc?.vcMetadata).getVcKey(),
        context.incomingVc,
      ),
    {to: context => context.serviceRefs.store},
  ),

  setReceiveLogTypeRegular: model.assign({
    receiveLogType: 'VC_RECEIVED',
  }),

  setReceiveLogTypeVerified: model.assign({
    receiveLogType: 'VC_RECEIVED_WITH_PRESENCE_VERIFIED',
  }),

  setReceiveLogTypeUnverified: model.assign({
    receiveLogType: 'VC_RECEIVED_BUT_PRESENCE_VERIFICATION_FAILED',
  }),

  setReceiveLogTypeDiscarded: model.assign({
    receiveLogType: 'VC_RECEIVED_NOT_SAVED',
  }),

  logReceived: send(
    (context: any) => {
      const vcMetadata = VCMetadata.fromVC(context.incomingVc?.vcMetadata);
      return ActivityLogEvents.LOG_ACTIVITY({
        _vcKey: vcMetadata.getVcKey(),
        type: context.receiveLogType,
        id: vcMetadata.id,
        idType: getIdType(vcMetadata.issuer),
        timestamp: Date.now(),
        deviceName: context.senderInfo.name || context.senderInfo.deviceName,
        vcLabel: vcMetadata.id,
      });
    },
    {to: context => context.serviceRefs.activityLog},
  ),

  sendVcReceived: send(VcMetaEvents.REFRESH_RECEIVED_VCS(), {
    to: (context: any) => context.serviceRefs.vcMeta,
  }),

  sendVCReceivingStartEvent: () => {
    sendStartEvent(
      getStartEventData(TelemetryConstants.FlowType.receiverVcShare),
    );
    sendImpressionEvent(
      getImpressionEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.Screens.sharingInProgressScreen,
      ),
    );
  },

  sendVCReceiveFlowTimeoutEndEvent: () => {
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
        {comment: 'VC sharing timeout'},
      ),
    );
  },

  sendVCReceiveSuccessEvent: () => {
    sendImpressionEvent(
      getImpressionEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.Screens.vcReceivedSuccessPage,
      ),
    );
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.success,
      ),
    );
  },

  sendVCReceiveFailedEvent: () => {
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
      ),
    );
  },

  sendBLEConnectionErrorEvent: (_, event) => {
    sendErrorEvent(
      getErrorEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        event.bleError.code,
        event.bleError.message,
      ),
    );
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
      ),
    );
  },

  sendVCReceiveRejectedEvent: () => {
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
        {comment: 'VC Rejected by the verifier'},
      ),
    );
  },

  sendVCReceivingTerminatedEvent: () => {
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
        {comment: 'Verifier Disconnected'},
      ),
    );
  },

  sendVCReceivingDisconnectedEvent: () => {
    sendEndEvent(
      getEndEventData(
        TelemetryConstants.FlowType.receiverVcShare,
        TelemetryConstants.EndEventStatus.failure,
        {comment: 'VC Sharing cancelled by sender'},
      ),
    );
  },
});
