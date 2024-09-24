import React, { useState, useEffect } from 'react';
import { Text, Pressable, Modal, View } from 'react-native';
import WebView from 'react-native-webview';
import { Theme } from '../../components/ui/styleUtils';

export const HomeScreenWebView: React.FC<HomeScreenWebViewProps> = ({ status }) => {
  const [isWebViewVisible, setWebViewVisible] = useState(true); // WebView is visible initially

  // Inject status into WebView when the WebView is rendered
  const getWebViewHTML = (status: string) => {
    return `
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
        <div id="app2Message">Message from App2: ${status}</div>
        <button id="openApp2">Open App2</button>
        <script>
          document.getElementById('openApp2').addEventListener('click', function() {
            window.ReactNativeWebView.postMessage('openApp2');
          });
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'openApp2') {
      setWebViewVisible(false); // Hide WebView when opening App2
      // Simulate opening App2 (this would be where you trigger deep linking)
    }
  };

  return (
    <React.Fragment>
      {/* WebView Modal */}
      <Modal
        visible={isWebViewVisible}
        onRequestClose={() => setWebViewVisible(false)}
        animationType="none">
        <WebView
          source={{
            html: getWebViewHTML(status), // Pass the status as part of the WebView HTML content
          }}
          javaScriptEnabled={true}
          onMessage={handleWebViewMessage}
          style={{ flex: 1 }}
        />

        {/* Button to close WebView */}
        <Pressable
          onPress={() => setWebViewVisible(false)}
          style={{
            backgroundColor: Theme.Colors.gradientBtn[0],
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            margin: 20,
          }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Close WebView</Text>
        </Pressable>
      </Modal>

      {/* Show the message from App2 in a separate view */}
      <View style={{ padding: 20, backgroundColor: '#f8f8f8' }}>
        <Text style={{ fontSize: 18 }}>Message from App2: {status}</Text>
      </View>
    </React.Fragment>
  );
};

export default HomeScreenWebView;

export interface HomeScreenWebViewProps {
  status: string;
}
