import React, {useState} from 'react';
import {View, Text, Pressable, Linking, Modal} from 'react-native';

export const HomeScreenWebView2: React.FC<HomeScreenWebView2Props> = props => {
  const sendResultToApp1 = (result: string) => {
    const app1DeepLink = `app1scheme://redirection?status=${result}`;
    props.setVisible(false);
    Linking.openURL(app1DeepLink).catch(err =>
      console.error('Failed to open App1:', err),
    );
  };

  return (
    <React.Fragment>
      <Modal visible={props.isVisible}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 40, marginBottom: 20}}>App ID Peru</Text>
          <Pressable
            onPress={() => sendResultToApp1('success')}
            style={({pressed}) => ({
              backgroundColor: pressed ? '#28a745' : '#218838',
              padding: 10,
              borderRadius: 5,
              marginBottom: 20,
            })}>
            <Text style={{color: 'white', fontSize: 18}}>
              Face Auth Success
            </Text>
          </Pressable>

          <Pressable
            onPress={() => sendResultToApp1('failure')}
            style={({pressed}) => ({
              backgroundColor: pressed ? '#dc3545' : '#c82333',
              padding: 10,
              borderRadius: 5,
            })}>
            <Text style={{color: 'white', fontSize: 18}}>
              Face Auth Failure
            </Text>
          </Pressable>
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default HomeScreenWebView2;

export interface HomeScreenWebView2Props {
  isVisible: Boolean;
  setVisible: (Boolean) => void;
}
