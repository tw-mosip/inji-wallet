import React from 'react';
import { useIssuerScreenController } from './IssuerScreenController';
import { FlatList, Image } from 'react-native';
import { Column } from '../../components/ui';
import { Issuer } from '../../components/Issuer/Issuer';
import { Text } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { ErrorModal } from '../../components/ui/ErrorModal';
import { HomeRouteProps } from '../../routes/main';

export const IssuersScreen: React.FC<HomeRouteProps> = (props) => {
  const controller = useIssuerScreenController(props);
  const { t } = useTranslation('IssuersListScreen');

  const onPressHandler = (id) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
  };

  const isGenericError = () => {
    return controller.errorMessage === 'generic';
  };

  const goBack = () => {
    if (isGenericError()) {
      controller.RESET_ERROR();
      setTimeout(() => {
        props.navigation.goBack();
      }, 0);
    }
  };

  const getImage = () => {
    if (isGenericError()) {
      return (
        <Image
          source={require('../../assets/Something-went-wrong.png')}
          style={{ width: 370, height: 150 }}
        />
      );
    }
    return (
      <Image source={require('../../assets/no-internet-connection.png')} />
    );
  };

  return (
    <React.Fragment>
      <Column style={Theme.Styles.issuerListOuterContainer}>
        <Text>{t('header')}</Text>
        {controller.issuers.length > 0 && (
          <FlatList
            data={controller.issuers}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Issuer
                id={item.id}
                description={item.displayName}
                onPress={() => onPressHandler(item.id)}
                {...props}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => item.id}
          />
        )}
      </Column>
      {controller.isError && (
        <ErrorModal
          isVisible={controller.isError}
          title={t(`errors.${controller.errorMessage}.title`)}
          message={t(`errors.${controller.errorMessage}.message`)}
          goBack={goBack}
          tryAgain={
            isGenericError() ? controller.TRY_AGAIN : props.navigation.goBack
          }
          image={getImage()}
        />
      )}
    </React.Fragment>
  );
};
