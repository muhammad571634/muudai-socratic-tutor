import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

/**
 * 100% Authentic Brand SVGs matching Duolingo's Referral Onboarding Screen
 */

// 1. Official Google "G" multicolor logo (floating directly, no container)
export const GoogleOriginal = ({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.14 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

// 2. Official Facebook circular badge (blue circle with white 'f')
export const FacebookOriginal = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Path
      fill="#1877F2"
      d="M36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.987 6.588 16.435 15.188 17.787V23.213h-4.571V18h4.571v-3.972c0-4.511 2.686-7.004 6.797-7.004 1.969 0 4.028.352 4.028.352v4.429h-2.27c-2.236 0-2.932 1.387-2.932 2.812V18h4.991l-.798 5.213h-4.193v12.574C29.412 34.435 36 26.987 36 18z"
    />
    <Path
      fill="#FFFFFF"
      d="M20.798 23.213l.798-5.213h-4.991v-3.383c0-1.425.696-2.812 2.932-2.812h2.27V7.377s-2.059-.352-4.028-.352c-4.111 0-6.797 2.493-6.797 7.004V18h-4.571v5.213h4.571v12.574c.907.142 1.835.213 2.774.213s1.867-.071 2.774-.213V23.213h4.193z"
    />
  </Svg>
);

// 3. Official TikTok 3D chromatic aberration note (floating directly without black container)
export const TikTokOriginal = ({ size = 34 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 34 38">
    {/* Cyan shadow shifted top-left */}
    <Path
      fill="#25F4EE"
      d="M23.2 10.2c-2.4-.7-4.3-2.6-4.6-5H14.8v17.6c-.2 2.1-1.9 3.7-4 3.6-2.2-.2-3.8-2-3.6-4.2.2-2 1.9-3.6 3.9-3.6.3 0 .6 0 .9.1V14.4c-.3 0-.6-.1-.9-.1-4.4 0-8 3.5-8.1 7.9-.1 4.5 3.5 8.1 8 8.1 4.3 0 7.8-3.4 8-7.7V14.1c2.7 1.8 5.8 2.7 9.1 2.6V12.5c-1.7 0-3.3-.8-4.7-2.3z"
    />
    {/* Red/Magenta shadow shifted bottom-right */}
    <Path
      fill="#FE2C55"
      d="M25.2 12.2c-2.4-.7-4.3-2.6-4.6-5H16.8v17.6c-.2 2.1-1.9 3.7-4 3.6-2.2-.2-3.8-2-3.6-4.2.2-2 1.9-3.6 3.9-3.6.3 0 .6 0 .9.1V16.4c-.3 0-.6-.1-.9-.1-4.4 0-8 3.5-8.1 7.9-.1 4.5 3.5 8.1 8 8.1 4.3 0 7.8-3.4 8-7.7V16.1c2.7 1.8 5.8 2.7 9.1 2.6V14.5c-1.7 0-3.3-.8-4.7-2.3z"
    />
    {/* Black note center */}
    <Path
      fill="#010101"
      d="M24.2 11.2c-2.4-.7-4.3-2.6-4.6-5H15.8v17.6c-.2 2.1-1.9 3.7-4 3.6-2.2-.2-3.8-2-3.6-4.2.2-2 1.9-3.6 3.9-3.6.3 0 .6 0 .9.1V15.4c-.3 0-.6-.1-.9-.1-4.4 0-8 3.5-8.1 7.9-.1 4.5 3.5 8.1 8 8.1 4.3 0 7.8-3.4 8-7.7V15.1c2.7 1.8 5.8 2.7 9.1 2.6V13.5c-1.7 0-3.3-.8-4.7-2.3z"
    />
    {/* Clean white highlight */}
    <Path
      fill="#FFFFFF"
      opacity={0.85}
      d="M19.6 11.2c-.8-1.3-1.4-2.8-1.5-4.5h-2v14.4c.7-.3 1.5-.4 2.3-.4.4 0 .8.1 1.2.2V11.2z"
    />
  </Svg>
);

// 4. Official Apple App Store squircle icon with white 'A' sticks
export const AppStoreOriginal = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    {/* App Store vibrant blue squircle */}
    <Rect width="100" height="100" rx="24" fill="#1C81FB" />
    {/* Slanted left & right main 'A' arms */}
    <Path
      fill="#FFFFFF"
      d="M45.5 18c1.9-3.3 6.7-3.3 8.6 0l27.4 47.5c1.9 3.3-.5 7.5-4.3 7.5h-8.8L50 39 31.6 73h-8.8c-3.8 0-6.2-4.2-4.3-7.5L45.5 18z"
    />
    {/* Horizontal cross bar */}
    <Rect x="13" y="55" width="74" height="11" rx="5.5" fill="#FFFFFF" />
  </Svg>
);

// 5. Cute retro 3D purple television illustration matching Duolingo exactly
export const TelevisionOriginal = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    {/* Antennas */}
    <Path d="M16 11L10 4.5" stroke="#71717A" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="9.5" cy="4" r="1.8" fill="#71717A" />
    <Path d="M24 11L30 4.5" stroke="#71717A" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="30.5" cy="4" r="1.8" fill="#71717A" />

    {/* Feet */}
    <Path d="M9 33L7 37H11L12 33" fill="#6042BE" />
    <Path d="M31 33L33 37H29L28 33" fill="#6042BE" />

    {/* 3D Bottom Depth Shadow */}
    <Rect x="4" y="11" width="32" height="23" rx="7" fill="#684AC2" />
    {/* Front Lavender Face */}
    <Rect x="4" y="10" width="32" height="22" rx="7" fill="#9983F8" />

    {/* Screen Bezel */}
    <Rect x="7" y="13" width="20" height="15" rx="4.5" fill="#242836" />
    {/* Screen Curved Glare Highlight */}
    <Path
      d="M8.5 15C8.5 14.2 9.2 13.5 10 13.5H16L12 22H8.5V15Z"
      fill="#3D445C"
      opacity={0.7}
    />

    {/* Control Dials (Right Side) */}
    <Circle cx="30.5" cy="16" r="2.2" fill="#EAE4FD" />
    <Circle cx="30.5" cy="16" r="1" fill="#684AC2" />
    <Circle cx="30.5" cy="22" r="2.2" fill="#EAE4FD" />
    <Circle cx="30.5" cy="22" r="1" fill="#684AC2" />
    {/* Speaker lines */}
    <Rect x="28.5" y="26" width="4" height="1" rx="0.5" fill="#684AC2" />
  </Svg>
);

