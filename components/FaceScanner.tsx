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
import { log } from 'xstate/lib/actions';
import { sleep } from '../shared/commonUtil';

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

  const [screenColor, setScreenColor] = useState('#FF0000');

  async function captureImage(face1) {
    lock = true;
    try {
      let camoptions = {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        contourMode: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 500,
        tracking: true,
      };
      let faceBounds;
      let face;
      let faceImage;

      if (cameraRef.current) {
        console.log('Time before capture-->', Date.now());
        const pic = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
          exif: false,
        });

        if (pic !== null && pic !== undefined) {
          face = (await FaceDetector.detectFacesAsync(pic.uri, camoptions))
            .faces[0];
          console.log('Captured face points', face);
        }

        // if(faceBounds !== null && faceBounds !== undefined) {
        //   console.log('Inside faceBounds');
        //   faceImage = await ImageEditor.cropImage(pic.uri, {
        //     offset: { x: faceBounds.bounds.origin.x, y: faceBounds.bounds.origin.y },
        //     size: { width: faceBounds.bounds.size.width, height: faceBounds.bounds.size.height },
        //   });

        //   console.log('Face Image', faceImage.uri);

        // if (faceImage !== null && faceImage !== undefined) {
        //   face = (await FaceDetector.detectFacesAsync(faceImage.uri, camoptions)).faces[0];
        //   console.log('Cropped face points', face);

        // if (face !== null && face !== undefined) {

        let colors;
        let rgbaColors;
        let redsum = 0;
        let greensum = 0;
        let bluesum = 0;

        let faceWidth = face.bounds.size.width;
        let scaleFactor = pic.width / faceWidth;

        let lefteyex = face.leftEyePosition.x;
        let lefteyey = face.leftEyePosition.y;
        let offsetX = 200;

        if (face !== null && face !== undefined) {
          let croppedImage = await ImageEditor.cropImage(pic.uri, {
            offset: {
              x: lefteyex * scaleFactor - offsetX,
              y: lefteyey * scaleFactor - offsetX,
            },
            size: {width: offsetX * 2, height: offsetX - 50},
          });
          console.log('Cropped image uri-->', croppedImage.uri);

          if (Platform.OS == 'ios') {
            colors = await getColors(croppedImage.uri);
            console.log('Colors are ->', colors);

            rgbaColors = Object.values(colors)
              .filter(
                color => typeof color === 'string' && color.startsWith('#'),
              )
              .map(color => hexRgb(color));

            console.log('RGB colors are ->', rgbaColors);

            rgbaColors.forEach(color => {
              redsum += color.red;
              greensum += color.green;
              bluesum += color.blue;
            });

            console.log('red-->', redsum);
            console.log('blue-->', bluesum);
            console.log('green-->', greensum);
          }
        } else {
          console.log('No face detected in the cropped image.');
        }
      } else {
        console.log('Face image could not be generated.');
      }
      setScreenColor('#0000FF');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
    lock = false;
  }
  
let captureCount = 0;
let lock = false;

async function lockFlow(face){
  if(lock){
    setTimeout(async ()=> {
      await lockFlow(face);
    },200);
    return;
  }
  await captureImage(face);
}

  const handleFacesDetected = async ({faces}) => {
    if (faces.length > 0) {
      console.log("Time when the face is detected-->", Date.now());
      //DeviceBrightness.setBrightnessLevel(1);
      const {bounds, yawAngle, rollAngle} = faces[0];

      console.log('facessss-->', faces[0]);

      const withinXBounds =
        bounds.origin.x + bounds.size.width >= 310 && bounds.origin.x <= 320;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 310 && bounds.origin.y <= 320;
      const withinYawAngle = yawAngle > -10 && yawAngle < 10;
      const withinRollAngle = yawAngle > -3 && rollAngle < 3;
      
      if (withinXBounds && withinYBounds && withinRollAngle && withinYawAngle && captureCount < 2 ) {
        captureCount += 1;
        lockFlow(faces[0]);
        // await captureImage(faces[0]);
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
            mode: FaceDetector.FaceDetectorMode.accurate,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            contourMode: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 1000,
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
