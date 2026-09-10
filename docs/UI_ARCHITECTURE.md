# MuudAI — Frontend Skeleti (UI/UX Arxitektura)

> **Kim o'qiydi:** 🎨 Gemini (dizayn chizadi) · 🧠 Claude (mantiqni ulaydi) · 👤 Muhammad (qaror qiladi)
>
> **Bu hujjat nima:** ilovaning **butun old qismi** — qanday ekranlar bor, ular
> qanday bog'langan, har biri qanday holatlarda bo'ladi va nima uchun aynan shunday.
>
> **Bu hujjat nima emas:** backend, ma'lumotlar bazasi, server. Ular
> `ARCHITECTURE.md` §4–5 da va hozircha **to'xtatib turilgan**.
>
> **Asos:** Duolingo modeli. Qayerda Duolingo bizga to'g'ri kelmasa — sabab bilan
> ajralib chiqamiz (§2). Ta'lim mantiqi: `docs/PEDAGOGY.md`. Iqtisod:
> `docs/UNIT_ECONOMICS_AND_LIMITS.md`.

---

## 0. UI/UX strategiyasi (asosiy qoida)

> **Vizual jihatdan Duolingo'ga ~95% o'xshash. Skelet, arxitektura va mantiq —
> MuudAI'niki.**

Ya'ni ish shunday taqsimlanadi:

| Qatlam | Kim belgilaydi | Manba |
| :-- | :-- | :-- |
| **Ko'rinish** — ranglar, tugmalar, animatsiya, his-tuyg'u | 🎨 Duolingo namunasi | Gemini chizadi |
| **Skelet** — qaysi ekran, qaysi holat, qanday oqim | 🧠 MuudAI mantiqi | Shu hujjat |
| **Mantiq** — XP, energiya, xatolar, AI, til | 🧠 Claude | `domain/`, `data/`, `state/` |

Bu shuni anglatadiki: agar Duolingo'da biror narsa chiroyli ko'rinsa — **olamiz**.
Agar Duolingo'ning **mantiqi** bizga to'g'ri kelmasa — **olmaymiz** (§2.2 dagi
6 ta qaror). Chiroyli ko'rinish va noto'g'ri mantiq — eng yomon birikma.

---

## 1. Bir jumlada: MuudAI nima

> Bola **o'z daftaridagi** masalani suratga oladi; AI javobni aytmaydi, balki uni
> qadam-baqadam **savol berib** yechimga olib boradi; adashgan joyi eslab qolinadi
> va ertaga qaytadi.

Shu bitta jumla butun interfeysni belgilaydi:

| Jumladagi so'z | Interfeysga ta'siri |
| :-- | :-- |
| "o'z daftaridagi" | Kontent **bizda yo'q** — u bolada. Demak asosiy tugma — **kamera** |
| "javobni aytmaydi" | Hech qayerda "Javobni ko'rsatish" tugmasi **bo'lmaydi** |
| "savol berib" | Ekranda bir vaqtda **bitta savol** turadi |
| "adashgan joyi eslab qolinadi" | Ikkinchi asosiy ekran — **Takrorlash** |
| "ertaga qaytadi" | Streak, energiya, kunlik odat mexanikasi kerak |

---

## 2. Duolingo modeli: nimani olamiz, nimadan voz kechamiz

### 2.1 Olamiz (o'zgartirmasdan)

