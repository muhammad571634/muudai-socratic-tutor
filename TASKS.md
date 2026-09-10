# MuudAI — Vazifalar Rejasi (TASKS)

> **Qanday ishlatiladi:** Yuqoridan pastga. Bitta vazifani tugatmasdan keyingisiga
> o'tilmaydi. Har bir vazifa uchun tayyor prompt: [`docs/GEMINI_PROMPTS.md`](./docs/GEMINI_PROMPTS.md)
>
> Arxitektura: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · Strategiya:
> [`docs/PRODUCT_STRATEGY.md`](./docs/PRODUCT_STRATEGY.md) · Ta'lim mantiqi:
> [`docs/PEDAGOGY.md`](./docs/PEDAGOGY.md)
>
> `[ ]` = bajarilmagan · `[x]` = bajarilgan va tekshirilgan

---

## 🔴 FAZA 0 — Tozalash va barqarorlashtirish

*Maqsad: loyihani ishonchli holatga keltirish. Backend'siz, yangi funksiyasiz.*
*Taxminiy: 1-2 hafta*

### 🚀 T0.0 — BIRINCHI HAFTA (shu yerdan boshlanadi)

> Reja yozish tugadi. Endi ishlaydigan kod kerak.
> Bir kunda bitta vazifa. Har birini **telefonda o'zingiz tekshirasiz**.

| Kun | Vazifa | Kechqurun nima ko'rasiz |
| :-- | :-- | :-- |
| **1** | `T0.1` — o'rnatish va ishga tushirish | Ilova telefoningizda ochiladi |
| **2** | `T0.2` — model nomlarini tekshirish ⚠️ | **Haqiqatni bilasiz** |
| **3–4** | `T0.3` — soxta demo darsni yo'q qilish | Ilova xato bo'lsa rostini aytadi |
| **5–7** | `T0.4` — xatolar tsiklini ulash | **Mahsulotning yuragi tiklanadi** |

- **Tayyor mezoni (hafta oxiri):** rasm skanerlayman → haqiqiy AI darsi keladi →
  xato qilaman → bosh sahifada "1 ta xato" chiqadi → qayta yechaman → yo'qoladi

### T0.1 — Loyihani ishga tushirish va tekshirish
- [ ] `npm install` bajarilsin
- [ ] `npx tsc --noEmit` ishga tushirilsin, barcha xatolar tuzatilsin
- [ ] `npx expo start -c` bilan ilova ochilsin, bosh sahifa ko'rinsin
- **Tayyor mezoni:** TypeScript 0 xato, ilova telefonda ochiladi

### T0.2 — Model nomlarini tekshirish (B9) ✅ BAJARILDI
> **Natija:** `gemini-3.5-flash` mavjud emasligi tasdiqlandi (har chaqiruvda 404).
> Asosiy model `gemini-3.8-flash`, zaxira `gemini-3.7-flash` qilib olindi.

- [x] `src/core/config.ts` dagi nomlar rasmiy hujjatga solishtirildi
- [x] Mavjud bo'lmagan nomlar olib tashlandi
- **Tayyor mezoni:** Bitta rasm skanerlansa, haqiqiy AI javobi keladi (demo dars emas)
- **⚠️ Bu eng birinchi tekshiriladi** — agar model nomi noto'g'ri bo'lsa, ilova hech
  qachon ishlamagan, faqat soxta demo ko'rsatgan bo'ladi

### T0.3 — Soxta "fallback" darsni yo'q qilish (B2, B3, B4) ✅ BAJARILDI
- [x] `createFallbackSession()` ikkala datasource'dan olib tashlandi
- [x] `ScanError` (`network` | `blurry` | `not_a_problem` | `unknown`) qo'shildi
- [x] Gemini datasource endi `isImageReadable === false` ni tekshiradi
- [x] Bolabop xato ekrani qo'shildi

> ⚠️ **Saboq:** Gemini bu vazifani bajarayotib `src/core/api/TutorApiClient.ts`
> faylida **yangi soxta dars** yaratdi (`canonicalAnswer: 'x = 4'`, matematikasi ham
> noto'g'ri) va uni ekranga uladi. Claude uni tuzatdi. Sabab: `AGENTS.md` qoidalari
> o'sha paytda `main` branch'ida yo'q edi — Gemini ularni ko'rmagan.
- **Tayyor mezoni:** Internet o'chirilganda ilova xato xabarini ko'rsatadi, demo dars emas

### T0.4 — Ta'lim tsiklini ulash (B5, B6) ⭐ ENG MUHIM
> Ish taqsimoti: `AGENTS.md` — "Ish taqsimoti" bo'limi

**🧠 Claude yozadi (mantiq):** ✅ BAJARILDI
- [x] `useMistakeStore` ga xato yozish mantiqi (mavzu, fan, savol, maslahat bilan)
- [x] `App.tsx` `handleSelectSocraticOption` javob indeksini tekshiradi
- [x] XP faqat **to'g'ri** javobga beriladi
- [x] 12 ta soxta "namuna xato" (`CURRICULUM_MISTAKES`) olib tashlandi —
      daftar endi faqat bolaning o'z xatolari bilan to'ladi
- [x] Ikki karra XP tuzatildi (`solveMistake` + `App.tsx` ikkalasi ham berardi)
- [x] `createdAt` haqiqiy ISO vaqtga o'tdi, `source` maydoni ajratildi

