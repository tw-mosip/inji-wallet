import React, { useContext, useRef } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { Pressable } from 'react-native';
import { ActorRefFrom } from 'xstate';

import {
  createVCItemMachine,
  selectContext,
  selectCredentials,
  selectGeneratedOn,
  VCItemEvents,
  VCItemMachine,
} from './VCItemMachine';
import { logState } from '../../machines/app';
import { Theme } from '../ui/styleUtils';
import { GlobalContext } from '../../shared/GlobalContext';
import { Row } from '../ui';
import { VcItemActivationStatus } from '../VcItemActivationStatus';
import { VCItemContent } from './VCItemContent';
import { KebabPopUp } from '../KebabPopUp';
import { selectKebabPopUp } from '../../machines/vcItem';

export const VCItem: React.FC<VCItemProps> = (props) => {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    createVCItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );

  const service = useInterpret(machine.current, { devTools: __DEV__ });
  service.subscribe(logState);
  const context = useSelector(service, selectContext);

  const isKebabPopUp = useSelector(service, selectKebabPopUp);
  const DISMISS = () => service.send(VCItemEvents.DISMISS());
  const KEBAB_POPUP = () => service.send(VCItemEvents.KEBAB_POPUP());

  const credentials = useSelector(service, selectCredentials);
  const generatedOn = useSelector(service, selectGeneratedOn);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => props.onPress(service)}
        disabled={!credentials}
        style={
          props.selected
            ? Theme.Styles.selectedBindedVc
            : Theme.Styles.closeCardBgContainer
        }>
        <VCItemContent
          context={context}
          credential={credentials}
          generatedOn={generatedOn}
          selectable={props.selectable}
          selected={props.selected}
          service={service}
          iconName={props.iconName}
          iconType={props.iconType}
          onPress={() => props.onPress(service)}
        />
        {props.isSharingVc ? null : (
          <Row crossAlign="center">
            {props.activeTab !== 'receivedVcsTab' &&
              props.activeTab != 'sharingVcScreen' && (
                <VcItemActivationStatus
                  verifiableCredential={credentials}
                  onPress={() => props.onPress(service)}
                  showOnlyBindedVc={props.showOnlyBindedVc}
                  emptyWalletBindingId
                />
              )}
            <Pressable onPress={KEBAB_POPUP}>
              <KebabPopUp
                vcKey={props.vcKey}
                iconName="dots-three-horizontal"
                iconType="entypo"
                isVisible={isKebabPopUp}
                onDismiss={DISMISS}
                service={service}
              />
            </Pressable>
          </Row>
        )}
      </Pressable>
    </React.Fragment>
  );
};

interface VCItemProps {
  vcKey: string;
  margin?: string;
  selectable?: boolean;
  selected?: boolean;
  showOnlyBindedVc?: boolean;
  onPress?: (vcRef?: ActorRefFrom<typeof VCItemMachine>) => void;
  onShow?: (vcRef?: ActorRefFrom<typeof VCItemMachine>) => void;
  activeTab?: string;
  iconName?: string;
  iconType?: string;
  isSharingVc?: boolean;
}
