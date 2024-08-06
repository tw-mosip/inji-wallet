import {NativeModules} from 'react-native';

export class VcRenderer {
  static async replacePlaceholders(vc: Object, svgTemplate: string) {
    const InjiVcRenderer = NativeModules.InjiVcRenderer;
    const updatedTemplate = await InjiVcRenderer.replaceSvgTemplatePlaceholders(
      JSON.stringify(vc),
    );
    return updatedTemplate;
  }
}
