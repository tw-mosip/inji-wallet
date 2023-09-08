import React from 'react';
import { VerifiableCredential } from '../types/vc';
import { VcItemContent, VcItemContentProps } from './VcItemContent';
import { GenericVcItemContent } from './GenericVcItemContent';

const MOSIPvc = 'MOSIPVerifiableCredential';

/**
 * isMOSIPvc returns true if the VC is of type=MOSIP
 */
const isMOSIPvc = (vc: VerifiableCredential) => {
  if (!vc) return true; // should ideally throw an error
  return vc.type.includes(MOSIPvc);
};

export const VcItemContentWrapper: React.FC<VcItemContentProps> = (props) => {
  if (isMOSIPvc(props.verifiableCredential)) {
    return <VcItemContent {...props} />;
  }
  return <GenericVcItemContent {...props} />;
};
