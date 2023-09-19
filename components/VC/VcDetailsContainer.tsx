import React from 'react';
import {EsignetMosipVCItemDetails} from './EsignetMosipVCItem/EsignetMosipVCItemDetails';
import {ExistingMosipVCItemDetails} from './ExistingMosipVCItem/ExistingMosipVCItemDetails';
import {VCMetadata} from '../../shared/VCMetadata';

export const VcDetailsContainer: React.FC = props => {
  if (VCMetadata.fromVC(props.vc).isFromOpenId4VCI()) {
    return (
      <EsignetMosipVCItemDetails
        vc={undefined}
        isBindingPending={false}
        {...props}
      />
    );
  }
  return (
    <ExistingMosipVCItemDetails
      vc={undefined}
      isBindingPending={false}
      {...props}
    />
  );
};
