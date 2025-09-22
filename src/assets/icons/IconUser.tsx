import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import normalize from 'react-native-normalize';

function SvgComponent({ fill }: any) {
  return (
    <Svg
      width={normalize(22)}
      height={normalize(22)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Circle cx={12} cy={6} r={4} fill={fill} />
      <Path
        fill={fill}
        d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z"
        opacity={0.5}
      />
    </Svg>
  );
}

export default SvgComponent;
