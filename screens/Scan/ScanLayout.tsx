import React from 'react';
import {useTranslation} from 'react-i18next';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SendVcScreen} from './SendVcScreen';
import {useScanLayout} from './ScanLayoutController';
import {ScanScreen} from './ScanScreen';
import {SCAN_ROUTES} from '../../routes/routesConstants';
import {SharingStatusModal} from './SharingStatusModal';
import {Theme} from '../../components/ui/styleUtils';
import {Icon} from 'react-native-elements';
import {Loader} from '../../components/ui/Loader';
import {VCShareFlowType} from '../../shared/Utils';
import {VerifyIdentityOverlay} from '../VerifyIdentityOverlay';
import {SvgImage} from '../../components/ui/svg';
import {View, I18nManager} from 'react-native';
import {Text} from './../../components/ui';
import {BannerStatusType} from '../../components/BannerNotification';
import {LIVENESS_CHECK} from '../../shared/constants';
import {SendVPScreen} from './SendVPScreen';

const ScanStack = createNativeStackNavigator();

export const ScanLayout: React.FC = () => {
  const {t} = useTranslation('ScanScreen');
  const controller = useScanLayout();

  if (
    controller.statusOverlay != null &&
    !controller.isAccepted &&
    !controller.isInvalid
  ) {
    return (
      <Loader
        title={controller.statusOverlay?.title}
        hint={controller.statusOverlay?.hint}
        onCancel={controller.statusOverlay?.onButtonPress}
        onStayInProgress={controller.statusOverlay?.onStayInProgress}
        isHintVisible={
          controller.isStayInProgress ||
          controller.isBleError ||
          controller.isSendingVc ||
          controller.isSendingVP
        }
        onRetry={controller.statusOverlay?.onRetry}
        showBanner={controller.isFaceIdentityVerified}
        bannerMessage={t('ScanScreen:postFaceCapture:captureSuccessMessage')}
        onBannerClose={controller.CLOSE_BANNER}
        bannerType={BannerStatusType.SUCCESS}
        bannerTestID={'faceVerificationSuccess'}
      />
    );
  }

  return (
    <React.Fragment>
      <VerifyIdentityOverlay
        credential={controller.credential}
        verifiableCredentialData={controller.verifiableCredentialData}
        isVerifyingIdentity={controller.isVerifyingIdentity}
        onCancel={controller.CANCEL}
        onFaceValid={controller.FACE_VALID}
        onFaceInvalid={controller.FACE_INVALID}
        isInvalidIdentity={controller.isInvalidIdentity}
        onNavigateHome={controller.GOTO_HOME}
        onRetryVerification={controller.RETRY_VERIFICATION}
        isLivenessEnabled={LIVENESS_CHECK}
      />
      <ScanStack.Navigator initialRouteName="ScanScreen">
        {controller.isReviewing &&
          controller.flowType === VCShareFlowType.SIMPLE_SHARE && (
            <ScanStack.Screen
              name={SCAN_ROUTES.SendVcScreen}
              component={SendVcScreen}
              options={{
                title: t('sharingVc'),
                headerTitleAlign: 'center',
                headerTitle: props => (
                  <View style={Theme.Styles.sendVcHeaderContainer}>
                    <Text style={Theme.Styles.scanLayoutHeaderTitle}>
                      {props.children}
                    </Text>
                  </View>
                ),
                headerBackVisible: false,
                headerRight: () =>
                  !I18nManager.isRTL && (
                    <Icon
                      name="close"
                      color={Theme.Colors.blackIcon}
                      onPress={controller.CANCEL}
                    />
                  ),
                headerLeft: () =>
                  I18nManager.isRTL && (
                    <Icon
                      name="close"
                      color={Theme.Colors.blackIcon}
                      onPress={controller.CANCEL}
                    />
                  ),
              }}
            />
          )}
        <ScanStack.Screen
          name={SCAN_ROUTES.ScanScreen}
          component={ScanScreen}
          options={{
            title: t('MainLayout:share'),
            headerTitle: props => (
              <View style={Theme.Styles.scanLayoutHeaderContainer}>
                <Text style={Theme.Styles.scanLayoutHeaderTitle}>
                  {props.children}
                </Text>
              </View>
            ),
          }}
        />
        {controller.flowType === VCShareFlowType.OPENID4VP && (
          <ScanStack.Screen
            name={SCAN_ROUTES.SendVPScreen}
            component={SendVPScreen}
            options={{
              title: t('SendVPScreen:requester'),
              headerRight: () =>
                !I18nManager.isRTL && (
                  <Icon
                    name="close"
                    color={Theme.Colors.blackIcon}
                    onPress={controller.DISMISS}
                  />
                ),
              headerLeft: () =>
                I18nManager.isRTL && (
                  <Icon
                    name="close"
                    color={Theme.Colors.blackIcon}
                    onPress={controller.DISMISS}
                  />
                ),
            }}
          />
        )}
      </ScanStack.Navigator>

      <SharingStatusModal
        isVisible={controller.isAccepted}
        testId={'sharingSuccessModal'}
        buttonStatus={'homeAndHistoryIcons'}
        title={t('status.accepted.title')}
        message={t('status.accepted.message')}
        image={SvgImage.SuccessLogo()}
        goToHome={controller.GOTO_HOME}
        goToHistory={controller.GOTO_HISTORY}
      />

      {controller.errorStatusOverlay && (
        <SharingStatusModal
          isVisible={controller.errorStatusOverlay !== null}
          testId={'walletSideSharingErrorModal'}
          image={SvgImage.ErrorLogo()}
          title={controller.errorStatusOverlay.title}
          message={controller.errorStatusOverlay.message}
          gradientButtonTitle={t('status.bleError.retry')}
          clearButtonTitle={t('status.bleError.home')}
          onGradientButton={controller.onRetry}
          onClearButton={controller.GOTO_HOME}
        />
      )}
    </React.Fragment>
  );
};