**🎨 Gemini yozadi (UI):** ✅ BAJARILDI *(commit `2d3ca5d`)*
- [x] `ReviewMistakesView` ekrani `App.tsx` ga ulandi
- [x] Bosh sahifada "Xatolar daftari" kartasi + faol xatolar soni
- **Tayyor mezoni:** Xato qilaman → bosh sahifada "1 ta xato" ko'rinadi → bosaman →
  xato ekrani ochiladi → qayta yechaman → xato yo'qoladi

### T0.5 — Energiya mantiqini tuzatish (B7, B8) ✅ BAJARILDI *(commit `a926aec`)*
- [x] Ikki marta sarflash to'xtatildi
- [x] Xatoni qayta yechganda **+1 energiya** beriladi
- [x] `config.ts`: refill oralig'i **3 soat** (`refillIntervalSeconds: 3 * 3600`)
- [x] `checkDailyRefresh()` dagi kunlik to'liq energiya reseti olib tashlandi
- **Tayyor mezoni:** 5 masala yechaman → energiya 0 → skaner ochilmaydi → xato yechaman → +1

### T0.6 — O'lik kodni tartibga solish (B10) ✅ BAJARILDI *(commit `2a4ea18`)*
- [x] `ReviewMistakesView` ulandi (T0.4 da)
- [x] **Saqlandi (V2 uchun):** `MagicMicOrb`, `VoiceWaveIndicator`, `useAudioRecorder`
      → `src/presentation/components/_future/`
- [x] 9 ta o'lik komponent o'chirildi (`AppleCameraDock`, `AppleCameraHeader`,
      `CameraViewFinder`, `SocraticTargetBox`, `FloatingSocraticBubble`,
      `SocraticGuidanceCard`, `HumanoidEnergyMeter`, `GamificationHeader`,
      `DuolingoCelebrationBanner`)
- [x] `data/repositories/*`, `AsyncStorageService`, `math_test.js` o'chirildi
- [ ] ⏸ `SubjectSelectionView` — hali ulanmagan (`App.tsx` dan import qilinmaydi).
      Fayl saqlanadi; ulash kerakmi yoki o'chiriladimi — alohida qaror
- **Tayyor mezoni:** `npx tsc --noEmit` 0 xato, ilova avvalgidek ishlaydi

### T0.7 — Hujjatlarni haqiqatga moslash (B11) ✅ BAJARILDI (Claude)
- [x] `README.md`: SDK 52→57, Reanimated 3→4.5.1, `expo-av`→`expo-audio`,
      React 19 / RN 0.86 / Zustand 5 qo'shildi
- [x] Mavjud bo'lmagan `useVoiceAnswerHandler` va o'chirilgan
      `DuolingoCelebrationBanner` havolalari olib tashlandi
- [x] Eskirgan model nomlari (`gemini-3.5-flash`, `gemini-flash-lite`) →
      `gemini-3.8-flash` + zaxira `gemini-3.7-flash`
