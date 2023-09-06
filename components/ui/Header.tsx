import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Column, Row } from './Layout';
import { Theme } from './styleUtils';

export const Header: React.FC<HeaderProps> = ({ goBack, title }) => {
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
          <TouchableOpacity onPress={goBack}>
            <Icon
              name="arrow-left"
              type="material-community"
              onPress={goBack}
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
  goBack: () => void;
}
