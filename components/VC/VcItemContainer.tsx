import {isVCFromOpenId4VCI} from '../../shared/openId4VCI/Utils';
import {VCItem} from '../openId4VCI/VCItem';
import React from 'react';
import {VcItem} from '../VcItem';

export const VcItemContainer: React.FC = props => {
  if (isVCFromOpenId4VCI(props.vcKey)) {
    return <VCItem vcKey={''} {...props} />;
  }
  return <VcItem vcKey={''} {...props} />;
};
