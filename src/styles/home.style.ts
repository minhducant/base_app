import normalize from 'react-native-normalize';
import { ViewStyle, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const homeStyle: any = {
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
    paddingHorizontal: normalize(16),
  } as ViewStyle,
  txtTitleHome: {
    fontSize: normalize(25),
    fontWeight: '700',
    fontFamily: themeStyle.FONT_BOLD,
    color: color.BLACK,
    width: '50%',
    marinBottom: normalize(0),
    marginTop: normalize(8),
  },
  viewTitleHome: {
    marginTop: normalize(16),
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
};
