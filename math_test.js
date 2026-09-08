const superscripts = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
};

const subscripts = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ'
};

function latexToUnicode(mathStr) {
  mathStr = mathStr.replace(/\^\{([^}]+)\}/g, (_, inner) => {
    return inner.split('').map(c => superscripts[c] || c).join('');
  });
  mathStr = mathStr.replace(/\^([a-zA-Z0-9+\-=()])/g, (_, c) => superscripts[c] || c);
  
  mathStr = mathStr.replace(/_\{([^}]+)\}/g, (_, inner) => {
    return inner.split('').map(c => subscripts[c] || c).join('');
  });
  mathStr = mathStr.replace(/_([a-zA-Z0-9+\-=()])/g, (_, c) => subscripts[c] || c);

  return mathStr;
}

console.log(latexToUnicode("Fe^{+2}"));
console.log(latexToUnicode("5s^14d^8"));
console.log(latexToUnicode("H_2O"));
console.log(latexToUnicode("E = mc^2"));
