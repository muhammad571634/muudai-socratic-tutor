# MuudAI — Arxitektura (Loyihaning Miyasi)

> **Bu fayl loyihaning yagona haqiqat manbai (single source of truth).**
> Har qanday AI (Gemini, Claude, Cursor) yoki dasturchi kod yozishdan **oldin** shu faylni
> o'qishi shart. Bu yerda yozilmagan texnologiya loyihaga qo'shilmaydi.
>
> Oxirgi yangilanish: 2026-09-09 · Muallif: Claude (arxitektor) · Holat: **Faol**

---

## 1. Loyiha nima?

**MuudAI** — 8–15 yoshdagi bolalar uchun Sokratik AI repetitor. Bola daftardagi masalani
kameraga tutadi, AI javobni **aytmaydi**, balki bosqichma-bosqich savollar berib, bolaning
o'zi javobni topishiga yordam beradi. Duolingo uslubidagi gamifikatsiya (streak, energiya,
XP, liga) bolani har kuni qaytib kelishga undaydi.

**Maqsad:** App Store va Google Play'ga chiqarish, global bozor.

---

## 2. HOZIRGI HOLAT (rostini aytganda)

### ✅ Tayyor va yaxshi ishlaydi

| Qism | Holat |
| :-- | :-- |
| UI dizayn (Duolingo/Apple uslubi) | ~85% tayyor, sifatli |
| Clean Architecture skeleti (`core/domain/data/presentation`) | To'g'ri qurilgan |
| Zustand store'lar (4 ta, AsyncStorage bilan saqlanadi) | Ishlaydi |
| Kamera skaner + rasm kesish | Ishlaydi |
| Gemini/OpenAI almashtirish (`AiRepositoryFactory`) | Yaxshi naqsh (pattern) |
| Sokratik prompt (guardrail'lar bilan) | Kuchli yozilgan |
| Orqa kamera qat'iyligi (`facing="back"`) | COPPA talabiga mos ✓ |
| TTS (ovozli o'qish, `expo-speech`) | Ishlaydi |

### ❌ Umuman yo'q (lekin `docs/` da "bor" deb yozilgan)

| `docs/` spetsifikatsiyasi va'da qilgan | Repoda haqiqat |
| :-- | :-- |
| Real-time WebSocket (<800ms) | **Yo'q.** Oddiy `fetch` so'rovi |
| Gemini Multimodal **Live** (jonli audio) | **Yo'q.** Qurilma TTS'i (robot ovoz) |
| 0.5 FPS video oqimi | **Yo'q.** Bitta rasm |
| `set_socratic_step` function calling | **Yo'q** |
| **Backend server** | **Yo'q.** Hech qanday |
| **Supabase / ma'lumotlar bazasi** | **Yo'q.** `package.json` da ham yo'q |
| Ro'yxatdan o'tish / akkaunt | **Yo'q** |
| To'lov / Pro obuna | **Yo'q** |
| Galereyadan rasm yuklash | **Yo'q** |
| Navigatsiya kutubxonasi | **Yo'q** (`useState` bilan qo'lda) |

> **Xulosa:** Ilova chiroyli **maketi (prototip)** tayyor. Uning ortidagi tizim — 0%.

### 🔴 Jiddiy xatolar (launch'dan oldin tuzatilishi SHART)

| # | Muammo | Fayl | Nima uchun xavfli |
| :- | :-- | :-- | :-- |
| **B1** | **API kalit ilova ichida** (`EXPO_PUBLIC_GEMINI_API_KEY`) | `src/core/config.ts` | Har kim `.apk` ni ochib kalitni o'g'irlaydi va **sizning hisobingizdan** pul sarflaydi. Store'da ham rad etilishi mumkin. |
| **B2** | AI ishlamasa **jimgina soxta demo dars** ko'rsatiladi | `GeminiSocraticDataSource.ts:216,223`<br>`OpenAiSocraticDataSource.ts:174` | Bola daftaridagi masala o'rniga **butunlay boshqa masalani** oladi va buni bilmaydi. Ishonchni yo'q qiladi. |
| **B3** | "Rasm xira" xatosi yutib yuboriladi | `OpenAiSocraticDataSource.ts:168→173` | `throw` qilinadi, darhol `catch` bo'ladi. Bola ogohlantirish o'rniga soxta dars oladi. |
| **B4** | Gemini `isImageReadable` ni **umuman o'qimaydi** | `GeminiSocraticDataSource.ts:104-110` | Schema'da e'lon qilingan, lekin koddа tekshirilmaydi. |
| **B5** | **Xatolar daftari hech qachon to'ldirilmaydi** | `useMistakeStore.ts:57` | `addMistake()` hech qayerdan chaqirilmaydi. Ya'ni Duolingo'ning eng kuchli mexanikasi (xatoni qayta ishlash) **ishlamaydi**. |
| **B6** | XP noto'g'ri javobga ham beriladi | `App.tsx:109` | `_optionIndex` e'tiborsiz qoldirilgan. Bola tasodifiy bosib XP yig'adi. |
| **B7** | Energiya 2 marta sarflanadi | `useSocraticScanner.ts:95` + `App.tsx:61` | Spetsifikatsiya bo'yicha bu yerda aksincha **+1 energiya** berilishi kerak edi. |
| **B8** | Energiya sozlamasi mos emas | `config.ts` = 10 daqiqa | Spetsifikatsiya = 3 soat. Bundan tashqari `checkDailyRefresh()` har kuni to'liq tiklaydi → limit ma'nosiz. |
| **B9** | Model nomlari shubhali | `config.ts`: `gemini-3.5-flash`, `gemini-3.7-flash` | Bu nomlar rasmiy hujjatda bor-yo'qligi **tekshirilmagan**. Agar yo'q bo'lsa — barcha so'rovlar muvaffaqiyatsiz → doim B2 (soxta dars). |
| **B10** | 13 ta komponent **o'lik kod** | pastdagi ro'yxat | Ilova hajmi shishadi, Gemini adashadi. |

### 🗂 O'lik kod ro'yxati (hech qayerdan chaqirilmaydi)

**Ekranlar/komponentlar:** `ReviewMistakesView` ⚠️, `SubjectSelectionView`,
`FloatingSocraticBubble`, `SocraticGuidanceCard`, `SocraticTargetBox`, `MagicMicOrb`,
`VoiceWaveIndicator`, `HumanoidEnergyMeter`, `GamificationHeader`, `AppleCameraDock`,
`AppleCameraHeader`, `CameraViewFinder`, `DuolingoCelebrationBanner`

**Hook'lar:** `useAudioRecorder`

**Butun zanjir o'lik:** `data/repositories/*` + `IGamificationRepository` +
`IMistakeRepository` + `AsyncStorageService` (store'lar `zustand/persist` ishlatadi)

> ⚠️ **`ReviewMistakesView`** — bu to'liq yozilgan "Xatolar daftari" ekrani, lekin
> `App.tsx` unga hech qanday yo'l bermaydi. Ya'ni **siz qurgan ekranni foydalanuvchi
> hech qachon ko'ra olmaydi.** Uni o'chirmaslik kerak — ulash kerak.

---

## 3. STRATEGIK QAROR: bosqichma-bosqich chiqamiz

> Bu loyihaning eng muhim qarori. Diqqat bilan o'qing.

`docs/` dagi spetsifikatsiya darhol **Gemini Live real-time streaming** ni talab qiladi.
**Bu xato yo'l.** Sabablari:

1. **Texnik murakkablik.** Full-duplex WebSocket + audio PCM oqimi + VAD + barge-in +
   function calling — bu 2-3 oylik ish va eng ko'p buziladigan qism. Vibe coding bilan
   deyarli imkonsiz.
2. **Narx.** Live sessiya ≈ **$0.0186 / masala**. Rasm rejimi ≈ **$0.0006 / masala**
   (~30 barobar arzon). Bepul foydalanuvchi Live'da oyiga ~$2.8, rasm rejimida ~$0.09.
3. **Sizda 90% tayyor mahsulot bor.** Rasm → Sokratik kartalar → TTS ovoz → tap javob.
   Bu allaqachon ishlaydi va bu **to'liq mahsulot**.

**Shuning uchun 3 bosqichli reja:**

| Versiya | Nima | Muddat | Maqsad |
| :-- | :-- | :-- | :-- |
| **V1 — "Scan & Learn"** | Rasm → Sokratik kartalar → TTS ovoz → tap javob. Backend + akkaunt + gamifikatsiya + to'lov. | ~6-8 hafta | **App Store / Play'ga CHIQISH** |
| **V2 — "Talk to Muud"** | Bola ovoz bilan javob beradi (yozib olish → transkripsiya → baholash) | +3 hafta | Ovozli tajriba |
| **V3 — "Live Tutor"** | Gemini Live real-time to'liq suhbat + 0.5 FPS video | +6-8 hafta | Spetsifikatsiyadagi orzu |

> **Qoida: V1 do'konga chiqmaguncha V3 ga tegilmaydi.**
> Foydalanuvchi qo'lidagi ishlaydigan oddiy ilova — hech qachon chiqmagan mукammal
> ilovadan yaxshiroq.

---

## 4. MAQSADLI ARXITEKTURA (V1)

```
┌─────────────────────────────────────────────────────────┐
│  MOBIL ILOVA  (Expo SDK 57 / React Native / TypeScript) │
│                                                          │
│  presentation/  ← ekranlar, komponentlar, Zustand        │
│  domain/        ← biznes qoidalari (AI'ga bog'liq emas)  │
│  data/          ← faqat Supabase bilan gaplashadi        │
│                                                          │
│  ❗ API KALIT YO'Q. Faqat Supabase anon key (bu xavfsiz) │
└────────────────────────┬─────────────────────────────────┘
                         │  HTTPS + JWT (foydalanuvchi tokeni)
                         ▼
┌─────────────────────────────────────────────────────────┐
│  SUPABASE  (backend)                                     │
│                                                          │
│  ├── Auth        anonim kirish + ota-ona akkaunti        │
│  ├── Postgres    profiles, sessions, mistakes, energy…   │
│  │    + RLS      har kim faqat o'z ma'lumotini ko'radi   │
│  ├── Edge Fn     ← 🔑 GEMINI KALIT SHU YERDA             │
│  │   solve-problem   rasm → Sokratik dars                │
│  │   check-answer    javobni baholash                    │
│  │   spend-energy    energiya nazorati (server hisoblaydi)│
│  └── Storage     rasm SAQLANMAYDI (COPPA)                │
└────────────────────────┬─────────────────────────────────┘
                         │  Gemini API (server↔server)
                         ▼
              ┌────────────────────┐
              │  Google Gemini     │
              │  (Flash / Vision)  │
              └────────────────────┘
```

### Nima uchun Supabase?

- Auth + Postgres + Server kodi + Fayl saqlash — **bitta joyda**.
- RLS (Row Level Security) — "har bir bola faqat o'z ma'lumotini ko'radi" qoidasini
  ma'lumotlar bazasi darajasida majburlaydi. Bu bolalar ilovasi uchun juda muhim.
- SQL — Gemini SQL yozishda ancha ishonchli (Firestore'ga qaraganda).
- Bepul tarif solo asoschi uchun yetarli.

---

## 5. Ma'lumotlar bazasi sxemasi (Supabase / Postgres)

```
profiles           id(uuid,PK) · display_name · age_group · locale · created_at
                   xp · streak_days · last_active_date · tier('free'|'pro')

learning_sessions  id · user_id(FK) · subject · problem_title · equation
                   final_answer · total_steps · completed_at · source('camera'|'gallery')

session_steps      id · session_id(FK) · step_number · tutor_question
                   options(jsonb) · correct_index · chosen_index · was_correct

mistakes           id · user_id(FK) · subject · topic_title · question_snippet
                   hint_summary · next_review_at · review_count · mastered(bool)

energy_ledger      id · user_id(FK) · delta(+1/-1) · reason · created_at
                   ↑ append-only. Joriy energiya = SUM(delta). Klient hisoblamaydi.

daily_quests       id · user_id(FK) · quest_date · quest_type · target · progress · claimed

subscriptions      id · user_id(FK) · platform('ios'|'android') · product_id
                   status · expires_at · original_transaction_id
```

**Qat'iy qoidalar:**
- Har bir jadvalda **RLS yoqilgan**, siyosat: `auth.uid() = user_id`.
- **Energiya, XP va streak — serverda hisoblanadi.** Klient faqat ko'rsatadi.
  (Hozirgi klient-only mantiq: bola telefon vaqtini o'zgartirib cheksiz energiya oladi.)
- Daftar rasmlari **saqlanmaydi** — Edge Function xotirasida tahlil qilinib o'chiriladi.

---

## 6. Gamifikatsiya modeli (Duolingo'dan o'rganilgan)

Duolingo'ning muvaffaqiyati 5 ta mexanikada. Bizda qaysi biri bor/yo'q:

| Mexanika | Duolingo'da | Bizda | Ustuvorlik |
| :-- | :-- | :-- | :-- |
| **Streak** (kunlik ketma-ketlik) | Eng kuchli retention omili | Bor (klientda) | 🔴 Serverga ko'chirish |
| **Streak Freeze** (muzlatish) | Churn'ni keskin kamaytiradi | Yo'q | 🟡 V1 |
| **Hearts / Energy** | Xato qilishni "qimmat" qiladi | Bor (buzuq) | 🔴 Tuzatish |
| **XP + Leagues** (haftalik liga) | Ijtimoiy raqobat | XP bor, liga yo'q | 🟡 V1.1 |
| **Daily Quests** (3 ta kunlik vazifa) | Kunlik maqsad beradi | Yo'q | 🟡 V1 |
| **Mistakes → takrorlash** | "Practice Hub" | ⚠️ Ekran bor, ulanmagan | 🔴 Ulash |
| **Push bildirishnoma** | Streak eslatmasi | Yo'q | 🔴 V1 |
| **Mystery Chest** | (bizning o'zimizniki) | Bor | ✅ |

**Asosiy tsikl (core loop) — hozir uzilgan, tiklanishi shart:**

```
Masalani skanerlash → Sokratik qadamlar → Xato qilsa → XATO YOZILADI
                                                            ↓
   +1 Energiya ← To'g'ri yechsa ← Ertaga "Xatolar daftari"da takrorlash
```

> **B5 xatosi shu tsiklni uzib qo'ygan.** Bu eng muhim tuzatish.

### Energiya qoidalari (yakuniy — `docs/` dagi ziddiyat shu yerda hal qilindi)

| Parametr | Qiymat |
| :-- | :-- |
| Maksimal energiya | 5 |
| 1 ta masala narxi | 1 energiya |
| Vaqt bilan tiklanish | 3 soatda +1 |
| Xatoni qayta yechish | **+1 energiya** (bonus) |
| Kunlik to'liq reset | ❌ **Yo'q** (limitni ma'nosiz qiladi) |
| Pro tarif | Cheksiz |

---

## 7. Xavfsizlik va bolalar uchun qoidalar (COPPA / GDPR-K / Kids Category)

Bu **majburiy**, aks holda App Store rad etadi:

- ✅ **Faqat orqa kamera.** Bolaning yuzi hech qachon suratga olinmaydi.
- ✅ **Rasm saqlanmaydi.** Tahlildan keyin darhol o'chiriladi.
- ❌ **Reklama yo'q.** Bolalar toifasida uchinchi tomon reklamasi taqiqlangan.
- ❌ **Bolаdan email/telefon/ism so'ralmaydi.** Anonim kirish.
- ✅ **Parental Gate** — to'lov, tashqi havola, sozlamalar oldida ota-ona tekshiruvi
  (bola yecha olmaydigan savol).
- ✅ **Maxfiylik siyosati** (Privacy Policy) — veb-sahifa sifatida majburiy.
- ✅ **Data Safety formasi** (Google Play) va **Privacy Nutrition Labels** (Apple).
- ✅ **Age Rating** to'g'ri to'ldirilgan.
- ✅ Chatda AI **hech qachon** shaxsiy ma'lumot so'ramaydi (promptda guardrail).

---

## 8. Kod qoidalari (Gemini SHU QOIDALARGA BO'YSUNADI)

1. **TypeScript strict.** `any` **taqiqlanadi**. (Hozir 5 ta bor — tuzatilsin.)
2. **Faqat funksional komponentlar.** Class komponent yo'q.
3. **Qatlam yo'nalishi:** `presentation → domain ← data`.
   `presentation` **hech qachon** `data/remote` ni to'g'ridan-to'g'ri chaqirmaydi.
4. **API kalit klientda bo'lmaydi.** Hech qachon. Hech qanday sababga ko'ra.
5. **Yangi kutubxona qo'shishdan oldin** — `ARCHITECTURE.md` ga yozilishi kerak.
6. **Yangi komponent yozishdan oldin** — mavjudini qidirish. (13 ta o'lik komponent
   aynan shu qoida buzilgani uchun paydo bo'lgan.)
7. **Model nomlari, API endpoint'lar, kutubxona versiyalari — TAXMIN QILINMAYDI.**
   Rasmiy hujjatdan tekshiriladi va manba havolasi izohda ko'rsatiladi.
8. **Xatolik jimgina yutilmaydi.** `catch` blokida soxta ma'lumot qaytarish taqiqlanadi —
   foydalanuvchiga rost xabar ko'rsatiladi.
9. **Expo SDK 57** hujjati: `https://docs.expo.dev/versions/v57.0.0/`
10. Har bir o'zgarishdan keyin: `npx tsc --noEmit` → **0 xato**.

### Haqiqiy texnologiya stek (README eskirgan, mana rost ro'yxat)

| | Versiya |
| :-- | :-- |
| Expo SDK | **57** (README'da "52" — noto'g'ri) |
| React Native | 0.86.3 |
| React | 19.2.3 |
| Reanimated | **4.5.1** (README va AGENTS.md'da "3" — noto'g'ri) |
| Audio | **`expo-audio`** (README'da "expo-av" — noto'g'ri) |
| State | Zustand 5 |
| TypeScript | 6.0.3 |

---

## 9. Keyingi qadam

Aniq vazifalar ro'yxati: **[`TASKS.md`](./TASKS.md)**
Gemini uchun tayyor promptlar: **[`docs/GEMINI_PROMPTS.md`](./docs/GEMINI_PROMPTS.md)**
