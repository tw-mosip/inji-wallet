import {Column, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import React from 'react';
import {setTextColor} from './VCUtils';

export const VCItemField = ({
  verifiableCredential,
  fieldName,
  fieldValue,
  wellknown,
}) => {
  return (
    <Column margin="9 0 0 0">
      <Text
        testID={`${fieldName}Title`}
        weight="regular"
        size="smaller"
        color={
          !verifiableCredential
            ? Theme.Colors.LoadingDetailsLabel
            : Theme.Colors.DetailsLabel
        }>
        {fieldName}
      </Text>
      <Text
        testID={`${fieldName}Title`}
        weight="semibold"
        style={[
          !verifiableCredential
            ? Theme.Styles.loadingTitle
            : Theme.Styles.subtitle,
          setTextColor(wellknown),
        ]}>
        {fieldValue}
      </Text>
    </Column>
  );
};
