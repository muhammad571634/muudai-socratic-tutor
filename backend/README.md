# ⚠️ `backend/` — PROTOTIP, ISHLATILMAYDI

> **Bu papkadagi kod hech qayerdan chaqirilmaydi va ishlaydigan server yo'q.**
> Uni ilovaga ulash **taqiqlanadi** — avval quyidagi xatolar tuzatilishi shart.

Bu kod `245fc55` commitida so'ralmagan holda yozilgan (T0.3 vazifasi doirasidan
tashqarida). G'oyasi to'g'ri — `MathValidator` `docs/PEDAGOGY.md` §2.5 dagi
tekshiruv quvuri uchun yaxshi asos. Lekin joriy holatida ishonchsiz.

---

## `/code-review` topgan xatolar (tuzatilmagan)

| Fayl | Muammo |
| :-- | :-- |
| `services/MathValidator.ts:74` | Bola `5=5` yozsa, **istalgan** tenglamaga "to'g'ri" deb baholanadi. `simplify('(0)/(x-4)')` → 0 → "ekvivalent". Ya'ni `1=1`, `0=0`, `x=x` — hammasi maqtaladi va +10 ball beradi |
| `services/MathValidator.ts:53` | O'zbekcha matnli javoblar (`"qavslarni ochaman"`) mathjs tomonidan simvol sifatida tahlil qilinadi va **aniq noto'g'ri** deb belgilanadi. Natijada AI'ga eskalatsiya yo'li (`isCertain: false`) hech qachon ishlamaydi |
| `providers/LLMProvider.ts:19` | Qotib qolgan mock: rasmdan qat'i nazar doim `topic: 'Algebra'`, `canonicalAnswer: 'x=4'` qaytaradi. Ulansa — bola kasrlar masalasini suratga oladi, unga chiziqli tenglama o'rgatiladi |
| `providers/LLMProvider.ts:9` | `blueprint: {} as any` — `any` taqiqi buzilgan (`AGENTS.md` 5-qoida) va keyinchalik `expectedSolutionPath.length` da `TypeError` beradi |
| `providers/LLMProvider.ts` (barcha) | `pedagogicalAction` maydoni hech qachon o'rnatilmaydi → UI'dagi barcha shartlar (`MASTERY_ACHIEVED`, `GIVE_HINT`, `TRANSFER_CHECK`) **o'lik kod** |
| `services/MathTutorEngine.ts:74` | `expectedStudentAction` ga `'TRANSFER_CHECK'` yozib yuboriladi → keyingi javob matematik ifoda o'rniga shu satrga solishtiriladi |
| `services/MathTutorEngine.ts:50` | Holat qisman o'zgartiriladi, qisman nusxalanadi. HTTP orqali serializatsiya qilinganda ikkalasi bir-biridan ajralib ketadi |
| `../tests/TutorFlow.test.ts` | Assertion yo'q, test runner ham yo'q — faqat `console.log`. Hech qachon yiqilmaydi, ya'ni yuqoridagi xatolarning birortasini ham tutmaydi |

---

## Rejalashtirilgan holat

Bu kod **Faza 1** da (`TASKS.md` T1.4 / T1.4b) Supabase Edge Function sifatida
qayta yoziladi:

- Gemini API kaliti **serverda** (`AGENTS.md` 1-taqiq)
- `MathValidator` — javobni asl tenglamaga qaytarib qo'yish orqali **deterministik**
  tekshiruv (`docs/PEDAGOGY.md` §2.5)
- Haqiqiy LLM chaqiruvi, mock emas
- `vitest` bilan haqiqiy testlar

**Shu paytgacha:** ilova `src/data/remote/GeminiSocraticDataSource.ts` orqali
to'g'ridan-to'g'ri ishlaydi.
