import {Tooltip} from 'react-native-elements';
import {View} from 'react-native';
import {Centered, Column} from './Layout';
import {Text} from './Text';
import React from 'react';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';

export const CustomTooltip: React.FC<CustomTooltipProps> = props => {
  return (
    <Tooltip
      {...testIDProps(props.testID)}
      popover={props.toolTipContent}
      width={props.width}
      height={props.height}
      withPointer={true}
      withOverlay={false}
      skipAndroidStatusBar={true}
      pointerColor={Theme.Colors.toolTipPointerColor}
      containerStyle={Theme.Styles.tooltipContainerStyle}>
      <Centered width={32} fill>
        {props.triggerComponent}
      </Centered>
    </Tooltip>
  );
};

interface CustomTooltipProps {
  width: number;
  height: number;
  triggerComponent: React.ReactElement;
  testID?: string;
  toolTipContent?: React.ReactElement;
}
