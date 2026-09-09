# Gemini uchun tayyor promptlar (nusxa ko'chirib ishlatiladi)

> Bu fayl — siz uchun **qo'llanma**. Antigravity'da Gemini'ga topshiriq berayotganda
> shu yerdan nusxa ko'chirasiz. Har bir prompt bitta vazifa uchun.
>
> **Oltin qoida: bitta promptda — bitta vazifa.** "Hammasini qilib ber" desangiz,
> Gemini chalkashadi va o'lik kod yozadi (hozirgi 13 ta o'lik komponent aynan shundan).

---

## 0. Har bir prompt shu 5 qismdan iborat bo'lishi kerak

```
1. KONTEKST   → qaysi fayllarni o'qishi kerak
2. VAZIFA     → aniq nima qilish kerak (bitta narsa)
3. QOIDALAR   → nima qilish TAQIQLANADI
4. TAYYOR MEZONI → qanday tekshiraman
5. TASDIQ     → o'zgartirgan fayllar ro'yxatini so'rash
```

---

## 1. ENG BIRINCHI PROMPT (har yangi suhbatda beriladi)

> Gemini xotirasi yo'q. Har safar yangi chat ochsangiz — **shuni birinchi yuboring.**

```
Sen MuudAI loyihasining dasturchisisan. Men texnik emasman — kod yozmayman.
Loyiha arxitekturasi Claude tomonidan tuzilgan va u ARCHITECTURE.md faylida.

BIRINCHI QADAM: Quyidagi 3 faylni o'qi va menga 5 gapda xulosa qil:
1. ARCHITECTURE.md
2. TASKS.md
3. AGENTS.md

QAT'IY QOIDALAR (buzilmaydi):
- ARCHITECTURE.md dagi qoidalar qonun. Ularga zid kod yozmaysan.
- TypeScript strict: `any` ishlatish TAQIQLANADI.
- API kalit hech qachon klient kodida bo'lmaydi.
- Model nomi, kutubxona versiyasi, API endpoint — TAXMIN QILMAYSAN.
  Bilmasang: "Bilmayman, tekshirish kerak" deb aytasan.
- Yangi komponent yozishdan oldin mavjudini qidirasan (grep).
- `catch` blokida soxta/demo ma'lumot qaytarish TAQIQLANADI.
- Men aytmagan narsani qo'shmaysan. Ortiqcha "yaxshilash" qilmaysan.

Xulosa qilganingdan keyin TO'XTA va mendan keyingi topshiriqni kut.
```

---

## 2. FAZA 0 promptlari (tartib bilan)

### T0.2 — Model nomlarini tekshirish ⚠️ ENG BIRINCHI

```
VAZIFA: src/core/config.ts va src/data/remote/GeminiSocraticDataSource.ts
fayllarida quyidagi Gemini model nomlari ishlatilgan:
  - gemini-3.5-flash
  - gemini-3.7-flash
  - gemini-flash-lite-latest

Bu nomlarning HAQIQATDAN mavjudligini Google'ning rasmiy hujjatidan tekshir
(ai.google.dev/gemini-api/docs/models).

Menga jadval ko'rinishida javob ber:
| Kodda yozilgan nom | Rasmiy hujjatda bormi? | To'g'ri nom |

QOIDA: Taxmin qilma. Rasmiy hujjatga havola ko'rsat.
Hozircha KOD O'ZGARTIRMA — faqat hisobot ber.
```

*Keyin, agar noto'g'ri chiqsa:*

```
VAZIFA: Yuqoridagi tekshiruvga asosan config.ts va GeminiSocraticDataSource.ts
dagi model nomlarini to'g'rilaringa almashtir.

TAYYOR MEZONI: Men rasm skanerlaganimda haqiqiy AI javobi keladi.
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.3 — Soxta demo darsni yo'q qilish

```
KONTEKST: ARCHITECTURE.md §2 dagi B2, B3, B4 xatolarini o'qi.

