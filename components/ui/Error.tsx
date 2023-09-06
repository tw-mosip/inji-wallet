import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, View } from 'react-native';
import { Button, Column, Row, Text } from '.';
import { Header } from './Header';
import { Theme } from './styleUtils';

export const Error: React.FC<ErrorProps> = (props) => {
  const { t } = useTranslation('common');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        props.goBack();
        return true;
      };

      const disableBackHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => disableBackHandler.remove();
    }, [])
  );

  return (
    <View
      style={{
        ...Theme.ModalStyles.modal,
        backgroundColor: Theme.Colors.whiteBackgroundColor,
      }}>
      <Column fill safe>
        {props.goBack && <Header goBack={props.goBack} title="" />}
        <Column fill safe align="space-evenly">
          <View style={{ alignItems: 'center' }}>
            <View>
              <Row align="center" style={Theme.ErrorStyles.image}>
                {props.image}
              </Row>
              <Text style={Theme.ErrorStyles.title}>{props.title}</Text>
              <Text style={Theme.ErrorStyles.message}>{props.message}</Text>
            </View>
            {props.tryAgain && (
              <Button
                onPress={props.tryAgain}
                width={Dimensions.get('screen').width * 0.46}
                title={t('tryAgain')}
                type="outline"
              />
            )}
          </View>
        </Column>
      </Column>
    </View>
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
