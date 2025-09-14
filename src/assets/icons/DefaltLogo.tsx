/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    fill="red"
    width={100}
    height={100}
    viewBox="0 0 1056 1024"
    style={{ alignSelf: 'center' , marginBottom: 20}}
  >
    <Path d="M804.8 496h-51.2V361.6c0-38.4-28.8-67.2-67.2-67.2H552v-51.2c0-44.8-38.4-83.2-83.2-83.2s-83.2 38.4-83.2 83.2v51.2H251.2c-38.4 0-67.2 28.8-67.2 67.2v128h51.2c51.2 0 89.6 41.6 89.6 89.6s-41.6 89.6-89.6 89.6H184v128c0 38.4 28.8 67.2 67.2 67.2h128v-51.2c0-51.2 41.6-89.6 89.6-89.6s89.6 41.6 89.6 89.6V864h128c38.4 0 67.2-28.8 67.2-67.2V662.4h51.2c44.8 0 83.2-38.4 83.2-83.2S849.6 496 804.8 496z" />
  </Svg>
);
export default SvgComponent;
