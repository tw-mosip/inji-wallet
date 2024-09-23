import React, {useState} from 'react';
import {Text, Pressable, Modal, Linking, View} from 'react-native';
import WebView from 'react-native-webview';
import {Theme} from '../../components/ui/styleUtils';

export const HomeScreenWebView: React.FC = props => {
  const [isWebViewVisible, setWebViewVisible] = useState(false);

  const openApp2FromWebView = message => {
    Linking.openURL(`app2scheme://redirection?status=${message}`);
  };

  const handleWebViewMessage = event => {
    const message = event.nativeEvent.data;
    setWebViewVisible(false);
    openApp2FromWebView(message);
  };

  return (
    <React.Fragment>
      <Pressable
        onPress={() => setWebViewVisible(true)}
        style={({pressed}) => ({
          backgroundColor: pressed ? '#ddd' : Theme.Colors.gradientBtn[0],
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        })}>
        <Text style={{color: 'white', fontSize: 18}}>Open WebView</Text>
      </Pressable>
      <Modal
        visible={isWebViewVisible}
        onRequestClose={() => setWebViewVisible(false)}
        animationType="none">
        <WebView
          source={{
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head><meta charset="UTF-8"></head>
              <body>
                <h1>Custom WebView Content</h1>
                <button id="success">Send Success to App 2</button>
                <button id="failure">Send Failure to App 2</button>
                <script>
                  document.getElementById('success').addEventListener('click', function() {
                    window.ReactNativeWebView.postMessage('success');
                  });
                  document.getElementById('failure').addEventListener('click', function() {
                    window.ReactNativeWebView.postMessage('failure');
                  });
                </script>
              </body>
              </html>
            `,
          }}
          javaScriptEnabled={true}
          onMessage={handleWebViewMessage}
          style={{flex: 1}}
        />

        <Pressable
          onPress={() => setWebViewVisible(false)}
          style={{
            backgroundColor: Theme.Colors.gradientBtn[0],
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            margin: 20,
          }}>
          <Text style={{color: 'white', fontSize: 18}}>Close WebView</Text>
        </Pressable>
      </Modal>
    </React.Fragment>
  );
};

export default HomeScreenWebView;

export interface HomeScreenWebViewProps {
  status: string;
}
