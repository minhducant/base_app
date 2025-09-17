import { ViewStyle } from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const CELL_SIZE = normalize(37);
export const CELL_BORDER_RADIUS = 27;
export const DEFAULT_CELL_BG_COLOR = '#fff';
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';
export const NOT_EMPTY_CELL_BG_COLOR = color.MAIN;

export const authenticationStyle: any = {
  containerSpanish: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingTop: 0,
  },
  formLogin: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  ScrollView: {
    // paddingBottom:100
  },
  txtLogo: {
    fontSize: 150,
    color: color.MAIN,
    textAlign: 'center',
  },
  copyRight: {
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 14,
  },
  containLogin: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  formRegis: {
    flex: 1,
    // paddingHorizontal: normalize(20),
    width: '100%',
  },
  formAuth: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingTop: normalize(10),
    paddingHorizontal: normalize(20),
  },
  formForget: {
    flex: 1,
    width: '100%',
    // alignItems: 'center',
    paddingTop: normalize(10),
    paddingHorizontal: normalize(20),
  },
  alertRequireText: {
    textAlign: 'center',
    // color: themeStyle.MAIN_COLOR,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  authButton: (disable: boolean): ViewStyle => ({
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
    width: '95%',
    borderRadius: normalize(24),
    backgroundColor: disable ? color.DUSTY_GRAY : color.MAIN,
  }),
  textButton: {
    fontSize: 16,
    paddingVertical: normalize(10),
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  txtForgetPass: {
    fontFamily: themeStyle.FONT_BOLD,
    color: color.PICTON_BLUE,
    textAlign: 'center',
    paddingTop: normalize(20),
    fontSize: 16,
  },
  txtLoginWith: {
    marginVertical: normalize(20),
    alignSelf: 'center',
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
  registerArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: normalize(20),
    marginBottom: normalize(20),
  },
  txtNewTo: { fontFamily: themeStyle.FONT_FAMILY, fontSize: 16 },
  txtRegister: {
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.PICTON_BLUE,
    marginLeft: normalize(5),
    fontSize: 16,
  },
  viewReSend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: normalize(20),
  },
  loginWith: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: normalize(130),
    height: normalize(130),
    resizeMode: 'contain',
    marginTop: 20,
    alignSelf: 'center',
  },
  logoText: {
    height: normalize(50),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: normalize(16),
  },
  buttonLoginWith: {
    height: normalize(50),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: color.SILVER,
    borderRadius: normalize(10),
    marginHorizontal: normalize(5),
    flexDirection: 'row',
    width: normalize(95),
  },
  loginWithText: {
    fontFamily: themeStyle.FONT_FAMILY,
    flex: 8,
    alignSelf: 'center',
    fontSize: 16,
  },
  codeFieldRoot: {
    height: CELL_SIZE,
    marginTop: normalize(30),
    marginVertical: normalize(10),
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    fontSize: 20,
    fontFamily: themeStyle.FONT_FAMILY,
    textAlign: 'center',
    color: color.MAIN,
    backgroundColor: '#fff',
    borderColor: color.SILVER,
    borderWidth: 1,
    borderRadius: 10,
  },
  root: {
    minHeight: 800,
    padding: 20,
  },
  title: {
    paddingTop: 50,
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 40,
  },
  icon: {
    width: 217 / 2.4,
    height: 158 / 2.4,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  subTitle: {
    paddingTop: 30,
    color: '#000',
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: '#3557b7',
    justifyContent: 'center',
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  imageForgetPass: {
    width: normalize(200),
    height: normalize(200),
    alignSelf: 'center',
  },
  titleAuth: {
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 20,
    // marginBottom: normalize(30),
    // marginTop: normalize(20),
    textAlign: 'center',
  },
  subTitleAuth: {
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 16,
    // marginBottom: normalize(30),
    // marginTop: normalize(20),
    textAlign: 'center',
    marginTop: normalize(15),
  },
  titleRegister: {
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: normalize(20),
  },
  forgetWay: {
    width: '90%',
    borderWidth: 0.5,
    flexDirection: 'row',
    padding: normalize(15),
    marginBottom: normalize(20),
    alignItems: 'center',
    borderColor: 'gray',
    borderRadius: normalize(5),
  },
  forgetWayText: {
    marginLeft: normalize(15),
  },
  txtWay: {
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 15,
  },
  txtBy: {
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: normalize(5),
  },
  contentSecurity: {
    flex: 1,
    paddingHorizontal: normalize(20),
    backgroundColor: color.WHITE,
  },
  titleSecurity: {
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: normalize(16),
    textAlign: 'center',
  },
  descriptionSecurity: {
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 16,
    marginTop: normalize(10),
    textAlign: 'center',
  },
  focusCell: {
    borderColor: color.MAIN,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.WHITE,
    marginTop: normalize(20),
  },
  loginFacebook: {
    borderColor: color.SILVER,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    padding: normalize(5),
    marginBottom: normalize(20),
    borderRadius: normalize(12),
    width: '95%',
    alignSelf: 'center',
  },
  txtLoginFB: {
    paddingLeft: normalize(8),
    alignSelf: 'center',
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 16,
    textAlign: 'center',
  },
};
