import React from 'react';
import { Image, Pressable, Text } from 'react-native';
import { Theme } from '../ui/styleUtils';

function isValidURL(urlString) {
  const urlPattern = new RegExp(
    `^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$`,
    'i'
  );
  return !!urlPattern.test(urlString);
}

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  /**
   * This check is added since the logo for Donwload via UIN/VID is present in the repo where as
   * other issuers has the logo url specfied in its data itself
   */
  function getSource() {
    if (isValidURL(props.logoUrl)) return { uri: props.logoUrl };
    return props.logoUrl;
  }

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) =>
        pressed
          ? [
              Theme.issuersScreenStyles.issuerBoxContainerPressed,
              Theme.Styles.boxShadow,
            ]
          : [
              Theme.issuersScreenStyles.issuerBoxContainer,
              Theme.Styles.boxShadow,
            ]
      }>
      <Image
        style={Theme.issuersScreenStyles.issuerIcon}
        source={getSource()}
      />
      <Text style={Theme.issuersScreenStyles.issuerHeading}>{props.id}</Text>
      <Text style={Theme.issuersScreenStyles.issuerDescription}>
        {props.description}
      </Text>
    </Pressable>
  );
};

interface IssuerProps {
  id: string;
  description: string;
  logoUrl: string;
  onPress: () => void;
}
