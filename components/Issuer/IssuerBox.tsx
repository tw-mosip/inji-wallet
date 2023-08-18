import React from 'react';
import { Text, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { Theme } from '../ui/styleUtils';

export const IssuerBox: React.FC<IssuerBoxProps> = (props: IssuerBoxProps) => {
  const onPressHandler = () => {
    if (props.id !== 'UIN, VID, AID') {
      props.controller.SELECTED_ISSUER(props.id);
    } else {
      props.controller.DOWNLOAD_VIA_ID();
      //props.navigation.goBack();
    }
  };

  return (
    <Pressable
      onPress={onPressHandler}
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

export interface IssuerBoxProps {
  controller: any;
  id: string;
  description: string;
  onPress?: () => void;
}