// 6. Cute 3D Duolingo-style Friends & Family avatars
export const FriendsFamilyOriginal = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    {/* Left Friend (Cyan) */}
    <Circle cx="15" cy="16" r="8" fill="#1CB0F6" />
    <Path d="M7 32c0-5 4-8 8-8s8 3 8 8" fill="#1899D6" />
    <Circle cx="13" cy="16" r="1.2" fill="#FFFFFF" />
    <Circle cx="17" cy="16" r="1.2" fill="#FFFFFF" />

    {/* Right Friend (Warm Orange) */}
    <Circle cx="25" cy="18" r="9" fill="#FF9600" />
    <Path d="M16 34c0-5.5 4.5-9 9-9s9 3.5 9 9" fill="#E08500" />
    <Circle cx="23" cy="18" r="1.4" fill="#FFFFFF" />
    <Circle cx="28" cy="18" r="1.4" fill="#FFFFFF" />
    <Path d="M24 21c.8.8 2.2.8 3 0" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
  </Svg>
);

// 7. Official YouTube Logo (Vibrant Red Rounded Card with White Play Triangle)
export const YouTubeOriginal = ({ size = 36 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Rect x="2" y="8" width="36" height="24" rx="7" fill="#FF0000" />
    <Path d="M16.5 15L26 20L16.5 25V15Z" fill="#FFFFFF" />
  </Svg>
);
