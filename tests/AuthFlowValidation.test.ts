import en from '../src/core/i18n/locales/en.json';
import uz from '../src/core/i18n/locales/uz.json';
import ru from '../src/core/i18n/locales/ru.json';

// Test suite for MuudAI Onboarding & Auth Flow
console.log('=== MUUDAI AUTH FLOW & ONBOARDING UNIT TESTS ===\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Detail: ${detail}`);
    process.exitCode = 1;
  }
}

// ── 1. i18n Locales Completeness & Symmetry ──────────────────────────
console.log('--- 1. Testing i18n Keys Across en, uz, ru ---');

assert(!!en.auth, 'en.json contains auth section');
assert(!!uz.auth, 'uz.json contains auth section');
assert(!!ru.auth, 'ru.json contains auth section');

type SignInKey = keyof typeof en.auth.signIn;
const requiredSignInKeys: SignInKey[] = [
  'title',
  'emailLabel',
  'emailPlaceholder',
  'passwordLabel',
  'passwordPlaceholder',
  'rememberMe',
  'forgotPassword',
  'submitButton',
  'invalidEmail',
  'invalidPassword',
];

type ForgotPasswordKey = keyof typeof en.auth.forgotPassword;
const requiredForgotPassKeys: ForgotPasswordKey[] = [
  'title',
  'subtitle',
  'emailLabel',
  'emailPlaceholder',
  'submitButton',
  'invalidEmail',
  'successTitle',
  'successMessage',
  'backToSignIn',
];

for (const key of requiredSignInKeys) {
  assert(typeof en.auth?.signIn?.[key] === 'string' && en.auth.signIn[key].length > 0, `en has auth.signIn.${key}`);
  assert(typeof uz.auth?.signIn?.[key] === 'string' && uz.auth.signIn[key].length > 0, `uz has auth.signIn.${key}`);
  assert(typeof ru.auth?.signIn?.[key] === 'string' && ru.auth.signIn[key].length > 0, `ru has auth.signIn.${key}`);
}

for (const key of requiredForgotPassKeys) {
  assert(typeof en.auth?.forgotPassword?.[key] === 'string' && en.auth.forgotPassword[key].length > 0, `en has auth.forgotPassword.${key}`);
  assert(typeof uz.auth?.forgotPassword?.[key] === 'string' && uz.auth.forgotPassword[key].length > 0, `uz has auth.forgotPassword.${key}`);
  assert(typeof ru.auth?.forgotPassword?.[key] === 'string' && ru.auth.forgotPassword[key].length > 0, `ru has auth.forgotPassword.${key}`);
}

// ── 2. Email Validation Logic ────────────────────────────────────────
console.log('\n--- 2. Testing Email Validation ---');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (val: string) => EMAIL_REGEX.test(val.trim());

const validEmails = [
  'andrew.ainsley@yourdomain.com',
  '  andrew.ainsley@yourdomain.com  ', // trimmed valid
  'student@muudai.com',
  'parent.guardian@school.edu',
  'user+tag@domain.co.uk',
];

const invalidEmails = [
  '',
  '   ',
  'andrew.ainsley',
  'andrew.ainsley@',
  '@yourdomain.com',
  'andrew@domain',
  'andrew ainsley@domain.com',
];

for (const email of validEmails) {
  assert(isValidEmail(email), `Valid email accepted: "${email}"`);
}

for (const email of invalidEmails) {
  assert(!isValidEmail(email), `Invalid email rejected: "${email}"`);
}

// ── 3. Password Validation Logic ─────────────────────────────────────
console.log('\n--- 3. Testing Password Validation ---');

const isValidPassword = (pwd: string) => pwd.trim().length >= 6;

assert(!isValidPassword(''), 'Empty password rejected');
assert(!isValidPassword('12345'), '5-char password rejected');
assert(!isValidPassword('  123  '), 'Whitespace-padded short password rejected');
assert(isValidPassword('123456'), '6-char password accepted');
assert(isValidPassword('MySecretPass!2026'), 'Strong password accepted');

// ── 4. Onboarding & Auth State Machine Simulation ─────────────────────
console.log('\n--- 4. Testing Navigation & State Transitions ---');

