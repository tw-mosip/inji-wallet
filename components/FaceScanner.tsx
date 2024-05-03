import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Camera, CameraType} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity, View} from 'react-native';
import {Button, Centered, Column, Row, Text} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
import { getColors } from 'react-native-image-colors';
import hexRgb from 'hex-rgb';
import {closest} from 'color-diff';
import {
  FaceScannerEvents,
  selectIsCheckingPermission,
  selectIsValid,
  selectIsPermissionDenied,
  selectIsScanning,
  selectWhichCamera,
  createFaceScannerMachine,
  selectIsInvalid,
  selectIsCapturing,
  selectIsVerifying,
} from '../machines/faceScanner';
import {GlobalContext} from '../shared/GlobalContext';
import {selectIsActive} from '../machines/app';
import {RotatingIcon} from './RotatingIcon';
import {Theme} from './ui/styleUtils';
import {SvgImage} from './ui/svg';
import { Platform } from 'react-native';

export const FaceScanner: React.FC<FaceScannerProps> = props => {
  const {t} = useTranslation('FaceScanner');
  const {appService} = useContext(GlobalContext);
  const isActive = useSelector(appService, selectIsActive);

  const machine = useRef(createFaceScannerMachine(props.vcImage));
  const service = useInterpret(machine.current);

  const whichCamera = useSelector(service, selectWhichCamera);

  const isPermissionDenied = useSelector(service, selectIsPermissionDenied);
  const isValid = useSelector(service, selectIsValid);
  const isInvalid = useSelector(service, selectIsInvalid);
  const isCheckingPermission = useSelector(service, selectIsCheckingPermission);
  const isScanning = useSelector(service, selectIsScanning);
  const isCapturing = useSelector(service, selectIsCapturing);
  const isVerifying = useSelector(service, selectIsVerifying);

  // let camera: Camera;
  // const cameraDevice = useCameraDevice('front');

  const cameraRef = useRef<Camera>(Camera.Constants.Type.front);

  const redColor = { red: 0, green: 0, blue: 255, alpha: 1 };

  const [screenColor, setScreenColor] = useState('#0000FF');

  async function captureImage(face) {
    try {

      // take picture
      if (cameraRef.current) {
        const pic = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
          exif: false,
        });


        console.log("Height-->", pic.height);
        console.log("Width-->", pic.width);
        console.log(pic.uri);

        let colors: any;
        let rgbaColors: any;

        let redsum= 0;
        let greensum= 0;
        let bluesum = 0;



        let originX = face.bounds.origin.x;
        let originY = face.bounds.origin.y;
        let faceWidth = face.bounds.size.width;
        let scaleFactor = pic.width/faceWidth;

        let lefteyex = face.leftEyePosition.x;
        let lefteyey = face.leftEyePosition.y;
        

        ImageEditor.cropImage(pic.uri, {
          offset: {x: (lefteyex * scaleFactor)-100, y: (lefteyey * scaleFactor)-100},
          size: {width: 200, height: 200},
          displaySize: {width:500, height: 500},
        }).then(result => {
          console.log('Cropped image uri-->', result.uri);

          if (Platform.OS == 'ios') {
            getColors(result.uri).then(result => {
              console.log('COlors are ->', result);
              colors = result;
              console.log('Result color is-->', colors);

              try {
                rgbaColors = Object.values(colors)
                  .filter(
                    color => typeof color === 'string' && color.startsWith('#'),
                  )
                  .map(color => hexRgb(color));
                console.log('RGB colors is ->', rgbaColors);

                rgbaColors.forEach(color => {
                  // Calculate the sum of RGBA components
                  redsum += color.red;
                  greensum += color.green;
                  bluesum += color.blue;
                
                  // Check if the current sum is greater than the maximum sum
                  // if (sum > maxSum) {
                  //     maxSum = sum;
                  //     maxKey = Object.keys(color).find(key => key !== 'alpha'); // Exclude 'alpha' key
                  // }
              });
              // console.log('Key with the highest sum:', maxKey);
              console.log("red-->", redsum);
              console.log("blue-->", bluesum);
              console.log("green-->", greensum);

              } catch (error) {
                console.log('Eroor is ', error);
              }
            });
          }
        });

        try {
          // Calculate the Euclidean distance between two colors
          // Red color in RGB
          // Find the closest color to red in each object
        } catch (err) {
          console.log('closest error is-->', err);
        }
        //setScreenColor('#FF0000');
        return;
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const handleFacesDetected = async ({faces}) => {
    if (faces.length > 0) {
      //DeviceBrightness.setBrightnessLevel(1);
      const {bounds} = faces[0];

      console.log('facessss-->', faces[0]);

      const withinXBounds =
        bounds.origin.x + bounds.size.width >= 310 && bounds.origin.x <= 320;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 310 && bounds.origin.y <= 320;
      // Check if the entire face is within the camera frame and close to screen
      if (withinXBounds && withinYBounds) {
        await captureImage(faces[0]);
        // red, blue, yellow, 
      }
    }
  };

  const setCameraRef = useCallback(
    (node: Camera) => {
      if (node != null && !isScanning) {
        service.send(FaceScannerEvents.READY(node));
      }
    },
    [isScanning],
  );

  useEffect(() => {
    if (isValid) {
      props.onValid();
    } else if (isInvalid) {
      props.onInvalid();
    }
  }, [isValid, isInvalid]);

  useEffect(() => {
    if (isActive) {
      service.send(FaceScannerEvents.APP_FOCUSED());
    }
  }, [isActive]);

  if (isCheckingPermission) {
    return <Column></Column>;
  } else if (isPermissionDenied) {
    return (
      <Column padding="24" fill align="space-between">
        <Text align="center" color={Theme.Colors.errorMessage}>
          {t('missingPermissionText')}
        </Text>
        <Button
          title={t('allowCameraButton')}
          onPress={() => service.send(FaceScannerEvents.OPEN_SETTINGS())}
        />
      </Column>
    );
  }

  return (
    <Column fill align="space-between" style={{backgroundColor: screenColor}}>
      <View style={Theme.Styles.scannerContainer}>
        <Camera
          style={Theme.Styles.scanner}
          type={whichCamera}
          ref={cameraRef}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            contourMode: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 500,
            tracking: true
          }}
        />
      </View>
      <Centered>
        {isCapturing || isVerifying ? (
          <RotatingIcon name="sync" size={64} />
        ) : (
          <Row align="center">
            <Centered style={Theme.Styles.imageCaptureButton}>
              <TouchableOpacity
                onPress={() => service.send(FaceScannerEvents.CAPTURE())}>
                {SvgImage.CameraCaptureIcon()}
              </TouchableOpacity>
              <Text size="small" weight="semibold" margin="8">
                {t('capture')}
              </Text>
            </Centered>

            <Centered>
              <TouchableOpacity
                onPress={() => service.send(FaceScannerEvents.FLIP_CAMERA())}>
                {SvgImage.FlipCameraIcon()}
              </TouchableOpacity>
              <Text size="smaller" weight="semibold" margin="8">
                {t('flipCamera')}
              </Text>
            </Centered>
          </Row>
        )}
      </Centered>
    </Column>
  );
};

interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
}
