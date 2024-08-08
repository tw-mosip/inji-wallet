import {NativeModules} from 'react-native';

export class VcRenderer {
  static async renderSvg(vc: Object) {
    const InjiVcRenderer = NativeModules.InjiVcRenderer;
    const updatedTemplate = await InjiVcRenderer.renderSvg(JSON.stringify(vc));
    return updatedTemplate;
  }
}
