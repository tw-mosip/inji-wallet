import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import { Centered, Column, Row, Text, Button} from './ui';
import {useInterpret, useSelector} from '@xstate/react';
import {useTranslation} from 'react-i18next';
import ImageEditor from '@react-native-community/image-editor';
import {getColors} from 'react-native-image-colors';
import hexRgb, { RgbaObject } from 'hex-rgb';
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
  selectCameraRef,
} from '../machines/faceScanner';
import {selectIsLivenessEnabled,
} from '../machines/settings';
import {GlobalContext} from '../shared/GlobalContext';
import {selectIsActive} from '../machines/app';
import {RotatingIcon} from './RotatingIcon';
import {Theme} from './ui/styleUtils';
import {SvgImage} from './ui/svg';
import Spinner from 'react-native-spinkit';

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


  const [picArray, setPicArray] = useState([]);
  let threshold;

  const [infoText, setInfoText] = useState('Hold the phone steady, keep your face focused in the centre.');

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

  const MAX_COUNTER = 5; // Total number of times handleCapture will be called
  let colors = ['#0000FF','#00FF00','#FF0000'];
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
        let lefteyex = face.leftEyePosition.x;
        let righteyex = face.rightEyePosition.x;
        let lefteyey = face.leftEyePosition.y;
        let righteyey = face.rightEyePosition.y;

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

          let colorFiltered = ['background','dominant'];

          let LeftrgbaColors = Object.values(leftEyeColors)
            .filter(color => typeof color === 'string' && color.startsWith('#') && !colorFiltered.includes(color))
            .map(color => hexRgb(color));

          let RightrgbaColors = Object.values(rightEyeColors)
            .filter(color => typeof color === 'string' && color.startsWith('#')  && !colorFiltered.includes(color))
            .map(color => hexRgb(color));

          await getEyeColorPredictionResult(LeftrgbaColors,color);// {r,g,b,a}, {r,g,b,a}
          await getEyeColorPredictionResult(RightrgbaColors,color);// {r,g,b,a}, {r,g,b,a}

        }),
      );
      console.log("Result set is-->", resultsSet);
      console.log("End time-->", Date.now());

      threshold = resultsSet.filter(element => element).length/resultsSet.length * 100;
      console.log("Threshold is ->",threshold);

      if(threshold > 10 ){
      props.onValid();
      }
  }

  async function captureImage(screenColor) {
    try {
      if (cameraRef) {
        const capturedImage = await cameraRef.takePictureAsync({
          base64: true,
          quality: 1,
          exif: false,
        });
        setPicArray([...picArray,{color: screenColor, image: capturedImage}]);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  const handleFacesDetected = async ({faces}) => {
    if (!livenessEnabled){
      return;
    }
    if (counter == MAX_COUNTER) {
      setCounter(counter+1);
      cameraRef.pausePreview();
      setScreenColor('#ffffff');
      await CropEyes();
      return;
    } else if (faces.length > 0) {
      const {bounds, yawAngle, rollAngle} = faces[0];

      // Magic numbers
      const withinXBounds =
        bounds.origin.x + bounds.size.width >= 310 && bounds.origin.x <= 320;
      const withinYBounds =
        bounds.origin.y + bounds.size.height >= 310 && bounds.origin.y <= 320;
      const withinYawAngle = yawAngle > -10 && yawAngle < 10;
      const withinRollAngle = yawAngle > -3 && rollAngle < 3;

      setInfoText("Keep your face inside");

      if (
        withinXBounds &&
        withinYBounds &&
        withinRollAngle &&
        withinYawAngle && counter < MAX_COUNTER
      ) {
        if(counter == 0){
        console.log("Start time-->", Date.now())}
        const randomNum = getRandomInt(0,2);
        const randomColor = colors[randomNum];
        setScreenColor(randomColor); 
        setCounter(counter+1);
        setInfoText('Hellooooo');
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
      {...(!livenessEnabled && { align: 'space-between' })}
      style={{backgroundColor: livenessEnabled ? screenColor : '#ffffff'}}>
      {livenessEnabled && 
      <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 9,
            width: Dimensions.get('window').width * 0.75,
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 70,
          }}
          onPress={handleOnCancel}>
            <Spinner
            type="ThreeBounce"
            color={Theme.Colors.Loading}
            style={{marginLeft: 6}}
          />
          <Text size="small" weight="bold" margin="8" color="black">
            {infoText}
          </Text>
        </View>
} 
      <View style={Theme.Styles.scannerContainer}>
        <Camera
          style={Theme.Styles.scanner}
          type={whichCamera}
          ref={setCameraRef}
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
      {livenessEnabled ? (
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 9,
            width: Dimensions.get('window').width * 0.3,
            alignSelf: 'center',
            alignItems: 'center',
            height: 40,
            marginBottom: 75,
            opacity: opacity,
          }}
          onPressIn={() => setOpacity(0.5)}
          onPressOut={() => setOpacity(1)}
          onPress={handleOnCancel}>
          <Text size="small" weight="bold" margin="8" color="black">
            Cancel
          </Text>
        </TouchableOpacity>
      ) : (
        <Centered>
          {isCapturing || isVerifying ? (
            <RotatingIcon name="sync" size={64} />
          ) : (
            <Row align="center">
              <Centered style={Theme.Styles.imageCaptureButton}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("I am called inside touch");
                    service.send(FaceScannerEvents.CAPTURE())
                    console.log("I am called inside touch after");}}>
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
