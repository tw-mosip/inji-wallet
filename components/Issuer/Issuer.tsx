import React from 'react';
import { Text, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { Theme } from '../ui/styleUtils';

export const Issuer: React.FC<IssuerProps> = (props: IssuerProps) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) =>
        pressed
          ? Theme.Styles.issuerBoxContainerPressed
          : Theme.Styles.issuerBoxContainer
      }>
      {/* This bento icon is a placeholder until the logo of the issuer is rendered. */}
      <Icon
        name={'bento'}
        size={30}
        color={Theme.Colors.Icon}
        style={Theme.issuersScreenStyles.issuerIcon}
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
  onPress: () => void;
}
