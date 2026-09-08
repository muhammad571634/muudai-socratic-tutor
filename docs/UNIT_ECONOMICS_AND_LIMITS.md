# MuudAI Global Unit Economics & Limitlar Siyosati (Specification)

Ushbu hujjat **MuudAI (Global Socratic AI Tutor)** ilovasining xalqaro miqyosdagi xarajatlarini (Cloud & Gemini AI API) qat’iy nazorat qilish, foydalanuvchilar uchun **Shot (Kamera)**, **Gallery (Galereya)** va **Live Video / Voice** limitlarini matematik aniqlikda belgilash uchun ishlab chiqildi.

---

## 1. Global Unit Economics: AI Xarajatlari va Foyda Modeli

### 📊 Gemini Multimodal Live API Narxlari (Standart stavkalar):
- **Ovozli Kirish (Audio Input)**: ~$0.002 / daqiqa (16kHz PCM)
- **Ovozli Chiqish (Native Audio Output)**: ~$0.008 / daqiqa
- **Rasm / Snapshot Kirish**: ~$0.00004 / rasm (~258 token)
- **Video Freymlar (1 FPS — sekundiga 1 kadr)**: ~$0.0025 / daqiqa

---

### 💰 1 ta Seans (1 Masala Yechish) Xarajati:
O‘rtacha bola bitta masalani Sokratik usulda **3 daqiqa** davomida yechadi:

| Komponent | Miqdor / Davomiylik | Xarajat (USD) |
| :--- | :--- | :--- |
| **Kamera Freymlari** | Har 2 soniyada 1 kadr (Jami 90 ta rasm) | $0.0036 |
| **Audio Suhbat (Kirish)** | Bolaning gapirishi (jami ~1 daqiqa VAD) | $0.0020 |
| **Audio Tushuntirish (Chiqish)** | AIning ovozli yo‘naltirishi (~1.5 daqiqa) | $0.0120 |
| **Server & WebSocket Trafik** | Cloudflare / AWS bandwidth | $0.0010 |
| **JAMI 1 TA MASALA UCHUN:** | **~3 daqiqalik dars** | **$0.0186 (1.8 sent)** |

---

### 📈 Foydalanuvchi Boshiga Oylik Hisob-Kitob (Freemium vs Premium):

