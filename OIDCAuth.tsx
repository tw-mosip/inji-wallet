import React, { useState } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import { authorize } from 'react-native-app-auth';

const mimotoConfig = {
  redirectUrl: 'io.mosip.residentapp.inji://oauthredirect',
  clientId: 'c578665bb6dea8ba01be',
  clientSecret: 'abb3ef56f401a4f821b7777d0352ce5dfd0d0d41',
  scopes: [],
  additionalHeaders: { Accept: 'application/json' },
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    // tokenEndpoint: 'https://api.dev3.mosip.net/residentmobileapp/getToken'
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  },
};

export function OIDCAuth(): JSX.Element {
  async function invokeAuthorization() {
    try {
      const result = await authorize(mimotoConfig);
      setLoggedIn(true);
      console.log('Result ->', result);
      setResponse(JSON.stringify(result, null, 4) + '');
    } catch (error) {
      console.log(error);
      setResponse(error.toString());
    }
  }

  const [loggedIn, setLoggedIn] = useState(false);
  const [response, setResponse] = useState('');

  return (
    <SafeAreaView>
      {loggedIn && <Text> Logged In SuccessFully </Text>}
      {response != '' && <Text> {response} </Text>}
      <Button title={'Mimoto'} onPress={invokeAuthorization} />
    </SafeAreaView>
  );
}
export default OIDCAuth;
