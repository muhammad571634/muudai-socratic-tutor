export interface GreetingInfo {
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  headline: string;
  subtitle: string;
  weatherIcon: string;
  accentBadgeColor: string;
}

/**
 * Foydalanuvchining real mahalliy vaqtiga moslashuvchi aqlli salomlashuv generatori.
 *
 * Ism ixtiyoriy. Ilgari bu yerda `'Alex'` degan zaxira ism turardi va ismini
 * kiritmagan bolaga "Good morning, Alex!" deb murojaat qilinardi — bola
 * o'zini boshqa birov deb chaqirilayotganini ko'rardi.
 */
export const getLiveGreeting = (studentName?: string | null): GreetingInfo => {
  const currentHour = new Date().getHours();
  const name = studentName?.trim();
  // Ism bo'lsa — "Good morning, Ali!", bo'lmasa — "Good morning!"
  const suffix = name ? `, ${name}!` : '!';

  if (currentHour >= 5 && currentHour < 12) {
    return {
      timeSlot: 'morning',
      headline: `Good morning${suffix}`,
      subtitle: 'Ready for a quick STEM brain warmup?',
      weatherIcon: 'sunny',
      accentBadgeColor: '#FFB800',
    };
  }

  if (currentHour >= 12 && currentHour < 17) {
    return {
      timeSlot: 'afternoon',
      headline: `Good afternoon${suffix}`,
      subtitle: 'What challenge shall we conquer today?',
      weatherIcon: 'partly-sunny',
      accentBadgeColor: '#28ACFF',
    };
  }

  if (currentHour >= 17 && currentHour < 22) {
    return {
      timeSlot: 'evening',
      headline: `Good evening${suffix}`,
      subtitle: "Keep the streak burning — solve today's quest!",
      weatherIcon: 'moon',
      accentBadgeColor: '#9046FE',
    };
  }

  return {
    timeSlot: 'night',
    headline: `Late session${suffix}`,
    subtitle: 'One quick riddle before you rest.',
    weatherIcon: 'cloudy-night',
    accentBadgeColor: '#34C759',
  };
};
