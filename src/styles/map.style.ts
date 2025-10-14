import normalize from 'react-native-normalize';
import { ViewStyle, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

import color from '@styles/color';
import themeStyle from '@styles/theme.style';

export const mapStyle: any = {
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
  },
  // ...existing code...
  resultBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    // height: 70,
    shadowOffset: { width: 0, height: 2 },
  },
  resultCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ...existing code...
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(8),
    marginVertical: 5,
    paddingHorizontal: normalize(12),
    marginHorizontal: normalize(8),
    marginRight: normalize(16),
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: themeStyle.FONT_FAMILY,
    fontSize: 14,
    color: color.BLACK,
  },
  clearButton: { padding: 0 },
  suggestionItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
  },
  vehicleBar: {
    flexDirection: 'row',
    marginVertical: normalize(8),
    paddingHorizontal: normalize(16),
  },
  vehicleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  vehicleButtonActive: {
    backgroundColor: color.MAIN,
    borderColor: color.MAIN,
  },
  mapContainer: {
    flex: 1,
    marginVertical: 10,
  },
  map: { flex: 1 },
  resultBox: {
    backgroundColor: '#fff',
    padding: normalize(8),
    borderRadius: 8,
    elevation: 3,
    marginBottom: 8,
    paddingLeft: normalize(32),
  },
  startButton: {
    backgroundColor: color.MAIN,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: color.CRIMSON,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: color.NEVADA,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: themeStyle.FONT_FAMILY,
    fontWeight: 'bold',
  },
  bottomButton: {
    flexDirection: 'row',
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(8),
  },
  text: {
    fontSize: 12,
    fontFamily: themeStyle.FONT_FAMILY,
    color: color.BLACK,
  } as ViewStyle,
  txtVehicle: {
    fontSize: 14,
    fontFamily: themeStyle.FONT_BOLD,
  },
  suggestionHeader: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  loadingOverlay: {
    top: normalize(200),
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconColumn: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: normalize(8),
    paddingTop: normalize(8),
  },
};
