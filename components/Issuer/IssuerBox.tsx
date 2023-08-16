import React from 'react';
import { Text, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { Theme } from '../ui/styleUtils';
import { useIssuerScreenController } from '../../screens/Issuers/IssuerScreenController';

export const IssuerBox: React.FC<IssuerBoxProps> = (props: IssuerBoxProps) => {
  const controller = useIssuerScreenController();
  const onPressHandler = () => {
    if (props.id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(props.id);
    } else {
      controller.DOWNLOAD_VIA_ID();
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
  id: string;
  description: string;
  onPress?: () => void;
}
