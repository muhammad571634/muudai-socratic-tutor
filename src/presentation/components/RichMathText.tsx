import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { formatEducationalMathText } from '../../domain/entities/SocraticDialogue';

const superscripts: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
};

const subscripts: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ'
};

export function latexToUnicode(mathStr: string): string {
  if (!mathStr) return '';
  // Convert basic LaTeX symbols
  let str = mathStr
    .replace(/\\times/g, '×')
    .replace(/\\div/g, ':')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\le(q)?/g, '≤')
    .replace(/\\ge(q)?/g, '≥')
    .replace(/\\ne(q)?/g, '≠')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←');

  // Replace ^{...}
  str = str.replace(/\^\{([^}]+)\}/g, (_, inner) => {
    return inner.split('').map((c: string) => superscripts[c] || c).join('');
  });
  // Replace ^x
  str = str.replace(/\^([a-zA-Z0-9+\-=()])/g, (_, c) => superscripts[c] || c);
  
  // Replace _{...}
  str = str.replace(/_\{([^}]+)\}/g, (_, inner) => {
    return inner.split('').map((c: string) => subscripts[c] || c).join('');
  });
  // Replace _x
  str = str.replace(/_([a-zA-Z0-9+\-=()])/g, (_, c) => subscripts[c] || c);

  return str;
}

interface RichMathTextProps extends TextProps {
  children?: string | null;
}

export const RichMathText: React.FC<RichMathTextProps> = ({ children, style, ...rest }) => {
  if (!children) return null;

  const formatted = formatEducationalMathText(children);
  const parts = formatted.split(/\$\$?/);

  return (
    <Text style={[styles.defaultText, style]} {...rest}>
      {parts.map((part, index) => {
        // Even indices are plain text, odd indices are math blocks (inside $...$)
        if (index % 2 === 1) {
          return (
            <Text key={index} style={[style, styles.mathText]}>
              {latexToUnicode(part)}
            </Text>
          );
        }
        return <Text key={index} style={style}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {},
  mathText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
