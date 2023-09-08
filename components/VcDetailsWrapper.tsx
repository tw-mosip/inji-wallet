import React from 'react';
import { VerifiableCredential, VC } from '../types/vc';
import { GenericVcDetails } from './GenericVcDetails';
import { VcDetails } from './VcDetails';

const MOSIPvc = 'MOSIPVerifiableCredential';

/**
 * isMOSIPvc returns true if the VC is of type=MOSIP
 */
const isMOSIPvc = (vc: VerifiableCredential) => {
  if (!vc) return true; // should ideally throw an error
  return vc.type.includes(MOSIPvc);
};

export const VcDetailsWrapper: React.FC<VcDetailsProps> = (props) => {
  if (isMOSIPvc(props.vc.verifiableCredential)) {
    // TODO: Check for VP when VC functionality is added
    return <VcDetails {...props} />;
  }
  return <GenericVcDetails {...props} />;
};

export interface VcDetailsProps {
  vc: VC;
  isBindingPending: boolean;
  onBinding?: () => void;
  activeTab?: Number;
  logo?: string;
}
