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

**Maqsad:** bola ilovani birinchi marta ochganda **nima qilishini** va **nima uchun
bu Photomath emasligini** 10 soniyada tushunsin.

Duolingo onboardingi qisqa: maskot salomlashadi → bir nechta savol → darhol
birinchi dars. Bizda ham shunday bo'lishi kerak — **ro'yxatdan o'tish yo'q**,
darhol foydalanish.

| Qadam | Ekran | Mazmuni |
| :-- | :-- | :-- |
| 1 | **Salomlashuv** | Maskot + gap pufakchasi + brend + "Boshlash" |
| 2 | *(keyinroq)* Yosh guruhi | 8–10 · 11–13 · 14–16 — `AgeGroup` ni belgilaydi |
| 3 | *(keyinroq)* Til | Qurilma tili to'g'ri topilmagan bo'lsa |
| 4 | *(keyinroq)* Birinchi skanerlash | Darhol amaliyot — Duolingo "birinchi dars" kabi |

#### ⚠️ Qat'iy qoidalar

| Qoida | Sabab |
| :-- | :-- |
| **Onboarding faqat BIR MARTA ko'rsatiladi** | Holat saqlanadi (`hasSeenOnboarding`). Bola 50-marta ochganda ham salomlashuv chiqsa — bu xato |
| **Ro'yxatdan o'tish / kirish tugmasi YO'Q** | Ilovada akkaunt tizimi **umuman yo'q**. "Akkauntim bor" tugmasi — mavjud bo'lmagan narsani va'da qiladi (§7 qoida 1). Anonim akkaunt V1 da avtomatik yaratiladi (`TASKS.md` T1.3), bolаdan hech narsa so'ralmaydi |
| **Hech qanday ma'lumot so'ralmaydi** | Ism, yosh, email, telefon — hech biri. COPPA/GDPR-K |
| **O'tkazib yuborish mumkin** | Har bir qadamda "O'tkazish" bo'lsin |

> **Qaror — nima uchun akkaunt yo'q:** bola 8 yoshda. Parol, email, tasdiqlash —
> bularning hammasi to'siq va COPPA muammosi. `TASKS.md` T1.3 bo'yicha ilova
> birinchi ochilganda **anonim akkaunt avtomatik** yaratiladi. Bola buni ko'rmaydi.
> Keyinchalik ota-ona xohlasa — o'z emaili bilan bog'laydi (ixtiyoriy).

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

> Bu savol Muhammad tomonidan ko'tarildi: *"WhatsApp'ga push qilish haqida
> o'ylab ko'rish kerak."* Quyida to'liq tahlil.

**Muammo:** `TASKS.md` T2.6 bo'yicha Ota-ona hisoboti — **Pro obunaning asosiy
qiymati**. Lekin to'lovni **ota-ona** qiladi, ilovani esa **bola** ishlatadi.
Ota-ona ilovani ochmaydi. Demak hisobot unga **yetib borishi** kerak.

### Variantlar

| Kanal | Yetib borish | Xarajat | Huquqiy xavf |
| :-- | :-- | :-- | :-- |
| Ilova ichida push | ❌ Ota-onada ilova yo'q | 0 | yo'q |
| Email | ⚠️ Past ochilish darajasi | ~0 | past |
| **WhatsApp** | ✅ 90%+ (MDH, Hindiston, Braziliya, Indoneziya) | 💰 **har suhbat uchun to'lov** | 🔴 **yuqori** |
| **Ulashiladigan havola** | ✅ Ota-ona brauzerda ochadi | ~0 | past |

### WhatsApp'ning haqiqiy narxi

WhatsApp Business API — bu "bir kunlik ish" emas:

1. Meta Business akkaunti + biznesni tasdiqlash (verification) talab qilinadi
2. Har bir xabar shabloni Meta tomonidan **oldindan tasdiqlanishi** kerak
3. Har suhbat uchun **to'lov** olinadi, narx davlatga qarab farq qiladi →
   bu `docs/UNIT_ECONOMICS_AND_LIMITS.md` ga yangi doimiy xarajat qatori qo'shadi
4. 🔴 **Eng muhimi:** ota-onaning **telefon raqamini yig'ish** kerak bo'ladi.
   13 yoshgacha bo'lgan foydalanuvchi uchun bu aynan COPPA cheklaydigan ma'lumot.
   Tasdiqlangan ota-ona roziligi, maxfiylik siyosatini o'zgartirish va ikkala
   do'kondagi **Data Safety / Privacy Nutrition Labels** deklaratsiyasini
   qayta to'ldirish talab qilinadi.

### ✅ Qaror: avval ulashiladigan havola, WhatsApp keyin (ehtimol)

> Haftalik hisobot **veb-sahifa** sifatida yaratiladi va **ulashiladigan havola**
> beriladi. Bola (yoki ilova) uni ota-onaga yuboradi — **o'zi xohlagan ilova
> orqali, jumladan WhatsApp**. Lekin biz WhatsApp bilan **integratsiya
> qilmaymiz**.

Nima yutamiz:

| | Ulashiladigan havola | WhatsApp API |
| :-- | :-- | :-- |
| Ota-onaga yetadimi | ✅ (WhatsApp orqali ham) | ✅ |
| Telefon raqami yig'iladimi | ❌ **yo'q** | ✅ ha — COPPA muammosi |
| Xabar uchun to'lov | ❌ yo'q | ✅ har suhbat |
| Meta tasdig'i kerakmi | ❌ yo'q | ✅ ha |
| Qancha vaqt oladi | Bir necha kun | Bir necha hafta |

Ya'ni **qiymatning 90% ini xarajatning 10% i bilan** olamiz.

**Keyinchalik** foydalanish ma'lumotlari ota-onalar haqiqatan push xohlashini
ko'rsatsa — WhatsApp Business API qayta ko'rib chiqiladi, to'g'ri rozilik
oqimi bilan.

> ⚠️ Amalga oshirishdan oldin WhatsApp Business API shartlari **rasmiy hujjatdan**
> tekshiriladi — narx va talablar o'zgaradi, xotiradan taxmin qilinmaydi
> (`AGENTS.md` 3-qoida).

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
