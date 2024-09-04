import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import {SvgImage} from './ui/svg';
import {NativeModules} from 'react-native';
import {VerifiableCredential} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {DEFAULT_ECL, MAX_QR_DATA_LENGTH} from '../shared/constants';
import {VCMetadata} from '../shared/VCMetadata';
import {shareImageToAllSupportedApps} from '../shared/sharing/imageUtils';
import {ShareOptions} from 'react-native-share';
import {ExpandedQrCodeOverlay} from './ExpandedQrCodeView';

export const QrCodeOverlay: React.FC<QrCodeOverlayProps> = props => {
  const {RNPixelpassModule} = NativeModules;
  const {t} = useTranslation('VcDetails');
  const [qrString, setQrString] = useState('');
  const [qrError, setQrError] = useState(false);

  async function getQRData(): Promise<string> {
    let qrData: string;
    try {
      qrData = await RNSecureKeyStore.get(props.meta.id);
    } catch {
      qrData = await RNPixelpassModule.generateQRData(
        JSON.stringify(props.verifiableCredential),
        '',
      );
      await RNSecureKeyStore.set(props.meta.id, qrData, {
        accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      });
    }
    return qrData;
  }

  function onQRError() {
    console.warn('Data is too big');
    setQrError(true);
  }

  useEffect(() => {
    (async () => {
      const qrData = await getQRData();
      if (qrData?.length < MAX_QR_DATA_LENGTH) {
        setQrString(qrData);
      } else {
        setQrError(true);
      }
    })();
  }, []);
  const [isQrOverlayVisible, setIsQrOverlayVisible] = useState(false);

  const toggleQrOverlay = () => setIsQrOverlayVisible(!isQrOverlayVisible);
  return (
    qrString != '' &&
    !qrError && (
      <React.Fragment>
        <View testID="qrCodeView" style={Theme.QrCodeStyles.QrView}>
          <Pressable
            {...testIDProps('qrCodePressable')}
            accessible={false}
            onPress={toggleQrOverlay}>
            <QRCode
              {...testIDProps('qrCode')}
              size={72}
              value={qrString}
              backgroundColor={Theme.Colors.QRCodeBackgroundColor}
              ecl={DEFAULT_ECL}
              onError={onQRError}
            />
            <View
              testID="magnifierZoom"
              style={[Theme.QrCodeStyles.magnifierZoom]}>
              {SvgImage.MagnifierZoom()}
            </View>
          </Pressable>
        </View>
        <ExpandedQrCodeOverlay
          isVisible={isQrOverlayVisible}
          toggleOverlay={toggleQrOverlay}
          qrString={qrString}
          onQRError={onQRError}
        />
      </React.Fragment>
    )
  );
};

interface QrCodeOverlayProps {
  verifiableCredential: VerifiableCredential;
  meta: VCMetadata;
}
