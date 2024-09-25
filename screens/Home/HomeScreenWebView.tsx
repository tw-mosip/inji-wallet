import React, {useEffect, useState} from 'react';
import {Text, Pressable, Modal, View, Linking} from 'react-native';
import WebView from 'react-native-webview';
import {Theme} from '../../components/ui/styleUtils';

export const HomeScreenWebView: React.FC<HomeScreenWebViewProps> = ({
  status,
  setStatus,
}) => {
  const [isWebViewVisible, setWebViewVisible] = useState(false);

  useEffect(() => {
    if (status != '') {
      const timeoutId = setTimeout(() => {
        setWebViewVisible(false);
        setStatus('');
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  const getWebViewHTML = (status: string) => {
    return `

       <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          #qrCode {
            padding: 20px;
            font-size: 60px;
            margin: 20px;
          }
          #app2Message {
          	font-size: 25px;
          }
          img {
            margin-top: 20px; /* Space between button and image */
            max-width: 100%; /* Make the image responsive */
            height: auto; /* Maintain aspect ratio */
          }

        </style>
      </head>
      <body>
        <div>
          <button id="qrCode">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/QR_Code_Example.svg" alt="QR Code" />
          </button>
          <div id="app2Message"><h1>${
            status ? `Message from App ID Peru: ${status}` : ''
          }</h1></div>
        </div>
        <script>
          document.getElementById('qrCode').addEventListener('click', function() {
            window.ReactNativeWebView.postMessage('success');
          });
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = event => {
    const message = event.nativeEvent.data;
    Linking.openURL(`app2scheme://redirection?status=${message}`);
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
        <Text style={{color: 'white', fontSize: 18}}>
          Open Platform ID Peru
        </Text>
      </Pressable>
      <Modal
        visible={isWebViewVisible}
        onRequestClose={() => setWebViewVisible(false)}
        animationType="none">
        <WebView
          source={{
            html: getWebViewHTML(status),
          }}
          javaScriptEnabled={true}
          onMessage={handleWebViewMessage}
          style={{flex: 1}}
        />
      </Modal>
    </React.Fragment>
  );
};

export default HomeScreenWebView;

export interface HomeScreenWebViewProps {
  status: string;
  setStatus: (string) => void;
}
