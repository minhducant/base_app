import normalize from 'react-native-normalize';
import { ViewStyle, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const homeStyle: any = {
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  } as ViewStyle,
  scrollView: {
    marginBottom: normalize(-20),
  },
  txtTitleHome: {
    fontSize: normalize(25),
    fontWeight: '700',
    fontFamily: themeStyle.FONT_BOLD,
    marinBottom: normalize(0),
    marginTop: normalize(8),
    color: color.MAIN,
  },
  viewTitleHome: {
    marginTop: normalize(10),
    marginHorizontal: normalize(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtName: {
    fontSize: normalize(25),
    fontWeight: '700',
    fontFamily: themeStyle.FONT_BOLD,
    color: color.BLACK,
    marinBottom: normalize(0),
    marginTop: normalize(8),
  },
  mapHome: {
    width: '100%',
    height: (height * 80) / 100,
    borderRadius: normalize(16),
    marginTop: normalize(16),
  },
  mapCheck: {
    width: '100%',
    height: (height * 50) / 100,
    borderRadius: normalize(16),
    // marginTop: normalize(16),
  },
  txtChoseFromMap: {
    fontSize: normalize(14),
    fontFamily: themeStyle.FONT_FAMILY,
    marginLeft: normalize(8),
    color: color.MAIN,
  } as ViewStyle,
  viewChooseFromMap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(12),
  } as ViewStyle,
  addressItem: {
    padding: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: color.SILVER,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: normalize(8),
  } as ViewStyle,
  titleAddressItem: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    marginLeft: normalize(8),
    // paddingRight: normalize(16),
  },
  txtAddressItem: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.DUSTY_GRAY,
    marginLeft: normalize(8),
    marginTop: normalize(4),
    width: '60%',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
    marginBottom: normalize(16),
    paddingHorizontal: normalize(24),
  },
  actionItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtActionItem: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    marginTop: normalize(4),
    textAlign: 'center',
    flexWrap: 'wrap',
    width: normalize(70), // giới hạn width, text sẽ wrap đẹp
  },
  banner: {
    // backgroundColor: color.WHITE,
    height: normalize(70),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(8),
    marginHorizontal: normalize(24),
    marginBottom: normalize(24),
  },
  bannerText: {
    color: color.MAIN,
    fontSize: normalize(20),
    fontFamily: themeStyle.FONT_BOLD,
    fontWeight: '700',
  },
  weatherDetail: {
    fontSize: 12,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.DUSTY_GRAY,
    marginBottom: normalize(6),
  },
  iconActionItem: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    backgroundColor: color.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    backgroundColor: color.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: normalize(20),
    padding: normalize(16),
    marginVertical: normalize(16),
    borderRadius: normalize(16),
  },
  weatherTemp: {
    fontSize: 35,
    fontFamily: themeStyle.FONT_BOLD,
    color: color.MAIN,
    fontWeight: '700',
  },
  surveyTitle: {
    fontSize: 16,
    fontFamily: themeStyle.FONT_BOLD,
    color: color.BLACK,
    fontWeight: '700',
    marginBottom: normalize(4),
  },
  surveyDesc: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.DUSTY_GRAY,
    marginBottom: normalize(4),
  },
  surveyLink: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_BOLD,
    color: color.SUN_FLOWER,
    fontWeight: '700',
    marginTop: normalize(8),
  },
  surveyCard: {
    backgroundColor: color.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    marginHorizontal: normalize(24),
    borderRadius: normalize(16),
    marginBottom: normalize(16),
  },
  questionCard:{
    flexDirection: 'row',
    marginHorizontal: normalize(24),
    padding: normalize(16),
    backgroundColor: color.WHITE,
    alignItems: 'center',
    marginBottom: normalize(16),
    borderRadius: normalize(16),
  }
};
