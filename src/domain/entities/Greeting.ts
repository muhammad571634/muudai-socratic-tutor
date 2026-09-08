export interface GreetingInfo {
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  headline: string;
  subtitle: string;
  weatherIcon: string;
  accentBadgeColor: string;
}

/**
 * Foydalanuvchining real mahalliy vaqtiga moslashuvchi aqlli salomlashuv generatori.
 */
export const getLiveGreeting = (studentName: string = 'Alex'): GreetingInfo => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return {
      timeSlot: 'morning',
      headline: `Good morning, ${studentName}!`,
      subtitle: 'Ready for a quick STEM brain warmup?',
      weatherIcon: 'sunny',
      accentBadgeColor: '#FFB800',
    };
  }

  if (currentHour >= 12 && currentHour < 17) {
    return {
      timeSlot: 'afternoon',
      headline: `Good afternoon, ${studentName}!`,
      subtitle: 'What challenge shall we conquer today?',
      weatherIcon: 'partly-sunny',
      accentBadgeColor: '#28ACFF',
    };
  }

  if (currentHour >= 17 && currentHour < 22) {
    return {
      timeSlot: 'evening',
      headline: `Good evening, ${studentName}!`,
      subtitle: "Keep the streak burning — solve today's quest!",
      weatherIcon: 'moon',
      accentBadgeColor: '#9046FE',
    };
  }

  return {
    timeSlot: 'night',
    headline: `Late session, ${studentName}!`,
    subtitle: 'One quick riddle before you rest.',
    weatherIcon: 'cloudy-night',
    accentBadgeColor: '#34C759',
  };
};
