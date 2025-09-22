import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import normalize from 'react-native-normalize';

const SvgComponent = () => (
  <Svg width={normalize(24)} height={normalize(24)} viewBox="0 0 36 36">
    <Path
      fill="#DA251D"
      d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
    />
    <Path
      fill="#FF0"
      d="M19.753 16.037 18 10.642l-1.753 5.395h-5.672l4.589 3.333-1.753 5.395L18 21.431l4.589 3.334-1.753-5.395 4.589-3.333z"
    />
  </Svg>
);
export default SvgComponent;
