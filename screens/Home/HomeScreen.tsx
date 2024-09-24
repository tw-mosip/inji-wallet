import React, {useEffect, useState} from 'react';
import {Icon} from 'react-native-elements';
import {Column} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {HomeRouteProps} from '../../routes/routeTypes';
import {MyVcsTab} from './MyVcsTab';
import {ReceivedVcsTab} from './ReceivedVcsTab';
import {ViewVcModal} from './ViewVcModal';
import {useHomeScreen} from './HomeScreenController';
import {TabRef} from './HomeScreenMachine';
import {ActorRefFrom} from 'xstate';
import LinearGradient from 'react-native-linear-gradient';
import {ErrorMessageOverlay} from '../../components/MessageOverlay';
import {Linking, Pressable} from 'react-native';
import testIDProps from '../../shared/commonUtil';
import {BannerNotificationContainer} from '../../components/BannerNotificationContainer';
import {VCItemMachine} from '../../machines/VerifiableCredential/VCItemMachine/VCItemMachine';
import {VerifiableCredential} from '../../machines/VerifiableCredential/VCMetaMachine/vc';
import {useTranslation} from 'react-i18next';
import HomeScreenWebView from './HomeScreenWebView';

export const HomeScreen: React.FC<HomeRouteProps> = props => {
  const controller = useHomeScreen(props);
  const {t} = useTranslation();

  const [status, setStatus] = useState('');

  const handleDeepLink = deepLinkData => {
    if (deepLinkData.url != null) {
      const intentURL = new URL(deepLinkData.url);
      if (intentURL.host === 'redirection') {
        const newStatus = intentURL.searchParams.get('status')!!;
        setStatus(newStatus);
      }
    }
  };

  useEffect(() => {
    const listener = Linking.addEventListener('url', handleDeepLink);

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    if (controller.IssuersService) {
      navigateToIssuers();
    }
  }, [controller.IssuersService]);

  const navigateToIssuers = () => {
    props.navigation.navigate('IssuersScreen', {
      service: controller.IssuersService,
    });
  };

  const DownloadFABIcon: React.FC = () => {
    const plusIcon = (
      <Icon
        {...testIDProps('plusIcon')}
        accessible={true}
        name={'plus'}
        type={'entypo'}
        size={36}
        color={Theme.Colors.whiteText}
      />
    );
    return (
      <LinearGradient
        colors={Theme.Colors.gradientBtn}
        style={Theme.Styles.downloadFabIconContainer}>
        <Pressable
          onPress={() => {
            controller.GOTO_ISSUERS();
          }}
          {...testIDProps('downloadCardButton')}
          accessible={false}
          style={({pressed}) =>
            pressed
              ? Theme.Styles.downloadFabIconPressed
              : Theme.Styles.downloadFabIconNormal
          }>
          {plusIcon}
        </Pressable>
      </LinearGradient>
    );
  };

  return (
    <React.Fragment>
      <BannerNotificationContainer />
      <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
        {controller.haveTabsLoaded && (
          <Column fill>
            <MyVcsTab
              isVisible={controller.activeTab === 0}
              service={controller.tabRefs.myVcs}
              vcItemActor={controller.selectedVc}
            />
            <ReceivedVcsTab
              isVisible={controller.activeTab === 1}
              service={controller.tabRefs.receivedVcs}
              vcItemActor={controller.selectedVc}
            />
          </Column>
        )}
      </Column>
      <HomeScreenWebView status={status} setStatus={setStatus} />

      <ErrorMessageOverlay
        translationPath={'MyVcsTab'}
        isVisible={controller.isMinimumStorageLimitReached}
        error={'errors.storageLimitReached'}
        onDismiss={controller.DISMISS}
      />
      {controller.selectedVc && (
        <ViewVcModal
          isVisible={controller.isViewingVc}
          onDismiss={controller.DISMISS_MODAL}
          vcItemActor={controller.selectedVc}
          activeTab={controller.activeTab}
          flow="downloadedVc"
        />
      )}
    </React.Fragment>
  );
};

export interface HomeScreenTabProps {
  isVisible: boolean;
  service: TabRef;
  vcItemActor: ActorRefFrom<typeof VCItemMachine>;
  vc: VerifiableCredential | Credential;
}
