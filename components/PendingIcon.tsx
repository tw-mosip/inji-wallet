import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Theme} from './ui/styleUtils';

const PendingIcon: React.FC = () => {
  return (
    <View style={Theme.Styles.verifiedIconContainer}>
      <View style={Theme.Styles.verifiedIconInner}>
        <Icon
          name="exclamation-circle"
          color={Theme.Colors.PendingIcon}
          size={12}
        />
      </View>
    </View>
  );
};

export default PendingIcon;
