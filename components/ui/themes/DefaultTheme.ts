/* eslint-disable sonarjs/no-duplicate-string */
import {Dimensions, I18nManager, StyleSheet, ViewStyle} from 'react-native';
import {Spacing} from '../styleUtils';
import {isIOS} from '../../../shared/constants';

const Colors = {
  Black: '#000000',
  Zambezi: '#5F5F5F',
  Grey: '#C7C7C7',
  Grey5: '#E0E0E0',
  Grey6: '#F2F2F2',
  Gray30: '#444444',
  Gray40: '#666666',
  Gray44: '#707070',
  Gray50: '#999999',
  Gray9: '#171717',
  Gray89: '#E3E3E3',
  DimGray: '#737373',
  platinumGrey: '#EDEDED',
  Orange: '#F2811D',
  LightGrey: '#F7F7F7',
  ShadeOfGrey: '#6F6F6F',
  mediumDarkGrey: '#7B7B7B',
  White: '#FFFFFF',
  Red: '#D52929',
  Green: '#4B9D20',
  Transparent: 'transparent',
  Warning: '#f0ad4e',
  GrayText: '#6F6F6F',
  mediumLightGrayText: '#A7A7A7',
  dorColor: '#CBCBCB',
  plainText: '#FFD6A7',
  walletbindingLabel: '#000000',
  LightOrange: '#FDF1E6',
  GradientColors: ['#F59B4B', '#E86E04'],
  DisabledColors: ['#C7C7C7', '#C7C7C7'],
  TimeoutHintBoxColor: '#FFF7E5',
  TimeoutHintBoxBorder: '#FFF2D6',
  TimeoutHintText: '#8B6105',
  resendCodeTimer: '#555555',
  uncheckedIcon: '#DBDBDB',
  startColor: '#f59b4b',
  endColor: '#e86e04',
  stroke: '#ee8123',
  iconBg: '#ffa85a',
  warningLogoBg: '#FFF7E5',
  toolTip: '#B7B7B7',
  toolTipContent: '#4B4B4B',
};

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DefaultTheme = {
  Colors: {
    TabItemText: Colors.Orange,
    Details: Colors.Black,
    DetailsLabel: Colors.Gray40,
    LoadingDetailsLabel: Colors.Gray40,
    AddIdBtnBg: Colors.Orange,
    AddIdBtnTxt: Colors.Orange,
    DownloadIdBtnTxt: Colors.White,
    Loading: Colors.Orange,
    Cursor: Colors.Orange,
    noUinText: Colors.Orange,
    IconBg: Colors.Orange,
    popUp: Colors.Green,
    Icon: Colors.Orange,
    GrayIcon: Colors.Gray50,
    helpText: Colors.Gray44,
    borderBottomColor: Colors.Grey6,
    whiteBackgroundColor: Colors.White,
    lightGreyBackgroundColor: Colors.LightGrey,
    aboutVersion: Colors.Gray40,
    switchHead: Colors.Orange,
    switchTrackTrue: Colors.LightOrange,
    switchTrackFalse: Colors.Grey,
    overlayBackgroundColor: Colors.White,
    rotatingIcon: Colors.Grey5,
    loadingLabel: Colors.Grey6,
    textLabel: Colors.Grey,
    textValue: Colors.Black,
    requesterName: Colors.Red,
    errorMessage: Colors.Red,
    QRCodeBackgroundColor: Colors.LightGrey,
    ReceiveVcModalBackgroundColor: Colors.LightGrey,
    ToastItemText: Colors.White,
    VerifiedIcon: Colors.Green,
    whiteText: Colors.White,
    flipCameraIcon: Colors.Black,
    RetrieveIdLabel: Colors.ShadeOfGrey,
    inputSelection: Colors.Orange,
    checkCircleIcon: Colors.White,
    OnboardingCircleIcon: Colors.White,
    OnboardingCloseIcon: Colors.White,
    WarningIcon: Colors.Warning,
    DefaultToggle: Colors.LightOrange,
    GrayText: Colors.GrayText,
    errorGrayText: Colors.mediumDarkGrey,
    gradientBtn: ['#F59B4B', '#E86E04'],
    dotColor: Colors.dorColor,
    plainText: Colors.plainText,
    IconBackground: Colors.LightOrange,
    GradientColors: Colors.GradientColors,
    DisabledColors: Colors.DisabledColors,
    getVidColor: Colors.Zambezi,
    TimeoutHintBoxColor: Colors.TimeoutHintBoxColor,
    TimeoutHintText: Colors.TimeoutHintText,
    walletbindingLabel: Colors.Black,
    walletbindingContent: Colors.Gray40,
    resendCodeTimer: Colors.resendCodeTimer,
    statusLabel: Colors.Black,
    statusMessage: Colors.Gray40,
    blackIcon: Colors.Black,
    uncheckedIcon: Colors.uncheckedIcon,
    settingsLabel: Colors.Black,
    chevronRightColor: Colors.Grey,
    linearGradientStart: Colors.startColor,
    linearGradientEnd: Colors.endColor,
    LinearGradientStroke: Colors.stroke,
    warningLogoBgColor: Colors.warningLogoBg,
    tooltipIcon: Colors.toolTip,
  },
  Styles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: Colors.Transparent,
    },
    loadingTitle: {
      color: Colors.Transparent,
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: Colors.Transparent,
      fontSize: 12,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    detailsValue: {
      color: Colors.Black,
      fontSize: 12,
    },
    statusLabel: {
      color: Colors.Gray30,
      fontSize: 12,
      flexWrap: 'wrap',
      flexShrink: 1,
    },
    activationTab: {
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    kebabIcon: {
      flex: 3,
      height: '100%',
    },
    kebabPressableContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    verifiedIconContainer: {
      marginRight: 3,
    },
    verifiedIconInner: {
      backgroundColor: 'white',
      borderRadius: 10,
    },
    vcItemLabelHeader: {
      color: Colors.Gray40,
    },
    closeDetails: {
      flex: 1,
      flexDirection: 'row',
      paddingRight: 90,
    },
    loadingContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    loadingCardDetailsContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
    cardDetailsContainer: {},
    bottomTabIconStyle: {
      padding: 4,
      width: Dimensions.get('window').width * 0.12,
      height: Dimensions.get('window').height * 0.045,
      borderRadius: 6,
      backgroundColor: Colors.LightOrange,
    },
    downloadingVcPopUp: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.Green,
      height: 39,
      position: 'relative',
      paddingHorizontal: 12,
    },
    homeScreenContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.4,
      elevation: 5,
      padding: 10,
    },
    vertloadingContainer: {
      flex: 1,
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
      padding: 5,
    },
    closeDetailsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    closecardMosipLogo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      marginLeft: 300,
    },
    horizontalLine: {
      height: 1,
      backgroundColor: Colors.Grey,
    },
    verticalLine: {
      width: 1,
      backgroundColor: Colors.Grey,
      marginVertical: 8,
    },
    verticalLineWrapper: {
      display: 'flex',
      flex: 0.1,
      height: '100%',
      justifyContent: 'center',
    },
    vcActivationStatusContainer: {
      display: 'flex',
      flex: 7,
      alignItems: 'center',
      width: '100%',
      height: '100%',
      padding: 5,
    },
    vcActivationDetailsWrapper: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    closeCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 7,
    },
    selectedBindedVc: {
      borderRadius: 15,
      margin: 5,
      borderWidth: 3,
      borderColor: Colors.Orange,
      overflow: 'hidden',
    },
    selectedVc: {
      borderRadius: 10,
      margin: 5,
      borderWidth: 2,
      borderColor: Colors.Orange,
    },
    labelPartContainer: {
      marginLeft: 16,
      flex: 1,
    },
    urlContainer: {
      backgroundColor: Colors.White,
      padding: 10,
      borderRadius: 12,
      fontSize: 12,
    },
    lockDomainContainer: {
      backgroundColor: Colors.White,
      alignSelf: 'center',
      borderRadius: 15,
      width: 100,
    },
    bottomButtonsContainer: {
      height: 'auto',
      borderTopLeftRadius: 27,
      borderTopRightRadius: 27,
      padding: 6,
      backgroundColor: Colors.White,
    },
    consentPageTop: {
      backgroundColor: Colors.White,
      height: 160,
      borderRadius: 6,
    },
    consentDottedLine: {
      width: 182,
      borderWidth: 2,
      margin: 5,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: 'grey',
    },
    labelPart: {
      marginTop: 10,
      alignItems: 'flex-start',
    },
    openCardBgContainer: {
      borderRadius: 10,
      margin: 8,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 4,
    },
    backgroundImageContainer: {
      flex: 1,
      padding: 10,
      overflow: 'hidden',
      borderRadius: 10,
    },
    successTag: {
      backgroundColor: Colors.Green,
      height: 43,
      flex: 1,
      alignItems: 'center',
      paddingLeft: 6,
    },
    closeDetailsHeader: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 18,
      margin: 6,
    },
    openDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    welcomeLogo: {
      width: 160.441,
      height: 173.276,
    },
    logo: {
      height: 40,
      width: 40,
    },
    issuerLogo: {
      resizeMode: 'contain',
      aspectRatio: 1,
      height: 60,
    },
    vcDetailsLogo: {
      height: 50,
      width: 50,
    },
    homeCloseCardDetailsHeader: {
      flex: 1,
    },
    cardDetailsHeader: {
      flex: 1,
      justifyContent: 'space-between',
    },
    mosipLogoContainer: {},
    details: {
      width: 290,
      marginLeft: 110,
      marginTop: 0,
    },
    openDetailsContainer: {
      flex: 1,
      padding: 10,
    },
    profileIconBg: {
      padding: 8,
      width: 40,
      height: 40,
      borderRadius: 6,
      backgroundColor: Colors.LightOrange,
    },
    IconContainer: {
      padding: 6,
      width: 36,
      marginRight: 4,
      marginLeft: 10,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightOrange,
    },
    cameraFlipIcon: {
      height: 42,
      width: 42,
    },
    imageCaptureButton: {
      marginLeft: 130,
      marginRight: 50,
    },
    backArrowContainer: {
      padding: 6,
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: Colors.LightOrange,
    },
    receiveCardsContainer: {
      height: Dimensions.get('window').height * 0.14,
      width: Dimensions.get('window').width * 0.47,
      alignItems: 'center',
      borderBottomRightRadius: 0,
      padding: 15,
      marginVertical: 18,
      elevation: 1,
    },
    pinIcon: {
      height: 39,
      width: 39,
      marginLeft: -13,
      marginTop: -9,
    },
    faceImage: {
      borderRadius: 10,
      height: 96,
      width: 88,
    },
    closeCardImage: {
      width: 80,
      height: 82,
      borderRadius: 100,
    },
    openCardImage: {
      width: 100,
      height: 106,
      borderRadius: 5,
      marginTop: 10,
    },
    versionContainer: {
      backgroundColor: Colors.Grey6,
      margin: 4,
      borderRadius: 14,
    },
    primaryRow: {
      backgroundColor: Colors.LightOrange,
      paddingHorizontal: 18,
      paddingVertical: 9,
      justifyContent: 'space-between',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    scannerContainer: {
      borderRadius: 24,
      alignSelf: 'center',
      height: 350,
      width: 320,
      overflow: 'hidden',
    },
    scanner: {
      height: 400,
      width: '100%',
      margin: 'auto',
    },
    disabledScannerContainer: {
      borderRadius: 24,
      height: 350,
      width: '100%',
      margin: 'auto',
      backgroundColor: Colors.White,
      borderWidth: 1,
      borderColor: Colors.Gray89,
    },
    cameraDisabledPopupContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    cameraDisabledPopUp: {
      justifyContent: 'space-between',
      backgroundColor: Colors.Red,
      position: 'relative',
      padding: 20,
      paddingHorizontal: 15,
      marginTop: -24,
    },
    photoConsentLabel: {
      backgroundColor: Colors.White,
      padding: 0,
      borderWidth: 0,
    },
    tabIndicator: {
      backgroundColor: Colors.Orange,
    },
    tabContainer: {
      backgroundColor: Colors.Transparent,
      justifyContent: 'center',
    },
    tabView: {
      flex: 1,
    },
    detailsText: {
      fontWeight: 'bold',
      fontSize: 15,
      fontFamily: 'Inter_700Bold',
    },
    idInputContainer: {
      marginTop: 20,
      marginRight: Dimensions.get('window').width * 0.26,
    },
    idInputPicker: {
      width: Dimensions.get('window').width * 0.32,
      borderBottomWidth: 1,
      borderColor: isIOS() ? 'transparent' : Colors.Grey,
      bottom: isIOS() ? 50 : 20,
      height: isIOS() ? 100 : 'auto',
    },
    idInputBottom: {
      position: 'relative',
      bottom: 18,
      borderBottomColor: Colors.Orange,
      borderBottomWidth: 1,
      minWidth: 180,
    },
    idInput: {
      position: 'relative',
      bottom: 18,
      minWidth: 180,
    },
    getId: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 6,
    },
    placeholder: {
      fontFamily: 'Inter_600SemiBold',
    },
    hrLine: {
      borderBottomColor: Colors.Gray44,
      borderBottomWidth: 0.3,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    hrLineFill: {
      borderBottomColor: Colors.platinumGrey,
      borderBottomWidth: 1.3,
    },
    downloadFabIconContainer: {
      height: 70,
      width: 70,
      borderRadius: 200,
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      elevation: 5,
      position: 'absolute',
      bottom: Dimensions.get('window').width * 0.1,
      right: Dimensions.get('window').width * 0.1,
    },
    downloadFabIconNormal: {
      borderRadius: 200,
      height: 70,
      width: 70,
      justifyContent: 'center',
      position: 'absolute',
    },
    downloadFabIconPressed: {
      borderRadius: 200,
      height: 70,
      width: 70,
      backgroundColor: Colors.Orange,
      justifyContent: 'center',
      position: 'absolute',
    },
    boxShadow: generateBoxShadowStyle(),
    tooltipContainerStyle: {
      backgroundColor: '#FAFAFA',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      marginTop: 20,
      marginLeft: 15,
    },
    tooltipContentDescription: {
      color: Colors.toolTipContent,
      marginTop: 10,
    },
    tooltipHrLine: {
      borderBottomColor: Colors.Grey5,
      borderBottomWidth: 1,
      marginTop: 10,
    },
  }),
  QrCodeStyles: StyleSheet.create({
    magnifierZoom: {
      backgroundColor: Colors.White,
      width: 30,
      height: 30,
      alignItems: 'center',
      padding: 5,
      borderTopLeftRadius: 11,
    },
    expandedQrCode: {
      backgroundColor: Colors.White,
      width: 350,
      borderRadius: 21,
    },
    QrCodeHeader: {
      backgroundColor: Colors.White,
      borderTopLeftRadius: 21,
      borderTopRightRadius: 21,
      justifyContent: 'space-between',
      fontFamily: 'Inter_700Bold',
      paddingBottom: 10,
      paddingRight: 15,
      paddingLeft: 130,
      elevation: 2,
    },
    warningText: {
      color: Colors.Red,
      fontSize: 18,
    },
    QrView: {
      padding: 6,
      backgroundColor: 'white',
      marginTop: 20,
      borderRadius: 10,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: {width: -1, height: 1},
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
  }),
  PinInputStyle: StyleSheet.create({
    input: {
      borderBottomWidth: 3,
      borderColor: Colors.Grey,
      color: Colors.Black,
      flex: 1,
      fontSize: 33,
      fontFamily: 'Inter_600SemiBold',
      height: 60,
      lineHeight: 28,
      margin: 8,
      textAlign: 'center',
    },
    onEnteringPin: {
      borderBottomWidth: 3,
      borderColor: Colors.Orange,
      color: Colors.Black,
      flex: 1,
      fontFamily: 'Inter_700Bold',
      fontSize: 29,
      height: 40,
      margin: 8,
      textAlign: 'center',
    },
  }),
  TextStyles: StyleSheet.create({
    header: {
      color: Colors.Black,
      fontFamily: 'Inter_700Bold',
      fontSize: 18,
      lineHeight: 19,
      paddingTop: 5,
    },
    subHeader: {
      color: Colors.mediumLightGrayText,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 19,
      fontSize: 13,
      paddingTop: 4,
    },
    semiBoldHeader: {
      color: Colors.Black,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 21,
      paddingTop: 4,
    },
    retrieveIdLabel: {
      color: Colors.ShadeOfGrey,
      fontFamily: 'Inter_600SemiBold',
      lineHeight: 18,
    },
    helpDetails: {
      margin: 5,
      color: Colors.Gray44,
      fontFamily: 'Inter_600SemiBold',
    },
    aboutDetails: {
      color: Colors.Black,
      fontSize: 18,
      margin: 7,
      lineHeight: 18,
    },
    error: {
      position: 'absolute',
      top: 24,
      left: 5,
      color: Colors.Red,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 12,
      minWidth: 200,
    },
    base: {
      color: Colors.Black,
      fontSize: 16,
      lineHeight: 18,
    },
    regular: {
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
    },
    regularGrey: {
      fontFamily: 'Inter_400Regular',
      fontSize: 15,
      lineHeight: 19,
      color: Colors.ShadeOfGrey,
    },
    semibold: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 15,
    },
    bold: {
      fontFamily: 'Inter_700Bold',
      fontSize: 15,
      justifyContent: 'center',
    },
    small: {
      fontSize: 13,
      lineHeight: 21,
    },
    extraSmall: {
      fontSize: 12,
    },
    smaller: {
      fontSize: 11,
      lineHeight: 18,
    },
    large: {
      fontSize: 18,
    },
  }),
  VcItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
      marginBottom: 2,
    },
    subtitle: {
      backgroundColor: 'transparent',
      flex: 1,
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  ToastItemStyles: StyleSheet.create({
    toastContainer: {
      backgroundColor: Colors.Orange,
      position: 'absolute',
      alignSelf: 'center',
      top: 80,
      borderRadius: 4,
    },
    messageContainer: {
      fontSize: 12,
    },
  }),
  LoaderStyles: StyleSheet.create({
    titleContainer: {
      marginLeft: Dimensions.get('screen').width * 0.001,
      marginBottom: 17,
      marginTop: 22,
    },
    heading: {
      flex: 1,
      flexDirection: 'column',
    },
  }),
  SearchBarStyles: StyleSheet.create({
    idleSearchBarBottomLine: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.Gray40,
    },
    searchBarContainer: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.Orange,
    },
    searchIcon: {
      justifyContent: 'center',
      height: Dimensions.get('window').height * 0.055,
      width: Dimensions.get('window').width * 0.1,
    },
    searchBar: {
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      height: Dimensions.get('window').height * 0.055,
      width: Dimensions.get('window').width * 0.8,
    },
  }),
  ButtonStyles: StyleSheet.create({
    fill: {
      flex: 1,
    },
    solid: {
      backgroundColor: Colors.Orange,
    },
    clear: {
      backgroundColor: Colors.Transparent,
    },
    outline: {
      backgroundColor: Colors.Transparent,
      borderColor: Colors.Orange,
    },
    container: {
      height: 45,
      flexDirection: 'row',
    },
    disabled: {
      backgroundColor: Colors.Grey,
    },
    addId: {
      backgroundColor: Colors.Orange,
    },
    gradient: {
      borderRadius: 9,
      width: Dimensions.get('window').width * 0.72,
      alignSelf: 'center',
      height: 54,
    },
    float: {
      borderRadius: 9,
      alignSelf: 'center',
      fontSize: 10,
      elevation: 5,
      position: 'absolute',
      bottom: 24,
    },
    clearAddIdBtnBg: {
      backgroundColor: Colors.Transparent,
    },
    radius: {
      borderRadius: 10,
      backgroundColor: Colors.Orange,
    },
  }),
  OIDCAuthStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
  }),
  QRCodeOverlay: StyleSheet.create({
    header: {},
  }),
  SelectVcOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    consentCheckContainer: {
      backgroundColor: Colors.White,
      borderWidth: 0,
      marginTop: -15,
      fontFamily: 'Inter_600SemiBold',
      padding: 0,
    },
    timeoutHintContainer: {
      backgroundColor: Colors.TimeoutHintBoxColor,
      margin: 21,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 2,
      borderColor: Colors.TimeoutHintBoxBorder,
      borderRadius: 12,
    },
    sharedSuccessfully: {
      flex: 1,
      backgroundColor: Colors.White,
    },
  }),
  AppMetaDataStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    contentView: {
      flex: 1,
      padding: 20,
    },
    header: {
      fontSize: 20,
      fontWeight: 'normal',
      color: 'rgb(28,28,30)',
    },
  }),
  FooterStyles: StyleSheet.create({
    bottom: {
      justifyContent: 'flex-end',
      backgroundColor: Colors.Grey6,
      borderRadius: 15,
      padding: 10,
    },
  }),
  ModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
    defaultModal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 18,
      marginVertical: 8,
    },
    progressingModal: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 36,
      marginVertical: 8,
      marginHorizontal: 18,
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginHorizontal: 18,
      marginVertical: 6,
    },
  }),
  UpdateModalStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  TextEditOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  PasscodeStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
  }),
  KebabPopUpStyles: StyleSheet.create({
    kebabPopUp: {
      flex: 1,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      width: Dimensions.get('screen').width,
      marginTop: Dimensions.get('screen').height * 0.55,
    },
    kebabHeaderStyle: {
      justifyContent: 'space-between',
      fontFamily: 'Inter_700Bold',
      paddingTop: 15,
    },
  }),
  MessageOverlayStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 5,
      borderRadius: 10,
    },
    buttonContainer: {
      justifyContent: 'center',
      marginBottom: 75,
    },
    popupOverLay: {
      backgroundColor: Colors.White,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    halfButton: {
      borderRadius: 8,
      margin: '0.5%',
    },
  }),
  BindingVcWarningOverlay: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
      borderRadius: 15,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  }),
  RevokeStyles: StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto',
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width,
    },
    revokeView: {padding: 20},
    flexRow: {flexDirection: 'row', margin: 0, padding: 0},
    rowStyle: {flexDirection: 'column', justifyContent: 'space-between'},
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  VerifyIdentityOverlayStyles: StyleSheet.create({
    content: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: Colors.White,
    },
  }),
  RevokeConfirmStyles: StyleSheet.create({
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 999999,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
  }),
  OtpVerificationStyles: StyleSheet.create({
    modal: {
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
    },
    viewContainer: {
      backgroundColor: Colors.White,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
      padding: 32,
    },
    close: {
      position: 'absolute',
      top: 32,
      right: 0,
      color: Colors.Orange,
    },
  }),
  MessageStyles: StyleSheet.create({
    overlay: {
      elevation: 5,
      backgroundColor: Colors.White,
      padding: 0,
    },
    button: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    viewContainer: {
      backgroundColor: 'rgba(0,0,0,.6)',
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      position: 'absolute',
      top: 0,
      zIndex: 9,
    },
    boxContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 4,
    },
    squircleContainer: {
      backgroundColor: Colors.White,
      padding: 24,
      elevation: 6,
      borderRadius: 16,
    },
  }),
  VidItemStyles: StyleSheet.create({
    title: {
      color: Colors.Black,
      backgroundColor: 'transparent',
    },
    loadingTitle: {
      color: 'transparent',
      backgroundColor: Colors.Grey5,
      borderRadius: 4,
    },
    subtitle: {
      backgroundColor: 'transparent',
    },
    loadingSubtitle: {
      backgroundColor: Colors.Grey,
      borderRadius: 4,
    },
    container: {
      backgroundColor: Colors.White,
    },
    loadingContainer: {
      backgroundColor: Colors.Grey6,
      borderRadius: 4,
    },
  }),
  OnboardingOverlayStyles: StyleSheet.create({
    overlay: {
      padding: 24,
      bottom: 86,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
    },
    slide: {
      width: '100%',
      padding: 20,
    },
    slider: {
      backgroundColor: Colors.Orange,
      minHeight: 300,
      width: '100%',
      margin: 0,
      borderRadius: 4,
    },
    appSlider: {},
    sliderTitle: {
      color: Colors.White,
      marginBottom: 20,
      fontFamily: 'Inter_700Bold',
    },
    text: {
      color: Colors.White,
    },
    paginationContainer: {
      margin: 10,
    },
    paginationDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    closeIcon: {
      alignItems: 'flex-end',
      end: 16,
      top: 40,
      zIndex: 1,
    },
    bottomContainer: {
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -185,
      paddingBottom: 100,
    },
  }),
  claimsContainer: StyleSheet.create({
    container: {
      backgroundColor: Colors.Transparent,
    },
  }),
  IssuersScreenStyles: StyleSheet.create({
    issuerListOuterContainer: {
      padding: 10,
      flex: 1,
      backgroundColor: Colors.White,
    },
    issuersContainer: {
      marginHorizontal: 3,
      marginTop: 5,
    },
    issuerBoxContainer: {
      margin: 5,
      flex: 1,
      padding: 10,
      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      paddingHorizontal: 6,
      paddingVertical: 8,
      backgroundColor: Colors.White,
    },
    issuerBoxContainerPressed: {
      margin: 5,
      flex: 1,
      padding: 10,
      borderRadius: 6,
      alignItems: 'flex-start',
      justifyContent: 'space-evenly',
      flexDirection: 'column',
      paddingHorizontal: 6,
      paddingVertical: 8,
      backgroundColor: Colors.Grey,
    },
    issuerHeading: {
      fontFamily: 'Inter_600SemiBold',
      fontSize: 14,
      paddingHorizontal: 3,
      marginBottom: 2,
      marginTop: 5,
    },
    issuerDescription: {
      fontSize: 11,
      lineHeight: 14,
      color: Colors.ShadeOfGrey,
      paddingVertical: 5,
      paddingHorizontal: 3,
      paddingTop: 1.4,
    },
  }),
  SendVcScreenStyles: StyleSheet.create({
    shareOptionButtonsContainer: {
      marginBottom: 1,
      marginTop: 1,
      rowGap: 8,
    },
  }),
  SendVcScreenStyles: StyleSheet.create({
    shareOptionButtonsContainer: {
      marginBottom: 1,
      marginTop: 1,
      rowGap: 8,
    },
  }),
  ErrorStyles: StyleSheet.create({
    image: {marginTop: -60, paddingBottom: 26},
    title: {
      color: Colors.Black,
      fontFamily: 'Inter_600SemiBold',
      fontSize: 18,
      lineHeight: 21,
      paddingTop: 4,
      textAlign: 'center',
    },
    message: {
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 6,
      marginBottom: 25,
      marginHorizontal: 40,
      color: Colors.mediumDarkGrey,
    },
  }),
  SetupLanguageScreenStyle: StyleSheet.create({
    columnStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: Colors.White,
      maxHeight: Dimensions.get('window').height,
    },
  }),
  BottomTabBarStyle: StyleSheet.create({
    headerRightContainerStyle: {paddingEnd: 13},
    headerLeftContainerStyle: {paddingEnd: 13},
    tabBarLabelStyle: {
      fontSize: 12,
      fontFamily: 'Inter_600SemiBold',
    },
    tabBarStyle: {
      display: 'flex',
      height: 75,
      paddingHorizontal: 10,
    },
    tabBarItemStyle: {
      height: 83,
      padding: 11,
    },
  }),

  ICON_SMALL_SIZE: 16,
  ICON_MID_SIZE: 22,
  ICON_LARGE_SIZE: 33,
  CloseCard: require('../../../assets/Card_Bg1.png'),
  OpenCard: require('../../../assets/Card_Bg1.png'),
  sharingIntro: require('../../../assets/Intro_Secure_Sharing.png'),
  walletIntro: require('../../../assets/Intro_Wallet_Binding.png'),
  IntroScanner: require('../../../assets/Intro_Scanner.png'),
  protectPrivacy: require('../../../assets/Intro_Unlock_Method.png'),
  elevation(level: ElevationLevel): ViewStyle {
    // https://ethercreative.github.io/react-native-shadow-generator/

    if (level === 0) {
      return null;
    }

    const index = level - 1;

    return {
      shadowColor: Colors.Black,
      shadowOffset: {
        width: 0,
        height: [1, 1, 1, 2, 2][index],
      },
      shadowOpacity: [0.18, 0.2, 0.22, 0.23, 0.25][index],
      shadowRadius: [1.0, 1.41, 2.22, 2.62, 3.84][index],
      elevation: level,
      zIndex: level,
      borderRadius: 4,
      backgroundColor: Colors.White,
    };
  },
  spacing(type: 'margin' | 'padding', values: Spacing) {
    if (Array.isArray(values) && values.length === 2) {
      return {
        [`${type}Horizontal`]: values[0],
        [`${type}Vertical`]: values[1],
      };
    }

    const [top, end, bottom, start] =
      typeof values === 'string' ? values.split(' ').map(Number) : values;

    return {
      [`${type}Top`]: top,
      [`${type}End`]: end != null ? end : top,
      [`${type}Bottom`]: bottom != null ? bottom : top,
      [`${type}Start`]: start != null ? start : end != null ? end : top,
    };
  },
};

function generateBoxShadowStyle() {
  if (isIOS()) {
    return {
      shadowColor: '#000',
      shadowOffset: {width: 1, height: 1.2},
      shadowOpacity: 0.3,
      shadowRadius: 2.5,
    };
  }
  return {
    elevation: 4,
    shadowColor: '#000',
  };
}
