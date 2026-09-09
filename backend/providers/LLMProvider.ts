import { CompactSessionState, DynamicSocraticStep, TutorDiagnosis, ProblemBlueprint } from '../../src/domain/entities/SocraticState';

export class LLMProvider {
  async extractProblemBlueprint(imageBase64: string): Promise<{ sessionId: string; blueprint: ProblemBlueprint; initialStep: DynamicSocraticStep }> {
    // If imageBase64 is a known blurry image string or something, we could return ASK_CLARIFICATION.
    if (imageBase64 === 'BLURRY') {
       return {
         sessionId: 'sess_123',
         blueprint: {} as any,
         initialStep: {
           id: "step_clarify",
           content: { tutorQuestion: "Kechirasiz, rasm biroz xira. Qaytadan aniqroq rasmga ola olasizmi?" },
           uiParams: { interactionFormat: "INFO_CARD" },
           xpReward: 0
         }
       };
    }

    return {
      sessionId: 'sess_456',
      blueprint: {
        subject: 'math',
        topic: 'Algebra',
        subtopic: 'Linear Equations',
        learningObjective: "Bir noma'lumli chiziqli tenglamalarni yechish",
        difficulty: 4,
        concepts: ["Isolating variables"],
        prerequisites: ["Basic arithmetic"],
        expectedSolutionPath: ["Qavslarni ochish", "X larni bir tomonga o'tkazish", "Bo'lish"],
        commonMisconceptions: ["Ishoralarda xato qilish"],
        canonicalAnswer: "x=4"
      },
      initialStep: {
        id: "step_1",
        content: { tutorQuestion: "Tenglamani yechishni nimadan boshlaymiz?" },
        uiParams: { 
          interactionFormat: "MULTIPLE_CHOICE", 
          quickOptions: ["Qavsni ochamiz", "Ikkala tomonni bo'lamiz", "X ni yig'amiz"] 
        },
        xpReward: 10
      }
    };
  }

  async diagnoseError(state: CompactSessionState, studentResponse: string): Promise<TutorDiagnosis> {
    if (studentResponse.includes('-') || studentResponse.includes('+')) {
      return { misconceptionDetected: "Ishorada xato", hintLevel: 1, nextBestAction: 'GIVE_HINT' };
    }
    if (studentResponse === "Ikkala tomonni bo'lamiz") {
      return { misconceptionDetected: "Amallar ketma-ketligi", hintLevel: 2, nextBestAction: 'GIVE_HINT' };
    }
    return { hintLevel: 1, nextBestAction: 'GIVE_HINT' };
  }

  async evaluateUncertainResponse(state: CompactSessionState, studentResponse: string): Promise<{ isCorrect: boolean, diagnosis: TutorDiagnosis }> {
    // Mocking an AI check
    return {
      isCorrect: studentResponse.includes('4'),
      diagnosis: {
        hintLevel: 0,
        nextBestAction: studentResponse.includes('4') ? 'ASK_QUESTION' : 'GIVE_HINT'
      }
    };
  }

  async generateNextStep(
    state: CompactSessionState,
    diagnosis: TutorDiagnosis,
    studentResponse: string
  ): Promise<DynamicSocraticStep> {
    const hintText = diagnosis.hintLevel === 1 ? "Kichik xato ketdi. E'tibor bering." :
                     diagnosis.hintLevel === 2 ? "Qavs oldidagi ishora barcha ichki hadlarga ta'sir qiladi." :
                     "Sizda manfiy ishora chiqib qoldi, qaytadan ko'paytiring.";

    if (diagnosis.nextBestAction === 'GIVE_HINT') {
      return {
        id: "step_hint_" + Date.now(),
        content: { tutorExplanation: hintText, tutorQuestion: "Yana bir bor urinib ko'ring!" },
        uiParams: { interactionFormat: "RETRY_PROMPT" },
        xpReward: 0
      };
    } else if (diagnosis.nextBestAction === 'TRANSFER_CHECK') {
       return {
        id: "step_transfer_" + Date.now(),
        content: { tutorExplanation: "Ajoyib! Buni to'g'ri yechdingiz.", tutorQuestion: "Endi o'zingiz mustaqil ravishda shuni yechib ko'ring: 3(x - 2) = 0" },
        uiParams: { interactionFormat: "OPEN_QUESTION" },
        xpReward: 20
      };
    } else if (diagnosis.nextBestAction === 'MASTERY_ACHIEVED') {
       return {
        id: "step_mastery_" + Date.now(),
        content: { tutorExplanation: "Tabriklayman! Siz bu mavzuni to'liq o'zlashtirdingiz." },
        uiParams: { interactionFormat: "INFO_CARD" },
        xpReward: 50
      };
    }

    return {
      id: "step_next_" + Date.now(),
      content: { tutorExplanation: "To'g'ri!", tutorQuestion: "Endi qanday qadamni bajaramiz?" },
      uiParams: { interactionFormat: "OPEN_QUESTION" },
      xpReward: 10
    };
  }
}
