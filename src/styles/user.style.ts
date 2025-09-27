import { ViewStyle } from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const userStyle: any = {
  container: {
    backgroundColor: color.WHITE,
    paddingHorizontal: normalize(16),
  } as ViewStyle,
  scrollViewContent: {
    paddingBottom: normalize(40),
  },
  fastImage: {
    height: normalize(120),
    width: normalize(120),
    borderRadius: normalize(500),
    marginBottom: normalize(16),
    alignSelf: 'center',
  },
  txtName: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: themeStyle.FONT_BOLD,
    color: color.MAIN,
    marinBottom: normalize(0),
    alignSelf: 'center',
    marginBottom: normalize(16),
  },
  titleFunction: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: themeStyle.FONT_BOLD,
    color: color.BLACK,
    marginBottom: normalize(8),
    marginLeft: normalize(16),
  },
  functionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  functionCard: {
    marginBottom: normalize(16),
    borderWidth: 2,
    borderColor: color.SILVER,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
  },
  txtFunction: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    marginLeft: normalize(16),
  },
};
