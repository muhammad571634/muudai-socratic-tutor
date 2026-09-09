import { MathValidator } from '../backend/services/MathValidator';
import { MathTutorEngine } from '../backend/services/MathTutorEngine';
import { LLMProvider } from '../backend/providers/LLMProvider';
import { CompactSessionState, DynamicSocraticStep } from '../src/domain/entities/SocraticState';

async function runTests() {
  console.log("=== RUNNING MATH TUTOR MVP TESTS ===");

  // 1. MathValidator tests (Equivalence checking)
  console.log("\n--- MathValidator Tests ---");
  console.log("Test: '5x - 20' == '5(x-4)' ->", MathValidator.isEquivalent("5x - 20", "5(x-4)").isCorrect);
  console.log("Test: 'x = 2' == '2 = x' ->", MathValidator.isEquivalent("x = 2", "2 = x").isCorrect);
  console.log("Test: '3x - 9 = 0' == 'x = 3' ->", MathValidator.isEquivalent("3x - 9 = 0", "x = 3").isCorrect);
  console.log("Test: 'x=4' != 'x=-4' ->", MathValidator.isEquivalent("x=4", "x=-4").isCorrect === false);
  
  const engine = new MathTutorEngine();
  
  // 7. Test blurry/invalid image
  console.log("\n--- Test: Blurry Image ---");
  const blurryRes = await engine.extractProblem('BLURRY');
  console.log("Blurry result:", blurryRes.initialStep.uiParams.interactionFormat === 'INFO_CARD' ? "PASS" : "FAIL");

  // 2. Test Normal Flow & Transfer Check
  console.log("\n--- Test: Normal Flow & Transfer Check ---");
  const extractRes = await engine.extractProblem('BASE64_IMAGE_MOCK');
  console.log("Extracted Subject:", extractRes.blueprint.subject);
  console.log("Initial Question:", extractRes.initialStep.content.tutorQuestion);

  // Initialize state
  const state: CompactSessionState = {
    blueprintContext: extractRes.blueprint,
    currentConceptMastery: {
      conceptId: "Algebra",
      masteryScore: 0,
      attempts: 0,
      correctResponses: 0,
      incorrectResponses: 0,
      detectedMisconceptions: [],
      hintsUsed: 0,
      prerequisiteGaps: []
    },
    learningState: {
      currentConcept: "Isolating variables",
      currentSubStepIndex: 0,
      expectedStudentAction: "Qavsni ochamiz",
      currentDifficulty: 4,
      attemptsAtCurrentStep: 0,
      hintsUsedAtCurrentStep: 0,
      independentSolve: false
    },
    sessionHistory: []
  };

  // Step 1: Correct Answer
  console.log("\nStudent says: 'Qavsni ochamiz'");
  let eval1 = await engine.evaluateResponse(state, "Qavsni ochamiz", extractRes.initialStep.id);
  console.log("Action:", eval1.step.content.tutorExplanation);
  
  // Step 2: Next sub-step is "X larni bir tomonga o'tkazish". Student says wrong.
  console.log("\n--- Test: Wrong Answer & Misconception ---");
  console.log("Student says: 'x=-4'"); // Sign error
  let eval2 = await engine.evaluateResponse(state, "x=-4", eval1.step.id);
  console.log("Detected Misconceptions:", eval2.updatedMastery.detectedMisconceptions);
  console.log("Hint Level 1:", eval2.step.content.tutorExplanation);

  console.log("\n--- Test: Hint Escalation ---");
  console.log("Student says: 'Ikkala tomonni bo'lamiz' (wrong operation order)");
  let eval3 = await engine.evaluateResponse(state, "Ikkala tomonni bo'lamiz", eval2.step.id);
  console.log("Hint escalated:", eval3.step.content.tutorExplanation);

  console.log("\n--- Test: Correct Final Answer -> Transfer Check ---");
  console.log("Student finally says: 'x=4'");
  // Let's pretend they reached the end of the steps
  state.learningState.currentSubStepIndex = state.blueprintContext.expectedSolutionPath.length - 1;
  state.learningState.expectedStudentAction = "x=4";
  let eval4 = await engine.evaluateResponse(state, "x=4", eval3.step.id);
  console.log("Transfer check triggered:", eval4.step.content.tutorQuestion);

  console.log("\n--- Test: Mastery Achieved (Transfer Check pass) ---");
  console.log("Student says: 'x=2' (which is the expected answer for 3(x-2)=0)");
  let eval5 = await engine.evaluateResponse(state, "x=2", eval4.step.id);
  console.log("Final message:", eval5.step.content.tutorExplanation);

}

runTests().catch(console.error);
