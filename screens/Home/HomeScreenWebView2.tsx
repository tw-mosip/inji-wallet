import React from 'react';
import {View, Text, Pressable, Linking} from 'react-native';

export const HomeScreenWebView2: React.FC<HomeScreenWebView2Props> = props => {
  const sendResultToApp1 = (result: string) => {
    const app1DeepLink = `app1scheme://redirection?status=${result}`;
    Linking.openURL(app1DeepLink).catch(err =>
      console.error('Failed to open App1:', err),
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 20, marginBottom: 20}}>App2 Screen</Text>

      {props.status === 'success' && (
        <Pressable
          onPress={() => sendResultToApp1('success')}
          style={({pressed}) => ({
            backgroundColor: pressed ? '#28a745' : '#218838',
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          })}>
          <Text style={{color: 'white', fontSize: 18}}>Send Success</Text>
        </Pressable>
      )}
      {props.status === 'failure' && (
        <Pressable
          onPress={() => sendResultToApp1('failure')}
          style={({pressed}) => ({
            backgroundColor: pressed ? '#dc3545' : '#c82333',
            padding: 10,
            borderRadius: 5,
          })}>
          <Text style={{color: 'white', fontSize: 18}}>Send Failure</Text>
        </Pressable>
      )}
    </View>
  );
};

export default HomeScreenWebView2;

export interface HomeScreenWebView2Props {
  status: string;
}
