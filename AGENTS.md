# AGENTS.md — MuudAI Engineering & Architecture Protocol

Welcome! This repository contains **MuudAI**, an Apple-minimalist Socratic AI Tutor built for global students (8–15 years old) using React Native (Expo Managed SDK 57), TypeScript, Zustand, and Reanimated 4.

---

## 🧭 BIRINCHI O'QILADIGAN FAYL

> **Har qanday kod yozishdan oldin [`ARCHITECTURE.md`](./ARCHITECTURE.md) o'qilishi SHART.**
>
> - `ARCHITECTURE.md` — loyihaning yagona haqiqat manbai (qарорlar, joriy holat, xatolar)
> - `TASKS.md` — bosqichma-bosqich vazifalar (tartib buzilmaydi)
> - `docs/PRODUCT_STRATEGY.md` — bozor, raqobat, yosh qarori, biznes modeli
> - `docs/PEDAGOGY.md` — Sokratik ta'lim mexanikasi (ilovaning yuragi)
> - `docs/GEMINI_PROMPTS.md` — topshiriq berish qo'llanmasi
>
> **Ziddiyat bo'lsa `ARCHITECTURE.md` ustun turadi.** Quyidagi `docs/` spetsifikatsiyalari
> — bu **V3 (kelajak) maqsadi**, hozirgi holat emas. `ARCHITECTURE.md` §3 dagi
> bosqichma-bosqich strategiyaga qarang: **V1 do'konga chiqmaguncha Live API'ga tegilmaydi.**

---

## 🏛️ Core Architecture & Master Specifications

Every agent or subagent working on this repository **MUST read and strictly follow** the master specifications located in `docs/`:

1. **[Unit Economics & API Limits Specification](docs/UNIT_ECONOMICS_AND_LIMITS.md)**:
   - **Gemini Multimodal Live API pricing & sustainability model**.
   - **Shot (Camera)**: Client-side compression to 1080p JPEG (0.75 quality, ~120KB), 1.5s cooldown debounce.
   - **Gallery**: Max 5MB, client-side 1200px resize, Fast OCR pre-processing.
   - **Video/Frame Streaming**: Never stream 30 FPS! Strictly use **0.5 FPS (1 frame every 2 seconds)**.
   - **Session Caps**: 5-minute hard limit per problem, 45-second silence auto-pause.
   - **Freemium Energy Battery**: 5 Energy bolts per day; refill via time or by re-practicing mistakes (+1 Energy). Pro tier: unlimited ($12.99/mo).

2. **[Socratic Multimodal Architecture](docs/SOCRATIC_MULTIMODAL_ARCHITECTURE.md)**:
   - **Full Duplex WebSocket streaming** (< 800ms latency).
   - **Dual Modality**: Students can either tap quick-reply option pills OR speak naturally with their voice.
   - **Function Calling**: Backend sends `set_socratic_step` tool calls to update the mobile UI synchronized with AI voice.
   - **Anti-Cheating Socratic Guardrail**: Never give final numerical answers directly. Guide the student one logical step at a time.
   - **Privacy First (Rear Camera Only)**: Zero front camera support; child's face is never captured (COPPA & GDPR-K compliance).

---

## 💻 Codebase Rules & Tech Stack

- **Expo SDK**: Always read versioned docs at `https://docs.expo.dev/versions/v57.0.0/`.
- **Framework**: React Native 0.86+, React 19, TypeScript strict mode (zero `any`).
- **State Management**: Zustand 5 (Global stores in `src/presentation/state/`).
- **Animations**: Reanimated **4.5.x** (`useAnimatedStyle`, spring physics, GPU 60–120fps).
- **Audio**: `expo-audio` (NOT `expo-av` — it is not installed).
- **Style System**: Apple Minimalist HIG tokens (`src/core/theme.ts`).
- **Components**: Functional components only. Zero class components.

### 👥 Ish taqsimoti (kim nima yozadi)

> **Gemini, bu bo'limni diqqat bilan o'qi.** Loyihada ikkita AI ishlaydi va
> ularning vazifasi aniq ajratilgan.

| Qatlam | Kim yozadi |
| :-- | :-- |
| `backend/` — server mantiqi, validatorlar | 🧠 **Claude** |
| `src/core/api/` — tarmoq klientlari | 🧠 **Claude** |
| `src/data/` — datasource'lar, repozitoriylar | 🧠 **Claude** |
| `src/domain/` — entitilar, promptlar, biznes qoidalari | 🧠 **Claude** |
| Supabase sxemasi, RLS, Edge Functions | 🧠 **Claude** |
| `src/presentation/components/` — ekranlar, dizayn, animatsiya | 🎨 **Gemini** |
| `src/presentation/state/`, `hooks/` | 🧠 Claude mantiqni yozadi · 🎨 Gemini ulaydi |

**Gemini uchun qoida:** `backend/`, `src/core/api/`, `src/data/`, `src/domain/`
ichiga **yozma**. Agar vazifa shu papkalarga tegishi kerak bo'lsa — **TO'XTA** va
shunday deb ayt:

> *"Bu qism Claude'ning zonasi (`AGENTS.md` — Ish taqsimoti). Men UI qismini
> bajardim, qolganini Claude yozib beradi."*

Keyin faqat UI qismini bajar. Bu qoidani buzish — eng ko'p muammo keltirgan xato.

---

### 🚫 Qat'iy taqiqlar (buzilmaydi)

1. **API kalit klient kodida bo'lmaydi.** Hech qachon, hech qanday sababga ko'ra.
   Barcha AI chaqiruvlari backend (Supabase Edge Function) orqali o'tadi.
2. **`catch` blokida soxta/demo ma'lumot qaytarish taqiqlanadi.** Xatolik
   foydalanuvchiga rost ko'rsatiladi. (Bu qoida `ARCHITECTURE.md` §2 B2 xatosi tufayli.)
3. **Model nomlari, API endpoint'lar, kutubxona versiyalari taxmin qilinmaydi.**
   Rasmiy hujjatdan tekshiriladi va manba havolasi ko'rsatiladi. Bilmasang —
   "bilmayman, tekshirish kerak" deb ayt.
4. **Yangi komponent yozishdan oldin mavjudini qidir** (`grep`). Repoda allaqachon
   13 ta o'lik komponent bor — aynan shu qoida buzilgani uchun.
5. **`any` taqiqlanadi.** Har o'zgarishdan keyin `npx tsc --noEmit` → 0 xato.

---

## ⚡ 100% Autonomous Execution Protocol (Auto-Pilot)
- **ZERO INTERRUPTIONS / NO OPTION MENUS**: Never pause to ask the user "1, 2, 3... which option do you prefer?". Always pick the most optimal, production-grade, Apple-minimalist solution autonomously.
- **END-TO-END ISSUE RESOLUTION**: When an error (red screen, Metro bundling, runtime crash, TypeScript error) occurs, continue the execution loop autonomously until all logs are clean, bundling succeeds (HTTP 200), and `npx tsc --noEmit` passes with 0 errors.
- **REPORT ONLY ON COMPLETE SUCCESS**: Only deliver concise, high-level summaries after the entire problem has been solved and verified.