MUAMMO: AI so'rovi muvaffaqiyatsiz bo'lganda ilova jimgina hardcoded demo dars
(getDemoSocraticSession) ko'rsatadi. Bola daftaridagi masala o'rniga butunlay
boshqa masalani oladi va buni bilmaydi. Bu ishonchni yo'q qiladi.

VAZIFA:
1. GeminiSocraticDataSource.ts va OpenAiSocraticDataSource.ts dagi
   createFallbackSession() chaqiruvlarini olib tashla.
2. Ularning o'rniga aniq xato turi qaytar (yangi `ScanError` tipi yarat:
   'network' | 'blurry' | 'not_a_problem' | 'unknown').
3. Gemini datasource `isImageReadable === false` holatini tekshirsin
   (hozir bu maydon schema'da bor, lekin kodda umuman o'qilmaydi).
4. useSocraticScanner.ts xato turini UI'ga uzatsin.
5. SocraticScannerScreen'da bolabop xato ekrani ko'rsatilsin:
   xira rasm → "Rasm biroz xira chiqdi 😅 Qani, yana bir marta urinamiz!"
   internet yo'q → "Internet ulanmadi. Wi-Fi ni tekshirib ko'r!"

QOIDA: `any` ishlatma. Demo sessiyani qaytarma. Boshqa fayllarga tegma.

TAYYOR MEZONI: Telefonda internetni o'chiraman → xato xabari chiqadi (demo dars emas).
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.4 — Ta'lim tsiklini ulash ⭐ ENG MUHIM

```
KONTEKST: ARCHITECTURE.md §6 "Asosiy tsikl" bo'limini o'qi.

MUAMMO: useMistakeStore.addMistake() funksiyasi yozilgan, lekin loyihada
HECH QAYERDAN chaqirilmaydi. Ya'ni bola xato qilsa — hech qayerga yozilmaydi.
Duolingo'ning eng kuchli mexanikasi (xatoni takrorlash) ishlamayapti.
Bundan tashqari App.tsx:109 dagi handleSelectSocraticOption javob indeksini
e'tiborsiz qoldiradi — noto'g'ri javobga ham XP beriladi.

VAZIFA (4 qism, tartib bilan):
1. SocraticScannerScreen.tsx: bola noto'g'ri variantni bosganda
   useMistakeStore.addMistake() chaqirilsin (masala matni, mavzu, fan bilan).
2. App.tsx: handleSelectSocraticOption javob to'g'riligini tekshirsin.
   XP FAQAT to'g'ri javobga berilsin.
3. ReviewMistakesView.tsx ekrani App.tsx ga ulansin (hozir u yozilgan, lekin
   foydalanuvchi unga hech qanday yo'l bilan kira olmaydi).
4. BentoSubjectGrid.tsx (bosh sahifa)da "Xatolar daftari" kartasi qo'shilsin,
   ustida faol xatolar soni ko'rsatilsin.

QOIDA: Mavjud komponentlarni ishlat, yangi yozma. Dizayn uslubi mavjud
BentoSpringCard bilan bir xil bo'lsin.

TAYYOR MEZONI: Xato qilaman → bosh sahifada "1 ta xato" chiqadi → bosaman →
xatolar ekrani ochiladi → qayta to'g'ri yechaman → xato ro'yxatdan yo'qoladi.
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.5 — Energiya mantiqini tuzatish

```
KONTEKST: ARCHITECTURE.md §6 "Energiya qoidalari" jadvalini o'qi — u yakuniy qoida.

MUAMMOLAR:
1. Energiya ikki marta sarflanadi: useSocraticScanner.ts:95 da bir marta,
   App.tsx:61 (handleCompletePracticingMistake) da yana bir marta.
2. Spetsifikatsiya bo'yicha xatoni qayta yechganda +1 energiya BERILISHI kerak,
   lekin kod aksincha uni SARFLAYAPTI.
