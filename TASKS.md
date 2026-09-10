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

**🎨 Gemini yozadi (UI):**
- [ ] `ReviewMistakesView` ekrani `App.tsx` ga ulansin (hozir kirish yo'li yo'q)
- [ ] Bosh sahifada "Xatolar daftari" kartasi + faol xatolar soni
      (dizayn `BentoSpringCard` uslubida)
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
- [x] `AGENTS.md`: "Reanimated 3" → "Reanimated 4" *(bajarildi)*
- **Tayyor mezoni:** README'dagi har bir gap `package.json` bilan mos

### T0.8 — Ko'p tillilik (i18n) ⭐ GLOBAL BOZOR UCHUN SHART
> **Nima uchun Faza 0 da?** Ilova hozir 100% o'zbek tilida qotib qolgan — barcha matnlar
> komponentlar ichiga yozilgan. Har yangi ekran bilan muammo kattalashadi. Keyinga
> qoldirilsa, tuzatish narxi bir necha barobar oshadi. Batafsil: `ARCHITECTURE.md` §6.5

- [x] `i18next` + `react-i18next` + `expo-localization` o'rnatildi *(Gemini)*
- [x] `src/core/i18n/` papkasi: `en.json` (asosiy), `ru.json`, `uz.json` *(Gemini)*
- [ ] ⏳ **Barcha** qotib qolgan matnlar komponentlardan chiqarilsin — **Gemini**
      Holat: 10 ta komponentda ~96 ta matn qoldi, lug'atda 52 ta kalit tayyor
      turibdi va ulanmagan. Ya'ni yangi matn o'ylash emas, `t()` ga ulash kerak.
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

### T0.13 — Skaner ekrani rejimini to'g'rilash 🎨 GEMINI
> Bola "Xatolar daftari" → "AI yordamchi" bossa, oldida masala o'rniga **kamera**
> ochiladi va u nima qilishini tushunmaydi. Sirli sandiqda ham xuddi shunday.
> Sabab: `viewMode` har doim `"scan"` dan boshlanadi va faqat deklansher
> bosilganda o'zgaradi.
>
> To'liq mantiq va tayyor prompt: `docs/GEMINI_PROMPTS.md` → T0.13

- [ ] `viewMode` holati olib tashlansin — rejim `activeStep` bor-yo'qligidan kelib chiqsin
- [ ] `finally` blokidagi `setViewMode('chat')` olib tashlansin
- [ ] Darvoza `if (!activeStep)` ko'rinishiga keltirilsin
- **Tayyor mezoni:** Xatolar daftaridan "AI yordamchi" bosilganda darhol dars
  ochiladi; bosh sahifadagi "AI SKANER" dan kirilganda kamera ochiladi

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
