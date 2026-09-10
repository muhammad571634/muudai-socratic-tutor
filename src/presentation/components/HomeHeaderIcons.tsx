// O'ylanish: Ushbu fayl Duolingo va MuudAI Home Dashboard yuqori paneliga
// 100% birga-bir mos keluvchi haqiqiy vektor ikonlarni (Flame, Gem, 3D Golden Star)
// taqdim etadi. SVG orqali platformalararo o'zgarmas, kristaldek tiniq (Retina 60-120fps)
// ko'rinish kafolatlanadi.

import React from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';

interface IconProps {
  size?: number;
}

/**
 * 1. Olovli Streak Ikonasi (Duolingo Fire Flame)
 * Reference: media_1789059526763.jpg dagi yorqin olovli streak belgisi
 */
export const HeaderFlameIcon: React.FC<IconProps> = ({ size = 22 }) => {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 24 26" fill="none">
      <Defs>
        <LinearGradient id="flameOuterGrad" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFA000" />
          <Stop offset="40%" stopColor="#FF6D00" />
          <Stop offset="100%" stopColor="#FF3D00" />
        </LinearGradient>
        <LinearGradient id="flameInnerGrad" x1="12" y1="9" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFFF8D" />
          <Stop offset="50%" stopColor="#FFEA00" />
          <Stop offset="100%" stopColor="#FF9100" />
        </LinearGradient>
      </Defs>

      {/* Tashqi olov shakli */}
      <Path
        d="M12.4 1.2C12.1 0.8 11.5 0.9 11.3 1.4C10.1 3.9 8.2 7.1 5.7 9.8C3.1 12.6 2 15.3 2 18C2 22.4 6.5 25 12 25C17.5 25 22 22.4 22 18C22 13.9 19.5 10.7 16.5 6.6C15.2 4.8 13.7 2.9 12.4 1.2Z"
        fill="url(#flameOuterGrad)"
      />

      {/* Olov ichidagi issiq yadro (Hot inner flame) */}
      <Path
        d="M12.2 10.5C12.1 10.2 11.7 10.3 11.6 10.6C10.7 12.1 9.4 14.1 8 15.6C7 16.7 6.5 18 6.5 19.3C6.5 21.8 8.9 23.3 12 23.3C15.1 23.3 17.5 21.8 17.5 19.3C17.5 16.8 15.9 14.8 14.2 12.6C13.5 11.7 12.7 10.9 12.2 10.5Z"
        fill="url(#flameInnerGrad)"
      />
    </Svg>
  );
};

/**
 * 2. Ko'k Olmos / Kristall / Energiya Ikonasi (Cyan Gem / Diamond)
 * Reference: media_1789059526763.jpg dagi oq jilosi bor moviy kristall
 */
export const HeaderGemIcon: React.FC<IconProps> = ({ size = 22 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="gemBodyGrad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#00E5FF" />
          <Stop offset="45%" stopColor="#00B0FF" />
          <Stop offset="100%" stopColor="#0072E5" />
        </LinearGradient>
      </Defs>

      {/* Asosiy ko'p qirrali qimmatbaho tosh tanasi */}
      <Path
        d="M12 2L20.8 7.2V16.8L12 22L3.2 16.8V7.2L12 2Z"
        fill="url(#gemBodyGrad)"
      />

      {/* Yuqori o'ng qirra foni */}
      <Path
        d="M12 2L20.8 7.2L16.5 12L12 7.5L12 2Z"
        fill="#0091EA"
        opacity={0.35}
      />

      {/* Pastki soya qirrasi */}
      <Path
        d="M12 22L3.2 16.8L8.5 13L12 17.5L12 22Z"
        fill="#0058B6"
        opacity={0.4}
      />

      {/* Yuqori chapdagi yorqin oq yorug'lik jilosi (Specular Highlight) */}
      <Path
        d="M6.5 7.5L10 4.2L11 6.8L7.5 9.5L6.5 7.5Z"
        fill="#FFFFFF"
        opacity={0.92}
      />
      <Circle cx="8.5" cy="6.2" r="1.2" fill="#FFFFFF" />
    </Svg>
  );
};

/**
 * 3. 3D Oltin Yulduz Ikonasi (Golden 3D Star with Sparkles)
 * Reference: media_1789059526763.jpg dagi nurlar taratuvchi 3D oltin yulduz
 */
export const HeaderStarIcon: React.FC<IconProps> = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Defs>
        <LinearGradient id="starLightGrad" x1="13" y1="2" x2="13" y2="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFF59D" />
          <Stop offset="50%" stopColor="#FFD54F" />
          <Stop offset="100%" stopColor="#FFA000" />
        </LinearGradient>
        <LinearGradient id="starShadowGrad" x1="13" y1="2" x2="13" y2="24" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFC107" />
          <Stop offset="100%" stopColor="#FF8F00" />
        </LinearGradient>
      </Defs>

      {/* Yulduzning yorug' qirralari */}
      <Path
        d="M13 2.5L13 13.5L19.8 18.5L17.2 10.7L23.5 6.2L15.6 6.2L13 2.5Z"
        fill="url(#starLightGrad)"
      />

      {/* Yulduzning soya 3D qirralari */}
      <Path
        d="M13 2.5L10.4 6.2L2.5 6.2L8.8 10.7L6.2 18.5L13 13.5L13 24.5L13 13.5Z"
        fill="url(#starShadowGrad)"
      />

      {/* Markaziy yorqin burchak */}
      <Circle cx="13" cy="11.5" r="2.2" fill="#FFF9C4" opacity={0.6} />

      {/* Atrofdagi nozik uchqunlar (Sparkle diamonds matching mockup) */}
      <Path
        d="M3 3L3.8 4L4.8 4.8L3.8 5.6L3 6.6L2.2 5.6L1.2 4.8L2.2 4L3 3Z"
        fill="#FFE082"
      />
      <Path
        d="M22.5 19L23.1 19.8L23.9 20.4L23.1 21L22.5 21.8L21.9 21L21.1 20.4L21.9 19.8L22.5 19Z"
        fill="#FFE082"
      />
      <Circle cx="21" cy="4" r="1.1" fill="#FFF59D" />
      <Circle cx="4" cy="20" r="1.1" fill="#FFF59D" />
    </Svg>
  );
};
