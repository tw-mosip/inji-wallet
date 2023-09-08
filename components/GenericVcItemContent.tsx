import React from 'react';
import { VerifiableCredential } from '../types/vc';
import { Column, Text } from './ui';
import { Theme } from './ui/styleUtils';
import { Image } from 'react-native';

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

/**
 * PoC: GenericVcItemContent will render a credentialSubject entities if they
 *  are not an object.
 * @param props is a VcItemContentProps and it has a VC and other relevant detail
 *  for rendering
 */
export const GenericVcItemContent: React.FC<VcItemContentProps> = (props) => {
  // Assigning the UIN and VID from the VC details to display the idtype label
  const vcEntities = props.verifiableCredential.credentialSubject;
  const items = Object.keys(vcEntities);
  return (
    <>
      {items.map(function (key) {
        return (
          <Column margin="5 5 5 5" key={key}>
            {typeof vcEntities[key] !== 'object'
              ? getDetails(key, vcEntities[key], props.verifiableCredential)
              : null}
          </Column>
        );
      })}
      <Column style={{ display: props.verifiableCredential ? 'flex' : 'none' }}>
        <Image
          source={props.logo ? props.logo : Theme.EsignetLogo}
          style={Theme.Styles.logo}
          resizeMethod="auto"
        />
      </Column>
    </>
  );
};

interface VcItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  generatedOn: string;
  tag: string;
  selectable: boolean;
  selected: boolean;
  logo?: string;
  iconName?: string;
  iconType?: string;
  service: any;
  onPress?: () => void;
}