- [x] Noto'g'ri `git clone` manzili tuzatildi (`muhammadsukut0509` → `muhammad571634`)
- [x] Arxitektura daraxti haqiqiy holatga moslandi (`i18n/`, `prompts/`, `_future/`;
      mavjud bo'lmagan `data/local/` va `data/repositories/` olib tashlandi)
- [x] API kalit klientda ekani ogohlantirish sifatida yozildi (T1.4 gacha)
- [x] i18n va Xatolar daftari imkoniyatlar ro'yxatiga qo'shildi
- [x] `AGENTS.md`: "Reanimated 3" → "Reanimated 4"
- **Tayyor mezoni:** README'dagi har bir gap `package.json` va kod bilan mos

### T0.8 — Ko'p tillilik (i18n) ⭐ GLOBAL BOZOR UCHUN SHART
> **Nima uchun Faza 0 da?** Ilova hozir 100% o'zbek tilida qotib qolgan — barcha matnlar
> komponentlar ichiga yozilgan. Har yangi ekran bilan muammo kattalashadi. Keyinga
> qoldirilsa, tuzatish narxi bir necha barobar oshadi. Batafsil: `ARCHITECTURE.md` §6.5

- [x] `i18next` + `react-i18next` + `expo-localization` o'rnatildi *(Gemini)*
- [x] `src/core/i18n/` papkasi: `en.json` (asosiy), `ru.json`, `uz.json` *(Gemini)*
- [ ] ⏸ **T0.8a / T0.8b / T0.8c TO'XTATILDI** — sabab: REDESIGN (Faza 0.5).
      Qaytadan chiziladigan ekranni tarjimaga ulash behuda ish. Gemini yangi
      komponentlarni **boshidanoq `t()` bilan** yozadi.
      Asosiy qism allaqachon bajarilgan va yo'qolmaydi: **167 ta kalit × 3 til**
      `locales/` fayllarida turibdi.
- [ ] ⏸ `VirtualScienceLabView` (19 ta matn) — ekran uzilgan, V1.2 da (T3.6)
- [ ] ⏸ `_future/MagicMicOrb` (3 ta matn) — V2 da (Faza 4)
      Promptlar: `docs/GEMINI_PROMPTS.md` → T0.8a / T0.8b / T0.8c
- [x] `SUBJECT_ITEMS`, `LEARNER_RANKS`, `TUTOR_STATE_CONFIGS`, `AGE_GROUP_CONFIGS`
      tarjima kalitlariga o'tkazildi *(Claude)*
- [x] `SocraticPromptBuilder.buildSystemPrompt()` ga `locale` parametri qo'shildi —
      `<language_policy>` bloki AI'ni foydalanuvchi tilida javob berishga majburlaydi *(Claude)*
- [x] `speechService.ts` dagi til taxmin qilish butunlay olib tashlandi —
      TTS tili `getSpeechLanguageTag()` orqali ilova tilidan olinadi *(Claude)*
- [x] Xato xabarlari lokalizatsiya qilindi: `ScanError` endi kalit saqlaydi,
      matnga aylantirish UI chegarasida *(Claude)*
- **Tayyor mezoni:** Telefon tilini English qilaman → butun ilova va AI javobi
  ingliz tilida. Ruschaga o'zgartiraman → hammasi ruscha.

### T0.9 — V1 qamrovini cheklash (fanlar va laboratoriya) ✅ BAJARILDI
> **Nima uchun:** matematika javobini tenglamaga qaytarib qo'yib **deterministik**
> tekshirish mumkin. Fizika/kimyoda bunday usul yo'q → ishonchsiz darsni bolaga
> ko'rsatgan bo'lardik. Bu `docs/PEDAGOGY.md` §2.5 qoidasini buzadi.
> To'liq asos: `docs/PRODUCT_STRATEGY.md` §5.5

- [x] `BentoSubjectGrid` — fizika/kimyo kartalari bosilmaydi, "Tez orada" nishoni bor
- [x] `VirtualScienceLabView` `App.tsx` dan uzildi (fayl saqlandi)
- [ ] ⚠️ **Saqlanadi:** `SubjectType` tipi va prompt qoidalari
      (`SocraticPromptBuilder` dagi fizika/kimyo bloklari) — V1.2 da qaytadi
- ℹ️ **Tuzatish:** yuqorida `SubjectItem` ga `comingSoon?: boolean` qo'shilgan deb
      yozilgan edi — bunday maydon aslida qo'shilmagan. `SubjectCard` va
      `BentoSubjectGrid` "tez orada" holatini `subject.id !== 'math'` orqali
      aniqlaydi. Maydon kerak bo'lsa alohida vazifa sifatida qo'shiladi.
- ℹ️ **Tuzatish:** `DEMO_PHYSICS_SESSION` va `DEMO_CHEMISTRY_SESSION` "saqlanadi"
      deb belgilangan edi — ular T0.12 da o'chirildi. V1.2 da fizika/kimyo
      qaytganda demo emas, haqiqiy AI tahlili ishlatiladi (T3.6).
- **Tayyor mezoni:** Bosh sahifada faqat matematika bosiladi; fizika va kimyo
  ko'rinadi, lekin "Tez orada" deb turadi va ochilmaydi

### T0.10 — 245fc55 dagi ortiqcha kodni tartibga solish
> Gemini T0.3 bilan birga so'ralmagan 1000+ qator kod yozdi. Hammasi yomon emas —
> lekin holati aniq bo'lishi kerak.

- [x] `payload.json` (ildizdagi axlat fayl) o'chirildi
- [x] `TutorApiClient.ts` dagi soxta dars olib tashlandi (Claude)
- [ ] `backend/` — **saqlanadi.** `MathValidator` (mathjs bilan) T1.4b uchun
      to'g'ri asos. Lekin hozircha **hech qayerdan chaqirilmaydi** — server yo'q
- [ ] `tests/TutorFlow.test.ts` — hozircha ishlamaydi (jest/vitest o'rnatilmagan).
      Faza 1 da to'g'ri test muhiti quriladi
- [ ] `SocraticInteractionView.tsx` va `SocraticState.ts` — Faza 1 da
      backend ulanganda qayta ko'rib chiqiladi

### T0.11 — Dinamik rejimni Faza 1 gacha o'chirish ✅ BAJARILDI (Claude)
> `/code-review` topdi: `TutorApiClient` skanerlash tugmasiga ulangani uchun
> **ilova bitta ham masalani skanerlay olmasdi**. U mavjud bo'lmagan serverga
> tayanadi va xato tashlaganda haqiqiy Gemini tahlilini to'sib qo'yardi.

- [x] `handleLocalSnapPhoto` dan `tutorApiClient.extractProblem` olib tashlandi
- [x] Ortiqcha ikkinchi surat olish yo'q qilindi (har tegishda 2 marta pul ketardi)
- [x] `useSocraticScanner` dagi oxirgi soxta dars (`3x + 5 = 20`) yo'q qilindi
- [x] `isImageReadable` JSON sxemada **majburiy** qilindi — xira rasm tekshiruvi
      endi haqiqatan ishlaydi
- [x] Xato xabarlari ajratildi: 404/401 → "xizmatda nosozlik",
      429 → "ko'p so'rov", faqat haqiqiy tarmoq muammosida "Wi-Fi ni tekshir"
- [x] `backend/README.md` — prototip ekani va 8 ta xatosi yozildi
- [ ] `SocraticInteractionView`, `SocraticState`, `backend/` — Faza 1 da
      (T1.4 / T1.4b) qayta yoziladi va ulanadi

### T0.12 — Soxta demo darsni butunlay yo'q qilish ✅ BAJARILDI (Claude)
> `/code-review` topdi: demo dars ekranga **uchta** alohida yo'ldan kirardi va
> bola hech narsa skanerlamasdan turib "5x - 20 = 2x + 12" masalasini yechib
> XP olishi mumkin edi. T0.3 va T0.11 har safar bitta chaqiruv joyini uzgan,
> lekin ma'lumot joyida qolgani uchun xato uchinchi marta qaytib kelgan.

- [x] `App.tsx` dagi `fallbackDemoSession` olib tashlandi
- [x] `SocraticScannerScreen` dagi `DEMO_SOCRATIC_SESSION.steps[0]` zaxirasi olib tashlandi
- [x] `equation = "5x - 20 = 2x + 12"` soxta prop default qiymati olib tashlandi
- [x] `DEMO_SOCRATIC_SESSION`, `DEMO_PHYSICS_SESSION`, `DEMO_CHEMISTRY_SESSION`,
      `getDemoSocraticSession()` domain'dan **o'chirildi** (255 qator) — uzilmadi,
      o'chirildi, aks holda to'rtinchi marta qaytadi
- [x] Dars ekrani haqiqiy qadam bo'lmasa ochilmaydi (`if (!activeStep)` darvozasi)
- [x] Sessiyasiz 50 XP berish yo'q qilindi
- **Tayyor mezoni:** Skanerlamasdan dars ekraniga tushib bo'lmaydi; kamera —
  bo'sh holat ekrani (Photomath / Gauth standarti)
- ⚠️ **Diqqat:** `DEMO_PHYSICS_SESSION` va `DEMO_CHEMISTRY_SESSION` T0.9 da
  "saqlanadi" deb belgilangan edi. Ular o'chirildi — V1.2 da fizika/kimyo
  qaytganda demo emas, haqiqiy tahlil ishlatiladi (T3.6)

### T0.13 — Skaner ekrani rejimini to'g'rilash 🎨 GEMINI ✅ BAJARILDI
> Bola "Xatolar daftari" → "AI yordamchi" bossa, oldida masala o'rniga **kamera**
> ochiladi va u nima qilishini tushunmaydi. Sirli sandiqda ham xuddi shunday.
> Sabab: `viewMode` har doim `"scan"` dan boshlanadi va faqat deklansher
> bosilganda o'zgaradi.
>
> To'liq mantiq va tayyor prompt: `docs/GEMINI_PROMPTS.md` → T0.13

- [x] `viewMode` holati olib tashlandi — rejim `activeStep` bor-yo'qligidan kelib chiqadi
- [x] `finally` blokidagi `setViewMode('chat')` olib tashlandi
- [x] Darvoza `if (!activeStep)` ko'rinishiga keltirildi
- **Tayyor mezoni:** Xatolar daftaridan "AI yordamchi" bosilganda darhol dars
  ochiladi; bosh sahifadagi "AI SKANER" dan kirilganda kamera ochiladi

---

## 🎨 FAZA 0.5 — REDESIGN (frontend qaytadan chiziladi)

*Maqsad: skeletni vizual ko'rib, sinab, tasdiqlash. Backend'siz.*
*Qaror: dizayn yoqmadi → avval mantiq va skelet aniqlanadi, keyin qaytadan chiziladi.*

> **Skelet hujjati:** [`docs/UI_ARCHITECTURE.md`](./docs/UI_ARCHITECTURE.md)
> **Promptlar:** [`docs/GEMINI_PROMPTS.md`](./docs/GEMINI_PROMPTS.md) → D1–D8
>
> **Nima uchun backend to'xtatildi:** ekranlar o'zgarsa, ma'lumot oqimi ham
> o'zgaradi. Hozir yozilgan server qismi qaytadan yozilishi kerak bo'lardi.
> B1 (API kalit) xavfi shu davrda ochiq qoladi — shart: **ilovani hech kimga
> tarqatmaslik** (`ARCHITECTURE.md` §2).

### T0.14 — Skeletni hujjatlashtirish ✅ BAJARILDI (Claude)
- [x] `docs/UI_ARCHITECTURE.md` yozildi — 12 bo'lim
- [x] Duolingo modelidan olinadigan 14 ta mexanika sanaldi
- [x] Duolingo'dan **voz kechiladigan 6 ta qaror** sabab bilan yozildi
      (D1 yo'l yo'q · D2 xato jazolanmaydi · D3 javob ko'rsatilmaydi ·
       D4 liga yo'q · D5 qisqa dars · D6 qattiqroq streak)
- [x] Navigatsiya qarori: **3 ta tab** (Bugun · Takrorlash · Profil) + modallar
- [x] Har bir ekran uchun **barcha holatlar** yozildi (bo'sh/yuklanish/xato/normal)
- [x] `ARCHITECTURE.md` §2 haqiqatga moslandi (10 ta xatodan 9 tasi yopilgan)

### D1–D8 — Ekranlarni qaytadan chizish 🎨 GEMINI
> Tartib muhim: dars ekrani birinchi, chunki qolgani unga moslashadi.

- [x] **D0** Onboarding — salomlashuv ekrani 🎨 *(Gemini, `bf6e749`)*
      `WelcomeOnboardingScreen` + `DuoButton` yaratildi, uch tilga ulandi.
      ⚠️ Ikkita ochiq masala pastda — T0.16.
- [x] **D0b** Onboarding — til tanlash ekrani 🎨 *(Gemini, `011f7d5`)*
      `LanguageSelectionScreen`. ✅ Zona to'g'ri hurmat qilingan: ekran chizilgan,
      tanlangan til `onContinue(lang)` orqali yuqoriga uzatilgan, ulash Claude'ga
      qoldirilgan (`// Pure UI transition for now`).
      ⬜ Ulash T0.16 da: tanlangan til `setAppLocale()` ga berilsin va saqlansin.
- [ ] **D1** Dars ekrani (5 ta holat) ⭐ eng muhim
- [ ] **D2** Bugun / bosh sahifa (4 ta holat)
- [ ] **D3** Yakun / tabrik (2 ta holat)
- [ ] **D4** Takrorlash / xatolar daftari (3 ta holat)
- [ ] **D5** Profil — **yangi ekran**, til va ovoz sozlamalari shu yerda
- [ ] **D6** Skaner / kamera (5 ta holat)
- [ ] **D7** Sirli sandiq (3 ta holat)
- [ ] **D8** Pastki tab panel (oxirida)
- **Tayyor mezoni:** har bir ekranning har bir holatini telefonda ko'rish mumkin

### T0.16 — Onboarding ulanishi ✅ BAJARILDI (Claude)
- [x] 🐞 **Onboarding endi faqat bir marta ko'rsatiladi.** `useAppStore` yaratildi,
      `hasSeenOnboarding` AsyncStorage'da saqlanadi. Ilova qayta o'rnatilganda
      xotira tozalanadi va salomlashuv yana bir marta chiqadi — kerakli xatti-harakat.
- [x] 🔌 **Til tanlash ulandi va saqlanadi.** `chooseLocale()` tanlovni saqlaydi
      va `setAppLocale()` ni chaqiradi. Ilova qayta ochilganda saqlangan til
      tiklanadi (`onRehydrateStorage`).
- [x] Saqlangan holat o'qilgunicha ekran ko'rsatilmaydi — aks holda salomlashuv
      bir zumga chaqnab, keyin bosh sahifaga sakrab ketardi.
- [x] Qo'llab-quvvatlanmagan til tanlansa — til o'zgarmaydi va konsolga
      ogohlantirish yoziladi (bola bo'sh interfeys olmasligi uchun)

### T0.17 — Onboarding: qolgan ekranlar va ochiq masalalar
> Gemini D0 (salomlashuv ekrani) ni chizdi — dizayn va kod sifati yaxshi,
> `DuoButton` foydali qo'shimcha. Lekin ikkita narsa hal qilinishi kerak.

- [ ] 🐞 **Onboarding har safar ochilganda ko'rinadi.** `App.tsx` da boshlang'ich
      ekran `'onboarding'` qilib qo'yilgan, lekin "ko'rgan" holati saqlanmaydi.
      Bola ilovani 50-marta ochsa ham salomlashuv chiqaveradi.
      Yechim: saqlanadigan `hasSeenOnboarding` bayrog'i (Claude zonasi).
**👤 Qaror qabul qilindi:** akkaunt, yosh va to'lov ekranlari **bo'ladi** —
Duolingo'da ham bor. Sabab: to'lov akkauntga bog'lanadi, ota-ona hisoboti
akkauntsiz ishlamaydi, va progress qurilma almashsa ham saqlanishi kerak.
To'liq asos: `UI_ARCHITECTURE.md` §4.0.

**🎨 Gemini chizadi (ekranlar bor deb aytilgan):**
- [ ] Yosh guruhi tanlash ekrani
- [ ] Akkaunt yaratish ekrani
- [ ] To'lov / Pro taklifi ekrani
- [ ] 🟡 Til ro'yxatidagi tarjimasi yo'q tillar (Mandarin, Spanish) "Tez orada"
      nishoni bilan so'niq va bosilmaydigan qilinsin — fizika/kimyo kartalari
      kabi (T0.9). Ro'yxat qolsin, T2.5 da to'ldiriladi.

**🔴 Do'konga chiqishdan oldin majburiy:**
- [ ] "Akkauntim bor" tugmasi **haqiqatan ishlasin** (T1.3) **yoki**
      "Tez orada" holatiga o'tsin. Ishlamaydigan "Kirish" tugmasi bilan
      do'kon tekshiruvidan o'tib bo'lmaydi.
- [ ] Yosh so'rash — ma'lumot yig'ish. Maxfiylik siyosati va Data Safety
      deklaratsiyasida aks etsin (T3.1). 13 yoshgacha → ota-ona darvozasi.
- [ ] 🔌 **Til tanlash ekranini ulash.** `LanguageSelectionScreen` tayyor va
      tanlangan tilni uzatadi, lekin `App.tsx` da u hozircha e'tiborsiz qoldirilgan.
      Kerak: `setAppLocale(lang)` chaqirilsin **va til saqlansin** — aks holda
      ilova qayta ochilganda telefon tiliga qaytadi.
- [ ] ℹ️ **Eslatma:** `App.tsx` Claude zonasi (`AGENTS.md`). D-promptlarda
      shunday yozilgan. Kelgusi topshiriqlarda Gemini ekranni chizadi,
      ulashni Claude qiladi.

### T0.18 — Onboarding kodini tekshirish natijalari 🔍 (Claude, tekshirildi)

> Gemini yaratgan 8 ta fayl tekshirildi: `DuoButton`, `WelcomeOnboardingScreen`,
> `LanguageSelectionScreen`, `LearnSelectionScreen`, `BrandIcons`,
> `DailyStudyTargetScreen`, `ReferralSourceScreen`, `CreateProfilePromptScreen`.

**✅ Qoidalar bajarilgan:**
- `npx tsc --noEmit` → 0 xato · `any` ishlatilmagan
- Qattiq kodlangan JSX matn **yo'q** — hammasi `t()` orqali
- 209 ta kalit × 3 til, farqsiz; ishlatilgan 44 ta kalitning hammasi mavjud
- Zona hurmat qilingan: `src/domain/`, `src/data/`, `src/core/api/` ga tegilmagan
- Soxta mazmun/statistika yo'q
- "Tez orada" nishoni qo'llangan (tavsiya qilinganidek)
- DEV tugmasi `__DEV__` ichida — reliz build'ga tushmaydi ✅
- `DuoButton` — `BentoSpringCard` takrori emas, haqiqiy foydali qo'shimcha

**🔴 Tuzatilishi kerak:**

- [ ] **"Profil yaratish" va "O'tkazib yuborish" bir xil ishni qiladi.**
      Ikkalasi ham faqat `completeOnboarding()` chaqiradi. Bola profil
      yaratishni tanlaydi — hech narsa yaratilmaydi.
      Yechim: T1.3 (anonim akkaunt) yoki "Tez orada" holati.
      Bu "Akkauntim bor" tugmasi bilan bir xil muammo.

- [ ] **Onboarding javoblari saqlanmayapti.** 4 ta savol so'raladi, 1 tasi saqlanadi:
      | Savol | Holat |
      | :-- | :-- |
      | Til | ✅ saqlanadi (`chooseLocale`) |
      | Nimani o'rganish | ❌ tashlab yuboriladi (`_topic`) |
      | Kunlik maqsad | ❌ tashlab yuboriladi (`_target`) |
      | Qayerdan eshitdingiz | ❌ tashlab yuboriladi (`_source`) |

      Bu **Claude zonasi** — Gemini ma'lumotni to'g'ri yuqoriga uzatgan.
      Kerak: kunlik maqsad → bosh sahifadagi maqsad halqasi va eslatmalar
      (Duolingo aynan shunday qiladi); fan → `setSubject()`.

- [ ] 🎨 **Rang palitrasi — 🎨 Gemini o'zi hal qiladi.** *(Muhammadning qarori:
      Gemini'da UI skill bor.)* Ma'lumot uchun: 8 ta ekranda 93 ta qattiq rang
      ishlatilgan; ularning **76 tasi allaqachon `theme.ts` da token sifatida bor**
      (masalan `#FFFFFF` ×32 → `theme.colors.background`, `#E5E5E5` ×15 →
      `borderLight`), 17 tasi esa yangi. Yangi rang kerak bo'lsa Gemini aytsin —
      Claude `theme.ts` ga qo'shadi.

- [ ] ♿️ **7 ta yangi ekranda birorta `accessibilityLabel` yo'q.**
      Eski ekranlarda bor (`SocraticScannerScreen`, `BentoSubjectGrid`).
      Bosiladigan elementlar: `LanguageSelectionScreen` 3 ta, `LearnSelectionScreen`,
      `DailyStudyTargetScreen`, `ReferralSourceScreen`, `ProfileNameScreen` — 2 tadan.
      Bolalar ta'limi ilovasi va do'kon tekshiruvi uchun muhim.
      ⬜ Kim bajaradi — hali hal qilinmagan.

**🟡 Kichik:**
- [ ] 21 ta `t('kalit', 'fallback')` — inline inglizcha zaxira matn bilan.
      Kalit yo'qolsa, o'zbekcha interfeysda inglizcha jumla **jimgina** chiqadi.
      Yaxshiroq: zaxirasiz, shunda yo'qolgan kalit darhol ko'rinadi.

### T0.15 — Redesign'dan keyin ulash 🧠 CLAUDE
> Gemini ekranlarni chizadi, Claude ularni mantiqqa ulaydi.

- [ ] `App.tsx` navigatsiyasi 3 tabga moslansin
- [ ] Til tanlash ishlasin va **saqlansin** (hozir ilova qayta ochilsa yo'qoladi)
- [ ] Tillar `app.json` orqali iOS/Android'ga e'lon qilinsin
      *(Expo SDK 57 hujjatidan aniq sozlama nomi tekshiriladi — taxmin qilinmaydi)*
- [ ] Ovoz sozlamalari (`useVoiceStore`) Profil ekraniga ulansin
- [ ] Yordam zinasi (`PEDAGOGY.md` §3) UI'ga ulansin
- [ ] `SubjectSelectionView` — ulanadimi yoki o'chiriladimi, qaror

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
- [ ] `ARCHITECTURE.md` §5 dagi 10 ta jadval SQL migratsiya sifatida yaratilsin
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

### T1.4b — Yechimni tekshirish quvuri ⭐ TA'LIM SIFATI UCHUN HAL QILUVCHI
> **Nima uchun:** LLM matematikada **ishonch bilan** xato qiladi. Tekshirilmasa,
> ilova bolaga noto'g'ri matematikani o'rgatadi va uni "to'g'ri" deb maqtaydi.
> To'liq asos: `docs/PEDAGOGY.md` §2.5

- [ ] `solve-problem` ichida 5 bosqich: PERCEIVE → SOLVE → **VERIFY** → PLAN → DIALOGUE
- [ ] Tenglamalarda: javobni asl tenglamaga qaytarib qo'yish (deterministik tekshiruv)
- [ ] Boshqa hollarda: ikkinchi mustaqil yechim (birinchisini ko'rsatmasdan) va solishtirish
- [ ] Mos kelmasa → 3-urinish → yana mos kelmasa → darsni **ko'rsatmaslik**:
      *"Bu masala men uchun ham qiyin ekan! 🤔 Boshqasini sinab ko'ramizmi?"*
- [ ] Bunday holatda **energiya qaytariladi** (bola aybdor emas) + serverga log
- [ ] `learning_sessions.verification_passed` ustuniga yozilsin
- **Tayyor mezoni:** Ataylab chalkash rasm beraman → ilova soxta dars ko'rsatmaydi,
  rostini aytadi va energiyani qaytaradi

### T1.7 — AgeBand + mavzular grafi (skill graph)
> Bu Ota-ona hisoboti va aqlli takrorlashning poydevori. `docs/PEDAGOGY.md` §4, §8

- [ ] `AgeBand` tipi: `'junior' | 'explorer' | 'scholar'` (`junior` V1 da ishlatilmaydi,
      lekin model bugundan tayyor bo'lsin — kelajakdagi Junior ilovasi uchun)
- [ ] `topics` va `topic_mastery` jadvallari + boshlang'ich mavzular ro'yxati
- [ ] `mistakes.misconception_tag` ustuni (`distribution_error`, `sign_error`,
      `operation_order`, `unit_error`, `concept_gap`, `careless`)
- [ ] AI har noto'g'ri variantga sabab yorlig'ini biriktirsin
      (`optionMisconceptions[]` — prompt sxemasiga qo'shiladi)
- [ ] Mastery holati: `not_seen → learning → practiced → mastered`
      (2 ta ketma-ket yordamsiz to'g'ri = mastered)
- [ ] Takrorlash oralig'i: xato→ertaga, 1-to'g'ri→3 kun, 2-to'g'ri→7 kun, mastered→30 kun
- **Tayyor mezoni:** Qavs ochishda 2 marta xato qilaman → ertaga "Xatolar daftari"da
  aynan shu mavzu chiqadi

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

### T2.7 — Kunlik mashq (Daily Practice) ⭐ RETENTION UCHUN POYDEVOR
> ⚠️ **T2.4 dan OLDIN bajarilsin.** Streak, kunlik vazifa va liga — bularning ostida
> kontent bo'lishi kerak. Faqat skanerlashga tayansak, uy vazifasiz kunlarda
> (dam olish, **yozgi ta'til**) ilovada qiladigan ish qolmaydi va streak uziladi.
> To'liq asos: `docs/PRODUCT_STRATEGY.md` §2.5

- [ ] `curriculum_problems` va `daily_challenge` jadvallari (`ARCHITECTURE.md` §5)
- [ ] Kontent generatsiya skripti: **oflayn** ishlaydi (repoda `scripts/` papkasida),
      AI masala yaratadi → `PEDAGOGY.md` §2.5 tekshiruvidan o'tadi → JSON'ga yoziladi
- [ ] Yaratilgan masalalar **inson tomonidan** ko'zdan kechirilsin (siz), keyin bazaga
      yuklansin (`verified_by`, `verified_at` to'ldiriladi)
- [ ] Boshlang'ich hajm: **faqat matematika** uchun 100–150 ta masala
      (fizika/kimyo V1.2 da — `TASKS.md` T0.9)
- [ ] Bosh sahifada karta: **"Bugungi mashq — 3 ta masala"**
- [ ] Ishlash paytida AI **chaqirilmaydi** — faqat bazadan o'qiladi (xarajat ~$0)
- **Tayyor mezoni:** Kamerani umuman ochmasdan, uy vazifasiz kunda ham ilovada
  qiladigan ish bor va streak saqlanadi

### T2.8 — Challenge kalendari (streak'ning yumshoq muqobili)
> ⚠️ **T2.7 dan KEYIN.** Kontent bo'lmasa, bola uy vazifasi yo'q kunda katakni
> yopa olmaydi va mexanika uni maktab jadvali uchun jazolaydi.
> To'liq asos: `docs/PRODUCT_STRATEGY.md` §3.5

- [ ] **Haftalik** challenge (oylik emas — 8–15 yosh uchun 30 kun juda uzoq)
- [ ] Kalendar ko'rinishi: bajarilgan kunlar belgilanadi ("zanjirni uzma" ta'siri)
- [ ] Streak uzilganda ham challenge progressi **yo'qolmaydi** — bu uning butun ma'nosi
- [ ] Ijtimoiy taqqoslash yo'q — kalendar faqat shaxsiy (COPPA)
- [ ] ⭐ Shu kalendar **ota-ona hisobotining asosiy vizuali** bo'lsin (T2.6) —
      alohida grafik chizish shart emas
- **Tayyor mezoni:** bir kun o'tkazib yuboraman → streak nolga tushadi, lekin
  challenge "4/7" bo'lib qoladi va davom etishga chorlaydi

### T3.7 — Ishlab topiladigan valyuta (V1.2+, ixtiyoriy)
> `docs/PRODUCT_STRATEGY.md` §4.5 dagi 2-bosqich. **Pulga sotilmaydi.**

- [ ] Olmos ishlab topiladi: masala yechish · **xatoni tuzatish** · kunlik maqsad
- [ ] Sarflanadi: maskot kiyimlari, mavzular (themes), Streak Freeze
- [ ] 🔒 **Energiyaga ALMASHTIRIB BO'LMAYDI** — buzilmas qoida
- **Tayyor mezoni:** `grep -r "buyEnergy\|energy.*purchase" src/` → hech narsa topilmaydi

### T2.4 — Gamifikatsiya to'ldirilishi
> ⚠️ **T2.7 siz bu vazifa ma'nosiz** — streak'ni oziqlantiradigan kontent bo'lmaydi.
- [ ] Kunlik 3 ta vazifa (Daily Quests)
- [ ] Streak Freeze (streakni muzlatish)
- [ ] Push bildirishnoma: streak eslatmasi (`expo-notifications`)
- [ ] **Streak faqat masala TO'G'RI yechilganda saqlansin** — shunchaki ilovani
      ochganda emas (`docs/PEDAGOGY.md` §10). Streak **T2.7 kunlik mashqidan**
      ham to'ldirilsin, faqat skanerlashdan emas
- [ ] Liga qo'shilsa — **faqat anonim taxalluslar** (`Brave Fox 🦊`), tizim beradi,
      foydalanuvchi tanlamaydi. Chat yo'q, do'st qo'shish yo'q.
      ⚠️ Bolalar ismini ko'rsatish = ijtimoiy funksiya = COPPA/Apple muammosi
- **Tayyor mezoni:** Kechqurun "Streak'ingni yo'qotma!" bildirishnomasi keladi

### T2.6 — Ota-ona hisoboti ⭐ PRO OBUNANING ASOSIY QIYMATI
> **Nima uchun muhim:** to'lovni bola emas, **ota-ona** qiladi.
> Bu Photomath'da yo'q va bo'lishi ham mumkin emas. `docs/PEDAGOGY.md` §9

- [ ] `parent-report` Edge Function: haftalik xulosa
- [ ] Ko'rsatiladigan bo'limlar: bu hafta (masala/daqiqa/streak) · kuchli tomonlar
      (mastered mavzular) · diqqat talab qiladi (takrorlanuvchi `misconception_tag`)
- [ ] ⭐ **"Sokratik dalil":** *"Ali 12 ta masalani mustaqil yechdi. Javob berilmagan."*
      (`learning_sessions.solved_unaided` asosida)
- [ ] Parental gate ortida ochilsin
- **Tayyor mezoni:** Bir hafta ishlatgandan keyin hisobot ochiladi va raqamlar to'g'ri

### T2.5 — Tillarni kengaytirish va matematik yozuv
> T0.8 poydevor edi; bu uni global bozorga kengaytiradi.

- [ ] Yangi tillar: `es`, `pt-BR`, `hi`, `ar`, `id`, `tr`
- [ ] Arab tili uchun RTL (o'ngdan chapga) layout tekshirilsin
- [ ] Mintaqaviy matematik yozuv: o'nlik ajratgich (`3.14` / `3,14`),
      bo'lish belgisi (`÷` / `:`) — `ARCHITECTURE.md` §6.5 jadvali bo'yicha
- **Tayyor mezoni:** Telefon tili arabcha bo'lsa, interfeys o'ngdan chapga oqadi

---

## 🟢 FAZA 3 — Do'konga chiqish (V1.0 LAUNCH — BEPUL)

*Taxminiy: 2-3 hafta*

> **V1.0 to'lovsiz chiqadi.** To'lov infratuzilmasi katta ish va u talab
> tasdiqlanmasdan oldin qilinadi. Energiya limiti (5/kun) xarajatni ushlaydi.
> Sabab: `docs/PRODUCT_STRATEGY.md` §5.5

### T3.1 — Huquqiy hujjatlar
- [ ] Maxfiylik siyosati (Privacy Policy) — veb-sahifa
- [ ] Foydalanish shartlari (Terms of Use)
- [ ] Parental Gate (ota-ona tekshiruvi) — tashqi havolalar oldida
      (keyinchalik to'lov ham shu darvoza ortida bo'ladi)
- **Tayyor mezoni:** Havolalar ilova ichida ochiladi

### T3.3 — Build va do'kon
- [ ] EAS Build (`eas build --platform all`)
- [ ] App Store Connect + Google Play Console akkauntlari
- [ ] Ikonka, skrinshotlar, tavsif (en/ru/uz — asosiysi **inglizcha**)
- [ ] Data Safety (Google) + Privacy Nutrition Labels (Apple) to'ldirilsin
- [ ] Age Rating: 4+ / Everyone
- **Tayyor mezoni:** ✅ **Ilova do'konda**

---

## 💚 FAZA 3.5 — V1.1: To'lov (launch'dan keyin)

*Faqat V1.0 chiqib, odamlar ishlatayotgani ko'ringandan keyin.*

### T3.5 — Pro obuna
- [ ] RevenueCat yoki `expo-in-app-purchases`
- [ ] Pro: cheksiz energiya + Ota-ona hisoboti — $9.99/oy yoki $59/yil
      (narx asosi: `docs/PRODUCT_STRATEGY.md` §4 — Gauth $7.99 so'raydi)
- [ ] Family tarifi (3 bola) — $14.99/oy
- [ ] **Mintaqaviy narxlar**: AQSh/Yevropa ~$9.99 · Lotin Amerikasi ~$5 · Hindiston/MDH ~$3
- [ ] Obuna holati `subscriptions` jadvalida
- [ ] To'lov **parental gate** ortida (`T3.1`)
- **Tayyor mezoni:** Test rejimida obuna sotib olinadi va energiya cheksiz bo'ladi

### T3.6 — V1.2: Fizika va kimyo
- [ ] Bu fanlar uchun ishonchli tekshiruv usuli ishlab chiqilsin
- [ ] `comingSoon` bayrog'i olib tashlansin (`T0.9` teskarisi)
- [ ] `VirtualScienceLabView` qayta ulansin
- **Tayyor mezoni:** Fizika masalasi skanerlanadi va tekshiruvdan o'tadi

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