| Foydalanuvchi Turi | Kunlik Foydalanish | Oylik API Xarajati (Biznes uchun) | Obuna Narxi (Foydalanuvchi to'laydi) | Sof Foyda (Gross Margin) |
| :--- | :--- | :--- | :--- | :--- |
| **Free (Bepul)** | Kuniga 3 ta masala (limitlangan) | ~$1.67 / oy | $0 | Marketing / Virallik uchun investitsiya |
| **Pro (Pullik)** | Kuniga 10 ta masala | ~$5.58 / oy | **$12.99 / oy** (yoki $99/yil) | **$7.41 / oy (57% - 65% Margin)** |
| **Hardcore Pro** | Kuniga 20 ta masala | ~$11.16 / oy | **$19.99 / oy** (Oila rejasi) | **$8.83 / oy (44% Margin)** |

---

## 2. Shot (Kamera Snapshot) Limitlari va Qoidalari

1. **Siqish (Client-side Compression)**:
   - Original 12MP/48MP surat serverga yuborilmaydi!
   - Telefondagi orqa kamera tasviri `1080x1080` yoki `1280x720` o‘lchamga tushiriladi va JPEG (sifati 0.75) qilinadi.
   - Hajmi: 5MB dan **~120 KB** ga tushadi (Trafik 40 barobarga tejaladi).
2. **Cooldown (Spamdan himoya)**:
   - Bola Shutter tugmasini ketma-ket bosa olmasligi uchun **1.5 soniyalik cooldown** (blokirovka) qo‘yiladi.
3. **Bepul Foydalanuvchi Limiti**:
   - Kuniga **5 ta bepul skanerlash** (Energy batareyasi bilan boshqariladi).

---

## 3. Gallery (Galereyadan Yuklash) Siyosati

1. **Fayl Hajmi va Formatlari**:
   - Maksimal rasm hajmi: **5 MB** (MIME: `image/jpeg`, `image/png`, `image/heic`).
   - Serverga yuklanishdan oldin telefonda avtomatik 1200px maksimal kenglikka qisqartiriladi.
2. **Kop-sahifali uy vazifalari (Batching)**:
   - Bepul tarifda: 1 marta bitta rasm.
   - Pro tarifda: Birvarakayiga 3 tagacha rasm yuklash (ko‘p qismli vazifalar uchun).
3. **Kechikish va Qayta Ishlash**:
   - Galereyadan yuklangan rasmda to‘g‘ridan-to‘g‘ri Live WebSockets o‘rniga **Fast Gemini OCR endpoint** orqali 0.8 soniyada masala matni ajratib olinadi va dars boshlanadi.

---

## 4. Live Video / Freymlar Oqimi (Streaming) Qoidalari

> [!CAUTION]
> **Hech qachon 30 FPS video uzatmang!** 
> 30fps video 1 daqiqada $0.15+ yeb qo‘yadi va biznesni bankrot qiladi.

1. **Adaptiv Freym Tezligi (Smart 0.5 FPS)**:
   - Tinimsiz video o‘rniga har **2 soniyada 1 ta freym (0.5 FPS)** yuboriladi.
   - Agar kamera harakatsiz tursa (masalan, telefon daftar ustida qimirlamay turibdi), kadr yuborish butunlay to‘xtatiladi (0 FPS — faqat ovoz uzatiladi).
2. **Sessiya Taymer Limiti (Session Cap - 5 daqiqa)**:
   - Bitta masala uchun jonli kamera seansi **maksimal 5 daqiqa**.
   - 4-daqiqada ogohlantirish: *"Let's wrap up this step!"*.
   - 5-daqiqada avtomatik xulosa qilinadi va kamera o‘chadi (Bola telefonni ochig‘icha stolga tashlab ketganda API behuda yonib turmasligi uchun).
3. **Avtomatik Kutish (Auto-Pause / Inactivity - 45 soniya)**:
   - Agar 45 soniya davomida bola na gapirmasa, na ekranga tegmasa:
     - Kamera pauzaga tushadi: *"Still there? Tap to continue ⚡"*.

---

## 5. Freemium Model: Duolingo Uslubidagi "Energy Battery"

Iqtisodiyotni himoya qilishning eng bolabop va qiziqarli usuli:

- **Har bir o‘quvchiga 5 ta Energiya (⚡)** beriladi.
- Har bir yangi masalani skanerlash = **1 Energiya sarflaydi**.
- **Energiyani qayta to‘ldirish yo‘llari**:
  1. *Vaqt bo‘yicha*: Har 3 soatda 1 ta energiya o‘z-o‘zidan tiklanadi.
  2. *Bilim orqali*: Kecha xato qilgan masalasini qayta to‘g‘ri yechsa darhol **+1 Energiya** mukofot oladi (bola dars qilish orqali limit yutib oladi!).
  3. *MuudAI Pro*: Cheksiz energiya ($12.99/oy).

---

## 6. Kelgusi Backend Arxitekturasiga Talablar (Backend Checklist)

Backend (FastAPI / Node.js) yozilayotganda quyidagi mantiqiy middleware'lar bo‘lishi shart:

- [ ] **Rate Limiter Middleware**: 1 ta IP/User uchun daqiqasiga maksimal 30 ta WebSocket xabari.
- [ ] **Token Bucket Algorithm**: Har bir foydalanuvchining oylik sarflagan tokenlarini hisoblab borish (Limitdan oshsa, sekinlashtirish yoki to‘xtatish).
- [ ] **VAD Audio Filter**: Faqat ovoz bo‘lgan qismlar Gemini ga uzatiladi, jimlik (silence) qirqib tashlanadi.
- [ ] **Image Resizer / WebP Converter**: Freymlar hajmini 70% ga kichraytirib uzatish.
