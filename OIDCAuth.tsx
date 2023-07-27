import React, { useState } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import { authorize } from 'react-native-app-auth';

export function OIDCAuth(): JSX.Element {
  async function invokeGithubAuthorization() {
    const config = {
      redirectUrl: 'io.mosip.residentapp://oauth',
      // redirectUrl: '',
      clientId: 'c578665bb6dea8ba01be',
      clientSecret: 'abb3ef56f401a4f821b7777d0352ce5dfd0d0d41',
      scopes: [],
      additionalHeaders: { Accept: 'application/json' },
      serviceConfiguration: {
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        tokenEndpoint: 'https://github.com/login/oauth/access_token',
        revocationEndpoint:
          'https://github.com/settings/connections/applications/c578665bb6dea8ba01be',
      },
    };
    try {
      const result = await authorize(config);
      setLoggedIn(true);
      console.log('Result ->', result);
      setResponse(JSON.stringify(result, null, 4) + '');
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  }

  async function invokeZoomAuthorization() {
    const config = {
      redirectUrl: 'com.oauthproject://oauthredirect',
      clientId: 'EIpYEJpASSurl2jEqvVrLA',
      clientSecret: 'ZzmpyLqnOLshLVyrQEwOG7Ce8CjmcsAb',
      scopes: ['identity'],
      additionalHeaders: { Accept: 'application/json' },
      serviceConfiguration: {
        authorizationEndpoint: 'https://github.com/login/oauth/authorize',
        tokenEndpoint: 'https://github.com/login/oauth/access_token',
        revocationEndpoint:
          'https://github.com/settings/connections/applications/c578665bb6dea8ba01be',
      },
    };
    try {
      const result = await authorize(config);
      setLoggedIn(true);
      console.log('Result ->', result);
      setResponse(JSON.stringify(result, null, 4) + '');
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  }

  async function invokeMimoto() {
    const response = await fetch('https://google.com');
    console.log('Response from MIMOTO : ', response);
  }

  const [loggedIn, setLoggedIn] = useState(false);
  const [response, setResponse] = useState('');

  return (
    <SafeAreaView>
      <Text> Hello </Text>
      <Button title={'Github'} onPress={invokeGithubAuthorization} />
      {loggedIn && <Text> Logged In SuccessFully </Text>}
      {response != '' && <Text> {response} </Text>}

      {/*<Button title={'Mimoto'} onPress={invokeMimoto} />*/}
    </SafeAreaView>
  );
}
export default OIDCAuth;
