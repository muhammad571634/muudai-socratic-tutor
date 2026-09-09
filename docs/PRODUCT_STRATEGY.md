# MuudAI — Mahsulot Strategiyasi va Bozor Tahlili

> Tadqiqot asosida yozilgan (2026-09). Manbalar hujjat oxirida.
> Bu hujjat **nima qurishimizni va nima uchun** belgilaydi.
> Texnik arxitektura: [`../ARCHITECTURE.md`](../ARCHITECTURE.md) · Ta'lim mexanikasi: [`PEDAGOGY.md`](./PEDAGOGY.md)

---

## 1. ⚠️ ENG MUHIM QAROR: 4–15 yosh — bu bitta mahsulot EMAS

Siz "4 yoshdan 15 yoshgacha" dedingiz. Men buni tekshirdim va **rad etaman** — sabablari bilan.

### 4 yoshli va 15 yoshli bola — butunlay boshqa foydalanuvchilar

| | 4–7 yosh | 12–15 yosh |
| :-- | :-- | :-- |
| O'qiy oladimi? | ❌ **Yo'q** | ✅ Ha |
| Uy vazifasi bormi? | ❌ Daftar yo'q | ✅ Algebra, fizika |
| Kamerani daftarga to'g'rilay oladimi? | ❌ Yo'q | ✅ Ha |
| Variantlarni o'qib tanlay oladimi? | ❌ **Yo'q** | ✅ Ha |
| Diqqat muddati | **8–10 daqiqa** | 25–40 daqiqa |
| Kim ishlatadi | Ota-ona bilan birga | Yolg'iz |
| Streak/liga ishlaydimi? | ❌ Charchatadi | ✅ Kuchli ishlaydi |

### Bozor buni allaqachon isbotlagan

Ikkala yirik o'yinchi ham **alohida ilova** qilgan — tasodif emas:

| Kompaniya | Katta bolalar | Kichik bolalar |
| :-- | :-- | :-- |
| Duolingo | Duolingo (7+) | **Duolingo ABC** — alohida ilova (3–8) |
| Khan Academy | Khan Academy | **Khan Academy Kids** — alohida ilova |

Sababi to'g'ridan-to'g'ri yozilgan: *"7 yoshdan kichiklar uchun streak, liderlar jadvali
va matnga boy darslar yordam berish o'rniga charchatadi."*

### Va eng muhimi: sizning kodingiz allaqachon katta bola uchun yozilgan

Hozirgi ilova: **kamera → daftardagi algebra → matnli variantlarni o'qib tanlash**.
4 yoshli bola bularning **hech birini** qila olmaydi. Ya'ni 4 yoshni qo'shish —
mavjud ilovani tuzatish emas, **noldan ikkinchi ilova yozish** demak.

### ✅ Qarorim

> **V1 = 9–15 yosh.** Mavjud kodingiz aynan shu uchun qurilgan. Uni tugatib, do'konga chiqaramiz.
>
> **MuudAI Junior (4–8 yosh) = keyingi alohida ilova**, V1 muvaffaqiyat qozongandan keyin.

**Lekin bugundanoq shunga tayyorlanamiz:** domen modeliga `AgeBand` tushunchasi
kiritiladi (`junior` | `explorer` | `scholar`). Shunda Junior ilovasini qurish
paytida biznes mantiq, backend va baza qayta yozilmaydi — faqat UI qatlami yangi bo'ladi.

**Nima uchun bir vaqtda ikkalasini qilmaslik kerak:** cheklangan resurs bilan ikkita
mahsulot qurish — ikkalasi ham o'rtamiyona chiqishining eng ishonchli yo'li.
Bitta yosh guruhida zo'r bo'lish — beshtasida o'rtacha bo'lishdan qimmatroq.

---

## 2. Raqobat tahlili: biz kimga qarshi turamiz?

