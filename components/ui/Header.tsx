import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { HomeRouteProps } from '../../routes/main';
import { Column, Row } from './Layout';
import { Theme } from './styleUtils';

export const Header: React.FC<HeaderProps> = ({ navigation, title }) => {
  return (
    <Column safe align="center">
      <Row elevation={2}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 18,
            marginBottom: 22,
            marginVertical: 16,
          }}>
          <TouchableOpacity onPress={navigation.goBack}>
            <Icon
              name="arrow-left"
              type="material-community"
              onPress={navigation.goBack}
              containerStyle={{
                ...Theme.Styles.backArrowContainer,
                marginLeft: 10,
              }}
              color={Theme.Colors.Icon}
            />
          </TouchableOpacity>
          <Row fill align={'center'}>
            <Column>
              <View style={{ alignItems: 'center', marginLeft: -40 }}>
                <Text style={Theme.TextStyles.semiBoldHeader}>{title}</Text>
              </View>
            </Column>
          </Row>
        </View>
      </Row>
    </Column>
  );
};

interface HeaderProps {
  title: string;
  navigation: HomeRouteProps['navigation'];
}
