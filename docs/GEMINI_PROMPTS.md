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
   SocraticTargetBox.tsx, FloatingSocraticBubble.tsx, SocraticGuidanceCard.tsx,
   HumanoidEnergyMeter.tsx, GamificationHeader.tsx, DuolingoCelebrationBanner.tsx,
   src/data/repositories/ (butun papka),
   src/domain/repositories/IGamificationRepository.ts,
   src/domain/repositories/IMistakeRepository.ts,
   src/data/local/ (butun papka),
   math_test.js (loyiha ildizida)

C) O'chirishdan keyin qolgan ishlatilmagan import'lar tozalansin.

QOIDA: ReviewMistakesView va SubjectSelectionView ni O'CHIRMA — ular ulanadi.
Ro'yxatda yo'q faylga TEGMA.

TAYYOR MEZONI: `npx tsc --noEmit` → 0 xato. Ilova avvalgidek ishlaydi.
TASDIQ: O'chirilgan va ko'chirilgan fayllar ro'yxatini ber.
```

### T0.8 — Ko'p tillilik (i18n) ⭐ GLOBAL BOZOR UCHUN

> ⚠️ **Bu promptning eski varianti eskirgan edi va olib tashlandi.** Quyidagi
> ishlar **allaqachon bajarilgan** — Gemini'dan qayta so'ramang:
>
> - ✅ `i18next` + `react-i18next` + `expo-localization` o'rnatilgan *(Gemini)*
> - ✅ `src/core/i18n/` + `en.json` / `uz.json` / `ru.json` yaratilgan *(Gemini)*
> - ✅ `App.tsx`, `BentoSubjectGrid`, `HeroScanBanner` qisman ulangan *(Gemini)*
> - ✅ `SocraticPromptBuilder` ga `locale` parametri *(Claude)*
> - ✅ `speechService` dagi til taxmin qilish o'chirilgan *(Claude)*
> - ✅ Domain konstantalari kalitga o'tgan *(Claude)*
> - ✅ Xato xabarlari lokalizatsiya qilingan *(Claude)*
>
> **Qolgan ish faqat bitta:** komponentlar ichidagi qattiq kodlangan matnlarni
> `t()` ga ulash. **50 ta kalit lug'atda allaqachon yozilgan va ulanmagan** —
> ya'ni ko'p hollarda yangi matn o'ylash kerak emas, faqat ulash kerak.

**Qolgan ish taqsimoti (94 ta matn, 10 ta komponent):**

| Komponent | Matn | Tayyor kalit | Bosqich |
| :-- | --: | --: | :-- |
| `SocraticScannerScreen.tsx` | 11 | 15 | **T0.8a** |
| `SocraticInteractionView.tsx` | 5 | 6 | **T0.8a** |
| `FloatingCameraDock.tsx` | 2 | 3 | **T0.8a** |
| `BentoSubjectGrid.tsx` | 11 | 12 | **T0.8b** |
| `ReviewMistakesView.tsx` | 5 | 5 | **T0.8b** |
| `SubjectSelectionView.tsx` | 3 | 3 | **T0.8b** |
| `GamificationDetailModal.tsx` | 28 | 7 | **T0.8c** |
| `MysteryChestView.tsx` | 7 | 4 | **T0.8c** |
| `VirtualScienceLabView.tsx` | 19 | 4 | ⏸ V1.2 (ekran uzilgan, T0.9) |
| `_future/MagicMicOrb.tsx` | 3 | 0 | ⏸ V2 (Faza 4) |

> **Bitta promptda — bitta bosqich.** Uchalasini birga so'ramang.

---

#### T0.8a — Skaner oqimi (birinchi, eng muhim)

```
KONTEKST: Quyidagi fayllarni o'qi:
  src/core/i18n/locales/en.json   (kalitlar lug'ati)
  src/presentation/components/SocraticScannerScreen.tsx
  src/presentation/components/SocraticInteractionView.tsx
  src/presentation/components/FloatingCameraDock.tsx

Namuna sifatida src/presentation/components/HeroScanBanner.tsx ni ko'r —
u allaqachon to'g'ri ulangan.

VAZIFA: Shu 3 ta komponentdagi qattiq kodlangan matnlarni t() ga ulash.

1. Har bir faylga qo'sh (agar yo'q bo'lsa):
       import { useTranslation } from 'react-i18next';
   va komponent ichida:
       const { t } = useTranslation();

2. Har bir ko'rinadigan matnni almashtir:
       <Text>Kameraga ruxsat kerak</Text>
   →   <Text>{t('scanner.camera.permissionRequired')}</Text>

3. AVVAL en.json dan mos kalitni QIDIR. `scanner.*` ostida 15 ta kalit
   allaqachon tayyor turibdi (camera.*, celebration.*, error.*, interaction.*).
   Faqat mos kalit topilmasa yangi kalit qo'sh — va u holda UCHALA faylga ham
   (en.json, uz.json, ru.json) bir xil kalit bilan qo'sh.

⚠️ QAT'IY QOIDALAR:
- `App.tsx`, `src/domain/`, `src/data/`, `src/core/` ga TEGMA — Claude zonasi
  (AGENTS.md "Ish taqsimoti"). Faqat `src/presentation/components/` va
  `src/core/i18n/locales/*.json`.
- Dizayn, joylashuv, ranglar, animatsiya — HECH NARSA o'zgarmaydi.
- `accessibilityLabel` ichidagi matnlar ham tarjima qilinadi.
- Mavjud kalitlarni QAYTA NOMLAMA va o'chirma.
- Uchala JSON faylda kalitlar soni bir xil bo'lishi SHART.
- `any` ishlatma.

TAYYOR MEZONI:
1. `npx tsc --noEmit` → 0 xato
2. Telefon tilini English qilaman → skaner ekranidagi barcha matn inglizcha
3. Ruschaga o'zgartiraman → hammasi ruscha
4. Shu 3 ta faylda birorta ham o'zbekcha/inglizcha qattiq matn qolmagan

TASDIQ: O'zgartirgan fayllar ro'yxatini va qo'shgan YANGI kalitlar ro'yxatini ber.
```

---

#### T0.8b — Bosh sahifa va xatolar daftari

```
KONTEKST: Quyidagi fayllarni o'qi:
  src/core/i18n/locales/en.json
  src/presentation/components/BentoSubjectGrid.tsx
  src/presentation/components/ReviewMistakesView.tsx
  src/presentation/components/SubjectSelectionView.tsx

VAZIFA: T0.8a bilan bir xil — qattiq kodlangan matnlarni t() ga ulash.
`home.*`, `mistakes.*` va `subjects.header.*` ostida 20 ta kalit tayyor turibdi.

DIQQAT: BentoSubjectGrid.tsx va ReviewMistakesView.tsx da `useTranslation()`
allaqachon ulangan — faqat qolgan matnlarni almashtirish kerak.

⚠️ QOIDALAR va TAYYOR MEZONI: T0.8a bilan bir xil.
```

---

#### T0.8c — Gamifikatsiya va sirli sandiq (eng katta)

```
KONTEKST: Quyidagi fayllarni o'qi:
  src/core/i18n/locales/en.json
  src/presentation/components/GamificationDetailModal.tsx
  src/presentation/components/MysteryChestView.tsx

VAZIFA: T0.8a bilan bir xil.

DIQQAT: Bu bosqichda matn ko'p (35 ta), tayyor kalit esa kam (11 ta).
Ya'ni ~24 ta YANGI kalit yozishga to'g'ri keladi. Har bir yangi kalitni
uchala JSON faylga ham qo'sh: en.json (asosiy), uz.json, ru.json.

Kalit nomlash uslubi mavjud fayldagidek: `gamification.<bo'lim>.<nom>`,
`chest.<bo'lim>.<nom>`.

⚠️ QOIDALAR va TAYYOR MEZONI: T0.8a bilan bir xil.
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

### T0.13 — Skaner ekrani rejimini to'g'rilash 🐞 XATO TUZATISH

> **Bu yangi funksiya emas, xato tuzatish.** Dizayn o'zgarmaydi — birgina
> shart o'zgaradi. Mantiqiy asos Claude tomonidan yozilgan, quyida to'liq bor.

**Bola nima ko'radi (muammo):**

Bola "Xatolar daftari"ni ochadi → xato kartasidagi **"AI yordamchi"** tugmasini
bosadi → oldida **kamera** ochiladi va xonasiga qaragan holda turadi. Bola nima
qilishini tushunmaydi. Agar u tavakkal qilib tugmani bossa — surat olinmaydi,
lekin ekran nihoyat darsga o'tadi.

Xuddi shu holat "Sirli Sandiq" dagi jumboqni yechishga o'tganda ham takrorlanadi.

**Nima uchun bunday bo'lyapti (sabab):**

`SocraticScannerScreen.tsx` da ekran rejimi mustaqil holat sifatida saqlanadi va
har doim `"scan"` (kamera) dan boshlanadi:

```ts
const [viewMode, setViewMode] = useState<"scan" | "chat">("scan");
```

Bu rejim **faqat bitta joyda** o'zgaradi — deklansher tugmasi bosilganda:

```ts
} finally {
  setViewMode('chat');
}
```

Ya'ni: dars ekranini ko'rish uchun **majburan surat olish tugmasini bosish
kerak**, hatto masala allaqachon mavjud bo'lsa ham. Xatolar daftaridan yoki
sirli sandiqdan kirilganda masala allaqachon tayyor turadi (`currentStep`
to'ldirilgan), lekin ekran buni hisobga olmaydi.

**To'g'ri mantiq (asl qoida):**

> Ekran rejimi **saqlanadigan holat emas.** Masala bor-yo'qligining o'zi rejimni
> belgilaydi: masala bor → dars, masala yo'q → kamera.

Bu qoida barcha holatlarni bittada hal qiladi:

| Bola qayerdan kirdi | `currentStep` | Ekran |
| :-- | :-- | :-- |
| Bosh sahifa → "AI SKANER" | yo'q | kamera ✅ |
| Bosh sahifa → Matematika kartasi | yo'q | kamera ✅ |
| Skanerlash muvaffaqiyatli tugadi | paydo bo'ldi | dars ✅ |
| Skanerlash muvaffaqiyatsiz | yo'q | kamera (+ xato kartasi) ✅ |
| Xatolar daftari → "AI yordamchi" | **bor** | **dars** ✅ (hozir buzuq) |
| Sirli sandiq → jumboqni yechish | **bor** | **dars** ✅ (hozir buzuq) |

Ayni paytda ekranda quyidagi darvoza allaqachon bor (Claude qo'ygan):

```ts
if (viewMode === "scan" || !activeStep) {   // → kamera
```

Ikkinchi shart (`!activeStep`) allaqachon to'g'ri qoidani bajaryapti. Birinchi
shart esa unga qarshi ishlaydi: masala bor bo'lsa ham ekranni kamerada ushlab
turadi. Demak `viewMode` o'zgaruvchisi ortiqcha — uni butunlay olib tashlash
kerak, shunda **masalaning bor-yo'qligi rejimning o'zi bo'lib qoladi.**

> **Muhim texnik nuqta:** darvoza aynan `if (!activeStep)` ko'rinishida
> yozilishi kerak. Shunda TypeScript darvozadan keyingi kodda `activeStep`
> `null` emasligini biladi va quyidagi 20 dan ortiq `activeStep.` chaqiruvi
> xatosiz ishlaydi. `if (viewMode === "scan")` deb yozilsa — kompilyatsiya
> buziladi.

```
KONTEKST: Quyidagi faylni o'qi:
  src/presentation/components/SocraticScannerScreen.tsx

VAZIFA (uchta kichik o'zgarish, boshqa hech narsa):

1. `viewMode` holatini BUTUNLAY olib tashla (~799-qator):
       const [viewMode, setViewMode] = useState<"scan" | "chat">("scan");
   Bu qator o'chiriladi. O'rniga hech narsa qo'yilmaydi.

2. `handleLocalSnapPhoto` ichidagi `finally` blokidan
       setViewMode('chat');
   qatorini (va uning ustidagi izohni) olib tashla. Endi rejim o'z-o'zidan
   to'g'ri bo'ladi: tahlil muvaffaqiyatli bo'lsa `activeStep` paydo bo'ladi va
   ekran darsga o'tadi; bo'lmasa kamerada qoladi.

3. Kamera darvozasini soddalashtir:
       if (viewMode === "scan" || !activeStep) {
   →   if (!activeStep) {

Shundan keyin faylda `viewMode` va `setViewMode` so'zlari umuman qolmasligi
kerak. Tekshir:  grep -n "viewMode" src/presentation/components/SocraticScannerScreen.tsx

⚠️ QAT'IY QOIDALAR:
- Dizayn, ranglar, animatsiya, joylashuv — HECH NARSA o'zgarmaydi.
- Kamera ekrani (reticle, deklansher, chiroq tugmasi) o'z holicha qoladi.
- Xato kartasi (`visibleError`) bloki o'z holicha qoladi — u darvozadan
  yuqorida turadi va shunday qolishi kerak.
- `App.tsx` ga TEGMA. U Claude zonasi.
- `activeStep` ni "zaxira" qiymat bilan to'ldirishga URINMA. Demo dars
  ataylab o'chirilgan (AGENTS.md 2-taqiq). `null` — to'g'ri holat.
- Yangi komponent, yangi ekran, yangi prop QO'SHMA.

TAYYOR MEZONI (telefonda tekshiriladi):
1. Bosh sahifa → "AI SKANER" bossam → kamera ochiladi.
2. Rasm olaman → haqiqiy dars ochiladi.
3. Xatolar daftari → "AI yordamchi" bossam → **darhol dars ochiladi**,
   kamera ko'rinmaydi.
4. Sirli sandiq → jumboqqa o'tsam → **darhol dars ochiladi**.
5. Internetni o'chirib rasm olaman → xato kartasi chiqadi, demo dars EMAS.
6. `npx tsc --noEmit` → 0 xato.

TASDIQ: Qaysi fayllarni o'zgartirganingni va har birida nechta qator
o'zgarganini yozib ber.
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