3. config.ts da refill oralig'i 600 soniya (10 daqiqa), lekin bo'lishi kerak — 3 soat.
4. useGamificationStore.checkDailyRefresh() har kuni energiyani to'liq tiklaydi —
   bu 5 ta kunlik limitni ma'nosiz qiladi.

VAZIFA: To'rttasini ham ARCHITECTURE.md §6 jadvaliga muvofiq tuzat.

TAYYOR MEZONI: 5 ta masala yecham → energiya 0 bo'ladi → skaner ochilmaydi →
xatolar daftaridan bitta xatoni to'g'ri yechaman → energiya 1 ga chiqadi.
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.6 — O'lik kodni tozalash

```
KONTEKST: ARCHITECTURE.md §2 "O'lik kod ro'yxati" ni o'qi.

VAZIFA (aynan shu ro'yxatga amal qil, o'zingdan qo'shma):

A) `src/presentation/components/_future/` papkasi yaratilsin va unga KO'CHIRILSIN
   (o'chirilmaydi, V2 da kerak bo'ladi):
   MagicMicOrb.tsx, VoiceWaveIndicator.tsx
   va src/presentation/hooks/useAudioRecorder.ts

B) BUTUNLAY O'CHIRILSIN:
   AppleCameraDock.tsx, AppleCameraHeader.tsx, CameraViewFinder.tsx,
   SocraticTargetBox.tsx, FloatingSocraticBubble.tsx,
   HumanoidEnergyMeter.tsx, GamificationHeader.tsx,
   src/data/repositories/ (butun papka),
   src/domain/repositories/IGamificationRepository.ts,
   src/domain/repositories/IMistakeRepository.ts,
   src/data/local/ (butun papka),
   math_test.js (loyiha ildizida)

C) O'chirishdan keyin qolgan ishlatilmagan import'lar tozalansin.

QOIDA — BULARNI O'CHIRMA:
- ReviewMistakesView.tsx va SubjectSelectionView.tsx (ular T0.4 da ulanadi)
- SocraticGuidanceCard.tsx va DuolingoCelebrationBanner.tsx
  (ular hozir SocraticScannerScreen da ISHLATILYAPTI — o'chirsang ilova buziladi)
- backend/ papkasi
Ro'yxatda yo'q faylga TEGMA.

TAYYOR MEZONI: `npx tsc --noEmit` → 0 xato. Ilova avvalgidek ishlaydi.
TASDIQ: O'chirilgan va ko'chirilgan fayllar ro'yxatini ber.
```

### T0.8 — Ko'p tillilik (i18n) ⭐ GLOBAL BOZOR UCHUN

> Bu katta vazifa. **Ikki bosqichga bo'ling** — bir promptda so'ramang.

**A qismi — avval hisobot:**

```
KONTEKST: ARCHITECTURE.md §6.5 "GLOBAL BOZOR strategiyasi" ni o'qi.

MUAMMO: Ilova 100% o'zbek tilida qotib qolgan. Barcha matnlar komponentlar
ichiga to'g'ridan-to'g'ri yozilgan. Loyiha global bozorga chiqadi, shuning uchun
asosiy til INGLIZ tili bo'ladi.

VAZIFA (hozircha faqat hisobot, KOD O'ZGARTIRMA):
src/ ichidagi barcha foydalanuvchiga ko'rinadigan matnlarni topib, jadval qil:
| Fayl | Qator | Matn | Taklif qilingan kalit |

Quyidagilarni ham qamrab ol:
- komponentlardagi <Text> ichidagi matnlar
- SUBJECT_ITEMS, LEARNER_RANKS, TUTOR_STATE_CONFIGS, AGE_GROUP_CONFIGS
- xato xabarlari va status matnlari

TO'XTA va hisobotni menga ko'rsat.
```

**B qismi — keyin bajarish:**

