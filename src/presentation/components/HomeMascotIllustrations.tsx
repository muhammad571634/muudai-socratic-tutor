// O'ylanish: Ushbu fayl Duolingo-style Sokratik yo'l (Socratic Stepping Path) uchun
// reference mockupdagi (media_1789057276062.png) 3 ta maxsus illyustratsiyani taqdim etadi:
// 1. CoolSunglassesMascot - ko'zoynak taqqan, "thumbs up" qilayotgan quvnoq binafsharang maskot
// 2. ZenMascot - tepada meditatsiya qilayotgan xotirjam maskot
// 3. MilestoneTrophy - 26 raqamli kumush kubok nishoni

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

interface MascotProps {
  width?: number;
  height?: number;
}

/**
 * 1. Cool Sunglasses Mascot (Mockup pastki o'ng tomonidagi ko'zoynakli maskot)
 */
export const CoolSunglassesMascot: React.FC<MascotProps> = ({
  width = 110,
  height = 115,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 110 115" fill="none">
        <Defs>
          {/* Tana gradienti: yorqin binafshadan to'q binafshaga */}
          <LinearGradient id="coolBodyGrad" x1="55" y1="12" x2="55" y2="100" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#7B57F8" />
            <Stop offset="50%" stopColor="#663CF0" />
            <Stop offset="100%" stopColor="#4A25C7" />
          </LinearGradient>

          {/* Qorinchadagi to'qroq doira */}
          <LinearGradient id="coolBellyGrad" x1="55" y1="62" x2="55" y2="96" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#4B24B3" />
            <Stop offset="100%" stopColor="#3C1A94" />
          </LinearGradient>

          {/* Ko'zoynak ramkasi gradienti */}
          <LinearGradient id="shadesGrad" x1="15" y1="48" x2="95" y2="68" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#2D3039" />
            <Stop offset="50%" stopColor="#1E2026" />
            <Stop offset="100%" stopColor="#111317" />
          </LinearGradient>
        </Defs>

        {/* Maskot ostidagi mayin soya */}
        <Ellipse cx="55" cy="110" rx="36" ry="5" fill="#E2E8F0" opacity={0.7} />

        {/* Qo'llar & Thumbs Up (Orqa qatlam) */}
        {/* Chap qo'l (pastga tayangan) */}
        <Path
          d="M20 78 C12 80 8 90 14 96 C18 97 25 93 28 85"
          stroke="#1E1B4B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* O'ng qo'l (Thumbs up ko'targan) */}
        <Path
          d="M86 80 C95 80 102 76 102 70 C102 65 96 66 94 70"
          stroke="#1E1B4B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bosh barmoq (Thumbs up) */}
        <Path
          d="M100 68 L100 62 C100 60 97 59 96 61 L95 67"
          stroke="#1E1B4B"
          strokeWidth="3"
          strokeLinecap="round"
          fill="#1E1B4B"
        />

        {/* Asosiy Teardrop Tana */}
        <Path
          d="M55 12 C68 34 94 62 94 82 C94 100 77 105 55 105 C33 105 16 100 16 82 C16 62 42 34 55 12 Z"
          fill="url(#coolBodyGrad)"
        />

        {/* Boshdagi oq nurlanish (Highlight Reflection) */}
        <Path
          d="M48 20 C42 28 32 40 30 50"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={0.8}
        />
        <Circle cx="50" cy="18" r="2" fill="#FFFFFF" opacity={0.8} />

        {/* Qorincha doirasi */}
        <Ellipse cx="55" cy="80" rx="24" ry="18" fill="url(#coolBellyGrad)" />

        {/* Qora Ko'zoynak (Sunglasses) */}
        {/* Chap linza */}
        <Path
          d="M16 52 C16 48 20 46 25 46 L46 46 C51 46 54 49 53 54 L50 67 C49 72 44 75 39 75 L28 75 C21 75 16 70 16 63 Z"
          fill="url(#shadesGrad)"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* O'ng linza */}
        <Path
          d="M57 46 L78 46 C83 46 87 48 87 52 L87 63 C87 70 82 75 75 75 L64 75 C59 75 54 72 53 67 L50 54 C50 49 53 46 57 46 Z"
          fill="url(#shadesGrad)"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Ko'zoynak o'rtasidagi ko'prik (Bridge) */}
        <Rect x="48" y="50" width="7" height="4" rx="2" fill="#0F172A" />

        {/* Ko'zoynak linzalaridagi oq yarqirashlar (White Glare Highlights) */}
        {/* Chap linza yarqirashi */}
        <Path d="M26 51 L20 67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity={0.85} />
        <Path d="M32 51 L26 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.85} />

        {/* O'ng linza yarqirashi */}
        <Path d="M63 51 L57 67" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity={0.85} />
        <Path d="M69 51 L63 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity={0.85} />

        {/* Tabassum qilayotgan oq tishli og'izcha */}
        <Path
          d="M50 84 C50 87 52 89 55 89 C58 89 60 87 60 84 Z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
};

/**
 * 2. Zen Meditating Mascot (Mockup yuqori o'ng tomonidagi meditatsiya qilayotgan maskot)
 */
export const ZenMascot: React.FC<MascotProps> = ({
  width = 110,
  height = 115,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 110 115" fill="none">
        <Defs>
          <LinearGradient id="zenBodyGrad" x1="55" y1="12" x2="55" y2="98" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#7B57F8" />
            <Stop offset="50%" stopColor="#663CF0" />
            <Stop offset="100%" stopColor="#4A25C7" />
          </LinearGradient>

          <LinearGradient id="zenBellyGrad" x1="55" y1="60" x2="55" y2="92" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#4B24B3" />
            <Stop offset="100%" stopColor="#3C1A94" />
          </LinearGradient>
        </Defs>

        {/* Meditatsiya ostidagi soya */}
        <Ellipse cx="55" cy="108" rx="38" ry="6" fill="#E2E8F0" opacity={0.7} />

        {/* Meditatsiya qo'llari (Mudra holatida tizzalarga ochilgan) */}
        {/* Chap qo'l */}
        <Path
          d="M26 70 C14 70 8 78 8 85 C8 91 16 93 22 88"
          stroke="#1E1B4B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <Circle cx="12" cy="85" r="3.5" fill="#1E1B4B" />

        {/* O'ng qo'l */}
        <Path
          d="M84 70 C96 70 102 78 102 85 C102 91 94 93 88 88"
          stroke="#1E1B4B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <Circle cx="98" cy="85" r="3.5" fill="#1E1B4B" />

        {/* Chalishtirilgan oyoqchalar (Lotus pose) */}
        <Path
          d="M38 102 C42 106 50 106 55 102 C60 106 68 106 72 102"
          stroke="#1E1B4B"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Asosiy Teardrop Tana */}
        <Path
          d="M55 14 C68 35 92 62 92 80 C92 98 76 102 55 102 C34 102 18 98 18 80 C18 62 42 35 55 14 Z"
          fill="url(#zenBodyGrad)"
        />

        {/* Boshdagi oq nurlanish */}
        <Path
          d="M48 22 C42 30 33 42 31 52"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity={0.8}
        />

        {/* Qorincha doirasi */}
        <Ellipse cx="55" cy="78" rx="22" ry="16" fill="url(#zenBellyGrad)" />

        {/* Yumilgan xotirjam ko'zlar (Zen closed eyes) */}
        <Path
          d="M35 62 C38 67 44 67 47 62"
          stroke="#1E1B4B"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M63 62 C66 67 72 67 75 62"
          stroke="#1E1B4B"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Xotirjam mayin tabassum */}
        <Path
          d="M52 74 C54 76 56 76 58 74"
          stroke="#1E1B4B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

/**
 * 3. Milestone Trophy (Mockup yuqori chap tomonidagi "26" raqamli kumush kubok)
 */
export const MilestoneTrophy: React.FC<MascotProps> = ({
  width = 95,
  height = 100,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 95 100" fill="none">
        <Defs>
          {/* Kubok kumush/metall gradienti */}
          <LinearGradient id="trophySilver" x1="47.5" y1="10" x2="47.5" y2="70" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="30%" stopColor="#E2E8F0" />
            <Stop offset="70%" stopColor="#CBD5E1" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          <LinearGradient id="trophyRim" x1="18" y1="12" x2="77" y2="12" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#CBD5E1" />
            <Stop offset="50%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#94A3B8" />
          </LinearGradient>

          <LinearGradient id="pedestalGrad" x1="47.5" y1="75" x2="47.5" y2="95" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#94A3B8" />
            <Stop offset="100%" stopColor="#64748B" />
          </LinearGradient>
        </Defs>

        {/* Kubok ostidagi soya */}
        <Ellipse cx="47.5" cy="97" rx="30" ry="3.5" fill="#E2E8F0" />

        {/* Kubok tutqichlari (Handles) */}
        {/* Chap tutqich */}
        <Path
          d="M26 22 C12 22 8 36 8 46 C8 58 18 64 28 62"
          stroke="#94A3B8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Path
          d="M26 22 C14 22 11 36 11 46 C11 56 20 62 28 60"
          stroke="#CBD5E1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* O'ng tutqich */}
        <Path
          d="M69 22 C83 22 87 36 87 46 C87 58 77 64 67 62"
          stroke="#94A3B8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Path
          d="M69 22 C81 22 84 36 84 46 C84 56 75 62 67 60"
          stroke="#CBD5E1"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Kubok Kosasi (Main Bowl) */}
        <Path
          d="M23 15 L72 15 C70 42 66 60 47.5 62 C29 60 25 42 23 15 Z"
          fill="url(#trophySilver)"
          stroke="#94A3B8"
          strokeWidth="2"
        />

        {/* Kubok labi (Rim) */}
        <Rect x="20" y="10" width="55" height="7" rx="3.5" fill="url(#trophyRim)" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Kubok poyasi (Stem) */}
        <Path d="M42 62 L53 62 L51 76 L44 76 Z" fill="#94A3B8" />

        {/* Kubok poydevori (Pedestal) */}
        <Rect x="32" y="76" width="31" height="8" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        <Rect x="24" y="84" width="47" height="10" rx="3" fill="url(#pedestalGrad)" stroke="#64748B" strokeWidth="1.5" />

        {/* Kubok yuzidagi doira nishon (Medallion) */}
        <Circle cx="47.5" cy="36" r="14" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />

        {/* "26" raqami */}
        <SvgText
          x="47.5"
          y="42"
          fontSize="15"
          fontWeight="900"
          fill="#334155"
          textAnchor="middle"
          fontFamily="System"
        >
          26
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
