import {Tooltip} from 'react-native-elements';
import {ViewStyle} from 'react-native';
import {Centered, Column} from './Layout';
import {Text} from './Text';
import React from 'react';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import {StyleProp} from 'react-native';

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
      <Centered style={props.triggerComponentStyles} fill>
        {props.triggerComponent}
      </Centered>
    </Tooltip>
  );
};

interface CustomTooltipProps {
  width: number;
  height: number;
  triggerComponent: React.ReactElement;
  triggerComponentStyles: StyleProp<ViewStyle>;
  testID?: string;
  toolTipContent?: React.ReactElement;
}
