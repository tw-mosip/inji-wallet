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
        {...setTextColor(wellknown)}
        style={[
          {width: 100},
          !verifiableCredential
            ? Theme.Styles.loadingTitle
            : Theme.Styles.subtitle,
        ]}>
        {fieldName}
      </Text>
      <Text
        testID={`${fieldName}Value`}
        weight="semibold"
        style={[
          {width: 200},
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
