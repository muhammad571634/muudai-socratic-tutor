# MuudAI Socratic Tutor 🦉

> **AI-Powered Socratic Learning & AR Vision Tutor**  
> Duolingo-uslubidagi minimalist "Oq Daftar" tamoyili, 60-120fps GPU animatsiyalari va Google Gemini AI integratsiyasi bilan yaratilgan mobil ta'lim ilovasi.

---

## 🌟 Asosiy Imkoniyatlar

1. **"Oq Daftar" Sokratik UI (Duolingo Minimalist)**:
   - Ortiqcha ranglar va vizual shovqindan xoli, o'quvchi diqqatini 100% darsga qaratuvchi toza dizayn.
   - 3 qismli Sokratik tahlil (Tushunish → Qo'llash → Yechim).
   - Har bir qadamda AI Repetitorning 3-5 jumlalik chuqur, qadam-ba-qadam tushuntirishi (`tutorExplanation`).
   - Duolingo Word Bank taktil 3D bloklari (A/B/C harflarisiz, faqat sof tushunchalar).

2. **Ovozli O'qish (TTS - Text to Speech)**:
   - `expo-speech` orqali savol, masala ifodasi va AI tushuntirishlarini tabiiy o'zbek tilida tinglash imkoniyati.

3. **Multimodal Vision & Audio Baholash**:
   - Daftardagi masalani kamerada skanerlash (Expo CameraView).
   - Matnli ko'rsatma va matematik formulani aqlli ajratish (`separateProblemContent`).
   - O'quvchining ovozli javoblarini real vaqtda transkripsiya qilish va baholash (`useVoiceAnswerHandler`).

4. **Gamifikatsiya va Mukofotlar**:
   - Duolingo uslubidagi muvaffaqiyat bayrog'i (`DuolingoCelebrationBanner`) va GPU zarrachalar festivali (`CelebrationConfetti`).
   - XP, Streak (kunlik ketma-ketlik) va sirli sandiq (`MysteryChestView`).

---

## 🛠 Texnologik Stek

- **Freymvork**: React Native (Expo Managed Workflow SDK 52)
- **Til**: TypeScript (Qat'iy turlar, 0 ta `any`)
- **Holat boshqaruvi**: Zustand
- **Animatsiyalar**: React Native Reanimated 3 (UI thread 60-120fps), Gesture Handler
- **AI Integratsiya**: Google Gemini Flash API (`gemini-3.5-flash`, `gemini-flash-lite`, `gemini-3.7-flash` fallback zanjiri bilan)
- **Audio & Haptics**: `expo-speech`, `expo-av`, `expo-haptics`
- **Ikonkalar**: `phosphor-react-native`

---

## 🏛 Arxitektura (Clean Architecture & SOLID)

```
src/
├── core/             # Konfiguratsiya, Mavzu (theme), Haptics, Audio xizmatlari
├── data/             # Ma'lumotlar qatlami
│   ├── local/        # AsyncStorage mahalliy xotira
│   ├── remote/       # GeminiSocraticDataSource (AI API integratsiyasi)
│   └── repositories/ # Repozitoriy implementatsiyalari
├── domain/           # Biznes mantig'i va entitilar
│   ├── entities/     # SocraticDialogue, Gamification, MistakeReview
│   └── repositories/ # Interfeyslar (ISocraticAiRepository)
└── presentation/     # UI qatlami
    ├── components/   # SocraticScannerScreen, AiMascotAvatar, DuolingoCelebrationBanner
    ├── hooks/        # useCameraPermission, useVoiceAnswerHandler
    └── state/        # Zustand global store'lar
```

---

## 🚀 Ishga Tushirish

### 1. Repozitoriyni klonlash:
```bash
git clone https://github.com/muhammadsukut0509/muudai-socratic-tutor.git
cd muudai-socratic-tutor
```

### 2. Bog'liqliklarni o'rnatish:
```bash
npm install
```

### 3. Muhit o'zgaruvchisini sozlash:
`.env.example` dan nusxa olib `.env` yarating va o'z Gemini API kalitingizni kiriting:
```bash
cp .env.example .env
```
`.env` fayli ichida:
```env
EXPO_PUBLIC_GEMINI_API_KEY=sizning_gemini_api_kalitingiz
```

### 4. Ilovani ishga tushirish:
```bash
npx expo start -c
```

---

## 📄 Litsenziya

MIT License. MuudAI jamoasi tomonidan ishlab chiqilgan.
