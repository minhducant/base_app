import * as React from 'react';
import normalize from 'react-native-normalize';
import Svg, { G, Rect, Mask, Path, Defs, ClipPath } from 'react-native-svg';

const SvgComponent = () => (
  <Svg width={normalize(24)} height={normalize(24)} fill="none" viewBox="0 -4 28 28">
    <G clipPath="url(#a)">
      <Rect width={28} height={20} fill="#fff" rx={2} />
      <Mask
        id="b"
        width={28}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <Rect width={28} height={20} fill="#fff" rx={2} />
      </Mask>
      <G mask="url(#b)">
        <Path fill="#0A17A7" d="M0 0h28v20H0z" />
        <Path
          fill="#fff"
          fillRule="evenodd"
          d="m-1.282-1.916 11.949 8.06v-7.477h6.666v7.476l11.95-8.06 1.49 2.211-9.447 6.373H28v6.666h-6.674l9.448 6.373-1.492 2.21-11.949-8.06v7.477h-6.666v-7.476l-11.95 8.06-1.49-2.211 9.447-6.373H0V6.667h6.674L-2.774.294l1.492-2.21Z"
          clipRule="evenodd"
        />
        <Path
          stroke="#DB1F35"
          strokeLinecap="round"
          strokeWidth={0.667}
          d="M18.668 6.332 31.333-2M20.013 13.697l11.354 7.653M8.006 6.31-3.837-1.67M9.29 13.605-3.837 22.31"
        />
        <Path
          fill="#E6273E"
          fillRule="evenodd"
          d="M0 12h12v8h4v-8h12V8H16V0h-4v8H0v4Z"
          clipRule="evenodd"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Rect width={28} height={20} fill="#fff" rx={2} />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgComponent;
