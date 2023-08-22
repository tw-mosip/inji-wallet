import React from 'react';
import { Dimensions, Modal as RNModal, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button, Column, Row, Text } from '.';
import { Theme } from './styleUtils';

export const ErrorModal: React.FC<ErrorProps> = (props) => {
  return (
    <RNModal
      animationType="slide"
      style={Theme.ModalStyles.modal}
      visible={props.isVisible}>
      {props.goBack && (
        <Icon
          name="arrow-left"
          type="material-community"
          onPress={props.goBack}
          containerStyle={{
            ...Theme.Styles.backArrowContainer,
            marginTop: 10,
            marginLeft: 10,
          }}
        />
      )}
      <Column align="center" fill safe style={{ marginHorizontal: 10 }}>
        <Row align="center">{props.image}</Row>
        <Row>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginHorizontal: 18,
              padding: 12,
            }}>
            <Row fill align={'center'}>
              <Column>
                <Text
                  style={{
                    ...Theme.TextStyles.header,
                    textAlign: 'center',
                    padding: 5,
                  }}>
                  {props.title}
                </Text>
                <Text style={{ textAlign: 'center' }}>{props.message}</Text>
              </Column>
            </Row>
          </View>
        </Row>
        <Row align="center" style={{ padding: 10 }}>
          <Button
            onPress={props.tryAgain}
            width={Dimensions.get('screen').width * 0.46}
            title="Try again"
            type="outline"
          />
        </Row>
      </Column>
    </RNModal>
  );
};

export interface ErrorProps {
  isVisible: boolean;
  title: string;
  message: string;
  image: React.ReactElement;
  goBack: () => void;
  tryAgain: () => void;
}
