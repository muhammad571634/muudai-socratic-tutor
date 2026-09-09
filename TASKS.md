# MuudAI — Vazifalar Rejasi (TASKS)

> **Qanday ishlatiladi:** Yuqoridan pastga. Bitta vazifani tugatmasdan keyingisiga
> o'tilmaydi. Har bir vazifa uchun tayyor prompt: [`docs/GEMINI_PROMPTS.md`](./docs/GEMINI_PROMPTS.md)
>
> Arxitektura qoidalari: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
>
> `[ ]` = bajarilmagan · `[x]` = bajarilgan va tekshirilgan

---

## 🔴 FAZA 0 — Tozalash va barqarorlashtirish

*Maqsad: loyihani ishonchli holatga keltirish. Backend'siz, yangi funksiyasiz.*
*Taxminiy: 3-5 kun*

### T0.1 — Loyihani ishga tushirish va tekshirish
- [ ] `npm install` bajarilsin
- [ ] `npx tsc --noEmit` ishga tushirilsin, barcha xatolar tuzatilsin
- [ ] `npx expo start -c` bilan ilova ochilsin, bosh sahifa ko'rinsin
- **Tayyor mezoni:** TypeScript 0 xato, ilova telefonda ochiladi

### T0.2 — Model nomlarini tekshirish (B9)
- [ ] `src/core/config.ts` dagi `gemini-3.5-flash`, `gemini-3.7-flash`,
      `gemini-flash-lite-latest` nomlari **rasmiy Google hujjatida** bor-yo'qligi tekshirilsin
- [ ] Mavjud bo'lmagan nomlar haqiqiy model nomlariga almashtirilsin
- **Tayyor mezoni:** Bitta rasm skanerlansa, haqiqiy AI javobi keladi (demo dars emas)
- **⚠️ Bu eng birinchi tekshiriladi** — agar model nomi noto'g'ri bo'lsa, ilova hech
  qachon ishlamagan, faqat soxta demo ko'rsatgan bo'ladi

### T0.3 — Soxta "fallback" darsni yo'q qilish (B2, B3, B4)
- [ ] `GeminiSocraticDataSource.ts` va `OpenAiSocraticDataSource.ts` dagi
      `createFallbackSession()` chaqiruvlari olib tashlansin
