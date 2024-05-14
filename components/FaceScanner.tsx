import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera, CameraCapturedPicture, CameraType} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as FileSystem from 'expo-file-system';
import {TouchableOpacity, View} from 'react-native';
import {Button, Centered, Column, Row, Text} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
import {getColors} from 'react-native-image-colors';
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
import {Platform} from 'react-native';
import {log} from 'xstate/lib/actions';
import {sleep} from '../shared/commonUtil';
import {color} from 'react-native-elements/dist/helpers';

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

  const cameraRef = useRef<Camera>(Camera.Constants.Type.front);

  const [screenColor, setScreenColor] = useState('#000000');

  // colors extract
  // colors match
  // result

  let counter = 0;
  let picArray = [{}];
  let FaceCropPicArray = [{}];
  let EyeCropPicArray = [{}];
  let face;
  let faceImage;
  let camoptions = {
    mode: FaceDetector.FaceDetectorMode.accurate,
    detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
    runClassifications: FaceDetector.FaceDetectorClassifications.all,
    contourMode: FaceDetector.FaceDetectorClassifications.all,
    minDetectionInterval: 500,
    tracking: true,
  };

  const MAX_COUNTER = 10; // Total number of times handleCapture will be called
  let colorCounts = {'#0000FF': 0, '#FF0000': 0, '#00FF00': 0};

  async function CropEyes() {
    await Promise.all(
      picArray.map(async pic => {
        const image = pic.image;
        face = (await FaceDetector.detectFacesAsync(image.uri, camoptions))
          .faces[0];

        let leftEyeOpenProb = face.leftEyeOpenProbability;
        let rightEyeOpenProb = face.rightEyeOpenProbability;

        if (leftEyeOpenProb > 0.85 && rightEyeOpenProb > 0.85) {
          // face crop
          faceImage = await ImageEditor.cropImage(image.uri, {
            offset: {x: face.bounds.origin.x, y: face.bounds.origin.y},
            size: {
              width: face.bounds.size.width,
              height: face.bounds.size.height,
            },
          });
          FaceCropPicArray.push({color: pic.colour, image: faceImage});
        } else {
          const cachedImagePath = image.uri;
          try {
            await FileSystem.deleteAsync(cachedImagePath);
            console.log('Cached image deleted successfully.');
          } catch (error) {
            console.error('Error deleting cached image:', error);
          }
        }
      }),
    );
    picArray = [{}];

    await Promise.all(
      FaceCropPicArray.map(async pics => {
        //let faceWidth = face.bounds.size.width;
        const image = pics.image;
        let lefteyex = face.leftEyePosition.x;
        let righteyex = face.rightEyePosition.x;
        let lefteyey = face.leftEyePosition.y;
        let righteyey = face.rightEyePosition.y;

        let offsetX = 200;
        let offsetY = 350;
        let leftcroppedImage;
        let rightcroppedImage;
        // left eye crop
        leftcroppedImage = await ImageEditor.cropImage(image.uri, {
          offset: {
            x: lefteyex - offsetX,
            y: lefteyey - offsetY,
          },
          size: {width: offsetX * 2, height: offsetY / 2 - 50},
        });

        rightcroppedImage = await ImageEditor.cropImage(image.uri, {
          offset: {
            x: righteyex - offsetX,
            y: righteyey - offsetY,
          },
          size: {width: offsetX * 2, height: offsetY / 2 - 50},
        });
        //console.log('Cropped image uri-->', croppedImage.uri);
        EyeCropPicArray.push({
          color: pics.color,
          leftEye: leftcroppedImage,
          rightEye: rightcroppedImage,
        });
      }),
    );
    FaceCropPicArray = [{}];

    if (Platform.OS == 'ios') {
      await Promise.all(
        EyeCropPicArray.map(async pics => {
          const color = pics.color;
          const leftEye = pics.leftEye;
          const rightEye = pics.rightEye;

          const leftEyeColors = await getColors(leftEye.uri);
          const rightEyeColors = await getColors(rightEye.uri);

          console.log(
            'Left eye colors --->',
            leftEyeColors,
            'and color is-->',
            color,
          );
          console.log(
            'Right eye colors --->',
            rightEyeColors,
            'and color is-->',
            color,
          );

          let LeftrgbaColors = Object.values(leftEyeColors)
            .filter(color => typeof color === 'string' && color.startsWith('#'))
            .map(color => hexRgb(color));
          console.log('RGB left are ->', LeftrgbaColors);

          let RightrgbaColors = Object.values(rightEyeColors)
            .filter(color => typeof color === 'string' && color.startsWith('#'))
            .map(color => hexRgb(color));
          console.log('RGB left are ->', RightrgbaColors);
        }),
      );
    }
    // let rgbaColors;
    // let redsum = 0;
    // let greensum = 0;
    // let bluesum = 0;
  }

  async function captureImage(screenColor) {
    try {
      if (cameraRef.current) {
        await cameraRef.current
          .takePictureAsync({
            base64: true,
            quality: 1,
            exif: false,
          })
          .then(resp => {
            console.log('Captured Image-->', resp.uri);
            picArray.push({color: screenColor, image: resp});
          });

        //   if (Platform.OS == 'ios') {
        //     colors = await getColors(croppedImage.uri);
        //     console.log('Colors are ->', colors);

        //     rgbaColors = Object.values(colors)
        //       .filter(
        //         color => typeof color === 'string' && color.startsWith('#'),
        //       )
        //       .map(color => hexRgb(color));

        //     console.log('RGB colors are ->', rgbaColors);

        //     rgbaColors.forEach(color => {
        //       redsum += color.red;
        //       greensum += color.green;
        //       bluesum += color.blue;
        //     });

        //     console.log('red-->', redsum);
        //     console.log('blue-->', bluesum);
        //     console.log('green-->', greensum);
        //   }
        //   else {
        //     console.log('No face detected in the cropped image.');
        //   }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const handleFacesDetected = async ({faces}) => {
    if (counter > MAX_COUNTER) {
      counter -= 10;
      cameraRef.current.pausePreview();
      setScreenColor('#000000');
      await CropEyes();
      return;
    } else if (faces.length > 0) {
      const {bounds, yawAngle, rollAngle} = faces[0];

      // console.log('facessss-->', faces[0]);

      const withinXBounds =
        bounds.origin.x + bounds.size.width >= 310 && bounds.origin.x <= 320;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 310 && bounds.origin.y <= 320;
      const withinYawAngle = yawAngle > -10 && yawAngle < 10;
      const withinRollAngle = yawAngle > -3 && rollAngle < 3;

      if (
        withinXBounds &&
        withinYBounds &&
        withinRollAngle &&
        withinYawAngle &&
        counter < MAX_COUNTER
      ) {
        const colors = Object.keys(colorCounts);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (colorCounts[randomColor] < 5) {
          setScreenColor(randomColor); // Set the screen color
          counter += 1; // Increment the counter
          colorCounts[randomColor]++;
          await captureImage(screenColor);
        }
      }
    }

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
              tracking: true,
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
};

interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
}
