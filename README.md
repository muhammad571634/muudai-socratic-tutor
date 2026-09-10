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

2. **Ko'p tillilik (i18n)**:
   - Interfeys va AI javobi bir xil tilda: **English** (asosiy), **O'zbek**, **Rus**.
   - Til qurilma sozlamasidan olinadi (`expo-localization`), qo'lda ham almashtiriladi.

3. **Ovozli O'qish (TTS - Text to Speech)**:
   - `expo-speech` orqali savol, masala ifodasi va AI tushuntirishlarini tinglash.
   - Ovoz tili foydalanuvchi tanlagan ilova tilidan olinadi.

4. **Multimodal Vision**:
   - Daftardagi masalani kamerada skanerlash (Expo CameraView, faqat orqa kamera).
   - Matnli ko'rsatma va matematik formulani aqlli ajratish (`separateProblemContent`).
   - Rasm o'qilmasa yoki tahlil muvaffaqiyatsiz bo'lsa — **rost xato xabari**,
     hech qanday o'ylab topilgan dars ko'rsatilmaydi.

5. **Gamifikatsiya va Mukofotlar**:
   - GPU zarrachalar festivali (`CelebrationConfetti`), XP, Streak, sirli sandiq
     (`MysteryChestView`).
   - **Xatolar daftari:** bola noto'g'ri javob berganda qadam yozib olinadi va
     keyinroq takrorlash uchun navbatga tushadi.

---

## 🛠 Texnologik Stek

- **Freymvork**: React Native 0.86 (Expo Managed Workflow **SDK 57**), React 19
- **Til**: TypeScript (Qat'iy turlar, 0 ta `any`)
- **Holat boshqaruvi**: Zustand 5
- **Animatsiyalar**: React Native Reanimated **4.5.1** (UI thread 60-120fps)
- **AI Integratsiya**: Google Gemini (`gemini-3.8-flash`, zaxira `gemini-3.7-flash`)
- **Ko'p tillilik**: `i18next` + `react-i18next` + `expo-localization`
- **Audio & Haptics**: `expo-speech`, `expo-audio`, `expo-haptics`
- **Ikonkalar**: `phosphor-react-native`, `@expo/vector-icons`

> Versiyalar `package.json` dan olingan. O'zgartirsangiz — shu ro'yxatni ham
> yangilang (`TASKS.md` T0.7).

---

## 🏛 Arxitektura (Clean Architecture & SOLID)

```
src/
├── core/             # Konfiguratsiya, theme, haptics, TTS
│   ├── api/          # TutorApiClient (backend klienti — Faza 1 da ulanadi)
│   └── i18n/         # i18next sozlamasi + locales/{en,uz,ru}.json
├── data/             # Ma'lumotlar qatlami
│   └── remote/       # GeminiSocraticDataSource, OpenAiSocraticDataSource
├── domain/           # Biznes mantig'i va entitilar
│   ├── entities/     # SocraticDialogue, Gamification, MistakeReview, Locale
│   ├── prompts/      # SocraticPromptBuilder
│   └── repositories/ # Interfeyslar (ISocraticAiRepository)
└── presentation/     # UI qatlami
    ├── components/   # SocraticScannerScreen, BentoSubjectGrid, ReviewMistakesView
    │   └── _future/  # V2 uchun saqlangan ovozli komponentlar
    ├── hooks/        # useCameraPermission, useSocraticScanner, useEnergyTimer
    └── state/        # Zustand global store'lar
```

> **Ish taqsimoti:** `backend/`, `src/core/api/`, `src/data/`, `src/domain/` —
> Claude zonasi. `src/presentation/components/` — Gemini zonasi.
> Batafsil: [`AGENTS.md`](./AGENTS.md).

---

## 🚀 Ishga Tushirish

### 1. Repozitoriyni klonlash:
```bash
git clone https://github.com/muhammad571634/muudai-socratic-tutor.git
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

> ⚠️ **Vaqtinchalik yechim.** `EXPO_PUBLIC_*` o'zgaruvchilari klient bundle'iga
> tushadi, ya'ni do'kondagi ilovadan kalitni ajratib olish mumkin. Kalit
> Supabase Edge Function ichiga ko'chiriladi — `TASKS.md` T1.4. Shungacha bu
> repo faqat ishlab chiqish uchun.

### 4. Ilovani ishga tushirish:
```bash
npx expo start -c
```

---

## 📚 Hujjatlar

| Fayl | Nima uchun |
| :-- | :-- |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Yagona haqiqat manbai — qarorlar, joriy holat |
| [`TASKS.md`](./TASKS.md) | Bosqichma-bosqich vazifalar (tartib buzilmaydi) |
| [`docs/UI_ARCHITECTURE.md`](./docs/UI_ARCHITECTURE.md) | **Frontend skeleti** — ekranlar, holatlar, Duolingo modeli |
| [`AGENTS.md`](./AGENTS.md) | Ish taqsimoti va qat'iy taqiqlar |
| [`docs/PEDAGOGY.md`](./docs/PEDAGOGY.md) | Sokratik ta'lim mexanikasi |
| [`docs/PRODUCT_STRATEGY.md`](./docs/PRODUCT_STRATEGY.md) | Bozor, raqobat, biznes modeli |
| [`docs/GEMINI_PROMPTS.md`](./docs/GEMINI_PROMPTS.md) | Gemini uchun tayyor promptlar |

---

## 📄 Litsenziya

MIT License. MuudAI jamoasi tomonidan ishlab chiqilgan.