- [ ] Ularning o'rniga aniq xatolik turi qaytarilsin (`ScanError`)
- [ ] Gemini datasource `isImageReadable === false` ni tekshirsin (hozir umuman o'qimaydi)
- [ ] UI'da bolabop xato ekrani: "Rasm xira chiqdi 😅 Qani, yana bir marta urinib ko'ramiz!"
- **Tayyor mezoni:** Internet o'chirilganda ilova xato xabarini ko'rsatadi, demo dars emas

### T0.4 — Ta'lim tsiklini ulash (B5, B6) ⭐ ENG MUHIM
- [ ] Bola noto'g'ri javob bersa → `useMistakeStore.addMistake()` chaqirilsin
- [ ] `App.tsx:109` `handleSelectSocraticOption` javob indeksini tekshirsin
- [ ] XP faqat **to'g'ri** javobga berilsin
- [ ] `ReviewMistakesView` ekrani `App.tsx` ga ulansin (hozir foydalanuvchi ko'ra olmaydi)
- [ ] Bosh sahifada "Xatolar daftari" tugmasi + xatolar soni ko'rsatilsin
- **Tayyor mezoni:** Xato qilaman → bosh sahifada "1 ta xato" ko'rinadi → bosaman →
  xato ekrani ochiladi → qayta yechaman → xato yo'qoladi

### T0.5 — Energiya mantiqini tuzatish (B7, B8)
- [ ] Ikki marta sarflashni to'xtatish (`App.tsx:61` dagi `consumeEnergy()` olib tashlansin)
- [ ] Xatoni qayta yechganda **+1 energiya** berilsin
- [ ] `config.ts`: refill oralig'i **3 soat** qilinsin
- [ ] `checkDailyRefresh()` dagi kunlik to'liq energiya reseti olib tashlansin
- **Tayyor mezoni:** 5 masala yechaman → energiya 0 → skaner ochilmaydi → xato yechaman → +1

### T0.6 — O'lik kodni tartibga solish (B10)
- [ ] **Ulanadi:** `ReviewMistakesView` (T0.4 da), `SubjectSelectionView`
- [ ] **Saqlanadi (V2 uchun):** `MagicMicOrb`, `VoiceWaveIndicator`, `useAudioRecorder`
      → `src/presentation/components/_future/` papkasiga ko'chirilsin
- [ ] **O'chiriladi:** `AppleCameraDock`, `AppleCameraHeader`, `CameraViewFinder`,
      `SocraticTargetBox`, `FloatingSocraticBubble`, `SocraticGuidanceCard`,
      `HumanoidEnergyMeter`, `GamificationHeader`, `DuolingoCelebrationBanner`
- [ ] **O'chiriladi:** `data/repositories/*`, `IGamificationRepository`,
      `IMistakeRepository`, `AsyncStorageService`, `math_test.js`
- **Tayyor mezoni:** `npx tsc --noEmit` 0 xato, ilova avvalgidek ishlaydi

### T0.7 — Hujjatlarni haqiqatga moslash (B11)
- [ ] `README.md`: SDK 52→57, expo-av→expo-audio, Reanimated 3→4.5.1,
      mavjud bo'lmagan `useVoiceAnswerHandler` olib tashlansin
- [ ] `AGENTS.md`: "Reanimated 3" → "Reanimated 4"
- **Tayyor mezoni:** README'dagi har bir gap `package.json` bilan mos

---

## 🟠 FAZA 1 — Backend (Supabase)

*Maqsad: API kalitni ilovadan olib tashlash, akkaunt va server-side nazorat.*
*Taxminiy: 2-3 hafta*

### T1.1 — Supabase loyihasini yaratish
- [ ] supabase.com'da bepul loyiha ochilsin (region: Frankfurt yoki eng yaqini)
- [ ] `EXPO_PUBLIC_SUPABASE_URL` va `EXPO_PUBLIC_SUPABASE_ANON_KEY` `.env` ga yozilsin
      *(anon key ilovada bo'lishi xavfsiz — u RLS bilan himoyalangan)*
- [ ] `@supabase/supabase-js` o'rnatilsin
- **Tayyor mezoni:** Ilova Supabase'ga ulanadi

### T1.2 — Ma'lumotlar bazasi sxemasi + RLS
- [ ] `ARCHITECTURE.md` §5 dagi 7 ta jadval SQL migratsiya sifatida yaratilsin
- [ ] Har bir jadvalda RLS yoqilsin: `auth.uid() = user_id`
- **Tayyor mezoni:** Supabase panelida jadvallar ko'rinadi, RLS "Enabled" yozuvi bor

### T1.3 — Anonim autentifikatsiya
- [ ] Ilova birinchi ochilganda avtomatik anonim akkaunt yaratilsin (bolаdan hech narsa so'ralmaydi)
- [ ] `useAuthStore` (Zustand) yozilsin
- [ ] Keyinchalik ota-ona emaili bilan bog'lash imkoniyati (ixtiyoriy)
- **Tayyor mezoni:** Ilova o'chirib yoqilsa ham bir xil foydalanuvchi qoladi

### T1.4 — Edge Function: `solve-problem` 🔑
- [ ] Supabase Edge Function yozilsin: rasm(base64) + fan → Sokratik dars
- [ ] **Gemini API kaliti Supabase Secrets'da** saqlansin
- [ ] `GeminiSocraticDataSource` shu funksiyani chaqiradigan qilib o'zgartirilsin
- [ ] **`EXPO_PUBLIC_GEMINI_API_KEY` va `EXPO_PUBLIC_OPENAI_API_KEY` ilovadan
      BUTUNLAY o'chirilsin** (B1)
- **Tayyor mezoni:** `grep -r "GEMINI_API_KEY" src/` → hech narsa topilmaydi

### T1.5 — Energiya va XP serverga ko'chirilsin
- [ ] Edge Function: `spend-energy` (energiya yetarli bo'lsa masalani boshlaydi)
- [ ] `energy_ledger` jadvali orqali hisoblansin
- [ ] Klient faqat serverdan kelgan qiymatni ko'rsatsin
- **Tayyor mezoni:** Telefon vaqtini o'zgartirish energiyaga ta'sir qilmaydi

### T1.6 — Ma'lumotlarni sinxronlash
- [ ] Sessiyalar, xatolar, streak Supabase'ga yozilsin
- [ ] Oflayn rejim: internet yo'q bo'lsa navbatga qo'yilsin, ulangach yuborilsin
- **Tayyor mezoni:** Ilovani o'chirib qayta o'rnatsam, progress qaytadi

---

## 🟡 FAZA 2 — Mahsulotni to'ldirish

*Taxminiy: 2 hafta*

### T2.1 — Navigatsiya
- [ ] `expo-router` o'rnatilsin, `App.tsx` dagi qo'lda `useState` almashtirish o'rniga
- **Tayyor mezoni:** Telefonning "orqaga" tugmasi to'g'ri ishlaydi

### T2.2 — Galereyadan rasm yuklash
- [ ] `expo-image-picker`, maks 5MB, 1200px'gacha kichraytirish
- **Tayyor mezoni:** Galereyadan rasm tanlab dars boshlanadi

### T2.3 — Rasm optimizatsiyasi va cheklovlar
- [ ] Yuborishdan oldin 1080px, JPEG sifat 0.75 (~120KB)
- [ ] Shutter tugmasiga 1.5 soniya cooldown
- **Tayyor mezoni:** Yuborilayotgan rasm hajmi 150KB dan kichik

### T2.4 — Gamifikatsiya to'ldirilishi
- [ ] Kunlik 3 ta vazifa (Daily Quests)
- [ ] Streak Freeze (streakni muzlatish)
- [ ] Push bildirishnoma: streak eslatmasi (`expo-notifications`)
- **Tayyor mezoni:** Kechqurun "Streak'ingni yo'qotma!" bildirishnomasi keladi

### T2.5 — Ko'p tillilik (i18n)
- [ ] `i18next` + `expo-localization`: **uz / ru / en**
- [ ] AI javobi ham foydalanuvchi tilida bo'lsin (promptga til uzatilsin)
- **Tayyor mezoni:** Telefon tili o'zgarsa, ilova va AI tili ham o'zgaradi

---

## 🟢 FAZA 3 — Do'konga chiqish (V1 LAUNCH)

*Taxminiy: 2-3 hafta*

### T3.1 — Huquqiy hujjatlar
- [ ] Maxfiylik siyosati (Privacy Policy) — veb-sahifa
- [ ] Foydalanish shartlari (Terms of Use)
- [ ] Parental Gate (ota-ona tekshiruvi) — to'lov va tashqi havolalar oldida
- **Tayyor mezoni:** Havolalar ilova ichida ochiladi

### T3.2 — To'lov (Pro obuna)
- [ ] RevenueCat yoki `expo-in-app-purchases`
- [ ] Pro: cheksiz energiya — $12.99/oy yoki $99/yil
- [ ] Obuna holati `subscriptions` jadvalida
- **Tayyor mezoni:** Test rejimida obuna sotib olinadi va energiya cheksiz bo'ladi

### T3.3 — Build va do'kon
- [ ] EAS Build (`eas build --platform all`)
- [ ] App Store Connect + Google Play Console akkauntlari
- [ ] Ikonka, skrinshotlar, tavsif (uz/ru/en)
- [ ] Data Safety (Google) + Privacy Nutrition Labels (Apple) to'ldirilsin
- [ ] Age Rating: 4+ / Everyone
- **Tayyor mezoni:** ✅ **Ilova do'konda**

---

## 🔵 FAZA 4 — V2: Ovozli javob

*V1 chiqqandan keyin. Taxminiy: 3 hafta*

- [ ] `useAudioRecorder` tiklansin (`_future/` dan)
- [ ] Ovozni yozib olish → Edge Function → transkripsiya → javobni baholash
- [ ] `MagicMicOrb` va `VoiceWaveIndicator` ulansin
- [ ] **Diqqat:** `useAudioRecorder.stopRecording()` xato bo'lsa soxta jim WAV qaytaradi —
      bu tuzatilsin

---

## ⚪️ FAZA 5 — V3: Gemini Live (real-time)

*Faqat V1 va V2 barqaror ishlagandan keyin. Taxminiy: 6-8 hafta*

- [ ] Edge Function WebSocket relay (Deno `Deno.upgradeWebSocket`)
- [ ] `LiveSessionController` (transport mantiqi store'da emas, alohida klassda)
- [ ] Audio uplink 16kHz PCM / downlink native audio
- [ ] `FrameStreamController` — **0.5 FPS**, harakatsizlikda 0 FPS
- [ ] `set_socratic_step` function calling → UI sinxronizatsiyasi
- [ ] Barge-in (bola gapirsa AI jim bo'ladi), VAD
- [ ] 5 daqiqa sessiya limiti, 45 soniya jimlikda auto-pause
- [ ] Rate limiter + token bucket (xarajat nazorati)

---

## 📌 Umumiy tekshiruv ro'yxati (har bir vazifadan keyin)

- [ ] `npx tsc --noEmit` → 0 xato
- [ ] Ilova telefonda ochiladi va buzilmaydi
- [ ] Yangi `any` qo'shilmagan
- [ ] `src/` ichida API kalit yo'q
- [ ] O'zgarish `git commit` qilingan
