# ROADMAP: WatermelonDB & Native Math View Transition

## Joriy Holat (Current Phase)
Hozirgi vaqtda loyiha **Expo Go (Managed Workflow)** da ishlayapti. Expo Go'da tezkor test qilish va UI ni qurish uchun biz faqatgina Javascript va oldindan kompilyatsiya qilingan native kodlardan foydalanyapmiz.

Shu sababli quyidagi texnologiyalar hozircha to'xtatib turilibdi (chunki ular maxsus `Custom Dev Client` yoki C++ kodlarni kompilyatsiya qilishni talab qiladi):
1. **WatermelonDB** (SQLite native adapter orqali)
2. **Native Math View** (haqiqiy LaTeX formulalarini SVG orqali chizish uchun `react-native-math-view`)

## Keyingi Bosqich (Production / Custom Dev Client Phase)
Loyihaning UI va AI logikasi to'liq bitib, xatosiz ishlagach, biz "Production" va haqiqiy APK yig'ish bosqichiga o'tamiz. Shu vaqtda biz Expo Go'dan voz kechib, `npx expo run:android` orqali Custom Build qilamiz.

**Shu bosqichda quyidagi ishlar BIRGALIKDA qilinishi shart:**

### 1. WatermelonDB ni qayta ulash
- `GamificationRepositoryImpl.ts` da `AsyncStorageService` o'rniga haqiqiy WatermelonDB database ulanadi.
- `schema.ts` va `models` to'liq ishga tushiriladi.
- `@nozbe/watermelondb` va babel dekoratorlari qoidasi o'rnatiladi.

### 2. Native Math View (`react-native-math-view`) o'rnatish
- AI'ning Sokratik matnlari va formulalari haqiqiy darslik formatida (original tipografiya, kasrlar, matritsalar) chiqishi uchun `react-native-math-view` kutubxonasini o'rnatamiz.
- **SocraticPromptBuilder.ts** dagi Guardrail 6 yana LaTeX formatiga o'tkaziladi:
  *Qoida: "Always format mathematical expressions using LaTeX wrapped in $$ (block) or $ (inline)."*
- **SocraticScannerScreen.tsx** dagi barcha oddiy `<Text>` va vaqtinchalik `<RichMathText>` lar `<MathText>` (from `react-native-math-view`) ga o'zgartiriladi.

---

*Eslatma: AI yoki dasturchi ushbu faylni o'qigach, WatermelonDB ni o'rnatish jarayonida zudlik bilan Native Math View ni ham o'rnatishi kerak.*
