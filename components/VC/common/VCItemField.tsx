import {Column, Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';
import {SvgImage} from '../../ui/svg';
import {Dimensions} from 'react-native';
import {CustomTooltip, ToolTipContentType} from '../../ui/ToolTip';
import {Icon} from 'react-native-elements';
import testIDProps from '../../../shared/commonUtil';

export const VCItemFieldName = ({fieldName, wellknown}) => {
  return (
    <Row>
      {fieldName && (
        <Text
          testID={`${fieldName}Title`}
          {...setTextColor(wellknown)}
          style={Theme.Styles.fieldItemTitle}>
          {fieldName}
        </Text>
      )}

      {fieldName == 'Status' && (
        <CustomTooltip
          testID="statusToolTip"
          width={Dimensions.get('screen').width * 0.8}
          height={Dimensions.get('screen').height * 0.18}
          triggerComponent={
            <Icon
              {...testIDProps('statusInfo')}
              name="infocirlceo"
              type="antdesign"
              size={15}
              color={Theme.Colors.tooltipIcon}
            />
          }
          toolTipContent={
            <Column align="flex-start">
              <Text weight="semibold">Valid Status:</Text>
              <Text
                weight="regular"
                style={Theme.Styles.tooltipContentDescription}>
                The credential has been successfully verified.
              </Text>
              <Text weight="semibold">Pending Status:</Text>
              <Text
                weight="regular"
                style={Theme.Styles.tooltipContentDescription}>
                Verification is currently pending due to technical issues.
              </Text>
            </Column>
          }
        />
      )}
    </Row>
  );
};

export const VCItemFieldValue = ({fieldName, fieldValue, wellknown}) => {
  return (
    <>
      <Text
        testID={`${fieldName}Value`}
        {...setTextColor(wellknown)}
        style={Theme.Styles.fieldItemValue}>
        {fieldValue}
      </Text>
    </>
  );
};

export const VCItemField = props => {
  return (
    <Column>
      <VCItemFieldName {...props} />
      <VCItemFieldValue {...props} />
    </Column>
  );
};
