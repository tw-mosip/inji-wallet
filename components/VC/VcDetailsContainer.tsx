import {isVCFromOpenId4VCI} from '../../shared/openId4VCI/Utils';
import React from 'react';
import {VCDetails} from '../openId4VCI/VCDetails';
import {VcDetails} from '../VcDetails';

export const VcDetailsContainer: React.FC = props => {
  if (isVCFromOpenId4VCI(props.vcKey)) {
    return <VCDetails vc={undefined} isBindingPending={false} {...props} />;
  }
  return <VcDetails vc={undefined} isBindingPending={false} {...props} />;
};
