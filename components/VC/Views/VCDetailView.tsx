import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  ImageBackground,
  NativeModules,
  View,
} from 'react-native';
import {
  Credential,
  VerifiableCredential,
  WalletBindingResponse,
} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import {Button, Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {QrCodeOverlay} from '../../QrCodeOverlay';
import {SvgImage} from '../../ui/svg';
import {isActivationNeeded} from '../../../shared/openId4VCI/Utils';
import {
  BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS,
  DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
  fieldItemIterator,
  getBackgroundColour,
  getBackgroundImage,
  getTextColor,
} from '../common/VCUtils';
import {ProfileIcon} from '../../ProfileIcon';
import {SvgCss} from 'react-native-svg';
import {ExpandedQrCodeOverlay} from '../../ExpandedQrCodeView';
import {MAX_QR_DATA_LENGTH} from '../../../shared/constants';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';

const getProfileImage = (face: any) => {
  if (face) {
    return (
      <Image source={{uri: face}} style={Theme.Styles.detailedViewImage} />
    );
  }
  return (
    <ProfileIcon
      profileIconContainerStyles={Theme.Styles.openCardProfileIconContainer}
      profileIconSize={40}
    />
  );
};

export const VCDetailView: React.FC<VCItemDetailsProps> = props => {
  const {t, i18n} = useTranslation('VcDetails');
  const logo = props.verifiableCredentialData.issuerLogo;
  const face = props.verifiableCredentialData.face;
  const verifiableCredential = props.credential;
  const svgImage = props.svgImage;
  const {RNPixelpassModule} = NativeModules;

  const shouldShowHrLine = verifiableCredential => {
    const availableFieldNames = Object.keys(
      verifiableCredential?.credentialSubject,
    );

    for (const fieldName of availableFieldNames) {
      if (
        BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS.includes(fieldName)
      ) {
        return true;
      }
    }

    return false;
  };

  const {width: deviceWidth} = Dimensions.get('window');

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

  const [qrString, setQrString] = useState('');
  const [qrError, setQrError] = useState(false);

  async function getQRData(): Promise<string> {
    let qrData: string;
    try {
      qrData = await RNSecureKeyStore.get(
        props.verifiableCredentialData.vcMetadata.id,
      );
    } catch {
      qrData = await RNPixelpassModule.generateQRData(
        JSON.stringify(verifiableCredential),
        '',
      );
      await RNSecureKeyStore.set(
        props.verifiableCredentialData.vcMetadata.id,
        qrData,
        {
          accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
        },
      );
    }
    return qrData;
  }

  function onQRError() {
    console.warn('Data is too big');
    setQrError(true);
  }

  return (
    <>
      <Column scroll>
        {svgImage !== '' ? (
          <Column padding="30 0 0 0">
            <SvgCss
              viewBox="0 0 350 530"
              xml={svgImage}
              width={deviceWidth - 20}
              height={((deviceWidth - 20) * 530) / 350}
              style={{marginHorizontal: 10}}
            />
            {!qrError && (
              <Button
                testID="share"
                styles={{width: '90%', marginTop: 30, marginHorizontal: 20}}
                title="Tap to Zoom QR Code"
                type="gradient"
                onPress={() => setIsQrOverlayVisible(true)}
              />
            )}

            <Button
              testID="viewActivityLog"
              type="outline"
              styles={{
                marginVertical: 30,
                marginHorizontal: 20,
              }}
              title="View Activity Log"
              onPress={() => console.log('cancel')}
            />
            <ExpandedQrCodeOverlay
              isVisible={isQrOverlayVisible}
              toggleOverlay={toggleQrOverlay}
              qrString={qrString}
              onQRError={onQRError}
            />
          </Column>
        ) : (
          <Column fill>
            <Column
              padding="10 10 3 10"
              backgroundColor={Theme.Colors.DetailedViewBackground}>
              <ImageBackground
                imageStyle={Theme.Styles.vcDetailBg}
                resizeMethod="scale"
                resizeMode="stretch"
                style={[
                  Theme.Styles.openCardBgContainer,
                  getBackgroundColour(props.wellknown),
                ]}
                source={getBackgroundImage(props.wellknown, Theme.OpenCard)}>
                <Row padding="14 14 0 14" margin="0 0 0 0">
                  <Column crossAlign="center">
                    {getProfileImage(face)}
                    <QrCodeOverlay
                      verifiableCredential={verifiableCredential}
                      meta={props.verifiableCredentialData.vcMetadata}
                    />
                    <Column
                      width={80}
                      height={59}
                      crossAlign="center"
                      margin="12 0 0 0">
                      <Image
                        src={logo?.url}
                        alt={logo?.alt_text}
                        style={Theme.Styles.issuerLogo}
                        resizeMethod="scale"
                        resizeMode="contain"
                      />
                    </Column>
                  </Column>
                  <Column
                    align="space-evenly"
                    margin={'0 0 0 24'}
                    style={{flex: 1}}>
                    {fieldItemIterator(
                      props.fields,
                      verifiableCredential,
                      props.wellknown,
                      props,
                    )}
                  </Column>
                </Row>
                {shouldShowHrLine(verifiableCredential) && (
                  <>
                    <View
                      style={[
                        Theme.Styles.hrLine,
                        {
                          borderBottomColor: getTextColor(
                            props.wellknown,
                            Theme.Styles.hrLine.borderBottomColor,
                          ),
                        },
                      ]}></View>
                    <Column padding="0 14 14 14">
                      {fieldItemIterator(
                        DETAIL_VIEW_BOTTOM_SECTION_FIELDS,
                        verifiableCredential,
                        props.wellknown,
                        props,
                      )}
                    </Column>
                  </>
                )}
              </ImageBackground>
            </Column>
          </Column>
        )}
      </Column>
      {props.vcHasImage && props.svgImage == '' && (
        <View
          style={{
            position: 'relative',
            backgroundColor: Theme.Colors.DetailedViewBackground,
          }}>
          {props.activeTab !== 1 &&
            (!props.walletBindingResponse &&
            isActivationNeeded(props.verifiableCredentialData?.issuer) ? (
              <Column
                padding="10"
                style={Theme.Styles.detailedViewActivationPopupContainer}>
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletUnActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="offlineAuthDisabledHeader"
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      color={Theme.Colors.statusLabel}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledHeader')}
                    </Text>
                    <Text
                      testID="offlineAuthDisabledMessage"
                      style={{
                        fontFamily: 'Inter_400Regular',
                        fontSize: 12,
                      }}
                      color={Theme.Colors.statusMessage}
                      margin={'0 18 0 0'}>
                      {t('offlineAuthDisabledMessage')}
                    </Text>
                  </Column>
                </Row>

                <Button
                  testID="enableVerification"
                  title={t('enableVerification')}
                  onPress={props.onBinding}
                  type="gradient"
                  size="Large"
                  disabled={
                    !props.verifiableCredentialData.vcMetadata.isVerified
                  }
                />
              </Column>
            ) : (
              <Column
                style={Theme.Styles.detailedViewActivationPopupContainer}
                padding="10">
                <Row>
                  <Column crossAlign="flex-start" margin={'2 0 0 10'}>
                    {SvgImage.WalletActivatedLargeIcon()}
                  </Column>
                  <Column crossAlign="flex-start" margin={'5 18 13 8'}>
                    <Text
                      testID="profileAuthenticated"
                      color={Theme.Colors.statusLabel}
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 14,
                      }}
                      margin={'0 18 0 0'}>
                      {isActivationNeeded(
                        props.verifiableCredentialData?.issuer,
                      )
                        ? t('profileAuthenticated')
                        : t('credentialActivated')}
                    </Text>
                  </Column>
                </Row>
              </Column>
            ))}
        </View>
      )}
    </>
  );
};

export interface VCItemDetailsProps {
  fields: any[];
  wellknown: any;
  credential: VerifiableCredential | Credential;
  verifiableCredentialData: any;
  walletBindingResponse?: WalletBindingResponse;
  onBinding?: () => void;
  activeTab?: Number;
  vcHasImage: boolean;
  svgImage: string;
}
