import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler} from 'react-native';
import {Button, Column, Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {LIVENESS_CHECK} from '../../shared/constants';
import {TelemetryConstants} from '../../shared/telemetry/TelemetryConstants';
import {
  getImpressionEventData,
  sendImpressionEvent,
} from '../../shared/telemetry/TelemetryUtils';
import {isMosipVC, VCItemContainerFlowType} from '../../shared/Utils';
import {VCMetadata} from '../../shared/VCMetadata';
import {VerifyIdentityOverlay} from '../VerifyIdentityOverlay';
import {ConsentOverlay} from './ConsentOverlay';
import {FaceVerificationAlertOverlay} from './FaceVerificationAlertOverlay';
import {useSendVPScreen} from './SendVPScreenController';

export const SendVPScreen: React.FC = () => {
  console.log('inside sendvp screen::');
  const {t} = useTranslation('SendVPScreen');
  const controller = useSendVPScreen();

  const vcsMatchingAuthRequest = controller.vcsMatchingAuthRequest;

  useEffect(() => {
    sendImpressionEvent(
      getImpressionEventData(
        TelemetryConstants.FlowType.senderVcShare,
        TelemetryConstants.Screens.vcList,
      ),
    );
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;

      const disableBackHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => disableBackHandler.remove();
    }, []),
  );

  const getVcKey = vcData => {
    return VCMetadata.fromVcMetadataString(vcData.vcMetadata).getVcKey();
  };

  const noOfCardsSelected = controller.areAllVCsChecked
    ? Object.values(controller.vcsMatchingAuthRequest).length
    : Object.keys(controller.selectedVCKeys).length;

  const cardsSelectedText =
    noOfCardsSelected === 1
      ? noOfCardsSelected + ' ' + t('cardSelected')
      : noOfCardsSelected + ' ' + t('cardsSelected');

  const areAllVcsChecked =
    noOfCardsSelected ===
    Object.values(controller.vcsMatchingAuthRequest).flatMap(vc => vc).length;
  console.log('no of vcs selected::', noOfCardsSelected);
  console.log(
    'matching vcs length::',
    Object.values(controller.vcsMatchingAuthRequest).flatMap(vc => vc).length,
  );

  const checkIfAnySelectedVCHasImage = () => {
    const hasImage = Object.values(controller.vcsMatchingAuthRequest)
      .flatMap(vc => vc)
      .some(vc => isMosipVC(vc.vcMetadata.issuer));
    return hasImage;
  };

  return (
    <React.Fragment>
      {Object.keys(vcsMatchingAuthRequest).length > 0 && (
        <>
          <Column fill backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
            <Column>
              <Text
                margin="15 0 13 24"
                weight="bold"
                color={Theme.Colors.textValue}
                style={{position: 'relative'}}>
                {t('SendVcScreen:pleaseSelectAnId')}
              </Text>
            </Column>
            <Row
              margin="15 24 13 24"
              style={{
                backgroundColor: '#FAFAFA',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontFamily: 'Inter_500Medium'}}>
                {cardsSelectedText}
              </Text>
              <Text
                style={{color: '#F2801D', fontFamily: 'Inter_600SemiBold'}}
                onPress={
                  areAllVcsChecked
                    ? controller.UNCHECK_ALL
                    : controller.CHECK_ALL
                }>
                {areAllVcsChecked ? t('unCheck') : t('checkAll')}
              </Text>
            </Row>
            <Column scroll>
              {Object.entries(vcsMatchingAuthRequest).map(
                ([inputDescriptorId, vcs]) =>
                  vcs.map(vcData => (
                    <VcItemContainer
                      key={getVcKey(vcData)}
                      vcMetadata={vcData.vcMetadata}
                      margin="0 2 8 2"
                      onPress={controller.SELECT_VC_ITEM(
                        getVcKey(vcData),
                        inputDescriptorId,
                      )}
                      selectable
                      selected={
                        controller.areAllVCsChecked ||
                        Object.keys(controller.selectedVCKeys).includes(
                          getVcKey(vcData),
                        )
                      }
                      flow={VCItemContainerFlowType.OPENID4VP}
                      isPinned={vcData.vcMetadata.isPinned}
                    />
                  )),
              )}
            </Column>
            <Column
              style={[
                Theme.SendVcScreenStyles.shareOptionButtonsContainer,
                {position: 'relative'},
              ]}
              backgroundColor={Theme.Colors.whiteBackgroundColor}>
              <Button
                type="gradient"
                styles={{marginTop: 12}}
                title={t('SendVcScreen:acceptRequest')}
                disabled={Object.keys(controller.selectedVCKeys).length === 0}
                onPress={controller.ACCEPT_REQUEST}
              />
              {checkIfAnySelectedVCHasImage() && (
                <Button
                  type="gradient"
                  title={t('SendVcScreen:acceptRequestAndVerify')}
                  styles={{marginTop: 12}}
                  disabled={Object.keys(controller.selectedVCKeys).length === 0}
                  onPress={controller.VERIFY_AND_ACCEPT_REQUEST}
                />
              )}

              <Button
                type="clear"
                loading={controller.isCancelling}
                title={t('SendVcScreen:reject')}
                onPress={controller.CANCEL}
              />
            </Column>
          </Column>

          <VerifyIdentityOverlay
            credential={controller.credentials}
            verifiableCredentialData={controller.verifiableCredentialsData}
            isVerifyingIdentity={controller.isVerifyingIdentity}
            onCancel={controller.CANCEL}
            onFaceValid={controller.FACE_VALID}
            onFaceInvalid={controller.FACE_INVALID}
            isInvalidIdentity={controller.isInvalidIdentity}
            onNavigateHome={controller.GO_TO_HOME}
            onRetryVerification={controller.RETRY_VERIFICATION}
            isLivenessEnabled={LIVENESS_CHECK}
          />

          <ConsentOverlay
            isVisible={controller.isVPSharingConsent}
            onConfirm={controller.CONFIRM}
            onCancel={controller.CANCEL}
          />

          <FaceVerificationAlertOverlay
            isVisible={controller.isFaceVerificationConsent}
            onConfirm={controller.FACE_VERIFICATION_CONSENT}
            close={controller.DISMISS}
          />
        </>
      )}
    </React.Fragment>
  );
};
