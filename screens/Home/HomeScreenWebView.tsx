import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, Modal, Linking } from 'react-native';
import WebView from 'react-native-webview';
import { Theme } from '../../components/ui/styleUtils'; // Ensure this path is correct

export const HomeScreenWebView: React.FC = props => {
  const [isWebViewVisible, setWebViewVisible] = useState(false); // To control WebView modal visibility
  const [resultFromApp2, setResultFromApp2] = useState(null); // To store result from App2

  const webviewRef = useRef(null); // Ref to inject JS in WebView

  useEffect(() => {
    // Handle incoming deep links (App2 returning result to WebView)
    const handleDeepLink = (event) => {
      const { url } = event;
      const status = url.split('status=')[1]; // Extract the status (success/failure) from App2
      setResultFromApp2(status);
      setWebViewVisible(true); // Reopen the WebView when returning from App2
    };

    // Subscribe to deep link events
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Cleanup listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  // Function to open App2 via deep linking from WebView
  const openApp2FromWebView = () => {
    Linking.openURL('app2scheme://'); // Replace with actual App2 deep link scheme
  };

  // Handle messages from the WebView
  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'openApp2') {
      setWebViewVisible(false); // Hide the WebView when opening App2
      openApp2FromWebView(); // Navigate to App2
    }
  };

  return (
    <React.Fragment>
      {/* Button to open WebView */}
      <Pressable
        onPress={() => setWebViewVisible(true)} // Show WebView when pressed
        style={({ pressed }) => ({
          backgroundColor: pressed ? '#ddd' : Theme.Colors.gradientBtn[0],
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        })}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Open WebView</Text>
      </Pressable>

      {/* Modal containing WebView */}
      <Modal
        visible={isWebViewVisible}
        onRequestClose={() => setWebViewVisible(false)}
        animationType="slide"
      >
        <WebView
          ref={webviewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head><meta charset="UTF-8"></head>
              <body>
                <h1>Custom WebView Content</h1>
                <button id="myButton">Go to App2</button>
                <script>
                  document.getElementById('myButton').addEventListener('click', function() {
                    window.ReactNativeWebView.postMessage('openApp2');
                  });
                </script>
              </body>
              </html>
            `,
          }} // Use a custom WebView HTML instead of a URL
          javaScriptEnabled={true}
          onMessage={handleWebViewMessage} // Handle messages from WebView
          style={{ flex: 1 }}
        />

        {/* Display result from App2 interaction */}
        {resultFromApp2 && (
          <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#f8f8f8' }}>
            <Text style={{ fontSize: 18 }}>Result from App2: {resultFromApp2}</Text>
          </View>
        )}

        {/* Button to close WebView */}
        <Pressable
          onPress={() => setWebViewVisible(false)}
          style={{
            backgroundColor: Theme.Colors.gradientBtn[0],
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            margin: 20,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Close WebView</Text>
        </Pressable>
      </Modal>
    </React.Fragment>
  );
};

export default HomeScreenWebView;
