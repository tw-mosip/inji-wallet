import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity, View, Image} from 'react-native';
import {Button, Centered, Column, Row, Text} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
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

  const cameraRef = useRef<Camera>();

  const [screenColor, setScreenColor] = useState('blue');


  async function captureImage(face) {
    try {
      if (cameraRef.current) {
        const pic = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 1,
          exif: false,
        });
        console.log(pic.uri);
        console.log('height->', pic.height);
        console.log('width->', pic.width);

        // Assuming you have the positions of the left and right eyes
        const leftEyePosition = face.leftEyePosition;
        const rightEyePosition = face.rightEyePosition;

        // Load the original image
        Image.getSize(pic.uri, (originalWidth, originalHeight) => {
          // Calculate the bounding box that encompasses both eyes
          const minX = Math.min(leftEyePosition.x, rightEyePosition.x);
          const minY = Math.min(leftEyePosition.y, rightEyePosition.y);
          const maxX = Math.max(leftEyePosition.x, rightEyePosition.x);
          const maxY = Math.max(leftEyePosition.y, rightEyePosition.y);

          // Calculate the width and height of the bounding box
          const width = maxX - minX;
          const height = maxY - minY;

          // Calculate the aspect ratio of the original image
          const aspectRatio = originalWidth / originalHeight;

          // Calculate the width and height of the cropped image based on the aspect ratio
          let croppedWidth = width;
          let croppedHeight = height;
          if (width / height > aspectRatio) {
            croppedHeight = width / aspectRatio;
          } else {
            croppedWidth = height * aspectRatio;
          }

          // Calculate the coordinates of the top-left corner of the bounding box in the original image
          const offsetX = minX - (croppedWidth - width) / 2;
          const offsetY = minY - (croppedHeight - height) / 2;

          // Crop the image using the calculated bounding box
          ImageEditor.cropImage(pic.uri, {
            offset: {x: 50, y: 200},
            size: {width: 1500, height: 2000},
            displaySize: {width: 200, height: 150},
            resizeMode: 'contain',
          }).then((result)=> {
            console.log("Cropped image uri-->", result.uri);
          });
        });
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
        bounds.origin.x + bounds.size.width >= 300 && bounds.origin.x <= 320;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 300 && bounds.origin.y <= 320;
      // Check if the entire face is within the camera frame and close to screen
      if (withinXBounds && withinYBounds) {
        await captureImage(faces[0]);
        setScreenColor('yellow');// red, blue, yellow, 
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
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
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
