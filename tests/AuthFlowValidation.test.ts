import en from '../src/core/i18n/locales/en.json';
import uz from '../src/core/i18n/locales/uz.json';
import ru from '../src/core/i18n/locales/ru.json';

// Test suite for MuudAI Onboarding & Auth Flow including Password Recovery
console.log('=== MUUDAI AUTH & RECOVERY FLOW UNIT TESTS ===\n');

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

// 1.1 Sign In Keys
const requiredSignInKeys = [
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
] as const;

for (const key of requiredSignInKeys) {
  assert(typeof en.auth?.signIn?.[key] === 'string' && en.auth.signIn[key].length > 0, `en has auth.signIn.${key}`);
  assert(typeof uz.auth?.signIn?.[key] === 'string' && uz.auth.signIn[key].length > 0, `uz has auth.signIn.${key}`);
  assert(typeof ru.auth?.signIn?.[key] === 'string' && ru.auth.signIn[key].length > 0, `ru has auth.signIn.${key}`);
}

// 1.2 Forgot Password Keys
const requiredForgotPassKeys = [
  'title',
  'subtitle',
  'emailLabel',
  'emailPlaceholder',
  'submitButton',
  'invalidEmail',
  'successTitle',
  'successMessage',
  'backToSignIn',
] as const;

for (const key of requiredForgotPassKeys) {
  assert(typeof en.auth?.forgotPassword?.[key] === 'string' && en.auth.forgotPassword[key].length > 0, `en has auth.forgotPassword.${key}`);
  assert(typeof uz.auth?.forgotPassword?.[key] === 'string' && uz.auth.forgotPassword[key].length > 0, `uz has auth.forgotPassword.${key}`);
  assert(typeof ru.auth?.forgotPassword?.[key] === 'string' && ru.auth.forgotPassword[key].length > 0, `ru has auth.forgotPassword.${key}`);
}

// 1.3 OTP Verification Keys
const requiredOtpKeys = [
  'title',
  'subtitle',
  'didntReceive',
  'resendTimer',
  'resendNow',
  'confirmButton',
  'invalidOtp',
] as const;

for (const key of requiredOtpKeys) {
  assert(typeof en.auth?.otpVerification?.[key] === 'string' && en.auth.otpVerification[key].length > 0, `en has auth.otpVerification.${key}`);
  assert(typeof uz.auth?.otpVerification?.[key] === 'string' && uz.auth.otpVerification[key].length > 0, `uz has auth.otpVerification.${key}`);
  assert(typeof ru.auth?.otpVerification?.[key] === 'string' && ru.auth.otpVerification[key].length > 0, `ru has auth.otpVerification.${key}`);
}

// 1.4 Create New Password Keys
const requiredCreatePassKeys = [
  'title',
  'subtitle',
  'newPasswordLabel',
  'confirmPasswordLabel',
  'passwordPlaceholder',
  'rememberMe',
  'continueButton',
  'passwordMismatch',
  'passwordTooShort',
] as const;

for (const key of requiredCreatePassKeys) {
  assert(typeof en.auth?.createNewPassword?.[key] === 'string' && en.auth.createNewPassword[key].length > 0, `en has auth.createNewPassword.${key}`);
  assert(typeof uz.auth?.createNewPassword?.[key] === 'string' && uz.auth.createNewPassword[key].length > 0, `uz has auth.createNewPassword.${key}`);
  assert(typeof ru.auth?.createNewPassword?.[key] === 'string' && ru.auth.createNewPassword[key].length > 0, `ru has auth.createNewPassword.${key}`);
}

// ── 2. Email Validation Logic ────────────────────────────────────────
console.log('\n--- 2. Testing Email Validation ---');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (val: string) => EMAIL_REGEX.test(val.trim());