| Ilova | Egasi | Nima qiladi | Zaif joyi |
| :-- | :-- | :-- | :-- |
| **Photomath** | Google | Faqat matematika, qadamli yechim. Qo'lyozma OCR eng yaxshisi | **Javobni beradi** → bola ko'chiradi |
| **Gauth** | ByteDance (TikTok) | Barcha fanlar + jonli repetitor. $7.99/oy — eng arzoni | Javob beruvchi. Agressiv narx |
| **Question.AI** | — | Gauth'ga o'xshash | Jonli repetitor yo'q |
| **Socratic** | Google | Tez tekshirish | Nomiga qaramay Sokratik emas |
| **Khanmigo** | Khan Academy | **Haqiqiy Sokratik**, GPT-4, 842 kurs, o'qituvchi paneli | Maktablarga sotiladi, mobil-birinchi emas, AQSh markazli |
| **Brainly** | — | Jamoa javoblari | AI emas |

### 🎯 Bo'sh joy (bizning o'rnimiz)

Bozor **javob beruvchilar** bilan to'lgan. Ular bir xil narsani sotadi va narx bo'yicha
urushadi. Ular hammasi bitta muammoni yaratadi:

> **Ota-onalar Photomath'dan nafratlanadi, chunki bolasi u bilan ko'chiradi.**

Khanmigo Sokratik yo'lni tanlagan — lekin u **maktab mahsuloti**, mobil emas, global emas.

**Bizning pozitsiya:**

> ### "Ko'chirib bo'lmaydigan uy vazifasi ilovasi"
> Javobni **hech qachon** aytmaydi. Bola o'zi topadi.
> Va bola **nimani bilmasligini eslab qoladi**.

Bu shunchaki xususiyat emas — bu **kimga sotishimizni** o'zgartiradi.

### Kim to'laydi? — Ota-ona, bola emas

Bu eng muhim strategik xulosa:

| | Photomath / Gauth | MuudAI |
| :-- | :-- | :-- |
| Bola nima uchun yoqtiradi | Uy vazifasi tez bitadi | Tushunganda o'zini aqlli his qiladi |
| **Ota-ona nima uchun to'laydi** | ⚠️ To'lamaydi — bu ko'chirish vositasi | ✅ **Bolam ko'chirmaydi, o'rganadi** |

→ Marketing bolaga emas, **ota-onaga** qaratiladi.
→ Shuning uchun **Ota-ona hisoboti** (Parent Report) — bepul funksiya emas, **asosiy mahsulot**.

---

## 2.5. ⚠️ Kontent umurtqasi: faqat skanerlash yetarli emas

> **Bu rejadagi eng katta ko'rinmas teshik.** Topilmaguncha, T2.4 (gamifikatsiya)
> bajarilsa ham ishlamaydi.

### Muammo

Duolingo'ning butun tsikli — streak, kunlik vazifa, liga, skill tree — **o'z kontenti**
ustiga qurilgan. Har bir mashq oldindan yozilgan va tekshirilgan. Shuning uchun
**har kuni qiladigan ish doimo mavjud**.

MuudAI kontenti esa **tasodifiy rasmdan** keladi:

| Holat | Nima bo'ladi |
| :-- | :-- |
| Uy vazifasi yo'q kun | Ilovani ochish sababi yo'q → **streak uziladi** |
| Dam olish kunlari | Ishlatilmaydi |
| **Yozgi ta'til (3 oy)** | **Foydalanuvchi butunlay yo'qoladi** |
| Skill tree qurmoqchi bo'lsak | Imkonsiz — qaysi mavzu kelishi noma'lum |

> Ya'ni: *"streak"* qo'shsak ham, uni **oziqlantiradigan narsa yo'q**.
> Duolingo'da bola har kuni dars qiladi. Bizda bola faqat vazifa bo'lganda keladi.

### Yechim: ikki yo'lli kontent

