# Sokratik Multimodal Real-Time AI Tutor: Arxitektura va Mantiqiy Qo'llanma

Ushbu hujjat **MuudAI Real-Time Socratic Tutor** tizimining mobil ilova (Frontend), server (Backend) va AI (Gemini Multimodal Live) o‘rtasidagi to‘liq ishlash logikasini belgilab beradi. Kelgusida backend yozilganda hech qanday me’moriy xatolik bo‘lmasligi uchun barcha qismlar standartlashtirilgan.

---

## 1. Asosiy Savolga Aniq Javob

> **Savol**: Bola kamerani daftarga qaratib turganda, AI bilan oddiy do‘stona jonli suhbat qilsa bo‘ladimi? AI butun jarayonni o‘zi boshqara oladimi va ekranda mavzular qanday paydo bo‘ladi?

**Javob: HA, 100%!** 
Bu zamonaviy sun’iy intellektning eng ilg‘or imkoniyati bo‘lgan **Multimodal Live (Real-Time Audio + Vision streaming)** texnologiyasidir. 
- **Kamera** — AIning "ko‘zi" (daftardagi yozuv va chizmalarni ko‘rib turadi).
- **Mikrofon** — AIning "qulog‘i" (bolaning savoli va ovoz ohangini eshitadi).
- **Karnay + Ekran** — AIning "og‘zi va qo‘li" (AI ham ovoz bilan tushuntiradi, ham ekrandagi Sokratik kartalar, variantlar va ko‘rsatkichlarni real vaqtda yangilab boradi).

---

## 2. To'liq Foydalanuvchi Tajribasi (User Journey)

### 1-bosqich: Kamera ochiladi va do‘stona salomlashuv
1. Bola kamerani ochadi va daftardagi masalaga qaratadi.
2. Bola gapiradi: *"Salom Muud! Men mana bu 5-misolni tushunmayapman..."*
3. AI ovoz chiqarib javob beradi: *"Salom Alex! Qani, daftaringni bir ko‘raychi... Aha, `5(x - 4) = 2(x + 6)` tenglamasi ekan-a! Juda qiziq misol. Keling, uni birgalikda, bosqichma-bosqich yechamiz. Ekranga qara, birinchi qadamni chiqardim!"*

### 2-bosqich: Ekranda Sokratik interaktiv karta paydo bo‘lishi
AI gapirish bilan bir vaqtda **Backend orqali Tool (Function Call)** ishga tushiradi:
- Ekranda nishon ramkasi tenglamani belgilaydi: `[ 5(x - 4) = 2(x + 6) ]`.
- Pastdan muzdek shaffof Apple pufakchasi ko‘tariladi:
  - **STEP 1 OF 4**: *"Chap tomondagi qavsni ochamiz: 5(x - 4). Qanday natija chiqadi?"*
  - Variantlar: `[ 5x - 20 ]`, `[ 5x - 4 ]`, `[ x - 20 ]`.

### 3-bosqich: Bolaning javob berishi (Gibrid erkinlik)
Bolada 2 xil qulay yo‘l bor:
- **1-yo‘l (Tugmani bosish)**: Bola shunchaki ekrandagi `[ 5x - 20 ]` tugmasini bosadi.
- **2-yo‘l (Ovoz bilan aytish yoki daftarga yozish)**: Bola daftarga yozib ko‘rsatadi yoki aytadi: *"5x minus 20 bo‘ladi shekilli"*.
- **AI reaksiyasi**: 
  - Tugma bosilsa ham, bola ovozda aytsa ham AI darhol quvonadi: *"Ofarin! Aynan shunday! Chunki 5 ni ikkala songa ko‘paytirding. Endi o‘ng tomoni 2(x + 6) ga o‘tamiz..."*
  - Ekranda avtomatik **STEP 2** ochiladi va bolaga `+25 XP` beriladi.

---

## 3. Bolani Qiziqtirish va Jalb Qilish Sirlari (AI Pedagogikasi)

Bolalar zerikmasligi va qiziqishi yo‘qolmasligi uchun AI quyidagi psixologik qoidalarga amal qiladi:

1. **Sokratik Cheklov (Anti-Cheating Guardrail)**:
   - Bola *"Javobini o‘zing aytvor"* desa ham, AI: *"Agar men aytib qo‘ysam, sening miyangdagi super-kuchlar rivojlanmay qoladi-ku! Qara, bu juda oson..."* deb do‘stona tarzda keyingi kichik qadamga yo‘naltiradi.
