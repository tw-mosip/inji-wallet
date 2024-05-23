import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera, CameraCapturedPicture, ImageType} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import { Centered, Column, Row, Text, Button} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
import {getColors} from 'react-native-image-colors';
import hexRgb, { RgbaObject } from 'hex-rgb';
import {closest} from 'color-diff';
import { faceCompare } from '@iriscan/biometric-sdk-react-native';
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
  selectCameraRef,
} from '../machines/faceScanner';
import {selectIsLivenessEnabled} from '../machines/settings';
import {GlobalContext} from '../shared/GlobalContext';
import {selectIsActive} from '../machines/app';
import {RotatingIcon} from './RotatingIcon';
import {Theme} from './ui/styleUtils';
import {SvgImage} from './ui/svg';
import Spinner from 'react-native-spinkit';
import {isAndroid} from '../shared/constants';

export const FaceScanner: React.FC<FaceScannerProps> = props => {

  const {t} = useTranslation('FaceScanner');
  const {appService} = useContext(GlobalContext);
  const settingsService = appService?.children?.get('settings') || {};
  const isActive = useSelector(appService, selectIsActive);

  const machine = useRef(createFaceScannerMachine(props.vcImage));
  const service = useInterpret(machine.current);

  const whichCamera = useSelector(service, selectWhichCamera);
  const cameraRef = useSelector(service, selectCameraRef);
  const livenessEnabled = useSelector(settingsService, selectIsLivenessEnabled);

  const rxDataURI = /data:(?<mime>[\w/\-.]+);(?<encoding>\w+),(?<data>.*)/;
  const matches = rxDataURI.exec(props.vcImage).groups;
  const vcFace = matches.data;

  const isPermissionDenied = useSelector(service, selectIsPermissionDenied);
  const isValid = useSelector(service, selectIsValid);
  const isInvalid = useSelector(service, selectIsInvalid);
  const isCheckingPermission = useSelector(service, selectIsCheckingPermission);
  const isScanning = useSelector(service, selectIsScanning);
  const isCapturing = useSelector(service, selectIsCapturing);
  const isVerifying = useSelector(service, selectIsVerifying);

  const [counter, setCounter] = useState(0);
  const [screenColor, setScreenColor] = useState('#0000ff');
  const [opacity, setOpacity] = useState(1);
  const [faceToCompare, setFaceToCompare] = useState(null);
  const MAX_COUNTER = 15; // Total number of times handleCapture will be called


  const [picArray, setPicArray] = useState([]);
  let threshold;
  let faceCompareResult;
  const randomNumToFaceCompare = getRandomInt(counter, MAX_COUNTER - 1); 
  const [infoText, setInfoText] = useState<string>(t('livenessCaptureGuide'));

  let FaceCropPicArray: any[] = new Array();
  let EyeCropPicArray: any[] = new Array();
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

  let colors = ['#0000FF', '#00FF00', '#FF0000'];
  let resultsSet: any[] = new Array();

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getEyeColorPredictionResult(
    LeftrgbaColors: import('hex-rgb').RgbaObject[],
    color: RgbaObject,
  ) {
    const palette = [
      {R: 255, G: 0, B: 0},
      {R: 0, G: 255, B: 0},
      {R: 0, G: 0, B: 255},
    ];
  
    LeftrgbaColors.forEach(colorRGBA => {
      let colorRGB = {};
      colorRGB['R'] = colorRGBA.red;
      colorRGB['G'] = colorRGBA.green;
      colorRGB['B'] = colorRGBA.blue;
  
      const closestColor = closest(colorRGB, palette);
  
      const result =
        color.red === closestColor.R &&
        color.blue === closestColor.B &&
        color.green === closestColor.G;

      resultsSet.push(result);
  
    });
  }

  async function CropEyes() {

    await Promise.all(
      picArray.map(async pic => {

        const image = pic.image;
        face = (await FaceDetector.detectFacesAsync(image.uri, camoptions))
          .faces[0];

        let leftEyeOpenProb = face.leftEyeOpenProbability;
        let rightEyeOpenProb = face.rightEyeOpenProbability;

        // prob numbers is magic numbers
        if (leftEyeOpenProb > 0.85 && rightEyeOpenProb > 0.85) {
          faceImage = await ImageEditor.cropImage(image.uri, {
            offset: {x: face.bounds.origin.x, y: face.bounds.origin.y},
            size: {
              width: face.bounds.size.width,
              height: face.bounds.size.height,
            },
          });

          FaceCropPicArray.push({color: pic.color, image: faceImage});
        }
      }),
    );

    await Promise.all(
      FaceCropPicArray.map(async pics => {
        const image = pics.image;

        let lefteyex = isAndroid() ? face.LEFT_EYE.x : face.leftEyePosition.x;
        let righteyex = isAndroid()
          ? face.RIGHT_EYE.x
          : face.rightEyePosition.x;
        let lefteyey = isAndroid() ? face.LEFT_EYE.y : face.leftEyePosition.y;
        let righteyey = isAndroid()
          ? face.RIGHT_EYE.x
          : face.rightEyePosition.y;

        let offsetX = 200;
        let offsetY = 350;
        let leftcroppedImage;
        let rightcroppedImage;

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

        EyeCropPicArray.push({
          color: pics.color,
          leftEye: leftcroppedImage,
          rightEye: rightcroppedImage,
        });
      }),
    );

    await Promise.all(
      EyeCropPicArray.map(async pics => {
        const color = hexRgb(pics.color);
        const leftEye = pics.leftEye;
        const rightEye = pics.rightEye;

        const leftEyeColors = await getColors(leftEye.uri);
        const rightEyeColors = await getColors(rightEye.uri);

        let colorFiltered = ['background', 'dominant'];

        let LeftrgbaColors = Object.values(leftEyeColors)
          .filter(
            color =>
              typeof color === 'string' &&
              color.startsWith('#') &&
              !colorFiltered.includes(color),
          )
          .map(color => hexRgb(color));

        let RightrgbaColors = Object.values(rightEyeColors)
          .filter(
            color =>
              typeof color === 'string' &&
              color.startsWith('#') &&
              !colorFiltered.includes(color),
          )
          .map(color => hexRgb(color));

        await getEyeColorPredictionResult(LeftrgbaColors, color); // {r,g,b,a}, {r,g,b,a}
        await getEyeColorPredictionResult(RightrgbaColors, color); // {r,g,b,a}, {r,g,b,a}
      }),
    );

    threshold =
      (resultsSet.filter(element => element).length / resultsSet.length) * 100;
    console.log('Threshold is ->', threshold);

    console.log('Face to compare URI is-->', faceToCompare.uri);
    faceCompareResult = await faceCompare(vcFace, faceToCompare.base64);
    console.log('faceresult is-->', faceCompareResult);

    console.log('End time-->', Date.now());
    // if(threshold > 40  && faceCompareResult){
    // props.onValid();
    // }
    // else{
    props.onInvalid();
    // }
  }

  async function captureImage(screenColor) {
    try {
      if (cameraRef) {
        const capturedImage = await cameraRef.takePictureAsync({
          base64: true,
          quality: 1,
          imageType: ImageType.jpg,
        });
        setPicArray([...picArray, {color: screenColor, image: capturedImage}]);

        if (counter === randomNumToFaceCompare) {
          setFaceToCompare(capturedImage);
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const handleFacesDetected = async ({faces}) => {
    if (!livenessEnabled) {
      return;
    }
    if (counter == MAX_COUNTER) {
      setCounter(counter + 1);
      cameraRef.pausePreview();
      setScreenColor('#ffffff');
      await CropEyes();
      return;
    } else if (faces.length > 0) {
      const {bounds, yawAngle, rollAngle} = faces[0];

      // Magic numbers
      const withinXBounds =
        bounds.origin.x + bounds.size.width >= 280 && bounds.origin.x <= 300;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 280 && bounds.origin.y <= 300;
      const withinYawAngle = yawAngle > -10 && yawAngle < 10;
      const withinRollAngle = yawAngle > -3 && rollAngle < 3;

      setInfoText(t('faceOutGuide'));

      if (
        withinXBounds &&
        withinYBounds &&
        withinRollAngle &&
        withinYawAngle &&
        counter < MAX_COUNTER
      ) {
        if (counter == 0) {
          console.log('Start time-->', Date.now());
        }
        const randomNum = getRandomInt(0, 2);
        const randomColor = colors[randomNum];
        setScreenColor(randomColor);
        setCounter(counter + 1);
        setInfoText(t('faceInGuide'));
        await captureImage(screenColor);
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

  function handleOnCancel() {
    props.onCancel();
  }

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
    <Column
      fill
      {...(!livenessEnabled && {align: 'space-between'})}
      style={{backgroundColor: livenessEnabled ? screenColor : '#ffffff'}}>
      {livenessEnabled && (
        <View
          style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 9,
              width: Dimensions.get('window').width * 0.85,
              alignItems: 'center',
              marginTop: Dimensions.get('window').height * 0.15,
              padding: 3,
            }}>
            <Spinner type="ThreeBounce" color={Theme.Colors.Loading} />
            <Text size="small" weight="bold" color="black" align="center">
              {infoText}
            </Text>
          </View>
        </View>
      )}
      <View style={{flex: 2, marginTop: 15}}>
        <View style={Theme.Styles.scannerContainer}>
          <View>
            <Camera
              style={Theme.Styles.scanner}
              type={whichCamera}
              ref={setCameraRef}
              onFacesDetected={handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.accurate,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                runClassifications:
                  FaceDetector.FaceDetectorClassifications.all,
                contourMode: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 1000,
                tracking: true,
              }}
            />
          </View>
        </View>
      </View>
      {livenessEnabled ? (
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 9,
              width: Dimensions.get('window').width * 0.3,
              alignSelf: 'center',
              alignItems: 'center',
              height: 40,
              marginBottom: Dimensions.get('window').height * 0.1,
              opacity: opacity,
            }}
            onPressIn={() => setOpacity(0.5)}
            onPressOut={() => setOpacity(1)}
            onPress={handleOnCancel}>
            <Text size="small" weight="bold" margin="8" color="black">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Centered>
          {isCapturing || isVerifying ? (
            <RotatingIcon name="sync" size={64} />
          ) : (
            <Row align="center">
              <Centered style={Theme.Styles.imageCaptureButton}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('I am called inside touch');
                    service.send(FaceScannerEvents.CAPTURE());
                    console.log('I am called inside touch after');
                  }}>
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
      )}
    </Column>
  );
};
interface FaceScannerProps {
  vcImage: string;
  onValid: () => void;
  onInvalid: () => void;
  isLiveness: boolean;
  onCancel: () => void;
}