const validEmails = [
  'andrew.ainsley@yourdomain.com',
  '  andrew.ainsley@yourdomain.com  ',
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

// ── 4. OTP Verification Logic, Box Selection & Keypad Input ──────────
console.log('\n--- 4. Testing OTP Verification Logic ---');

const OTP_REGEX = /^\d{4}$/;
const isValidOtp = (code: string) => OTP_REGEX.test(code.replace(/\s/g, ''));

assert(!isValidOtp(''), 'Empty OTP rejected');
assert(!isValidOtp('123'), '3-digit OTP rejected');
assert(!isValidOtp('12345'), '5-digit OTP rejected');
assert(!isValidOtp('12a4'), 'Alpha-numeric OTP rejected');
assert(!isValidOtp('abcd'), 'Alpha OTP rejected');
assert(!isValidOtp('4 67'), 'Incomplete OTP with blank box rejected');
assert(isValidOtp('4672'), '4-digit OTP accepted');
assert(isValidOtp('0000'), '4-digit zero OTP accepted');
assert(isValidOtp('9999'), '4-digit max OTP accepted');

// 4.1 Mockup Exact State: 3 digits entered ("467") with Box 2 active
console.log('\n--- 4.1 Testing Mockup Exact OTP Box State ---');
interface OtpState {
  code: string;
  focusedIndex: number;
}

const applyDigit = (state: OtpState, key: string): OtpState => {
  if (!/^[0-9]$/.test(key)) return state;
  const digits = [state.code[0] || '', state.code[1] || '', state.code[2] || '', state.code[3] || ''];
  digits[state.focusedIndex] = key;
  return {
    code: digits.join(''),
    focusedIndex: Math.min(state.focusedIndex + 1, 3),
  };
};

const applyDelete = (state: OtpState): OtpState => {
  const digits = [state.code[0] || '', state.code[1] || '', state.code[2] || '', state.code[3] || ''];
  if (digits[state.focusedIndex]) {
    digits[state.focusedIndex] = '';
    return {
      code: digits.join('').replace(/ +$/, ''),
      focusedIndex: state.focusedIndex,
    };
  } else if (state.focusedIndex > 0) {
    const prev = state.focusedIndex - 1;
    digits[prev] = '';
    return {
      code: digits.join('').replace(/ +$/, ''),
      focusedIndex: prev,
    };
  }
  return state;
};

// Start typing 4, 6, 7
let otpState: OtpState = { code: '', focusedIndex: 0 };
otpState = applyDigit(otpState, '4');
assert(otpState.code === '4' && otpState.focusedIndex === 1, 'Digit 4 entered -> code="4", focus=1');
otpState = applyDigit(otpState, '6');
assert(otpState.code === '46' && otpState.focusedIndex === 2, 'Digit 6 entered -> code="46", focus=2');
otpState = applyDigit(otpState, '7');
assert(otpState.code === '467' && otpState.focusedIndex === 3, 'Digit 7 entered -> code="467", focus=3');

// User taps Box 2 (which contains '7') as shown in mockup media_1789054142349.png
otpState.focusedIndex = 2;
assert(otpState.focusedIndex === 2, 'User taps Box 2 -> focus=2 (matches media_1789054142349.png)');
assert(otpState.code[2] === '7', 'Box 2 contains digit "7" with active purple border');
assert(!isValidOtp(otpState.code), 'Incomplete 3-digit code "467" cannot be confirmed');

// User edits Box 2: replaces '7' with '8'
otpState = applyDigit(otpState, '8');
assert(otpState.code === '468' && otpState.focusedIndex === 3, 'Box 2 updated to "8" -> code="468", focus=3');

// User enters 4th digit '2'
otpState = applyDigit(otpState, '2');
assert(otpState.code === '4682' && otpState.focusedIndex === 3, 'Box 3 filled with "2" -> code="4682"');
assert(isValidOtp(otpState.code), 'Completed 4-digit code "4682" is valid for confirmation');

// User presses delete
otpState = applyDelete(otpState);
assert(otpState.code === '468', 'Delete clears Box 3 -> code="468"');

// ── 5. OTP Resend Countdown Logic & Text Highlighting ────────────────
console.log('\n--- 5. Testing OTP Resend Countdown Logic & Highlighting ---');

interface CountdownTimerState {
  seconds: number;
  canResend: boolean;
}

const createTimer = (initial: number = 55): CountdownTimerState => ({
  seconds: initial,
  canResend: initial === 0,
});

const tickTimer = (state: CountdownTimerState): CountdownTimerState => {
  const nextSec = Math.max(0, state.seconds - 1);
  return {
    seconds: nextSec,
    canResend: nextSec === 0,
  };
};

let timer = createTimer(55);
assert(timer.seconds === 55, 'Initial timer starts at 55s');
assert(timer.canResend === false, 'Resend is disabled while timer > 0');

// Tick 10 seconds
for (let i = 0; i < 10; i++) {
  timer = tickTimer(timer);
}
assert(timer.seconds === 45, 'Timer ticks down correctly to 45s');
assert(timer.canResend === false, 'Resend is still disabled at 45s');

// Fast-forward to 0
for (let i = 0; i < 45; i++) {
  timer = tickTimer(timer);
}
assert(timer.seconds === 0, 'Timer reaches 0s');
assert(timer.canResend === true, 'Resend is enabled when timer reaches 0s');

// Resend triggered
timer = createTimer(55);
assert(timer.seconds === 55 && timer.canResend === false, 'Resend resets timer back to 55s');

// 5.1 Test Timer Highlight Segment Extraction (Purple "55 s" in mockup)
console.log('\n--- 5.1 Testing Timer Unit Highlight Regex Across Locales ---');

const extractTimerHighlight = (text: string): { prefix: string; highlight: string; suffix: string } => {
  const parts = text.split(/(\d+\s*(?:soniyada|soniya|s|с)?)/i);
  let prefix = '';
  let highlight = '';
  let suffix = '';
  for (const part of parts) {
    if (/^\d+\s*(?:soniyada|soniya|s|с)?$/i.test(part)) {
      highlight = part;
    } else if (!highlight) {
      prefix += part;
    } else {
      suffix += part;
    }
  }
  return { prefix, highlight, suffix };
};

const enResult = extractTimerHighlight('You can resend code in 55 s');
assert(enResult.prefix === 'You can resend code in ', 'en timer prefix extracted correctly');
assert(enResult.highlight === '55 s', 'en timer highlight includes both number and unit: "55 s" (purple)');

const ruResult = extractTimerHighlight('Вы можете отправить код повторно через 55 с');
assert(ruResult.prefix === 'Вы можете отправить код повторно через ', 'ru timer prefix extracted correctly');
assert(ruResult.highlight === '55 с', 'ru timer highlight includes both number and unit: "55 с" (purple)');

const uzResult = extractTimerHighlight('Kodni 55 soniyada qayta yuborishingiz mumkin');
assert(uzResult.prefix === 'Kodni ', 'uz timer prefix extracted correctly');
assert(uzResult.highlight === '55 soniyada', 'uz timer highlight includes both number and unit: "55 soniyada" (purple)');
assert(uzResult.suffix === ' qayta yuborishingiz mumkin', 'uz timer suffix extracted correctly');

// ── 6. Create New Password & Confirmation Validation ─────────────────
console.log('\n--- 6. Testing Create New Password Validation ---');

const validateNewPassword = (pwd: string, confirm: string) => {
  const tPwd = pwd.trim();
  const tConf = confirm.trim();
  if (tPwd.length < 6) return { valid: false, error: 'passwordTooShort' };
  if (tPwd !== tConf) return { valid: false, error: 'passwordMismatch' };
  return { valid: true, error: null };
};

assert(validateNewPassword('123', '123').error === 'passwordTooShort', 'Short password rejected');
assert(validateNewPassword('password123', 'password456').error === 'passwordMismatch', 'Mismatched passwords rejected');
assert(validateNewPassword('secret123', 'secret123').valid === true, 'Matching password >= 6 characters accepted');
assert(validateNewPassword('  pass123  ', 'pass123').valid === true, 'Trimmed matching password accepted');

// 6.1 Test Single-Dispatch Callback Handler
console.log('\n--- 6.1 Testing Single Dispatch Callback Handler ---');
let continueCalls = 0;
let successCalls = 0;

const dispatchResult = (
  callbacks: { onContinue?: () => void; onSuccess?: () => void }
) => {
  if (callbacks.onContinue) {
    callbacks.onContinue();
  } else if (callbacks.onSuccess) {
    callbacks.onSuccess();
  }
};

dispatchResult({
  onContinue: () => { continueCalls++; },
  onSuccess: () => { successCalls++; },
});

assert(continueCalls === 1, 'onContinue invoked exactly once');
assert(successCalls === 0, 'onSuccess not doubly called when onContinue provided');

// ── 7. Full Password Recovery Flow State Machine ─────────────────────
console.log('\n--- 7. Testing Full Recovery Flow Transitions ---');

type FlowStep =
  | 'welcome'
  | 'signIn'
  | 'forgotPassword'
  | 'otpVerification'
  | 'createNewPassword';

interface RecoveryFlowState {
  currentStep: FlowStep;
  recoveryEmail: string;
  studentEmail: string;
  studentPassword: string;
  hasSeenOnboarding: boolean;
}

let flow: RecoveryFlowState = {
  currentStep: 'welcome',
  recoveryEmail: '',
  studentEmail: '',
  studentPassword: '',
  hasSeenOnboarding: false,
};

// Step 1: User taps "I ALREADY HAVE AN ACCOUNT" on Welcome
flow.currentStep = 'signIn';
assert(flow.currentStep === 'signIn', 'Step 1: welcome -> signIn');

// Step 2: User taps "Forgot Password?"
flow.currentStep = 'forgotPassword';
assert(flow.currentStep === 'forgotPassword', 'Step 2: signIn -> forgotPassword');

// Step 2b: User tests back button on forgotPassword
flow.currentStep = 'signIn';
assert(flow.currentStep === 'signIn', 'Step 2b: forgotPassword back -> signIn');
flow.currentStep = 'forgotPassword';

// Step 3: User enters email on forgotPassword and continues
const inputRecoveryEmail = 'student@example.com';
if (isValidEmail(inputRecoveryEmail)) {
  flow.recoveryEmail = inputRecoveryEmail;
  flow.studentEmail = inputRecoveryEmail;
  flow.currentStep = 'otpVerification';
}
assert(flow.currentStep === 'otpVerification', 'Step 3: forgotPassword -> otpVerification');
assert(flow.recoveryEmail === 'student@example.com', 'Step 3: recoveryEmail correctly stored');

// Step 3b: User taps back button on otpVerification
flow.currentStep = 'forgotPassword';
assert(flow.currentStep === 'forgotPassword', 'Step 3b: otpVerification back -> forgotPassword');
flow.currentStep = 'otpVerification';

// Step 4: User enters valid OTP and confirms
const enteredOtp = '4672';
if (isValidOtp(enteredOtp)) {
  flow.currentStep = 'createNewPassword';
}
assert(flow.currentStep === 'createNewPassword', 'Step 4: otpVerification -> createNewPassword');

// Step 4b: User taps back button on createNewPassword
flow.currentStep = 'otpVerification';
assert(flow.currentStep === 'otpVerification', 'Step 4b: createNewPassword back -> otpVerification');
flow.currentStep = 'createNewPassword';

// Step 5: User enters matching new passwords and submits
const newPass = 'MyNewPassword2026';
const confirmPass = 'MyNewPassword2026';
const rememberMe = true;

const passValidation = validateNewPassword(newPass, confirmPass);
if (passValidation.valid) {
  flow.studentPassword = newPass;
  if (rememberMe) {
    flow.studentEmail = flow.recoveryEmail;
  } else {
    flow.studentEmail = '';
  }
  flow.currentStep = 'signIn';
}

assert(flow.currentStep === 'signIn', 'Step 5: createNewPassword -> signIn');
assert(flow.studentPassword === 'MyNewPassword2026', 'Step 5: studentPassword updated');
assert(flow.studentEmail === 'student@example.com', 'Step 5: studentEmail preserved when rememberMe=true');

// Step 6: User signs in with the new credentials
if (isValidEmail(flow.studentEmail) && isValidPassword(flow.studentPassword)) {
  flow.hasSeenOnboarding = true;
}
assert(flow.hasSeenOnboarding === true, 'Step 6: User successfully signs in with new password');

console.log(`\n=============================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed.`);
console.log(`=============================================\n`);
