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
      <Icon
        name={'star'}
        color={Theme.Colors.Icon}
        style={Theme.Styles.issuersIcon}
      />
      <Text>{props.id}</Text>
      <Text>{props.description}</Text>
    </Pressable>
  );
};

interface IssuerProps {
  id: string;
  description: string;
  onPress: () => void;
}
