import React from 'react';
import {Image} from 'react-native';
import {Column, Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import {ProfileInfo} from '../shared/googleCloudUtils';
import {useTranslation} from 'react-i18next';

export const AccountInformation: React.FC<ProfileInfo> = ({email, picture}) => {
  const {t} = useTranslation('AccountSelection');
  return (
    <Row style={{marginBottom: 21, columnGap: 11}}>
      <Column align="center">
        <Image
          style={{height: 40, width: 40, borderRadius: 45}}
          source={{
            uri: picture,
          }}
        />
      </Column>
      <Column>
        <Row>
          <Text style={{color: Theme.Colors.helpText, fontSize: 12}}>
            {t('associatedAccount')}
          </Text>
        </Row>
        <Row>
          <Text style={{fontSize: 13, fontFamily: 'Helvetica Neue'}}>
            {email}
          </Text>
        </Row>
      </Column>
    </Row>
  );
};