import React from 'react';
import { RootRouteProps } from '../routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './Home/HomeScreen';
import { Icon } from 'react-native-elements';
import { Theme } from '../components/ui/styleUtils';
import { IssuersList } from './Issuers/IssuersList';
import { useTranslation } from 'react-i18next';
import { Row } from '../components/ui';
import { HelpScreen } from '../components/HelpScreen';
import { Image } from 'react-native';
import { SettingScreen } from './Settings/SettingScreen';

const { Navigator, Screen } = createNativeStackNavigator();
export const HomeScreenLayout: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('IssuersListScreen');
  const HomeScreenOptions = {
    headerLeft: () =>
      React.createElement(Image, {
        source: require('../assets/inji-home-logo.png'),
        style: { width: 124, height: 27, resizeMode: 'contain' },
      }),
    headerTitle: '',
    headerRight: () => (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <Image
              source={require('../assets/help-icon.png')}
              style={{ width: 36, height: 36 }}
            />
          }
          navigation={undefined}
          route={undefined}
        />

        <SettingScreen
          triggerComponent={
            <Icon
              name="settings"
              type="simple-line-icon"
              size={21}
              style={Theme.Styles.IconContainer}
              color={Theme.Colors.Icon}
            />
          }
          navigation={props.navigation}
          route={undefined}
        />
      </Row>
    ),
  };

  return (
    <Navigator>
      <Screen
        key={'HomeScreen'}
        name={'HomeScreen'}
        component={HomeScreen}
        options={HomeScreenOptions}
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
