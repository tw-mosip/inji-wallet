import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {
  Button,
  Column,
  HorizontallyCentered,
  Row,
  Text,
} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';

export const AccountSelectionConfirmation: React.FC<
  AccountSelectionConfirmationProps
> = props => {
  const {t} = useTranslation('AccountSelection');

  return (
    <Modal
      isVisible={props.isVisible}
      showClose={false}
      onDismiss={props.goBack}>
      <Column style={{flex: 1, justifyContent: 'space-around'}}>
        <View style={{alignItems: 'center', paddingTop: 30}}>
          {SvgImage.DataBackupIcon(80, 100)}
        </View>

        <Column>
          <Text
            size="large"
            style={Theme.BackupAndRestoreStyles.backupProcessInfo}>
            {t('backupProcessInfo')}
          </Text>
          <Text
            size="regular"
            color={Theme.Colors.GrayText}
            style={Theme.BackupAndRestoreStyles.cloudInfo}>
            {t('cloudInfo')}
          </Text>
        </Column>

        <HorizontallyCentered
          fill
          crossAlign="center"
          style={{paddingHorizontal: 120, paddingVertical: 50}}>
          <Row>
            {SvgImage.GoogleDriveIcon(45, 45)}
            <Text style={Theme.BackupAndRestoreStyles.cloudLabel}>
              {t('googleDriveTitle')}
            </Text>
          </Row>
        </HorizontallyCentered>

        <Column fill align="flex-end" crossAlign="center">
          <Button type="gradient" title={'Proceed'} onPress={props.onProceed} />
          <Button type="clear" title={t('goBack')} onPress={props.goBack} />
        </Column>
      </Column>
    </Modal>
  );
};

interface AccountSelectionConfirmationProps {
  goBack: () => void;
  isVisible: boolean;
  onProceed: () => void;
}