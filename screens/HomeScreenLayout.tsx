import React from 'react';
import { RootRouteProps } from '../routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './Home/HomeScreen';
import { Icon } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { IssuersList } from './Issuers/IssuersList';
import { useTranslation } from 'react-i18next';

const { Navigator, Screen } = createNativeStackNavigator();
export const HomeScreenLayout: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('IssuersListScreen');

  return (
    <Navigator>
      <Screen
        key={'HomeScreen'}
        name={'HomeScreen'}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        key={'Issuers'}
        name={'IssuersListScreen'}
        component={IssuersList}
        options={{
          headerShown: true,
          headerLeft: () => (
            <Icon
              name="arrow-left"
              type="material-community"
              onPress={props.navigation.goBack}
              containerStyle={Theme.Styles.backArrowContainer}
              color={Theme.Colors.Icon}
            />
          ),
          headerTitle: t('title'),
        }}
      />
    </Navigator>
  );
};
