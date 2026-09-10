# ⚠️ `backend/` — HOZIRCHA BO'SH

> Bu papkada **kod yo'q**. Supabase Edge Function'lari `TASKS.md` T1.4 da
> shu yerda yoziladi.

## Nima bo'ldi (T0.20)

Bu yerda `245fc55` commitida so'ralmagan holda yozilgan prototip turardi.
`/code-review` unda sakkizta xato topgan edi va ular tuzatilmagan.
T0.20 da uchala fayl ham hal qilindi:

| Fayl | Qaror | Sabab |
| :-- | :-- | :-- |
| `providers/LLMProvider.ts` | 🗑 **O'chirildi** | Qotib qolgan mock: rasmdan qat'i nazar doim `topic: 'Algebra'`, `canonicalAnswer: 'x=4'` qaytarardi. Bu — soxta darsning **to'rtinchi** ko'rinishi (T0.3, T0.11, T0.12 dan keyin). Loyihaning qoidasi: soxta ma'lumot o'chirib qo'yilmaydi, **yo'q qilinadi** |
| `services/MathTutorEngine.ts` | 🗑 **O'chirildi** | Holat qisman o'zgartirilib qisman nusxalanardi; `expectedStudentAction` ga `'TRANSFER_CHECK'` satri yozilardi; `updatedMastery: any`. T1.4b da Edge Function sifatida qaytadan yoziladi |
| `services/MathValidator.ts` | 📦 **`src/domain/services/` ga ko'chirildi** | Endi u **asosiy baholovchi**: plitka javobi qurilmada shu kod bilan tekshiriladi (`docs/UI_ARCHITECTURE.md` §4.3.2 D). Ikki nusxa bo'lsa, telefonda "to'g'ri" javob serverda "xato" chiqishi mumkin edi |
| `../tests/TutorFlow.test.ts` | 🗑 **O'chirildi** | Assertion ham, test runner ham yo'q edi — faqat `console.log`. Hech qachon yiqilmasdi, ya'ni yuqoridagi xatolarning birortasini ham tutmasdi |

`MathValidator` dagi ikkita xatodan biri tuzatildi: bola `5 = 5` yozsa,
**istalgan** tenglamaga "to'g'ri" deb baho berilardi (nol nisbat endi rad
etiladi). Ikkinchisi ochiq: matnli javoblar (`"qavslarni ochaman"`) mathjs
tomonidan aniq "noto'g'ri" deb belgilanadi va AI'ga eskalatsiya yo'li
(`isCertain: false`) ishlamaydi — **T1.4b**. Plitka formatida javob har doim
matematik ifoda bo'lgani uchun bu yo'l V1 da kam ta'sir qiladi.

## Rejalashtirilgan holat

`TASKS.md` T1.4 / T1.4b: `solve-problem`, `spend-energy`, `parent-report`
Edge Function'lari. Gemini kaliti **faqat** shu yerda yashaydi.