```
VAZIFA: Yuqoridagi hisobot asosida i18n tizimini qur.

1. `i18next`, `react-i18next`, `expo-localization` o'rnat.
2. `src/core/i18n/` yarat: index.ts + locales/en.json, ru.json, uz.json
   — ASOSIY (fallback) til: EN
3. Barcha topilgan matnlarni `t('kalit')` ga almashtir.
   Mavjud o'zbekcha matn → uz.json ga. en.json va ru.json ni ham to'ldir.
4. SocraticPromptBuilder.buildSystemPrompt() ga `locale: string` parametri qo'sh.
   Promptda: "Respond ONLY in {locale} language."
5. speechService.ts dagi detectLanguage() funksiyasini O'CHIR
   (u o'zbekcha so'zlar ro'yxati bo'yicha taxmin qiladi — global ilovada ishlamaydi).
   O'rniga chaqiruvchi kod lokalni parametr sifatida uzatsin.

QOIDA: Bir vaqtda bitta papka ustida ishla va har qadamdan keyin
`npx tsc --noEmit` ni tekshir. `any` ishlatma.

TAYYOR MEZONI: Telefon tilini English qilaman → butun ilova va AI javobi inglizcha.
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.9 — V1 qamrovini cheklash (fanlar)

```
KONTEKST: docs/PRODUCT_STRATEGY.md §5.5 ni o'qi.

QAROR: V1.0 faqat MATEMATIKA bilan chiqadi. Sabab — matematika javobini asl
tenglamaga qaytarib qo'yib deterministik tekshirish mumkin, fizika va kimyoda
esa bunday usul yo'q. Ishonchsiz darsni bolaga ko'rsatish taqiqlanadi.

VAZIFA:
1. src/domain/entities/Gamification.ts: SubjectItem interfeysiga
   `comingSoon?: boolean` maydoni qo'sh.
2. SUBJECT_ITEMS da 'physics' va 'chemistry' uchun `comingSoon: true` qo'y.
3. BentoSubjectGrid.tsx: comingSoon kartalar bosilmasin, opacity pasaytirilsin
   va "Tez orada" nishoni ko'rsatilsin. Dizayn uslubi mavjud kartalar bilan bir xil.
4. App.tsx: VirtualScienceLabView ga o'tish yo'li uzilsin va 'lab' ekrani
   olib tashlansin.

⚠️ QAT'IY SAQLANADI (o'CHIRMA):
- VirtualScienceLabView.tsx fayli (V1.2 da qaytadi)
- SubjectType tipidagi 'physics' va 'chemistry'
- SocraticPromptBuilder dagi fizika/kimyo qoidalari
- DEMO_PHYSICS_SESSION va DEMO_CHEMISTRY_SESSION

TAYYOR MEZONI: Bosh sahifada faqat matematika bosiladi. Fizika va kimyo
ko'rinadi, lekin "Tez orada" deb turadi va ochilmaydi.
TASDIQ: O'zgartirgan fayllar ro'yxatini ber.
```

### T0.12 — Rasmni kichraytirish (xarajatni 10 barobar kamaytiradi)

```
KONTEKST: docs/UNIT_ECONOMICS_AND_LIMITS.md §2 ni o'qi.

MUAMMO: src/presentation/hooks/useSocraticScanner.ts da 12MP surat to'liq
yuboriladi (bir necha megabayt). Talab: 1080p, JPEG sifat 0.75, ~120KB.
Ya'ni har skanerlash kerakligidan ~10 barobar ko'p trafik va pul yeyapti.

QIL:
1. ImageManipulator.manipulateAsync ga `resize` amali qo'shilsin — kesishdan
   KEYIN, maksimal kenglik 1080px (balandlik avtomatik).
2. `compress: 0.8` → `compress: 0.75`.
3. takePictureAsync dan `base64: true` olib tashlansin. U hozir hisoblanadi,
   keyin tashlab yuboriladi — bekor ish. Faqat manipulator natijasidan
   base64 olinsin.
