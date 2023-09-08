import React from 'react';
import { Column, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { Image } from 'react-native';
import { CredentialSubject } from '../types/vc';
import { VcDetailsProps } from './VcDetailsWrapper';
import { getLocalizedField } from '../i18n';

const getDetails = (arg1, arg2, verifiableCredential) => {
  return (
    <Column>
      <Text
        color={
          !verifiableCredential
            ? Theme.Colors.LoadingDetailsLabel
            : Theme.Colors.DetailsLabel
        }
        size="smaller"
        weight={'bold'}
        style={Theme.Styles.vcItemLabelHeader}>
        {arg1}
      </Text>
      <Text
        numLines={4}
        color={Theme.Colors.Details}
        weight="bold"
        size="smaller"
        style={
          !verifiableCredential
            ? Theme.Styles.loadingTitle
            : Theme.Styles.subtitle
        }>
        {!verifiableCredential ? '' : arg2}
      </Text>
    </Column>
  );
};

export const GenericVcDetails: React.FC<VcDetailsProps> = (props) => {
  // Assigning the UIN and VID from the VC details to display the idtype label
  const vcEntities = props.vc.verifiableCredential.credentialSubject;
  const items = Object.keys(vcEntities);
  return (
    <>
      {items.map(function (key) {
        return (
          <Column margin="5 5 5 5" key={key}>
            {typeof vcEntities[key] !== 'object'
              ? getDetails(key, vcEntities[key], props.vc)
              : null}
          </Column>
        );
      })}
      <Column style={{ display: props.vc ? 'flex' : 'none' }}>
        <Image
          source={props.logo ? props.logo : Theme.EsignetLogo}
          style={Theme.Styles.logo}
          resizeMethod="auto"
        />
      </Column>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    .map((field) => getLocalizedField(credential[field]))
    .concat(credential.postalCode)
    .filter(Boolean)
    .join(', ');
}
