import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal as RNModal, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button, Column, Row, Text } from '.';
import { Theme } from './styleUtils';

export const ErrorModal: React.FC<ErrorProps> = (props) => {
  const { t } = useTranslation('common');

  return (
    <RNModal
      animationType="slide"
      style={Theme.ModalStyles.modal}
      visible={props.isVisible}>
      <Column fill safe>
        {props.goBack && (
          <Row elevation={2}>
            <View style={Theme.ModalStyles.header}>
              <Row fill align={'flex-start'} margin={'16 0 0 0'}>
                <Icon
                  name="arrow-left"
                  type="material-community"
                  onPress={props.goBack}
                  containerStyle={{
                    ...Theme.Styles.backArrowContainer,
                  }}
                />
              </Row>
            </View>
          </Row>
        )}
        <Column fill safe align="space-evenly">
          <View style={{ alignItems: 'center' }}>
            <View>
              <Row align="center">{props.image}</Row>
              <Text
                style={{
                  ...Theme.TextStyles.header,
                  textAlign: 'center',
                }}>
                {props.title}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  ...Theme.TextStyles.regular,
                  marginTop: 12,
                  marginBottom: 30,
                  marginHorizontal: 40,
                }}>
                {props.message}
              </Text>
            </View>
            <Button
              onPress={props.tryAgain}
              width={Dimensions.get('screen').width * 0.46}
              title={t('tryAgain')}
              type="outline"
            />
          </View>
        </Column>
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