| # | Mexanika | Nima uchun bizga ham to'g'ri keladi |
| :-- | :-- | :-- |
| 1 | **Bitta ustun tugma** bosh sahifada | Bola "endi nima qilay?" deb o'ylamasligi kerak |
| 2 | **Pastki tab panel**, kam tab | 8 yoshli bola ham adashmaydi |
| 3 | **Dars — to'liq ekran**, tab panel yashiriladi | Diqqat faqat masalada |
| 4 | Dars tepasida **progress chizig'i** | "Qancha qoldi?" — tashlab ketishning asosiy sababi |
| 5 | **Darhol javob qaytarish**: rang + ovoz + tebranish, 100 ms ichida | Duolingo'ning eng kuchli hissi shu |
| 6 | Asosiy tugma **doim pastda, doim bir joyda** | Bosh barmoq zonasi; mushak xotirasi |
| 7 | **"Tekshirish" → keyin "Davom etish"** ikki qadam | Bola natijani ko'rib ulguradi |
| 8 | Yakunda **tabrik ekrani** + raqamlar | Tugatish hissi (closure) |
| 9 | Tepada **ixcham holat paneli**: energiya · streak · XP | Har doim ko'rinib turadi, lekin bezovta qilmaydi |
| 10 | **Bo'sh holat o'rgatadi**, yolg'on tabriklamaydi | "Hali xato yo'q" ≠ "Hammasini yechding" |
| 11 | **Qalin 3D tugmalar** (pastda soya, bosilganda cho'kadi) | Repoda allaqachon bor: `BentoSpringCard` |
| 12 | **Maskot** — hissiy langar | Repoda bor: `AiMascotAvatar` |
| 13 | **Ovoz dizayni** (to'g'ri/xato/tabrik) | Duolingo'ning yarim kuchi ovozda |
| 14 | **Kunlik maqsad** va eslatma | Odat hosil qilish |

### 2.2 Voz kechamiz (sabab bilan)

> Bu qarorlarni Claude qabul qildi. Har birining sababi bor — dizaynda buzilmaydi.

#### ❌ D1. "Yo'l" (Path / Skill Tree) — V1 da BO'LMAYDI

Duolingo'da bosh sahifa — bu **yo'l**: darslar zanjiri, yuqoriga qarab ko'tariladi.

Bizda bunday yo'l **bo'lishi mumkin emas**, chunki **kontent bizda yo'q** — u
bolaning daftarida. Biz uning ertaga qaysi mavzuni o'tishini bilmaymiz.

> **Qaror:** V1 bosh sahifasi — yo'l emas, **"Bugun" markazi**: bitta ustun
> harakat + kunlik holat. Yo'l faqat o'zimizning o'quv dasturimiz paydo bo'lgach
> ma'noga ega bo'ladi (`TASKS.md` T2.7) va u V1.2 dan oldin qurilmaydi.

#### ❌ D2. Xato uchun jazo — BO'LMAYDI

Duolingo'da noto'g'ri javob **yurak** (heart) yo'qotadi. Bizda esa energiya
**faqat masala boshlashda** sarflanadi, xato qilganda **hech narsa ketmaydi**.

> **Sabab — bu pedagogik zarurat, texnik qulaylik emas.** Sokratik usulning butun
> mohiyati bolaning **xavfsiz adashishi**da. Agar xato pul turadigan bo'lsa, bola
> o'ylashni to'xtatib, taxmin qilishni boshlaydi yoki umuman urinmaydi.
> Energiya bizda **xarajatni** cheklaydi (har skanerlash = AI so'rovi = pul),
> **xatoni** emas.

| | Duolingo | MuudAI |
| :-- | :-- | :-- |
| Nimani cheklaydi | Xatolar soni | AI so'rovlari soni |
| Qachon kamayadi | Noto'g'ri javobda | Masala boshlanganda (1 ta) |
| Qanday tiklanadi | Vaqt · gems · mashq | Vaqt (3 soat) · **xatoni tuzatish (+1)** |

> Oxirgi qator bizning ustunligimiz: jazoni **o'rganishga** aylantiradi.

#### ❌ D3. Javobni ko'rsatish — HECH QACHON

Duolingo bir necha urinishdan keyin to'g'ri javobni ko'rsatadi. Bizda bu
**Sokratik Shartnomani buzadi** (`docs/PEDAGOGY.md` §1).

> **O'rniga: Yordam Zinasi** (§5.3). 5-urinishdan keyin qadam **o'tkazib
> yuboriladi**, javob aytilmaydi, XP berilmaydi va masala **ertaga qaytadi**.
> Bola javobni ko'chira olmaydi — faqat kechiktiradi.

#### ❌ D4. Ligalar va reyting — V1 da BO'LMAYDI
LIGALAR BO'LISHI KERAK HUDDI DUOLINGO QILGANDEK UI UX KABI LEKIN FOYDALANUVCHI ISMLARI SHAXSI ANONIM QOLADI (*faqat tizim bergan anonim
> taxallus)
> 
Duolingo'ning ligasi ismlar bilan ishlaydi. Bizning foydalanuvchimiz — **8–15 yosh**.
Bolalar ismini ko'rsatish = ijtimoiy funksiya = COPPA/GDPR-K va App Store Kids
Category muammosi.

> **Qaror:** V1 da liga yo'q. Keyinchalik qo'shilsa — **faqat tizim bergan anonim
> taxallus** (`Brave Fox 🦊`), chat yo'q, do'st qo'shish yo'q.

#### ❌ D5. Uzun dars — BO'LMAYDI
"SHU HAQIDA JIDDIY STRATEGIYA QILISH KERAK VA DARS JARAYONINI TO'LIQ OPTIMALLLASHRISH KERAK RAQOBATCHILAR XATOSI BO'LSA AGAR SHU FEATUREDA BUNGA MUQOBIL YECHIM BERISH KERAK VA DARS JARAYONINI UY VAZIFASI DARS STOLI QILIHS KERAK YOKI "DUOLINGO LOGIKASIGA MOSLASH KERAK YOKI AMALIY YECHIM QILISH KERAK"


Duolingo darsi ≈ 15 ta qisqa savol. Bizda **bitta masala = 2–4 qadam**, va har
qadam **o'ylashni** talab qiladi, eslab qolishni emas.

> **Qaror:** progress chizig'i **qadamlarni** sanaydi. Katta tabrik — masala
> oxirida **bir marta**. Har qadamda kichik, ichki (inline) javob qaytariladi.
> Sessiya cheklovi: **5 daqiqa** (`UNIT_ECONOMICS` bo'yicha).

#### ❌ D6. Streak har qanday darsdan — BO'LMAYDI

Duolingo'da eng oson darsni bosib o'tib ham streak saqlanadi.

> **Qaror** (`PEDAGOGY.md` §10): streak faqat masala **to'g'ri yechilganda**
> saqlanadi. Ilovani ochish yoki tashlab yuborilgan sessiya streak bermaydi.

---

## 3. Navigatsiya skeleti

### 3.1 Qaror: 3 ta tab + to'liq ekranli modal

Hozir ilovada navigatsiya `useState` bilan qo'lda qilingan va **sozlamalar ekrani
umuman yo'q**. Shu sababli quyidagilar "uysiz" qolgan:

- til almashtirish (`setAppLocale()` yozilgan, chaqirilmaydi)
- ovoz sozlamalari (`useVoiceStore` yozilgan, UI'si yo'q — o'lik kod)
- keyinchalik: ota-ona darvozasi, maxfiylik havolalari (do'kon uchun **majburiy**)
- ota-onaga hisobot yuborish — kanal masalasi **§10.5** da hal qilingan

> **Qaror: pastki tab panel, 3 ta tab.** Duolingo'da 5 ta, bizda 3 ta yetadi —
> chunki bizda yo'l ham, liga ham yo'q (D1, D4).

```
┌─────────────────────────────────────────┐
│                                         │
│            EKRAN MAZMUNI                │
│                                         │
├─────────────────────────────────────────┤
│    🏠 Bugun    🔁 Takrorlash    👤 Profil │
└─────────────────────────────────────────┘
```

| Tab | Nomi | Nima uchun bor |
| :-- | :-- | :-- |
| 🏠 | **Bugun** | Kunlik markaz. Bitta ustun harakat: **Skanerlash** |
| 🔁 | **Takrorlash** | Xatolar daftari. Keyinchalik kunlik mashq ham shu yerda |
| 👤 | **Profil** | Statistika, sozlamalar, til, ovoz, ota-ona zonasi |

### 3.2 Modal ekranlar (tab panel ustida, to'liq ekran)

Dars va kamera **tab emas** — ular modal. Duolingo'da ham dars tab emas: u
to'liq ekranni egallaydi va tab panel yashiriladi. Sabab — diqqat.

| Modal | Qayerdan ochiladi | Qanday yopiladi |
| :-- | :-- | :-- |
| **Skaner** (kamera) | Bugun → asosiy tugma | ✕ · orqaga |
| **Dars** (Sokratik qadamlar) | Skaner → tahlil tugagach · Takrorlash → xato kartasi | ✕ (tasdiq bilan) |
| **Yakun** (tabrik) | Dars → oxirgi qadam | "Davom etish" |
| **Sirli sandiq** | Bugun → sandiq kartasi | ✕ |

### 3.3 To'liq ekranlar xaritasi

```
                        ┌──────────────┐
                        │  🏠 BUGUN    │◄──────────────┐
                        └──────┬───────┘               │
                               │                       │
         ┌─────────────────────┼──────────────────┐    │
         │                     │                  │    │
         ▼                     ▼                  ▼    │
   ┌───────────┐        ┌────────────┐     ┌──────────┴──┐
   │  SKANER   │        │   SANDIQ   │     │   YAKUN     │
   │ (kamera)  │        │  (modal)   │     │  (tabrik)   │
   └─────┬─────┘        └─────┬──────┘     └──────▲──────┘
         │                    │                   │
         │ tahlil ✓           │ jumboq            │ oxirgi qadam
         ▼                    ▼                   │
   ┌─────────────────────────────────────────────┴┐
   │                    DARS                       │
   │        (Sokratik qadamlar, to'liq ekran)      │
   └───────────────────────▲───────────────────────┘
                           │
                    ┌──────┴────────┐         ┌──────────┐
                    │ 🔁 TAKRORLASH │         │ 👤 PROFIL│
                    └───────────────┘         └──────────┘
```

**Muhim qoida:** `DARS` ekraniga **faqat haqiqiy masala bilan** kiriladi.
Masala yo'q bo'lsa — bu ekran umuman ochilmaydi (`TASKS.md` T0.12/T0.13).

---

## 4. Ekranlar: maqsad, elementlar, holatlar

> **Har bir ekran uchun 4 ta holat majburiy:** yuklanmoqda · bo'sh · xato · normal.
> Hozirgi ilovaning eng katta kamchiligi shu — ekranlar faqat "hammasi yaxshi"
> holatida chizilgan.

### 4.0 👋 Onboarding (birinchi ochilish)

**Maqsad:** bola nima qilishini va nima uchun bu Photomath emasligini tushunsin;
ota-ona esa keyinchalik hisobot va to'lovga ega bo'lsin.

Duolingo onboardingi shu tartibda: salomlashuv → til → maqsad → yosh →
akkaunt → to'lov taklifi. **Biz ham shu skeletni olamiz.**

| # | Ekran | Holat | Kim |
| :-- | :-- | :-- | :-- |
| 1 | **Salomlashuv** — maskot + brend | ✅ tayyor (`WelcomeOnboardingScreen`) | Gemini |
| 2 | **Til tanlash** | ✅ tayyor (`LanguageSelectionScreen`) | Gemini |
| 3 | **Nimani o'rganish** | ✅ tayyor (`LearnSelectionScreen`) | Gemini |
| 4 | **Yosh guruhi** | ⬜ chizilmagan | Gemini |
| 5 | **Akkaunt yaratish** | ⬜ chizilmagan | Gemini |
| 6 | **To'lov / Pro taklifi** | ⬜ chizilmagan | Gemini |

#### ⚠️ Qat'iy qoidalar

| Qoida | Sabab |
| :-- | :-- |
| **Onboarding faqat bir marta** — yangi o'rnatishda | ✅ bajarildi: `useAppStore.hasSeenOnboarding` saqlanadi |
| **Tanlangan til saqlanadi** | ✅ bajarildi: `useAppStore.locale`. Saqlanmasa ilova har ochilganda telefon tiliga qaytardi |
| **Har bir qadam o'tkazib yuborilishi mumkin** | Bola darhol ishlatishni boshlay olsin |
| **Akkaunt MAJBURIY EMAS** | Bola akkauntsiz ham darhol boshlaydi. Akkaunt — progressni saqlash va ota-ona uchun |

#### Yosh so'rash — qanday qilinadi (COPPA)

Yosh **so'raladi** (Duolingo ham so'raydi), lekin natijasi muhim:

| Yosh | Nima o'zgaradi |
| :-- | :-- |
| **13 dan kichik** | Akkaunt va to'lov **ota-ona darvozasi** ortiga o'tadi. Email so'ralmaydi. Tasdiqlangan ota-ona roziligi kerak (COPPA) |
| **13+** | Odatdagi oqim |

> ⚠️ Yosh — bu **ma'lumot yig'ish**. Maxfiylik siyosatida va do'kondagi
> Data Safety deklaratsiyasida aks etishi shart (`TASKS.md` T3.1).

#### Akkaunt va to'lov — nima uchun kerak

Bu Muhammadning qarori va u to'g'ri:

1. **To'lov akkauntga bog'lanadi.** Obunani saqlash uchun boshqa yo'l yo'q.
2. **Ota-ona hisoboti** akkauntsiz ishlamaydi — kimning hisoboti ekanini bilish kerak.
3. **Progress qurilmadan mustaqil.** Telefon almashsa, XP va streak yo'qolmaydi.
4. **Ota-ona kirishi.** Ota-ona o'z qurilmasidan bolaning progressini ko'radi.

#### 🔴 Bitta shart: tugma yolg'on gapirmasin

Hozir `WelcomeOnboardingScreen` da **"Akkauntim bor"** tugmasi bor va u
bosh sahifaga olib boradi — chunki akkaunt tizimi hali qurilmagan.

> **Qoida:** dizayn bosqichida bu normal. Lekin **do'konga chiqishdan oldin**
> ikkitadan biri bo'lishi shart:
> - akkaunt tizimi haqiqatan ishlaydi (`TASKS.md` T1.3), **yoki**
> - tugma "Tez orada" holatiga o'tadi.
>
> Ishlamaydigan "Kirish" tugmasi bilan do'kon tekshiruvidan o'tib bo'lmaydi,
> va bu §7 qoida 1 ning buzilishi.

#### 🟡 Til ro'yxati haqida

`LanguageSelectionScreen` hozir **5 ta til** ko'rsatadi: English, Mandarin,
Spanish, O'zbekcha, Русский. Lekin tarjima faqat **3 tasida** bor (en · uz · ru).

Mandarin yoki Spanish tanlansa — til o'zgarmaydi (`useAppStore` uni rad etadi,
aks holda bola bo'sh interfeys olardi).

> **Yechim (Gemini uchun):** tarjimasi yo'q tillar **"Tez orada"** nishoni bilan
> so'niq va bosilmaydigan qilinsin — xuddi fizika/kimyo kartalari kabi (T0.9).
> Ro'yxat qolsin: u T2.5 da to'ldiriladi (es, pt-BR, hi, ar, id, tr).

### 4.1 🏠 Bugun (bosh sahifa)

**Maqsad:** bola ilovani ochganda **3 soniya ichida** nima qilishini bilsin.

**Tuzilishi (yuqoridan pastga):**

| Blok | Mazmuni | Qoida |
| :-- | :-- | :-- |
| **Holat paneli** | 🔥 streak · ⚡ energiya (5 tagacha) · ⭐ XP | Ixcham, bitta qator, bosilsa tafsilot |
| **Salomlashuv** | "Salom! Bugun nima o'rganamiz?" | Vaqtga qarab o'zgaradi |
| **⭐ ASOSIY TUGMA** | **"Masalani skanerlash"** + kamera ikonkasi | Ekranning eng katta, eng yorqin elementi. Duolingo'ning "START" tugmasi kabi |
| **Takrorlash kartasi** | "3 ta xato kutyapti" yoki "Hammasi toza ✓" | Faol xato bo'lsa — diqqat tortadi |
| **Sirli sandiq** | Kunlik sandiq (ochilgan/ochilmagan) | Kichikroq, ikkilamchi |
| **Kunlik maqsad** | "Bugun: 1/3 masala" halqa diagramma | Duolingo'ning daily goal'i |

**Holatlar:**

| Holat | Nima ko'rinadi |
| :-- | :-- |
| Normal | Yuqoridagi to'liq tarkib |
| **Energiya 0** | Asosiy tugma **kulrang va bosilmaydi**; ostida taymer: "Keyingi ⚡ 2 soat 14 daqiqadan keyin" + "yoki xatoni tuzatib +1 ol" havolasi |
| Yangi foydalanuvchi | Streak 0, XP 0, xatolar yo'q — asosiy tugma yanada kattaroq, boshqa kartalar so'niq |
| Yuklanmoqda | Skelet (shimmer) kartalar, sakrash yo'q |

> ⚠️ **Taqiq:** bu ekranda hech qachon **o'ylab topilgan statistika** ko'rsatilmaydi
> ("12 ta yechildi", "35%"). Faqat haqiqiy raqamlar yoki nol.

### 4.2 📷 Skaner (kamera modali)

**Maqsad:** bola daftarini ramkaga to'g'rilab, tugmani bossin. Boshqa hech narsa.

**Elementlar:** ramka (reticle) · ko'rsatma matni · deklansher · chiroq · galereya · ✕

**Holatlar:**

| Holat | Nima ko'rinadi |
| :-- | :-- |
| Normal | Kamera + ramka + "Misolni ramka ichiga to'g'rilang" |
| **Ruxsat so'ralmagan** | Oq karta: nima uchun kamera kerakligi bolabop tilda + "Kamerani yoqish" |
| **Ruxsat rad etilgan** | O'sha karta + telefon sozlamalariga yo'l |
| **Tahlil qilinmoqda** | Kamera muzlaydi, ustida overlay: aylanuvchi indikator + "Socrates Jr. masalani o'qiyapti..." |
| **Xato** | Qizil ikonka + **rost sabab** (internet / xira rasm / xizmat) + "Qayta urinish" |

> ⚠️ **Taqiq:** tahlil muvaffaqiyatsiz bo'lsa — **hech qanday dars ko'rsatilmaydi**.
> Ekran kamerada qoladi yoki xato kartasi chiqadi. Bu `AGENTS.md` 2-taqiq.
> Kamera — bu ekranning **bo'sh holati**; alohida "masala yo'q" ekrani kerak emas.

### 4.3 📖 Dars (Sokratik qadamlar) — **ilovaning yuragi**

**Maqsad:** bir vaqtda **bitta savol**. Bola o'ylasin, tanlasin, natijani ko'rsin.

**Tuzilishi:**

```
┌────────────────────────────────────────┐
│  ✕        ▓▓▓▓▓▓▓░░░░░░░░░       ⚡3    │  ← chiqish · progress · energiya
├────────────────────────────────────────┤
│                                        │
│   📐 Chiziqli tenglamalar              │  ← mavzu sarlavhasi
│                                        │
│   ┌──────────────────────────────┐     │
│   │  5(x − 4) = 2(x + 6)         │     │  ← masala (bolaning daftaridan)
│   └──────────────────────────────┘     │
│                                        │
│   🦉  Qavsni ochish uchun 5 ni         │  ← maskot + AI savoli
│       nimaga ko'paytiramiz?            │
│                                        │
│   ┌──────────────────────────────┐     │
│   │  Faqat x ga                  │     │  ← variantlar (A/B/C harflarisiz)
│   ├──────────────────────────────┤     │
│   │  x ga ham, −4 ga ham         │     │
│   ├──────────────────────────────┤     │
│   │  Faqat −4 ga                 │     │
│   └──────────────────────────────┘     │
│                                        │
│   💡 Maslahat                          │  ← ixtiyoriy, ochiladi
├────────────────────────────────────────┤
│      ┌──────────────────────────┐      │
│      │      TEKSHIRISH          │      │  ← pastda, doim bir joyda
│      └──────────────────────────┘      │
└────────────────────────────────────────┘
```

**Qat'iy qoidalar:**

1. Ekranda **bitta savol**. Keyingi qadamlar ko'rsatilmaydi (`PEDAGOGY.md` §2 —
   reja bolaga ko'rsatilmaydi, aks holda u oldinga qarab taxmin qiladi).
2. Variantlarda **A/B/C harflari yo'q** — faqat mazmun.
3. **"Javobni ko'rsatish" tugmasi yo'q.** Hech qanday ko'rinishda.
4. Asosiy tugma **doim pastda**, matni holatga qarab o'zgaradi:
   `TEKSHIRISH` → `DAVOM ETISH` → `QAYTA URINISH`.
5. ✕ bosilganda **tasdiq so'raladi**: "Chiqsang, bu masala saqlanmaydi."

**Holatlar:**

| Holat | Ko'rinish |
| :-- | :-- |
| Savol | Variantlar neytral, tugma **so'niq** (hech narsa tanlanmagan) |
| Variant tanlandi | Variant **ko'k** ramka, tugma **yonadi** |
| **To'g'ri** | Variant **yashil**, pastdan yashil panel ko'tariladi + ✓ ovoz + yengil tebranish |
| **Xato** | Variant **qizil**, ekran **chapga-o'ngga silkinadi** + xato ovozi + kuchli tebranish, pastda **maslahat paneli** |
| Yuklanmoqda | Tugma o'rnida indikator, variantlar bosilmaydi |

---

### 4.3.1 🔍 Hozirgi dars ekrani auditi — nima uchun qaytadan chiziladi

> Sana: 2026-09-10 · Manba: ishlab turgan ilovadan olingan skrinshot
> (masala: `9288 + 8000 + 5296`, "Step 2 / 2").
> Bu bo'lim D1 topshirig'ining **asosidir**: quyidagi 14 ta nuqta takrorlanmasligi kerak.

#### A. Mazmun buzilishi (🧠 Claude zonasi — dizayn bilan tuzalmaydi)

| # | Ekranda nima ko'rindi | Nima uchun bu jiddiy |
| :- | :-- | :-- |
| **M1** | Masala `9288 + 8000 + 5296` (qo'shish), savol esa *"Let's move x terms to one side and numbers to the other!"* (chiziqli tenglama) | Savol masalaga **umuman aloqasiz**. Bola o'zi suratga olgan masala emas, boshqa masala bo'yicha o'qitilyapti. `PEDAGOGY.md` §2.5 dagi asosiy xavf — aynan shu |
| **M2** | Ikkinchi savol: *"Birinchi qo'shiluvchi 9288 soni 8 ga bo'linadimi?"* | Qo'shish masalasida 8 ga bo'linish **so'ralmaydi**. Sokratik qadam masalaning yechim yo'lidan chiqib ketgan |
| **M3** | Maslahat: *"9288 sonini 8 ga bo'lib ko'ring: 9288 / 8 = 1161"* | **Javob to'g'ridan-to'g'ri berilgan.** Bu Sokratik Shartnomaning (§1) buzilishi. Hisob-kitob AI tomonidan bajarilib, bolaga tayyor ko'rsatilgan |
| **M4** | Variant C: *"Ha, chunki 9288 soni 8 ga qoldiqsiz bo'linadi"* | Variantning **o'zi** javobni va sababini aytib turibdi. Bola o'ylamasdan tanlaydi |
| **M5** | Sarlavha `MATHEMATICS • SAVOL`, savol inglizcha, tanasi o'zbekcha | Bitta ekranda **ikki til**. `TASKS.md` T0.8 buzilgan |

> **Xulosa:** M1–M4 ni Gemini tuzata olmaydi. Bular `solve-problem` Edge Function
> va **tekshiruv quvuri** (`TASKS.md` T1.4b) vazifasi. Dizayn qanchalik chiroyli
> bo'lmasin, savol masalaga mos kelmasa — ilova yolg'on o'qitadi.

#### B. Interfeys qoidalari buzilgani (🎨 Gemini zonasi)

| # | Ekranda nima ko'rindi | Qaysi qoida |
| :- | :-- | :-- |
| **U1** | Variantlarda **A / B / C** doiralari | §4.3 qoida 2 — harflar yo'q, faqat mazmun |
| **U2** | Maslahat kartasi **savol bilan bir vaqtda** ochiq turibdi | §5.3 — maslahat faqat **xatodan keyin** chiqadi va bosqichma-bosqich kuchayadi. Oldindan ko'rsatilsa, zina ma'nosini yo'qotadi |
| **U3** | Pastdagi tugma: *"Tap to Speak or Select"* | Ovozli javob — **V2 (Faza 4)**. `ARCHITECTURE.md` §3: V1 do'konga chiqmaguncha ovozga tegilmaydi |
| **U4** | Tugma matni "tekshirish" emas — variant bosilishi bilan javob yuboriladi ko'rinadi | §4.3 qoida 4 — variant tanlanadi (ko'k ramka), tekshirish **faqat pastdagi tugma** bilan |
| **U5** | Yuqorida: `‹` orqaga · ovoz tugmasi · suzuvchi ⚙️ tishli g'ildirak | §4.3 — yuqorida faqat **✕ · progress · ⚡ energiya**. Sozlamalar Profil tab'ida (§4.6) |
| **U6** | Progress chizig'i **yo'q**, o'rniga `Step 2 / 2` matni | §4.3 — chiziq bo'ladi. "2 / 2" bolaga rejani oshkor qiladi (§4.3 qoida 1) |
| **U7** | `⚡ +15 XP` savolga javob berilmasdan **oldin** ko'rsatilgan | §9 — XP **olingandan keyin** ko'rsatiladi. Oldindan va'da qilingan XP bola xato qilsa yolg'onga aylanadi |
| **U8** | Maslahat kartasida `✕` yopish va *"Try Another Option"* — ikkita raqobatlashuvchi harakat | Bir ekranda **bitta** asosiy harakat bo'ladi |
| **U9** | Bir ekranda **4 ta** ramkali, soyali karta ustma-ust | Duolingo mos ekranida ramkali karta **0 ta**. Vizual shovqin |

#### C. Ildiz sabab: ekran chalkash, chunki **ma'lumot modeli chalkash**

Bu auditning eng muhim topilmasi. Ekranni qayta chizish **yetarli emas** —
`src/domain/entities/` da ikkita parallel model bor va ular UI'ni to'ldirishga majbur qiladi:

| Model | Matn maydonlari |
| :-- | :-- |
| `SocraticDialogue.ts` → `SocraticStep` | `stepTitle` · `questionHeadline` · `tutorExplanation` · `tutorQuestion` · `explanationSnippet` · `hintText` · `optionSubtitles` — **7 ta** |
| `SocraticState.ts` → `DynamicSocraticStep` | `content.tutorExplanation` · `content.tutorQuestion` · `uiParams.hintText` |

Ustiga `InteractionFormat` **5 xil**: `MULTIPLE_CHOICE` · `OPEN_QUESTION` ·
`HINT_OVERLAY` · `RETRY_PROMPT` · `INFO_CARD`.

> Bitta qadamda ekranga chiqishi mumkin bo'lgan matn bloklari soni — **7 ta**.
> Skrinshotda ularning 5 tasi bir vaqtda turibdi. Gemini ekranni qayta chizsa ham,
> model 7 ta maydon bersa, u yana 7 ta blok chizadi.

**Shuning uchun tartib qat'iy:**
`1) Claude shartnomani qisqartiradi → 2) Gemini qisqargan shartnomani chizadi.`
Teskarisi ishlamaydi.

#### D. Maqsadli qadam shartnomasi (Claude yozadi, D1 shunga chiziladi)

Bir qadamda ekranda **to'rtta** narsa bor, boshqa hech narsa:

```
masala        ← o'zgarmaydi, bolaning daftaridan (kichik, tepada, doim ko'rinadi)
savol         ← BITTA jumla, maks. ~12 so'z
variantlar    ← 3 ta, harfsiz, subtitrsiz
tugma         ← bitta, pastda, doim bir joyda
```

`hintText` ekranda **oldindan turmaydi** — u xatodan keyin pastdan
ko'tariladigan panel ichida yashaydi va §5.3 zinasi bo'yicha kuchayadi.
`tutorExplanation`, `questionHeadline`, `explanationSnippet`, `optionSubtitles`
— dars ekranida **ishlatilmaydi**.

#### E. Duolingo mos ekranidan nima olinadi

Solishtirish uchun berilgan Duolingo ekranlarining kuchi — **bir qarashda tushunarli**:

| Duolingo qiladi | MuudAI'da qanday bo'ladi |
| :-- | :-- |
| Yuqorida faqat `✕` · progress · bitta valyuta | `✕` · progress · `⚡` energiya. Boshqa hech narsa |
| Ko'rsatma bitta qator, **doim bir xil joyda** | AI savoli shu rolni bajaradi — joyi qadamdan qadamga siljimaydi |
| Kontent zonasi **oq va bo'sh** — ramka, soya, badge yo'q | Masala katagi bundan mustasno (u bolaning daftaridan) |
| Javob zonasi — bir xil o'lchamli neytral tugmalar | 3 ta variant, bir xil balandlik |
| Bitta asosiy tugma, pastda, doim o'sha joyda | `TEKSHIRISH` → `DAVOM ETISH` → `QAYTA URINISH` |
| Fikr-mulohaza **pastdan to'liq kenglikda** rangli panel bo'lib ko'tariladi va tugmani **o'z ichiga oladi** | Aynan shunday: yashil / qizil panel + panel ichidagi tugma |
| Ekranda bir vaqtda **bitta format** | `InteractionFormat` bir qadamda bittadan ortiq bo'lmaydi |

**MuudAI'ning Duolingo'dan farqi (dizaynda hisobga olinadi):**
Duolingo kontenti — oldindan yozilgan qisqa jumla. MuudAI kontenti — **bolaning
o'z daftaridagi masala**. Shuning uchun bizda qo'shimcha doimiy element bor:
masala satri. U **tepada, kichik va tinch** turadi — savol bilan raqobatlashmaydi,
lekin bola "qaysi masala ustida ishlayapman?" deb o'ylamasligi uchun yo'qolmaydi ham.


---

### 4.3.2 🧩 Javob berish formatlari — plitka (qadam yig'ish) asosiy yadro

> **Qaror (2026-09-10):** dars ekranining yadrosi — **plitka formati**.
> Bola javobni tanlamaydi, **quradi**. Bu qaror UI'dan tashqari backend
> narxini, kontent strategiyasini va oflayn rejim imkoniyatini ham belgilaydi.

#### A. Format nima

Bola keyingi yechim qatorini tayyor plitkalardan yig'adi:

```
Masala:  5(x − 4) = 2(x + 6)
Savol:   Qavslarni och va keyingi qatorni yoz

Sening qatoring:   ____  ____  ____  ____  ____

Plitkalar:   [5x] [−20] [=] [2x] [+12] [−4] [+6] [5x−4]
                                        └──── chalg'ituvchilar ────┘
```

Chalg'ituvchi plitkalar **tasodifiy emas** — har biri `PEDAGOGY.md` §4 dagi
xato turiga bog'langan:

| Plitka | `misconception_tag` | Bola buni olsa, nimani bilmaydi |
| :-- | :-- | :-- |
| `5x−4` | `distribution_error` | 5 ni qavs ichidagi ikkala hadga ko'paytirishni |
| `−4` | `distribution_error` | Ko'paytirish `−4` ga ham tegishli ekanini |
| `+6` | `sign_error` / `distribution_error` | `2 · (+6) = +12` ekanini |

> Bu formatning **eng katta ustunligi**: bola qaysi **noto'g'ri plitkani**
> olgani "xato qildi" degandan ancha aniqroq signal. Har bir qadam — kichik
> diagnostika. Bu `mistakes.misconception_tag` ustunini rostakam to'ldiradi.

#### B. Nima uchun bu format tanlandi (variant tanlashga nisbatan)

| Mezon | 3 ta variant | **Plitka** |
| :-- | :-- | :-- |
| Taxmin qilib o'tish | 33% ehtimol | Deyarli imkonsiz |
| Bo'sh maydonga yozish qo'rquvi | yo'q | yo'q (material tayyor) |
| Telefonda matematik belgi kiritish | — | Hal qilingan (plitka bosiladi) |
| Xato signalining aniqligi | "xato" | **qaysi tushunchada** xato |
| Bola nima qiladi | **tanidi** | **qurdi** |

> Sokratik shartnoma buzilmaydi: plitkalar javobni **aytmaydi**, ular faqat
> qurilish materiali. Bolaning o'zi tartibni topadi.

#### C. ⭐ Maslahat zinasi = plitka amallari (matn emas)

Bu formatning eng nafis tomoni. `PEDAGOGY.md` §3 dagi 5 bosqich **plitkalar
ustidagi amalga** aylanadi — javob **hech qachon aytilmaydi**, faqat
**qidiruv maydoni toraytiriladi**:

| Urinish | Plitkalar bilan nima qilinadi | Javob oshkor bo'ldimi |
| :-- | :-- | :-- |
| **1-xato** | Plitkalar bankka qaytadi + dalda | ❌ yo'q |
| **2-xato** | **Nechta** plitka kerakligi ko'rsatiladi (slotlar soni) | ❌ yo'q |
| **3-xato** | **Birinchi** plitka joyiga qo'yiladi (boshlang'ich turtki) | ❌ yo'q |
| **4-xato** | Chalg'ituvchilar olib tashlanadi (8 ta → 5 ta) | ❌ yo'q |
| **5-xato** | Qadam o'tkaziladi. **XP yo'q**, xatolar daftariga yoziladi | ❌ yo'q |

**Ikkita katta yutuq:**

1. **Tarjima kerak emas.** "Uchta plitkani olib tashladim" degan yordam —
   bu **harakat**, matn emas. Uchala tilda (keyin 10 tilda) bir xil ishlaydi.
   Matnli maslahat esa har til uchun alohida yoziladi va AI tomonidan
   generatsiya qilinadi — ya'ni pul turadi.
2. **Javob hech qachon chiqmaydi.** Duolingo xatoda `Correct answer: ...` deb
   javobni ko'rsatadi — bizda §2.2 D3 qarori bo'yicha bu **taqiqlangan**.
   Plitka zinasi bu muammoni butunlay chetlab o'tadi.

#### D. ⭐ Iqtisodiy oqibat: baholash BEPUL bo'ladi

Bu qarorning eng katta, lekin ko'rinmaydigan foydasi.

**Hozirgi oqim** (`src/core/api/TutorApiClient.ts`):

```
rasm → POST /extract   (AI chaqiruvi)
javob → POST /evaluate (AI chaqiruvi)   ← har bir javob uchun qaytadan
javob → POST /evaluate (AI chaqiruvi)
javob → POST /evaluate (AI chaqiruvi)
```

**Plitka bilan:** javob — bu **plitka id'lari ketma-ketligi**. Uni baholash
uchun AI **kerak emas**:

```
rasm → POST /extract   (AI chaqiruvi — barcha qadamlar bir yo'la yoziladi)
javob → MathValidator.isEquivalent()   ← AI yo'q, ~1 ms
javob → MathValidator.isEquivalent()   ← AI yo'q
javob → MathValidator.isEquivalent()   ← AI yo'q
```

`backend/services/MathValidator.ts` **allaqachon yozilgan** va aynan shuni
qiladi (`math.simplify` orqali matematik tenglikni tekshiradi, satrlarni
solishtirmaydi).

| Natija | Ma'nosi |
| :-- | :-- |
| **AI chaqiruvi 4 tadan 1 taga tushadi** | Bitta masala narxi ~4 barobar arzonlashadi |
| **Javob < 50 ms qaytadi** | §5.2 talabi (**100 ms dan kechikmaydi**) endi bajarilishi mumkin. AI chaqiruvi bilan bu **jismonan imkonsiz** edi |
| **Oflayn rejim mumkin bo'ladi** | Yuklab olingan mashq internetsiz ishlaydi — baholash qurilmada |

> ⚠️ Muhim nuance: `isEquivalent()` `{ isCertain: false }` qaytarsa
> (mathjs parse qila olmadi) — **faqat o'shanda** AI'ga murojaat qilinadi.
> Ya'ni AI zaxira, asosiy yo'l emas.

#### E. ⭐ Kontent dvigateli: streak uchun $0 xarajat

`ARCHITECTURE.md` §5 dagi `curriculum_problems` jadvali — "kontent umurtqasi".
Plitka formati uni **arzon** qiladi:

Yechilgan masaladan plitka mashqi **avtomatik chiqariladi** — yechim qatorlari
plitkalarga bo'linadi, chalg'ituvchilar xato taksonomiyasidan olinadi.
Bu **oflayn**, bir marta, inson tekshiruvi bilan bajariladi.

Natijada: kunlik mashq · streak · challenge kalendari · xatolarni takrorlash —
hammasi **ishlash paytida AI chaqirmaydi**, marginal xarajati ~$0.

> Bu `ARCHITECTURE.md` §5 dagi ogohlantirishga javob: *"faqat skanerlashga
> tayansak, uy vazifasiz kunlarda ilovada qiladigan ish qolmaydi va streak
> uziladi."* Plitka mashqlari — aynan o'sha kunlarning kontenti.

#### F. Ota-ona hisoboti uchun: "ishni ko'rsatish"

Bola har qadamda qatorni **o'zi quradi**. Demak sessiya oxirida bizda
bolaning **o'z qo'li bilan yig'ilgan to'liq yechim** qoladi:

```
5(x − 4) = 2(x + 6)
5x − 20 = 2x + 12        ← bola yig'di, 1-urinishda
3x − 20 = 12             ← bola yig'di, 2-urinishda
3x = 32                  ← bola yig'di, 1-urinishda
```

Ota-onaga **ball emas, ish ko'rsatiladi**. Photomath'da bunday narsa yo'q —
u faqat javobni ko'rsatadi. Bu Pro obunaning asosiy qiymati
(`PEDAGOGY.md` §9).

#### G. Bitta komponent — butun yo'l xaritasi

Plitka komponenti bir marta yoziladi, keyin hamma joyda ishlatiladi:

| Qayerda | Plitkalar nima bo'ladi | Versiya |
| :-- | :-- | :-- |
| Matematika | `5x` · `−20` · `=` | V1.0 |
| Xatolarni takrorlash | O'sha bolaning **o'z** eski plitkalari | V1.0 |
| Kunlik mashq | `curriculum_problems` dan | V1.0 |
| Fizika | Formula yig'ish: `F` · `=` · `m` · `·` · `a` | V1.2 |
| Kimyo | Tenglama tenglashtirish: koeffitsient plitkalari | V1.2 |
| MuudAI Junior (4–8) | Raqam va rasm plitkalari | V4 |

#### H. 🔴 Ikkita qaror — kod yozilishidan oldin hal qilinadi

**H1. Plitka donadorligi (granularity) — formatning eng muhim qoidasi**

`5x` bitta plitkami yoki `5` va `x` ikkita plitkami?

> **Qoida: donadorlik — shu qadamda o'rgatilayotgan tushuncha bilan bir xil.**

| Qadam nimani o'rgatadi | To'g'ri donadorlik | Noto'g'ri |
| :-- | :-- | :-- |
| Qavs ochish (distributiv qonun) | `5x` · `−20` (natijalar tayyor) | `5` · `·` · `x` — bola ko'paytirishni qayta teradi, tushuncha yo'qoladi |
| Ko'paytirish jadvali | `20` · `24` · `28` | `5x` — juda yirik, savol ma'nosiz |

Donadorlik noto'g'ri bo'lsa — pedagogika buziladi, ekran esa xuddi ishlayotgandek
ko'rinadi. Bu format bilan qilinishi mumkin bo'lgan eng jiddiy xato.

**H2. Bir nechta to'g'ri tartib qabul qilinadi**

`5x − 20 = 2x + 12` va `−20 + 5x = 12 + 2x` — **ikkalasi ham to'g'ri**.
Tekshiruv **satr solishtirish emas**, `MathValidator.isEquivalent()` orqali
matematik tenglik bo'yicha bo'ladi. Bola to'g'ri yig'gani uchun "xato" olsa,
u ilovaga ishonchni yo'qotadi.

#### I. Ekranning holatlari (D1 shu holatlarni chizadi)

| # | Holat | Ko'rinish |
| :- | :-- | :-- |
| 1 | **Bo'sh** | Slotlar bo'sh, plitkalar bankda, tugma **so'niq** |
| 2 | **Yig'ilmoqda** | Bosilgan plitka slotga uchadi, bankda **kulrang soya** qoladi |
| 3 | **To'la** | Barcha slotlar band → tugma **yonadi** |
| 4 | **To'g'ri** | Qator yashil, pastdan yashil panel + tugma panel ichida |
| 5 | **Xato** | Qator qizil, silkinish, panel + zinaning keyingi bosqichi |
| 6 | **Plitka kamaydi** (4-xato) | Chalg'ituvchilar **so'nib yo'qoladi** (animatsiya bilan) |
| 7 | **Yuklanmoqda** | Skelet slotlar, plitkalar bosilmaydi |

**Qat'iy qoidalar:**
1. Slotdagi plitka bosilsa — bankka **qaytadi** (bekor qilish har doim mumkin).
2. Fikr-mulohaza **faqat "TEKSHIRISH" bosilganda**. Plitka qo'yilganda
   yashil/qizil **ko'rsatilmaydi** — aks holda bola plitkalarni yashil
   chiqquncha surib chiqadi va hech narsa o'rganmaydi.
3. Bir qatorda **6 tadan ortiq slot bo'lmaydi** (kichik ekranda sig'maydi).
   Uzun ifoda kerak bo'lsa — qadam ikkiga bo'linadi.
4. Bankda **kamida 2 ta** chalg'ituvchi bo'ladi (aks holda tanlov yo'q).


### 4.4 🎉 Yakun (tabrik)

**Maqsad:** tugatish hissi + haqiqiy raqamlar.

| Element | Mazmun |
| :-- | :-- |
| Maskot | Bayram holatida |
| Sarlavha | "Ajoyib! Masala yechildi!" |
| Raqamlar | ⭐ olingan XP · ⏱ sarflangan vaqt · 🎯 nechta qadamda |
| Streak | Agar streak oshgan bo'lsa — alangali animatsiya |
| Tugma | "Davom etish" → Bugun ekraniga |

> ⚠️ Agar masala **yordam zinasining 5-bosqichi** bilan tugagan bo'lsa (qadam
> o'tkazib yuborilgan), tabrik **boshqacha** bo'ladi: "Bu qiyin bo'ldi — ertaga
> yana ko'ramiz 💪" va XP berilmaydi.

### 4.5 🔁 Takrorlash (xatolar daftari)

**Maqsad:** Duolingo'ning "Practice Hub" ekvivalenti — bolaning **o'z** xatolari.

| Element | Mazmun |
| :-- | :-- |
| Sarlavha | "Takrorlash va o'zlashtirish" |
| Yig'indi | "3 ta xato · 45 XP kutyapti" (haqiqiy yig'indi) |
| Xato kartasi | Fan nishoni · **qachon** (2 soat oldin) · mavzu · masala parchasi · maslahat · "AI yordamchi" tugmasi |

**Holatlar:**

| Holat | Sarlavha | Matn |
| :-- | :-- | :-- |
| Xatolar bor | "3 ta xato kutyapti" | Kartalar ro'yxati |
| **Hali xato yo'q** | "Hali xato yo'q" | "Masalani skanerlab, yechishni boshla. Adashgan savollaring shu yerga tushadi." + **Skanerlash tugmasi** |
| **Hammasi tuzatilgan** | "Barcha xatolar tuzatildi!" | 🏆 + "Bu daraja bo'yicha hammasini o'zlashtirding" |

> Bu ikki holatning **farqi muhim**: birinchisida bola hech narsa qilmagan,
> ikkinchisida hammasini qilgan. Bir xil xabar ko'rsatish — yolg'on.

### 4.6 👤 Profil

**Maqsad:** statistika + sozlamalar. Hozir bu ekran **umuman yo'q**.

| Blok | Mazmuni |
| :-- | :-- |
| Daraja | Nishon · daraja nomi · keyingi darajagacha progress |
| Statistika | Umumiy XP · yechilgan masalalar · eng uzun streak · faol kunlar |
| **⚙️ Sozlamalar** | **Til** (English / O'zbek / Русский) · **Ovoz** (yoqilgan/o'chirilgan) · **Avto-o'qish** |
| Ota-ona zonasi | *(V1.0 oxirida)* Maxfiylik siyosati · Foydalanish shartlari · ota-ona darvozasi ortida |

> Til va ovoz sozlamalari **shu yerda yashaydi**. Bu ilgari ochiq qolgan savolning
> javobi: alohida "til tugmasi" kerak emas, Profil tab'i uni o'z ichiga oladi.

### 4.7 🎁 Sirli sandiq

Kunlik jumboq. Ochilmagan → yopiq sandiq animatsiyasi. Ochilgan → jumboq matni.
Yechilgan → mukofot + "ertaga qayt".

---

## 5. Sokratik dars — batafsil oqim

### 5.1 Holat mashinasi (interfeys nuqtai nazaridan)

`docs/PEDAGOGY.md` §2 dagi mantiqning ekrandagi ko'rinishi:

```
[SKANER]  bola tugmani bosadi
    │
    ▼
[TAHLIL]  kamera muzlaydi + "Socrates Jr. o'qiyapti..."
    │
    ├─ o'qib bo'lmadi ──► [XATO KARTASI] "Rasm xira 😅" → kameraga qaytadi
    │
    ▼
[QADAM]  bitta savol + 3 variant          ◄──────────────┐
    │                                                     │
    ├─ to'g'ri ──► [TABRIK] yashil panel, +XP ───────────►│ keyingi qadam
    │                                                     │
    └─ xato ────► [YORDAM ZINASI] qizil + maslahat ───────┘ o'sha qadam
                          │
                          └─ 5-urinish ──► qadam o'tkaziladi (javob AYTILMAYDI)
                                                │
                        oxirgi qadam? ──────────┤
                                │               │
                                ▼               ▼
                          [YAKUN] tabrik   [XATOLAR DAFTARIGA YOZILADI]
```

### 5.2 Bir qadamning ichki tsikli (millisekundlar bilan)

Duolingo hissi aynan shu vaqtlarda:

| Vaqt | Nima bo'ladi |
| :-- | :-- |
| 0 ms | Bola variantni bosdi → variant darhol ko'k ramkaga kiradi, yengil tebranish |
| 0 ms | Pastdagi tugma so'niqdan yorqinga o'tadi |
| — | Bola "TEKSHIRISH" ni bosadi |
| < 50 ms | Rang o'zgaradi (yashil yoki qizil) |
| < 100 ms | Ovoz + tebranish |
| 100–300 ms | Panel pastdan ko'tariladi (spring animatsiya) |
| — | Bola "DAVOM ETISH" ni bosadi |
| 200 ms | Keyingi qadam o'ngdan suriladi, progress chizig'i o'sadi |

> **Qoida:** javob qaytarish **hech qachon** 100 ms dan kechikmaydi. Bu tarmoqqa
> bog'liq emas — to'g'ri javob indeksi allaqachon qurilmada.

### 5.3 Yordam zinasi — ekranda qanday ko'rinadi

`PEDAGOGY.md` §3 dagi 5 bosqichning UI ekvivalenti:

| Urinish | Ekranda nima o'zgaradi |
| :-- | :-- |
| **1-xato** | Qizil variant + silkinish. Panel: dalda ("Yaqin kelding!") |
| **2-xato** | Panel: **nima uchun** xato ekani. Maskot o'ylanayotgan holatda |
| **3-xato** | Panel: **soddaroq misol** alohida kartada |
| **4-xato** | Variantlar **3 tadan 2 taga** kamayadi (noto'g'rilari so'nadi) + eng aniq maslahat |
| **5-xato** | Panel: "Bu qadam qiyin bo'ldi — birga o'tamiz". Tugma: "Keyingi qadam". **XP yo'q**, xatolar daftariga yoziladi |

**Anti-spam:** ketma-ket 1 soniyadan tez bosilsa — 2 soniyalik kutish + maskot:
"Shoshilmaymiz. Birga o'ylab ko'raylik 🤔"

---

## 6. Fikr-mulohaza tizimi (feedback)

Duolingo'ning kuchi — **bir vaqtda 4 kanal**: rang, harakat, ovoz, tebranish.

| Hodisa | Rang | Harakat | Ovoz | Tebranish |
| :-- | :-- | :-- | :-- | :-- |
| Variant tanlandi | Ko'k ramka | Yengil bosilish (scale 0.98) | — | `selection` |
| **To'g'ri** | Yashil | Panel ko'tariladi, ✓ belgisi | Baland, qisqa | `success` |
| **Xato** | Qizil | Chapga-o'ngga silkinish (±8px) | Past, yumshoq | `error` |
| Qadam tugadi | — | Progress chizig'i o'sadi | Klik | `light` |
| Masala tugadi | Oltin | Konfetti + maskot | Bayram | `success` ×2 |
| Energiya tugadi | Kulrang | Tugma so'nadi | — | `error` |

> **Xato ovozi hech qachon qo'pol bo'lmaydi.** Bola o'zini yomon his qilmasligi
> kerak — u shunchaki "hali emas" degan signal olishi kerak.

Repoda tayyor: `HapticFeedback` (`src/core/haptics.ts`), `CelebrationConfetti`,
`BentoSpringCard` (bosilish animatsiyasi).

---

## 7. Bo'sh, yuklanish va xato holatlari — halollik qoidalari

> Bu bo'lim **buzilmaydi**. Loyihaning eng ko'p muammo keltirgan qismi shu
> (`TASKS.md` T0.3, T0.11, T0.12 — soxta dars uch marta qaytib kelgan).

| Qoida | Ma'nosi |
| :-- | :-- |
| **1. O'ylab topilgan mazmun yo'q** | Masala bo'lmasa — dars ekrani ochilmaydi. Zaxira "namuna masala" yo'q |
| **2. O'ylab topilgan statistika yo'q** | "12 ta yechildi" kabi raqamlar faqat haqiqiy bo'lsa |
| **3. Xato rost aytiladi** | "Internet yo'q" ≠ "Xizmatda nosozlik" ≠ "Rasm xira". Bola sababni bilishi kerak |
| **4. Texnik matn ko'rsatilmaydi** | `TypeError`, stack trace — hech qachon. Faqat bolabop jumla |
| **5. Bo'sh ≠ tugallangan** | "Hali xato yo'q" va "Hammasini tuzatding" — ikki xil ekran |
| **6. Yuklanish sakramaydi** | Skelet (shimmer) ishlatiladi, kontent joyini oldindan egallaydi |

---

## 8. Dizayn tizimi (mavjud tokenlar)

> Gemini: **yangi rang, yangi o'lcham o'ylab topmaysan.** `src/core/theme.ts` da
> hammasi bor. Yetishmasa — qo'shishdan oldin ayt.

### Ranglar (`theme.colors`)

| Vazifa | Token | Qiymat |
| :-- | :-- | :-- |
| Fon | `background` | `#FFFFFF` |
| Asosiy matn | `textDark` | `#4B4B4B` |
| So'niq matn | `textMuted` | `#AFAFAF` |
| Chegara | `borderLight` | `#E5E5E5` |
| Matematika | `mathBlue` | `#1CB0F6` (+ `mathBlueShadow`) |
| To'g'ri javob | `mathGreen` | `#16A34A` (+ `Light`/`Border`/`Shadow`/`Badge`) |
| Sandiq | `chestAmber` | `#D97706` |

> Duolingo palitrasi allaqachon shu yerda: `#1CB0F6` (Duolingo ko'ki),
> `#58CC02` yashili kod ichida ishlatilgan.

### O'lchamlar

| | Qiymat |
| :-- | :-- |
| **Bo'shliq** | `xs 4 · sm 8 · md 16 · lg 24 · xl 32 · xxl 48` |
| **Radius** | `card 24 · button 16 · pill ∞ · badge 12` |
| **Shrift** | `largeTitle 32/900 · title2 24/800 · headline 18/800 · subhead 16/700 · overline 12` |

> Qalin shriftlar (800–900) — bu Duolingo uslubi, ataylab tanlangan.

### Mavjud komponentlar (qayta ishlatiladi, yangisi yozilmaydi)

| Komponent | Vazifasi |
| :-- | :-- |
| `BentoSpringCard` | 3D bosiladigan karta (Duolingo tugmasi hissi) |
| `AiMascotAvatar` | Maskot |
| `CelebrationConfetti` | GPU konfetti |
| `PulsingFlame` | Streak alangasi |
| `ModernLevelBadge` | Daraja nishoni |
| `RichMathText` | Matematik matnni chiroyli ko'rsatish |
| `FloatingElement` | Suzuvchi animatsiya |

---

## 9. Gamifikatsiya UI qoidalari

| Element | Qoida |
| :-- | :-- |
| **⚡ Energiya** | 5 ta belgi. Sarflanganda so'nadi. 0 bo'lsa — skaner tugmasi bloklanadi + taymer |
| **🔥 Streak** | Faqat masala **to'g'ri** yechilganda oshadi. Oshganda alanga animatsiyasi |
| **⭐ XP** | To'g'ri javobda oshadi. Takrorlashda **kamroq** (yangi masala qimmatroq bo'lib qolishi kerak) |
| **🏅 Daraja** | 4 daraja (`LEARNER_RANKS`). Har darajada yangi imkoniyat ochiladi |
| **🎯 Kunlik maqsad** | Halqa diagramma, 3 ta masala |

---

## 10. V1 da QURILMAYDI (ataylab)

| Nima | Nima uchun | Qachon |
| :-- | :-- | :-- |
| Yo'l / Skill Tree | Kontent bizda yo'q (D1) | V1.2+ |
| Liga / reyting | COPPA (D4) | Ehtimol hech qachon |
| Do'stlar, chat | COPPA | ❌ |
| Fizika, Kimyo | Javobni tekshirib bo'lmaydi | V1.2 (T3.6) |
| Virtual laboratoriya | Sokratik tsiklga aloqasi yo'q | V1.2 |
| Ovozli javob | Katta ish | V2 (Faza 4) |
| Jonli AI suhbat | Juda qimmat | V3 (Faza 5) |
| To'lov / obuna | Talab tasdiqlanmagan | V1.1 |

---

## 10.5. Ota-onaga hisobot: qaysi kanal orqali?

**Muammo:** `TASKS.md` T2.6 bo'yicha Ota-ona hisoboti — Pro obunaning asosiy
qiymati. Lekin to'lovni **ota-ona** qiladi, ilovani **bola** ishlatadi.
Ota-ona ilovani ochmaydi — demak hisobot unga **yetib borishi** kerak.

### ✅ Qaror: ulashiladigan havola. WhatsApp integratsiyasi YO'Q.

Haftalik hisobot **veb-sahifa** sifatida yaratiladi va **ulashiladigan havola**
beriladi. Foydalanuvchi uni ota-onaga **o'zi xohlagan ilova orqali** yuboradi —
WhatsApp, Telegram, SMS, nima bo'lsa. Biz hech biri bilan integratsiya qilmaymiz.

| | Ulashiladigan havola | WhatsApp Business API |
| :-- | :-- | :-- |
| Ota-onaga yetadimi | ✅ (WhatsApp orqali ham) | ✅ |
| Telefon raqami yig'iladimi | ❌ **yo'q** | ✅ ha — COPPA muammosi |
| Xabar uchun to'lov | ❌ yo'q | ✅ har suhbat uchun |
| Meta tasdig'i | ❌ kerak emas | ✅ bir necha hafta |
| Amalga oshirish | Bir necha kun | Bir necha hafta |

**Nima uchun WhatsApp API rad etildi:** u ota-onaning **telefon raqamini
yig'ishni** talab qiladi. 13 yoshgacha bo'lgan foydalanuvchi uchun bu aynan
COPPA cheklaydigan ma'lumot — tasdiqlangan ota-ona roziligi, maxfiylik
siyosatini o'zgartirish va ikkala do'kondagi Data Safety deklaratsiyasini
qayta to'ldirish kerak bo'lardi. Ulashiladigan havola bilan bularning
**hech biri kerak emas**, natija esa deyarli bir xil.

> Amalga oshirish: `TASKS.md` T2.6.

---

## 11. Ish tartibi (Gemini uchun)

Dizayn quyidagi tartibda chiziladi — har biri alohida topshiriq:

| # | Ekran | Nima uchun shu tartib |
| :-- | :-- | :-- |
| 0 | **Onboarding** (§4.0) | ⚠️ Gemini rejadan oldin boshlab yubordi — §4.0 qoidalariga moslanadi |
| 1 | **Dars** (§4.3) + 5 ta holati | Ilovaning yuragi. Qolgani shunga moslashadi |
| 2 | **Bugun** (§4.1) + 4 ta holati | Bola eng ko'p ko'radigan ekran |
| 3 | **Yakun** (§4.4) | Darsning davomi |
| 4 | **Takrorlash** (§4.5) + 3 ta holati | Ikkinchi asosiy tsikl |
| 5 | **Profil** (§4.6) | Yangi ekran — til va ovoz shu yerda |
| 6 | **Skaner** (§4.2) + holatlari | Mavjud, sayqallanadi |
| 7 | **Sandiq** (§4.7) | Ikkilamchi |

> Promptlar: `docs/GEMINI_PROMPTS.md` → **D1–D7**.

---

## 12. Bu hujjat qachon yangilanadi

Dizayn qarori o'zgarsa — **avval shu hujjat**, keyin kod. Ziddiyat bo'lsa
`ARCHITECTURE.md` ustun turadi (`AGENTS.md` qoidasi).
