import {Centered, Column} from './Layout';
import {Image, View} from 'react-native';
import {Theme} from './styleUtils';
import testIDProps from '../../shared/commonUtil';
import Spinner from 'react-native-spinkit';
import React from 'react';

export const ActivityIndicator = () => {
  return (
    <Centered
      style={{backgroundColor: Theme.Colors.whiteBackgroundColor}}
      crossAlign="center"
      fill>
      <Column
        style={{
          flex: 1,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}
        margin="24 0"
        align="center"
        crossAlign="center">
        <Image
          source={Theme.InjiProgressingLogo}
          height={2}
          width={2}
          style={{marginLeft: -6}}
          {...testIDProps('progressingLogo')}
        />
        <View {...testIDProps('threeDotsLoader')}>
          <Spinner
            type="ThreeBounce"
            color={Theme.Colors.Loading}
            style={{marginLeft: 6}}
          />
        </View>
      </Column>
    </Centered>
  );
};