| | **A yo'li — Scan** | **B yo'li — Practice** |
| :-- | :-- | :-- |
| Kontent qayerdan | AI rasmdan generatsiya qiladi | **Bizniki** — oldindan yozilgan, tekshirilgan |
| Qachon mavjud | Faqat vazifa bo'lganda | **Har doim** |
| Vazifasi | Jalb qilish (acquisition), "wow" | **Ushlab turish (retention)** |
| Streak'ni oziqlantiradimi | ❌ Notekis | ✅ **Ha** |
| Skill tree | ❌ Imkonsiz | ✅ Mumkin |
| Ishlash paytida AI narxi | ~$0.0012 | **~$0** (baza o'qish) |

**B yo'li qanday quriladi:** masalalar **oflayn** yaratiladi (skript + AI), inson
tekshiradi, bazaga yuklanadi. Ishlash paytida AI **chaqirilmaydi** → marginal xarajat
deyarli nol. Bu bepul tarifni ham ancha arzonlashtiradi.

**Boshlang'ich hajm:** har sinf/mavzu uchun 100–150 ta masala V1 uchun yetarli.

> 📌 **Qoida:** Streak **B yo'liga** tayanadi, A yo'liga emas.
> Texnik tafsilotlar: `ARCHITECTURE.md` §5 (`curriculum_problems`, `daily_challenge`),
> vazifa: `TASKS.md` T2.7.

---

## 3. Gamifikatsiya: Duolingo'dan nimani olamiz

Duolingo raqamlari (ochiq manbalardan):

- 4 yilda **DAU 4.5 barobar** o'sgan — gamifikatsiya + bildirishnoma + streak hisobiga
- **7+ kunlik streak**ka ega DAU ulushi **3 barobar** o'sgan
- Churn (tashlab ketish) asosiy bozorlarda **47% → 28%** ga tushgan
- Eng faol foydalanuvchilarning kunlik churn'i **40%** kamaygan

Ishlaydigan psixologiya: **yo'qotish qo'rquvi** (loss aversion), **majburiyat** (commitment),
**ijtimoiy raqobat**.

### Bizning gamifikatsiya to'plami

| Mexanika | Olamizmi | Izoh |
| :-- | :-- | :-- |
| **Streak** | ✅ Ha | Eng kuchli. Serverda hisoblanadi |
| **Streak Freeze** | ✅ Ha | Churn'ni keskin kamaytiradi |
| **Energy** | ✅ Ha | Xarajatni ham cheklaydi — ikki foyda |
| **XP** | ✅ Ha | Bor |
| **Kunlik vazifalar** | ✅ Ha | 3 ta kichik maqsad |
| **Liga / Liderlar jadvali** | ⚠️ **Anonim** | Pastga qarang |
| **Push bildirishnoma** | ✅ Ha | Streak eslatmasi |

> ⚠️ **Liderlar jadvali — huquqiy xavf.** Bolalar ismini boshqa bolalarga ko'rsatish =
> **ijtimoiy funksiya**. Bu Apple Kids Category va COPPA bo'yicha muammo tug'diradi.
> **Yechim:** anonim taxalluslar (`Brave Fox 🦊`, `Quick Owl 🦉`) — foydalanuvchi
> tanlamaydi, tizim beradi. Chat yo'q. Do'st qo'shish yo'q.

### ❗️ Gamifikatsiyaning tuzog'i

Duolingo'ni tanqid qiladigan asosiy gap: bolalar **streak uchun** kiradi, o'rganish uchun emas.
Biz buni oldini olamiz: **streak faqat masala TO'G'RI yechilganda saqlanadi**,
shunchaki ilovani ochganda emas.

---

## 4. Biznes modeli va do'kon qoidalari

### ✅ Apple qoidasini rasmiy manbadan tekshirdim

Internetdagi ko'p maqolalar *"Kids Category'da to'lov taqiqlanadi"* deb yozadi.
**Bu noto'g'ri.** Apple'ning rasmiy App Review Guidelines, 1.3-band:

> *"These apps must not include links out of the app, purchasing opportunities, or other
> distractions to kids **unless reserved for a designated area behind a parental gate**."*

→ **To'lov mumkin, lekin faqat "ota-ona darvozasi" (parental gate) ortida.**

### Kids Category haqida boshqa muhim faktlar

| Qoida | Ta'siri |
| :-- | :-- |
| Uchinchi tomon analitikasi **taqiqlanadi** (juda cheklangan istisnolar bilan) | ❌ Firebase Analytics, Mixpanel, Amplitude ishlatib bo'lmaydi → **o'z analitikamizni Supabase'da quramiz** |
| Uchinchi tomon reklamasi taqiqlanadi | Bizda reklama yo'q — muammo yo'q |
| **Bir tomonlama eshik** ⚠️ | *"once customers expect your app to follow the Kids Category requirements, it will need to continue to meet these guidelines in subsequent updates, even if you decide to deselect the category"* — kirgandan keyin chiqib ketolmaysiz |
| Maxfiylik siyosati majburiy | Balandagi 5.1.4(b) bandi |

### 📌 Qarorim: Kids Category'ga KIRMAYMIZ

**Sabab:** V1 auditoriyasi 9–15 yosh, Kids Category esa 13 yoshgacha uchun.
Bir tomonlama eshik + analitika taqiqi bizni keraksiz cheklaydi.

**O'rniga:**
- Kategoriya: **Education**
- Yosh reytingi: **4+**
- **Parental gate** baribir quramiz (to'lov va tashqi havolalar oldida) — Kids Category
  talab qilmasa ham, bu to'g'ri ish va ota-ona ishonchini oshiradi
- COPPA'ga muvofiqlik **ma'lumot yig'maslik** orqali ta'minlanadi

> Photomath, Gauth va Duolingo aynan shu yo'ldan borgan.

### Narxlash

| Tarif | Nima | Narx |
| :-- | :-- | :-- |
| **Free** | Kuniga 5 energiya, 1 ta fan | $0 |
| **Pro** | Cheksiz energiya, barcha fanlar, **Ota-ona hisoboti** | $9.99/oy · $59/yil |
| **Family** | 3 ta bola | $14.99/oy |

> **Nima uchun $12.99 emas, $9.99?** Gauth $7.99 so'raydi. $12.99 — Khanmigo darajasidagi
> narx, lekin bizda hali Khan Academy brendi yo'q. Yillik obunani ($59) asosiy taklif qilamiz —
> u churn'ni keskin kamaytiradi.
>
> **Mintaqaviy narxlar shart:** Hindiston/MDH ~$3, Lotin Amerikasi ~$5.

---

## 5. Tavsiya etilgan yo'l xaritasi

| Bosqich | Auditoriya | Asosiy qiymat | Maqsad |
| :-- | :-- | :-- | :-- |
| **V1** | 9–15 | Rasm → Sokratik dars → xatolar daftari → ota-ona hisoboti | **Do'konga chiqish** |
| **V2** | 9–15 | Ovozli javob | Tajribani chuqurlashtirish |
| **V3** | 9–15 | Gemini Live real-time | Spetsifikatsiyadagi orzu |
| **V4** | 4–8 | **MuudAI Junior — alohida ilova** | Bozorni kengaytirish |

---

## 6. Manbalar

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — 1.3 Kids Category, 5.1.4 Kids Apps
- [Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en)
- [Sal Khan wants to give every student on Earth a personal AI tutor — Freethink](https://www.freethink.com/consumer-tech/khanmigo-ai-tutor)
- [AI Tutoring at Scale: Khan Academy's Khanmigo Case Study](https://www.buildmvpfast.com/blog/ai-tutoring-khanmigo-case-study-2026)
- [How Duolingo reignited user growth — Lenny's Newsletter (Jorge Mazal)](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- [Duolingo gamification explained — StriveCloud](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [Duolingo ABC — App Store](https://apps.apple.com/us/app/learn-to-read-duolingo-abc/id1440502568)
- [Duolingo for Kids: An Honest Review from a Home Educating Mum](https://darlingmellow.co.uk/duolingo-kids-review-home-education/)
- [Gauth vs Photomath (2026)](https://tutoraisolver.com/blog/gauth-vs-photomath-2026-best-ai-stem-solver-alternatives)
- [AI tutoring outperforms in-class active learning: an RCT — Scientific Reports](https://www.nature.com/articles/s41598-025-97652-6)
- [What the research shows about generative AI in tutoring — Brookings](https://www.brookings.edu/articles/what-the-research-shows-about-generative-ai-in-tutoring/)
- [UX Design for Kids: Principles and Recommendations — Ramotion](https://www.ramotion.com/blog/ux-design-for-kids/)
- [Designing apps for young kids — UX Collective](https://uxdesign.cc/designing-apps-for-young-kids-part-1-ff54c46c773b)