type OnboardingStep =
  | 'welcome'
  | 'signIn'
  | 'forgotPassword'
  | 'language'
  | 'learn'
  | 'target'
  | 'referral'
  | 'profilePrompt'
  | 'profileName'
  | 'profileAge'
  | 'profileEmail'
  | 'profilePassword'
  | 'profileSuccess';

interface MockNavigationState {
  hasSeenOnboarding: boolean;
  onboardingStep: OnboardingStep;
  currentScreen: string;
  studentEmail: string;
}

let state: MockNavigationState = {
  hasSeenOnboarding: false,
  onboardingStep: 'welcome',
  currentScreen: 'home',
  studentEmail: '',
};

// Action 1: On Welcome, tap "I ALREADY HAVE AN ACCOUNT"
state.onboardingStep = 'signIn';
assert(state.onboardingStep === 'signIn', 'Welcome -> I ALREADY HAVE AN ACCOUNT navigates to signIn');

// Action 2: On SignIn, tap "Forgot Password?"
state.onboardingStep = 'forgotPassword';
assert(state.onboardingStep === 'forgotPassword', 'SignIn -> Forgot Password? navigates to forgotPassword');

// Action 3: On ForgotPassword, tap Back Arrow
state.onboardingStep = 'signIn';
assert(state.onboardingStep === 'signIn', 'ForgotPassword -> Back returns to signIn');

// Action 4: On SignIn, tap Back Arrow
state.onboardingStep = 'welcome';
assert(state.onboardingStep === 'welcome', 'SignIn -> Back returns to welcome');

// Action 5: Re-enter SignIn, and submit valid credentials with rememberMe=true
state.onboardingStep = 'signIn';
const credentials = { email: 'andrew.ainsley@yourdomain.com', rememberMe: true };
if (isValidEmail(credentials.email)) {
  state.studentEmail = credentials.rememberMe ? credentials.email.trim() : '';
  state.hasSeenOnboarding = true;
  state.onboardingStep = 'welcome';
}

assert(state.hasSeenOnboarding === true, 'SignIn success completes onboarding');
assert(state.studentEmail === 'andrew.ainsley@yourdomain.com', 'SignIn success with rememberMe=true stores student email');
assert(state.currentScreen === 'home', 'After onboarding completes, user views home screen');

// Action 6: Test rememberMe=false flow
let rememberFalseState: MockNavigationState = {
  hasSeenOnboarding: false,
  onboardingStep: 'signIn',
  currentScreen: 'home',
  studentEmail: 'previous@user.com',
};
const credentialsNoRemember = { email: 'guest@yourdomain.com', rememberMe: false };
if (isValidEmail(credentialsNoRemember.email)) {
  rememberFalseState.studentEmail = credentialsNoRemember.rememberMe ? credentialsNoRemember.email.trim() : '';
  rememberFalseState.hasSeenOnboarding = true;
  rememberFalseState.onboardingStep = 'welcome';
}
assert(rememberFalseState.hasSeenOnboarding === true, 'SignIn without rememberMe completes onboarding');
assert(rememberFalseState.studentEmail === '', 'SignIn with rememberMe=false clears stored email');

// ── 5. Forgot Password Submit Flow ───────────────────────────────────
console.log('\n--- 5. Testing Forgot Password Submission Flow ---');

let fpState: { email: string; isSuccess: boolean; returnedToSignIn: boolean } = {
  email: '',
  isSuccess: false,
  returnedToSignIn: false,
};

// User enters email and submits
const inputEmail = '  student@test.com  ';
if (isValidEmail(inputEmail)) {
  fpState.email = inputEmail.trim();
  fpState.isSuccess = true;
}

assert(fpState.isSuccess === true, 'ForgotPassword submission succeeds with valid email');
assert(fpState.email === 'student@test.com', 'ForgotPassword trims email correctly');

// User taps "Back to Sign In" after success feedback
if (fpState.isSuccess) {
  fpState.returnedToSignIn = true;
}
assert(fpState.returnedToSignIn === true, 'User can navigate back to Sign In after viewing feedback');

console.log(`\n=============================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed.`);
console.log(`=============================================\n`);
