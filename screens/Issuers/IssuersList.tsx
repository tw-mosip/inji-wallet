import React, { useCallback } from 'react';
import { useIssuerScreenController } from './IssuerScreenController';
import { FlatList } from 'react-native';
import { Column } from '../../components/ui';
import { IssuerBox } from '../../components/Issuer/IssuerBox';
import { Text } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { ProgressingModal } from '../../components/ProgressingModal';
export const IssuersList: React.FC = (props) => {
  useFocusEffect(
    useCallback(() => {
      props.navigation.getParent().setOptions({ headerShown: false });
      return () => {
        props.navigation.getParent().setOptions({ headerShown: true });
      };
    }, [])
  );

  console.log('IssuersList props-> ', props);
  const controller = useIssuerScreenController(props);
  const { t } = useTranslation('IssuersListScreen');

  return (
    <React.Fragment>
      <Column style={Theme.Styles.issuerListOuterContainer}>
        <Text>{t('header')}</Text>
        {controller.issuers.length > 0 && (
          <FlatList
            data={controller.issuers}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <IssuerBox
                id={item.id}
                description={item.displayName}
                controller={controller}
                {...props}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => item.id}
          />
        )}
      </Column>
    </React.Fragment>
  );
};
