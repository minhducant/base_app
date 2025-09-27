import { ViewStyle } from 'react-native';
import normalize from 'react-native-normalize';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const userStyle: any = {
  container: {
    flex: 1,
  } as ViewStyle,
  scrollViewContent: {},
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
    marginBottom: normalize(16),
    marginLeft: normalize(28),
  },
  functionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  functionCard: {
    marginBottom: normalize(16),
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: normalize(16),
  },
  txtFunction: {
    fontSize: 15,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
    marginLeft: normalize(16),
  },
  txtVerion: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.DUSTY_GRAY,
    alignSelf: 'center',
    marginTop: normalize(16),
    marginBottom: normalize(50),
  },
};
