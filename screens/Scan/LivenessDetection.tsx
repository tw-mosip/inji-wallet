import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';


const FaceDetection = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [flashColor, setFlashColor] = useState('');

  let camera: Camera;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isFaceDetected) {
      interval = setInterval(() => {
        const randomColor = Math.floor(Math.random() * 3);
        const colors = ['#FF0000', '#00FF00', '#0000FF'];
        setFlashColor(colors[randomColor]);
        setTimeout(() => {
          setFlashColor(null);
          takePicture();
        }, 500);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isFaceDetected]);

  const handleFaceDetection = (faces) => {
    if (faces.length > 0) {
      const { bounds } = faces[0];
      const ovalBounds = { x: 100, y: 150, width: 200, height: 300 };// adjust based on our sizes
      if (
        bounds.origin.x > ovalBounds.x &&
        bounds.origin.y > ovalBounds.y &&
        bounds.origin.x + bounds.size.width < ovalBounds.x + ovalBounds.width &&
        bounds.origin.y + bounds.size.height < ovalBounds.y + ovalBounds.height
      ) {
        setIsFaceDetected(true);
      } else {
        setIsFaceDetected(false);
      }
    } else {
      setIsFaceDetected(false);
    }
  };

  const handleCapture = async () => {
    if (isFaceDetected) {
      const randomColor = Math.floor(Math.random() * 3);
      const colors = ['#FF0000', '#00FF00', '#0000FF'];
      const imageUri = await takePicture();
      setCapturedImages([...capturedImages, { uri: imageUri, color: colors[randomColor] }]);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      return photo.uri;
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        onFacesDetected={handleFaceDetection}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: false,
        }}
        ref={(ref) => {
          this.camera = ref;
        }}
      >
        <View style={styles.oval} />
        <View style={styles.oval} />
        {flashColor && <View style={[styles.flashColor, { backgroundColor: flashColor }]} />}
      </Camera>
      {isFaceDetected && (
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <Text style={styles.captureText}>Capture</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  oval: {
    width: 200,
    height: 300,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -150,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
  },
  captureText: {
    color: 'white',
    fontSize: 20,
  },
  flashColor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.8,
  },
});

export default FaceDetection;
