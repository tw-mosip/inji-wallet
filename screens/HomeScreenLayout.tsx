import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { HelpScreen } from '../components/HelpScreen';
import { Row } from '../components/ui';
import { Header } from '../components/ui/Header';
import { Theme } from '../components/ui/styleUtils';
import { RootRouteProps } from '../routes';
import { HomeScreen } from './Home/HomeScreen';
import { IssuersScreen } from './Issuers/IssuersScreen';
import { SettingScreen } from './Settings/SettingScreen';

const { Navigator, Screen } = createNativeStackNavigator();
export const HomeScreenLayout: React.FC<RootRouteProps> = (props) => {
  const { t } = useTranslation('IssuersScreen');
  const HomeScreenOptions = {
    headerLeft: () =>
      React.createElement(Image, {
        source: Theme.InjiHomeLogo,
        style: { width: 124, height: 27, resizeMode: 'contain' },
      }),
    headerTitle: '',
    headerRight: () => (
      <Row align="space-between">
        <HelpScreen
          triggerComponent={
            <Image source={Theme.HelpIcon} style={{ width: 36, height: 36 }} />
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
        name={'IssuersScreen'}
        component={IssuersScreen}
        options={{
          header: (props) => (
            <Header navigation={props.navigation} title={t('title')} />
          ),
        }}
      />
    </Navigator>
  );
};