4. Agar kesish/kichraytirish muvaffaqiyatsiz bo'lsa — mavjud xatti-harakat
   saqlansin (to'liq surat), lekin base64 o'sha yerda olinsin.

QOIDA: `any` ishlatma. Faqat shu bitta faylga teg.

TAYYOR MEZONI: Skanerlaganda konsolda base64 uzunligi 160 000 belgidan
kichik bo'lsin (≈120KB). Skanerlash avvalgidek ishlaydi.
TASDIQ: O'zgartirgan faylni va base64 uzunligini ko'rsat.
```

---

## 3. Gemini "yolg'on" gapirganda nima qilish kerak

AI ko'pincha "hammasi tayyor!" deydi, lekin aslida ishlamaydi. Shu 3 ta savolni bering:

```
1. "Nima o'zgartirding? Har bir faylni va o'zgarish sababini ro'yxat qil."

2. "`npx tsc --noEmit` ni ishga tushir va natijani ko'rsat.
    Agar xato bo'lsa — tuzat."

3. "Bu o'zgarish ishlaganini men telefonimda QANDAY tekshiraman?
    Aniq qadamlar bilan ayt."
```

Agar Gemini uch marta urinib ham tuzata olmasa — **to'xtating** va menga (Claude'ga)
xato matnini yuboring. Uzoq davom etgan urinishlar kodni battar buzadi.

---

## 4. HECH QACHON aytmang ❌

| ❌ Yomon prompt | ✅ Yaxshi prompt |
| :-- | :-- |
| "Ilovani yaxshila" | "T0.3 ni bajar" (aniq vazifa) |
| "Backend qo'sh" | "Supabase'da faqat `profiles` jadvalini yarat" |
| "Xatolarni tuzat" | "Mana bu xato matni: [...] — shuni tuzat" |
| "Duolingo kabi qil" | "Bosh sahifaga streak kartasi qo'sh, dizayn BentoSpringCard kabi" |
| "Hammasini qayta yoz" | (hech qachon aytmang) |

---

## 5. Birinchi hafta — kunlik jadval

> Reja yozish tugadi. Endi ishlaydigan kod kerak.

| Kun | Prompt | Kechqurun nima ko'rasiz |
| :-- | :-- | :-- |
| **1** | `T0.1` (§1 promptdan keyin) | Ilova telefoningizda ochiladi |
| **2** | `T0.2` — model nomlari ⚠️ | **Haqiqatni bilasiz** |
| **3–4** | `T0.3` — soxta demo darsni yo'q qilish | Ilova xato bo'lsa rostini aytadi |
| **5–7** | `T0.4` — xatolar tsiklini ulash | **Mahsulotning yuragi tiklanadi** |

**Hafta oxirida shuni tekshiring:** rasm skanerlayman → haqiqiy AI darsi keladi →
xato qilaman → bosh sahifada "1 ta xato" chiqadi → qayta yechaman → yo'qoladi.

Ishlasa — Claude'ga yozing, keyingi bosqichni birga rejalashtiramiz.

---

## 6. Ish tartibi (har kuni shunday)

```
1. TASKS.md ni ochib, keyingi belgilanmagan `[ ]` vazifani toping
2. Yangi Gemini chati oching → §1 dagi "ENG BIRINCHI PROMPT" ni yuboring
3. Shu fayldan tegishli vazifa promptini nusxa ko'chiring
4. Gemini ishlagach → §3 dagi 3 ta savolni bering
5. Telefonda o'zingiz tekshiring ("Tayyor mezoni" bo'yicha)
6. Ishlasa → TASKS.md da `[x]` qiling → commit qiling
7. Ishlamasa yoki tushunmasangiz → Claude'ga (menga) yozing
```

> **Muhim:** Bitta vazifa tugab, telefonda tekshirilmaguncha keyingisiga o'tmang.
