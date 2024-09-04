import React, {useRef} from 'react';
import {Overlay} from 'react-native-elements';
import {Column, Row, Centered, Button, Text} from './ui';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Theme} from './ui/styleUtils';
import {useTranslation} from 'react-i18next';
import testIDProps from '../shared/commonUtil';
import {ShareOptions} from 'react-native-share';
import {shareImageToAllSupportedApps} from '../shared/sharing/imageUtils';

interface ExpandedQrCodeOverlayProps {
  isVisible: boolean;
  toggleOverlay: () => void;
  qrString: string;
  onQRError: (error: Error) => void;
}

export const ExpandedQrCodeOverlay: React.FC<ExpandedQrCodeOverlayProps> = ({
  isVisible,
  toggleOverlay,
  qrString,
  onQRError,
}) => {
  const {t} = useTranslation('VcDetails');
  let qrRef = useRef(null);
  const base64ImageType = 'data:image/png;base64,';

  async function shareImage(base64String: string) {
    const options: ShareOptions = {
      url: base64String,
    };
    const shareStatus = await shareImageToAllSupportedApps(options);
    if (!shareStatus) {
      console.error('Error while sharing QR code::');
    }
  }

  function handleShareQRCodePress() {
    qrRef.current.toDataURL(dataURL => {
      shareImage(`${base64ImageType}${dataURL}`);
    });
  }

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={toggleOverlay}
      overlayStyle={{padding: 1, borderRadius: 21}}>
      <Column style={Theme.QrCodeStyles.expandedQrCode}>
        <Row pY={20} style={Theme.QrCodeStyles.QrCodeHeader}>
          <Text
            testID="qrCodeHeader"
            align="center"
            style={Theme.TextStyles.header}
            weight="bold">
            {t('qrCodeHeader')}
          </Text>
          <Icon
            testID="qrCodeCloseIcon"
            name="close"
            onPress={toggleOverlay}
            color={Theme.Colors.Details}
            size={32}
          />
        </Row>
        <Centered testID="qrCodeDetails" pY={30}>
          <QRCode
            {...testIDProps('qrCodeExpandedView')}
            size={300}
            value={qrString}
            backgroundColor={Theme.Colors.QRCodeBackgroundColor}
            ecl="L"
            quietZone={10}
            onError={onQRError}
            getRef={data => (qrRef.current = data)}
          />
          <Button
            testID="share"
            styles={Theme.QrCodeStyles.shareQrCodeButton}
            title={t('shareQRCode')}
            type="gradient"
            icon={<Icon name="share-variant-outline" size={24} color="white" />}
            onPress={handleShareQRCodePress}
          />
        </Centered>
      </Column>
    </Overlay>
  );
};
