import {View} from 'react-native';
import {Theme} from '../../ui/styleUtils';
import {Row, Text} from '../../ui';
import React from 'react';
import {VCCardInnerSkeleton} from './VCCardInnerSkeleton';

export const VCCardSkeleton = () => {
  return (
    <View style={Theme.Styles.closeCardBgContainer}>
      <VCCardInnerSkeleton />
      <View style={Theme.Styles.horizontalLine} />
      <Row style={[Theme.Styles.activationTab, {height: 30, borderRadius: 20}]}>
        <Row style={Theme.Styles.vcActivationStatusContainer}>
          <Row style={Theme.Styles.vcActivationDetailsWrapper}>
            <Text
              weight="regular"
              size="smaller"
              color={Theme.Colors.Details}
              style={[{width: 200}, Theme.Styles.loadingTitle]}></Text>
          </Row>
        </Row>
      </Row>
    </View>
  );
};