2. **Jonli Analogiyalar va Hikoyalar**:
   - Quruq qoidalar o‘rniga obrazlar ishlatadi: *"Tasavvur qil, qavs bu qulflangan xona, uning oldidagi 5 esa sehrli ko‘paytiruvchi kalit..."*.
3. **Interruptibility (So'zni bo'lish madaniyati - VAD)**:
   - AI gapirayotgan paytda bola biror narsa deb yuborsa, AI darhol jim bo‘ladi va bolani tinglaydi. Bolaga bosim o‘tkazmaydi.
4. **Xatoni sharmanda qilmaslik (No-shaming)**:
   - Bola xato qilsa: *"Hechqisi yo‘q, bu juda ko‘p uchraydigan adashish! 5 ni faqat x ga emas, 4 ga ham ko‘paytirishni unutma"*.

---

## 4. Tizim Arxitekturasi: Frontend, Backend va AI Bog‘lanishi

```
[ Mobil Ilova (React Native / Expo) ]
    │
    ├── 1. Mikrofon oqimi (Audio PCM 16kHz) ────────┐
    ├── 2. Kamera rasmi (Har 1.5 soniyada 1 freym) ──┼──> [ WebSocket Stream ]
    │                                                │           │
    ▼                                                │           ▼
[ Foydalanuvchi Interfeysi (UI) ]                    │   [ Backend Gateway (FastAPI / Node.js) ]
    ▲                                                │           │
    │  3. AI Ovozi (Karnayda real-time yangraydi)  ──┘           │ (Bi-directional WebSocket)
    └── 4. UI Buyruqlari (Step 1, Options, XP) <─────────────────┘           │
                                                                 ▼
                                                  [ Gemini 3.1 Flash Live API ]
                                                  - Voice Activity Detection (VAD)
                                                  - Vision + Audio reasoning
                                                  - Function Calling: update_quiz_ui()
```

---

## 5. Backend Yozilganda Xato Qilmaslik Uchun 5 Ta Oltin Qoida

Kelajakda server (backend) qismini yozayotganda quyidagi texnik me’yorlarga qat’iy amal qilish kerak:

### 1. Tinimsiz 30fps video yubormang (Snapshot Strategiyasi)
- Mobil ilovadan serverga har sekundda 30 ta video kadr jo‘natish telefonni qizdirib yuboradi, batareyani yeydi va API narxini oshiradi.
- **Yechim**: Har **1.5 – 2 soniyada bitta yuqori sifatli JPEG snapshot** yuboriladi yoki bola daftarni qimirlatib yangi misolga to‘g‘rilaganda bitta freym jo‘natiladi.

### 2. Duplex WebSockets protokolidan foydalaning (REST API emas)
- Ovozli muloqot kechikishi (latency) **800ms dan kam** bo‘lishi shart. REST API (request-response) bu tezlikni bera olmaydi.
- Backend va Mobil ilova o‘rtasida **WebSocket** o‘rnatiladi. Audio baytlar va JSON xabarlar uzluksiz oqim (streaming) tarzida almashinadi.

### 3. Function Calling orqali UI va Ovozni Sinxronlang
- AI shunchaki ovozda gapirib qolmasligi kerak. Serverda Gemini uchun Tool (Function) e’lon qilinadi:
  ```json
  {
    "name": "set_socratic_step",
    "description": "Updates the interactive UI on the child's screen with current question and choices",
    "parameters": {
      "type": "OBJECT",
      "properties": {
        "step_number": { "type": "INTEGER" },
        "total_steps": { "type": "INTEGER" },
        "equation": { "type": "STRING" },
        "question": { "type": "STRING" },
        "quick_options": { "type": "ARRAY", "items": { "type": "STRING" } },
        "correct_option_index": { "type": "INTEGER" },
        "hint": { "type": "STRING" }
      }
    }
  }
  ```
- AI ovoz bilan gapirishni boshlagan onda ushbu funksiyani chaqiradi va ilova ekranda aynan o‘sha kartani chizib beradi!

### 4. Holat Sinxronligi (Single Source of Truth)
- Bola ekrandagi variantni bosganda, ilova serverga kichik xabar yuboradi: `{"event": "option_selected", "index": 0}`.
- Backend buni AIning sessiyasiga kiritadi, AI darhol suhbatni davom ettiradi.

### 5. Xavfsizlik va COPPA / GDPR-K Muvofiqligi
- Bolalar ilovasida faqat **orqa kamera** ishlatiladi.
- Hech qachon bolaning shaxsiy ma’lumotlari yoki fotosuratlari serverda ochiq saqlanmaydi (faqat xotirada tahlil qilinadi).
