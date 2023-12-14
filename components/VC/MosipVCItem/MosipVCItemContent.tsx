import React, {useEffect, useState} from 'react';
import {Image, ImageBackground} from 'react-native';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import VerifiedIcon from '../../VerifiedIcon';
import {Column, Row} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import testIDProps from '../../../shared/commonUtil';
import {VCItemField} from '../common/VCItemField';
import {useTranslation} from 'react-i18next';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {
  CARD_VIEW_ADD_ON_FIELDS,
  CARD_VIEW_DEFAULT_FIELDS,
} from '../../../shared/constants';
import {fieldItemIterator, getIssuerLogo} from '../common/VCUtils';

export const MosipVCItemContent: React.FC<
  ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps
> = props => {
  const verifiableCredential = props.isDownloading
    ? null
    : props.vcMetadata.isFromOpenId4VCI()
    ? props.verifiableCredential?.credential
    : props.verifiableCredential;
  const {t} = useTranslation('VcDetails');
  const [fields, setFields] = useState(CARD_VIEW_DEFAULT_FIELDS);
  useEffect(() => {
    getCredentialIssuersWellKnownConfig(
      props?.vcMetadata.issuer,
      props.verifiableCredential?.wellKnown,
      fields,
    ).then(response => {
      setFields(response.slice(0, 1).concat(CARD_VIEW_ADD_ON_FIELDS));
    });
  }, [props.verifiableCredential?.wellKnown]);

  return (
    <ImageBackground
      source={!verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      style={
        !verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer
      }>
      <Column>
        <Row margin={'0 20 10 10'}>
          <Column>
            <ImageBackground
              imageStyle={Theme.Styles.faceImage}
              source={faceImageSource()}
              style={Theme.Styles.closeCardImage}>
              {props.isPinned && (
                <Image
                  source={Theme.PinIcon}
                  style={Theme.Styles.pinIcon}
                  {...testIDProps('pinIcon')}
                />
              )}
            </ImageBackground>
          </Column>
          <Column margin={'0 0 0 20'}>
            {fieldItemIterator(fields.slice(0, 2), verifiableCredential)}
          </Column>
        </Row>

        {fieldItemIterator(fields.slice(2), verifiableCredential)}

        <Row align={'space-between'} margin="0 8 5 8">
          <VCItemField
            key={'status'}
            fieldName={t('status')}
            fieldValue={!verifiableCredential ? null : <VerifiedIcon />}
            verifiableCredential={verifiableCredential}
          />
          <Column>
            {!verifiableCredential
              ? null
              : getIssuerLogo(
                  props.vcMetadata.isFromOpenId4VCI(),
                  props.verifiableCredential?.issuerLogo,
                )}
          </Column>
        </Row>
      </Column>
    </ImageBackground>
  );

  function faceImageSource() {
    return !verifiableCredential
      ? Theme.cardFaceIcon
      : {
          uri: props.vcMetadata.isFromOpenId4VCI()
            ? verifiableCredential?.credentialSubject.face
            : props.context.credential.biometrics.face,
        };
  }
};

interface ExistingMosipVCItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  isPinned?: boolean;
  service: any;
  onPress?: () => void;
  isDownloading?: boolean;
}

export interface EsignetMosipVCItemContentProps {
  context: any;
  credential: VerifiableCredential;
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  isPinned?: boolean;
  service: any;
  onPress?: () => void;
  isDownloading?: boolean;
}

MosipVCItemContent.defaultProps = {
  isPinned: false,
};
