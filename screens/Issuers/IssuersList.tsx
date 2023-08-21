import React from 'react';
import { useIssuerScreenController } from './IssuerScreenController';
import { FlatList } from 'react-native';
import { Column } from '../../components/ui';
import { Issuer } from '../../components/Issuer/Issuer';
import { Text } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { Error } from '../../components/ui/Error';

export const IssuersList: React.FC = (props) => {
  const controller = useIssuerScreenController(props);
  const { t } = useTranslation('IssuersListScreen');

  const onPressHandler = (id) => {
    if (id !== 'UIN, VID, AID') {
      controller.SELECTED_ISSUER(id);
    } else {
      controller.DOWNLOAD_ID();
    }
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
        <Error
          isVisible={controller.isError}
          title={t(`errors.${controller.errorMessage}.title`)}
          message={t(`errors.${controller.errorMessage}.message`)}
          goBack={props.navigation.goBack}
          tryAgain={controller.TRY_AGAIN}
        />
      )}
    </React.Fragment>
  );
};
