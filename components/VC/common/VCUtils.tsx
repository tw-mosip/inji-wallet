import {
  CredentialSubject,
  VerifiableCredential,
} from '../../../types/VC/ExistingMosipVC/vc';
import VerifiedIcon from '../../VerifiedIcon';
import i18n, {getLocalizedField} from '../../../i18n';
import {Row} from '../../ui';
import {VCItemField} from './VCItemField';
import React from 'react';
import {format, parse} from 'date-fns';
import {logoType} from '../../../machines/issuersMachine';
import {Image} from 'react-native';
import {Theme} from '../../ui/styleUtils';

export const getFieldValue = (
  verifiableCredential: VerifiableCredential,
  field: string,
) => {
  switch (field) {
    case 'status':
      return <VerifiedIcon />;
    case 'idType':
      return i18n.t('VcDetails:nationalCard');
    case 'dateOfBirth':
      return formattedDateOfBirth(verifiableCredential);
    case 'address':
      return getLocalizedField(
        getFullAddress(verifiableCredential?.credentialSubject),
      );
    default:
      return getLocalizedField(verifiableCredential?.credentialSubject[field]);
  }
};

function getFullAddress(credential: CredentialSubject) {
  if (!credential) {
    return '';
  }

  const fields = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'province',
    'region',
  ];

  return fields
    .map(field => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}

function formattedDateOfBirth(verifiableCredential: any) {
  const dateOfBirth = verifiableCredential?.credentialSubject.dateOfBirth;
  if (dateOfBirth) {
    const formatString =
      dateOfBirth.split('/').length === 1 ? 'yyyy' : 'yyyy/MM/dd';
    const parsedDate = parse(dateOfBirth, formatString, new Date());
    return format(parsedDate, 'MM/dd/yyyy');
  }
  return dateOfBirth;
}

export const fieldItemIterator = (fields: any[], verifiableCredential: any) => {
  return fields.map(field => {
    const fieldValue = getFieldValue(verifiableCredential, field);
    if (!fieldValue) return;
    return (
      <Row
        style={{flexDirection: 'row', flex: 1}}
        align="space-between"
        let
        margin="0 8 5 8">
        <VCItemField
          key={field}
          fieldName={i18n.t(`VcDetails:${field}`)}
          fieldValue={fieldValue}
          verifiableCredential={verifiableCredential}
        />
      </Row>
    );
  });
};

export const getIssuerLogo = (isOpenId4VCI: boolean, issuerLogo: logoType) => {
  if (isOpenId4VCI) {
    return (
      <Image
        src={issuerLogo?.url}
        alt={issuerLogo?.alt_text}
        style={Theme.Styles.issuerLogo}
        resizeMethod="scale"
        resizeMode="contain"
      />
    );
  }
  return (
    <Image
      source={Theme.MosipSplashLogo}
      style={Theme.Styles.logo}
      resizeMethod="scale"
      resizeMode="contain"
    />
  );
};
