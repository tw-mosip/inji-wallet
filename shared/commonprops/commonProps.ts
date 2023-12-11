import {configure} from '@iriscan/biometric-sdk-react-native';
import {changeCrendetialRegistry} from '../constants';
import {CACHED_API} from '../api';

export const COMMON_PROPS_KEY: string =
  'CommonPropsKey-' + '6964d04a-9268-11ed-a1eb-0242ac120002';

export default async function getAllConfigurations(host = undefined) {
  host && changeCrendetialRegistry(host);
  return await CACHED_API.getAllProperties();
}

let config = {
  withFace: {
    encoder: {
      tfModel: {
        path: 'https://api.dev3.mosip.net/inji/model.tflite',
        inputWidth: 160,
        inputHeight: 160,
        outputLength: 512,
        // optional
        modelChecksum: '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
      },
    },
    matcher: {
      threshold: 1.0,
    },
    liveness: {
      tfModel: {
        path: 'https://api.dev3.mosip.net/inji/liveness/model.tflite',
        inputWidth: 224,
        inputHeight: 224,
        // 0.0 - real, 1.0 - spoof
        threshold: 0.5,
        // optional
        // modelChecksum: "797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06",
      },
    },
  },
};

export async function downloadModel() {
  try {
    var injiProp = await getAllConfigurations();
    const maxRetryStr = injiProp.modelDownloadMaxRetry;
    const maxRetry = parseInt(maxRetryStr);
    const resp: string = injiProp != null ? injiProp.faceSdkModelUrl : null;
    if (resp != null) {
      console.log(resp)
      for (let counter = 0; counter < maxRetry; counter++) {
        var result = await configure(config);
        console.log('model download result is = ' + result);
        if (result) {
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export interface DownloadProps {
  maxDownloadLimit: number;
  downloadInterval: number;
}
