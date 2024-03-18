import {  Text, View } from 'react-native';
import {Camera, CameraCapturedPicture, ImageType} from 'expo-camera';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { livenessGetDirection, faceCompare } from '@iriscan/biometric-sdk-react-native';
import { Column } from './ui';
import { Button } from 'react-native';
import { check } from 'react-native-permissions';

export default function LivenessDialog({ vcImage, onValid, onInvalid}) {
  const [device, setDevice] = useState(Camera.Constants.Type.front); 
  const camera = useRef<Camera>(null);
  const actions = ['UP', 'DOWN', 'RIGHT', 'LEFT'];

  const rxDataURI = /data:(?<mime>[\w/\-.]+);(?<encoding>\w+),(?<data>.*)/;
  const matches = rxDataURI.exec(vcImage).groups;


  const [actionText, setActionText] = useState('Look Straight and Click on Start');
  let isReal;
  const flipCamera = () => {
    const newDevice = device === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front;
    setDevice(newDevice);
  };

  const waitForDirection = async (action) => {
    let count = 0;
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const photo = await camera.current!.takePictureAsync({
            base64: true,
            imageType: ImageType.jpg
          });

          const direction = await livenessGetDirection(photo.base64);
          console.log(`Found head direction ${direction}`);

          if(direction === 'STRAIGHT'){
            const result =  faceCompare(photo.base64, matches.data);
            isReal = result;
          }

          if (direction === action) {
            console.log('Action passed');
            clearInterval(intervalId);
            resolve(true);
          }

          if (count >= 5) {
            clearInterval(intervalId);
            resolve(false);
          }
          count += 1;

        } catch (error) {
          console.log('ERROR: ' + JSON.stringify(error));
          clearInterval(intervalId);
          reject(false);
        }
      }, 1000);
    });
  };

  let isValidated = false;

  const checkActions = async () => {
  
    if(!isValidated){
    for (let i = 0; i < actions.length; ++i) {
      setActionText(`Please turn head ${actions[i]}`);
      const actionSuccess = await waitForDirection(actions[i]);
      if (!actionSuccess) {
        onInvalid();
        return;
      }
    }
    }

    if (!isValidated) {
      if (isReal) {
        isValidated = true;
        camera.current?.pausePreview();
        onValid();
      }else{
        onInvalid();
        return;
      }
    }
  };

  return (
    <View>
      <View
        style={{
          borderRadius: 24,
          alignSelf: 'center',
          height: 350,
          width: 320,
          overflow: 'hidden',
          marginBottom: 30,
        }}>
        <Camera
          ref={camera}
          type={device}
          style={{
            height: 400,
            width: '100%',
            margin: 'auto',
          }}
          ></Camera>
      </View>
      <Column>
        <Text
          style={{
            color: 'black',
            marginBottom: 30,
            fontSize: 28,
            textAlign: 'center'
          }}>
          {actionText}
        </Text>

          <Button
            title="Start Verification"
            onPress={() => {
                checkActions() }}
          />
  
          <Button
            title="Flip Camera"
            onPress={() => flipCamera()}
          />
      </Column>
    </View>
  );
}