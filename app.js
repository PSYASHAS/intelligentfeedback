/**
 * Mistake-to-Mastery Platform (app.js)
 * Grounded in: "Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback" (Akbar 2025)
 * Focus: 1st Semester C Programming Language (C99 / C11), Bloom's Taxonomy, AI-Solvability, and 4-Part Formative Feedback.
 */

// --- BLOOM'S TAXONOMY METADATA ---
const BLOOM_LEVELS = {
  remember: { name: 'Remember', order: 1, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'Recall C syntax, headers & primitives' },
  understand: { name: 'Understand', order: 2, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', desc: 'Trace pointer/array bounds & logic execution' },
  apply: { name: 'Apply', order: 3, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Implement standard algorithms in C' },
  analyse: { name: 'Analyse', order: 4, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Debug memory boundaries, off-by-one & logic flaws' },
  evaluate: { name: 'Evaluate', order: 5, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', desc: 'Judge memory footprint & algorithmic efficiency' },
  create: { name: 'Create', order: 6, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', desc: 'Design original modular programs in C' }
};

// --- SEMESTER 1 (BEGINNER) C CODING CHALLENGES ---
const BEGINNER_CHALLENGES = {
  find_max: {
    id: 'find_max',
    title: 'Lab 1: Find Maximum Number in an Array (C Language)',
    targetTopic: 'Arrays, Loop Traversal, and Integer Limits in C',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: 52,
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `A 1st-semester student wrote a C function \`int findMax(int numbers[], int size)\` to find the largest integer in an array.\n\nHowever, their C code contains a **classic beginner mistake**: it works for positive numbers like \`{3, 7, 2, 9}\`, but fails completely when all numbers in the array are negative (e.g., \`{-8, -3, -10}\`).\n\n**Your Tasks:**\n1. **Identify the mistake**: Why does initializing \`int max = 0;\` fail when all integers are negative?\n2. **Correct the code**: Update line 12 so that \`max\` is initialized using the first element of the array.\n3. **Test edge cases**: Verify your fix handles all-negative arrays and single-element arrays in C.`,
    starterCode: `#include <stdio.h>

/**
 * Lab 1: Find the largest number in the array.
 * Notice the beginner mistake below:
 */
int findMax(int numbers[], int size) {
    if (size <= 0) {
        return 0; // Empty array guard
    }

    // MISTAKE HERE: Initializing to 0 fails when all numbers are negative!
    int max = 0;

    for (int i = 0; i < size; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
} `,
    correctCode: `#include <stdio.h>

/**
 * Lab 1: Correct Solution - Find Maximum Number in an Array
 * Initializing max with numbers[0] handles both positive and negative integers.
 */
int findMax(int numbers[], int size) {
    if (size <= 0) {
        return 0; // Empty array guard
    }

    // CORRECT: Initializing to numbers[0] handles negative numbers properly
    int max = numbers[0];

    for (int i = 1; i < size; i++) {
        if (numbers[i] > max) {
            max = numbers[i];
        }
    }

    return max;
}`,
    flawExplanation: {
      identifiedMistake: "Line 12 initializes `int max = 0;`. If all numbers in the array are negative (e.g. {-8, -3, -10}), `max` remains 0, which is incorrect because 0 was never in the array!",
      rootCause: "Mental model assumption that numbers are always positive, failing to consider negative integers.",
      remediationSuggestion: "Initialize `int max = numbers[0];` (the first element of the array) instead of 0."
    },
    testCases: [
      { id: 1, name: 'Positive numbers {3, 7, 2, 9}', input: '{3, 7, 2, 9}, size = 4', expected: '9', execute: (fn) => fn([3, 7, 2, 9], 4), check: (act) => act === 9 },
      { id: 2, name: 'All negative numbers {-8, -3, -10}', input: '{-8, -3, -10}, size = 3', expected: '-3', execute: (fn) => fn([-8, -3, -10], 3), check: (act) => act === -3 },
      { id: 3, name: 'Single negative number {-42}', input: '{-42}, size = 1', expected: '-42', execute: (fn) => fn([-42], 1), check: (act) => act === -42 },
      { id: 4, name: 'Mixed numbers {-5, 0, 12, -2}', input: '{-5, 0, 12, -2}, size = 4', expected: '12', execute: (fn) => fn([-5, 0, 12, -2], 4), check: (act) => act === 12 }
    ],
    educatorFeedback: {
      strength: "Tests array indexing `numbers[i]`, loop condition `i < size`, and conditional updates in C.",
      limitation: "Asking only for standard max code is easy for AI (85% solvability).",
      enhancement: "By providing the negative-number bug and asking students to explain why `max = numbers[0]` is safer (Analyse), AI solvability drops to 52%."
    },
    reflectionPrompt: "In C, why is initializing `int max = numbers[0];` safer than writing `int max = -999999;`?"
  },

  count_vowels: {
    id: 'count_vowels',
    title: 'Lab 2: Count Vowels in a String (C Character Handling)',
    targetTopic: 'C Strings (char arrays), <ctype.h>, and ASCII Encoding',
    bloomLevel: 'apply',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: 68,
    aiSolvabilityCategory: 'Medium-High (65–74%)',
    description: `Write a C function \`int countVowels(char text[])\` that counts vowels (a, e, i, o, u) in a null-terminated C string.\n\n**The Beginner Mistake in Starter Code:**\nThe starter C code only checks lowercase characters: \`ch == 'a' || ch == 'e' ...\`. In C, character comparisons compare ASCII integer values (\`'A'\` is 65, while \`'a'\` is 97). Because \`'A' == 'a'\` is false, the function completely misses uppercase vowels in words like \`"Apple"\` and \`"PROGRAMMING"\`.\n\n**Your Tasks:**\n1. Ensure case insensitivity using the \`tolower()\` function from \`<ctype.h>\` (or by checking uppercase characters).\n2. Verify that both uppercase and lowercase vowels are counted correctly.`,
    starterCode: `#include <stdio.h>
#include <ctype.h>

/**
 * Lab 2: Count vowels (a, e, i, o, u) in a C string.
 * Bug: The code fails on uppercase letters like "Apple" and "PROGRAMMING".
 */
int countVowels(char text[]) {
    int count = 0;

    // Traverses until the null-terminator '\0'
    for (int i = 0; text[i] != '\\0'; i++) {
        char ch = text[i];
        
        // MISTAKE: Only checks lowercase 'a', 'e', 'i', 'o', 'u'
        // Misses uppercase vowels like 'A', 'E', 'I', 'O', 'U'
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            count++;
        }
    }

    return count;
}`,
    correctCode: `#include <stdio.h>
#include <ctype.h>

/**
 * Lab 2: Correct Solution - Count Vowels in a String
 * Handles case insensitivity using tolower() from <ctype.h>.
 */
int countVowels(char text[]) {
    int count = 0;

    // Traverses until the null-terminator '\\0'
    for (int i = 0; text[i] != '\\0'; i++) {
        char ch = tolower(text[i]);
        
        // CORRECT: Checks lowercase and uppercase vowels uniformly
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            count++;
        }
    }

    return count;
}`,
    flawExplanation: {
      identifiedMistake: "Line 16 only checks lowercase characters ('a', 'e', 'i', 'o', 'u'). It misses uppercase vowels, returning 1 instead of 2 for 'Apple', and 0 instead of 3 for 'PROGRAMMING'.",
      rootCause: "In C, characters are numeric ASCII values ('A' is 65, 'a' is 97). Because 'A' == 'a' evaluates to false, uppercase letters are skipped.",
      remediationSuggestion: "Use `tolower()` from `<ctype.h>` on line 14: `char ch = tolower(text[i]);`."
    },
    testCases: [
      { id: 1, name: 'Simple lowercase: "hello"', input: '"hello"', expected: '2', execute: (fn) => fn('hello'), check: (act) => act === 2 },
      { id: 2, name: 'Mixed case: "Apple"', input: '"Apple"', expected: '2', execute: (fn) => fn('Apple'), check: (act) => act === 2 },
      { id: 3, name: 'All uppercase: "PROGRAMMING"', input: '"PROGRAMMING"', expected: '3', execute: (fn) => fn('PROGRAMMING'), check: (act) => act === 3 },
      { id: 4, name: 'No vowels: "rhythm"', input: '"rhythm"', expected: '0', execute: (fn) => fn('rhythm'), check: (act) => act === 0 }
    ],
    educatorFeedback: {
      strength: "Reinforces null-terminator loop traversal `text[i] != '\\0'` and `<ctype.h>` library usage.",
      limitation: "AI writes clean C string loops without effort.",
      enhancement: "Testing mixed-case inputs tests student understanding of character representation in C (ASCII byte values)."
    },
    reflectionPrompt: "In C, what is the ASCII value difference between uppercase 'A' and lowercase 'a', and what does `tolower('A')` return?"
  },

  even_sum: {
    id: 'even_sum',
    title: 'Lab 3: Sum of Even Numbers (1-Based Indexing in C)',
    targetTopic: '0-Based Array Bounds and Modulo Operator in C',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: 58,
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `Implement \`int sumEvenNumbers(int arr[], int size)\` to calculate the sum of all positive even integers in an array.\n\n**The Beginner Mistake in Starter Code:**\nA student wrote \`for (int i = 1; i <= size; i++)\`. Because C arrays are 0-indexed, starting at \`i = 1\` **skips the very first element \`arr[0]\`**, and accessing \`arr[size]\` accesses unallocated memory out of bounds! For \`{2, 4, 6}\`, the code skips 2 and returns 10 instead of 12.\n\n**Your Tasks:**\n1. Correct the loop starting index to 0: \`int i = 0\`.\n2. Fix the termination condition to \`i < size\` so all elements from index 0 to size-1 are traversed.`,
    starterCode: `#include <stdio.h>

/**
 * Lab 3: Sum of positive even numbers in C.
 * Bug: Loop starts at i = 1, skipping the first element arr[0]!
 */
int sumEvenNumbers(int arr[], int size) {
    int total = 0;

    // MISTAKE HERE: Starting at i = 1 skips arr[0]!
    // And i <= size causes out-of-bounds array access!
    for (int i = 1; i <= size; i++) {
        int num = arr[i];

        if (num > 0 && num % 2 == 0) {
            total += num;
        }
    }

    return total;
}`,
    correctCode: `#include <stdio.h>

/**
 * Lab 3: Correct Solution - Sum of Even Numbers
 * Uses standard 0-based indexing (i = 0; i < size; i++).
 */
int sumEvenNumbers(int arr[], int size) {
    int total = 0;

    // CORRECT: Loop starts at 0 and ends strictly before size
    for (int i = 0; i < size; i++) {
        int num = arr[i];

        if (num > 0 && num % 2 == 0) {
            total += num;
        }
    }

    return total;
}`,
    flawExplanation: {
      identifiedMistake: "Line 12 starts at `int i = 1` and stops at `i <= size`. This skips `arr[0]`, returning 10 instead of 12 for {2, 4, 6} and 10 instead of 18 for {8, 10}.",
      rootCause: "Confusing 1-based natural counting with 0-based programming array indexing in C.",
      remediationSuggestion: "Change loop header on line 12 to standard 0-based traversal: `for (int i = 0; i < size; i++)`."
    },
    testCases: [
      { id: 1, name: 'Even numbers {2, 4, 6}', input: '{2, 4, 6}, size = 3', expected: '12', execute: (fn) => fn([2, 4, 6], 3), check: (act) => act === 12 },
      { id: 2, name: 'First item is even {8, 10}', input: '{8, 10}, size = 2', expected: '18', execute: (fn) => fn([8, 10], 2), check: (act) => act === 18 },
      { id: 3, name: 'Mixed with odd {1, 2, 3, 4, 5}', input: '{1, 2, 3, 4, 5}, size = 5', expected: '6', execute: (fn) => fn([1, 2, 3, 4, 5], 5), check: (act) => act === 6 },
      { id: 4, name: 'Includes negative evens {-2, 4, -6, 8}', input: '{-2, 4, -6, 8}, size = 4', expected: '12', execute: (fn) => fn([-2, 4, -6, 8], 4), check: (act) => act === 12 }
    ],
    educatorFeedback: {
      strength: "Targets 0-based indexing mental models and accumulator patterns in C.",
      limitation: "Standard loop problems are easily generated by LLMs.",
      enhancement: "Providing the 1-based index bug and asking students to diagnose why `arr[0]` is lost shifts task to Analyse (Level 4)."
    },
    reflectionPrompt: "In C, if an array has 3 elements, what are the valid index numbers, and what happens if you read `arr[3]`?"
  },

  reverse_list: {
    id: 'reverse_list',
    title: 'Lab 4: Reverse an Array in C (Without Library Functions)',
    targetTopic: 'Array Indices, Backward Loops, and Pointer Bounds in C',
    bloomLevel: 'evaluate',
    difficulty: 'Semester 1 — Intermediate C',
    aiSolvability: 46,
    aiSolvabilityCategory: 'Low (<50%)',
    description: `Implement \`void reverseArray(int arr[], int size, int result[])\` to copy the elements of \`arr\` into \`result\` in reverse order.\n\n**The Beginner Mistake in Starter Code:**\nThe loop currently iterates forward (\`for (int i = 0; i < size; i++)\`), which simply makes a duplicate copy of the array (\`{1, 2, 3, 4}\`) instead of reversing it to \`{4, 3, 2, 1}\`.\n\n**Your Tasks:**\n1. Modify the assignment so that \`result[i] = arr[size - 1 - i];\`.\n2. Verify that elements are stored in reverse order in the \`result\` buffer.`,
    starterCode: `#include <stdio.h>

/**
 * Lab 4: Reverse an array into result[] without using library functions.
 * Bug: Forward loop copies elements in original order instead of reverse.
 */
void reverseArray(int arr[], int size, int result[]) {
    // MISTAKE: Forward loop (0 to size - 1) copies forward instead of reversing!
    for (int i = 0; i < size; i++) {
        result[i] = arr[i]; // Copies forward!
    }
}`,
    correctCode: `#include <stdio.h>

/**
 * Lab 4: Correct Solution - Reverse an Array
 * Copies elements backwards into the result buffer using size - 1 - i.
 */
void reverseArray(int arr[], int size, int result[]) {
    // CORRECT: Backward indexing correctly reverses elements into result
    for (int i = 0; i < size; i++) {
        result[i] = arr[size - 1 - i];
    }
}`,
    flawExplanation: {
      identifiedMistake: "Line 9 iterates from 0 to size - 1 and assigns `result[i] = arr[i];`, producing an exact forward copy {1, 2, 3, 4} instead of reversing to {4, 3, 2, 1}.",
      rootCause: "Confusion between forward accumulation and backward indexing using `size - 1 - i`.",
      remediationSuggestion: "Change line 10 to: `result[i] = arr[size - 1 - i];`."
    },
    testCases: [
      { id: 1, name: 'Reversing {1, 2, 3, 4}', input: '{1, 2, 3, 4}, size = 4', expected: '[4, 3, 2, 1]', execute: (fn) => { const r = []; fn([1, 2, 3, 4], 4, r); return r; }, check: (act) => JSON.stringify(act) === JSON.stringify([4, 3, 2, 1]) },
      { id: 2, name: 'Odd-length array {10, 20, 30}', input: '{10, 20, 30}, size = 3', expected: '[30, 20, 10]', execute: (fn) => { const r = []; fn([10, 20, 30], 3, r); return r; }, check: (act) => JSON.stringify(act) === JSON.stringify([30, 20, 10]) },
      { id: 3, name: 'Single item {100}', input: '{100}, size = 1', expected: '[100]', execute: (fn) => { const r = []; fn([100], 1, r); return r; }, check: (act) => JSON.stringify(act) === JSON.stringify([100]) },
      { id: 4, name: 'Two elements {5, 99}', input: '{5, 99}, size = 2', expected: '[99, 5]', execute: (fn) => { const r = []; fn([5, 99], 2, r); return r; }, check: (act) => JSON.stringify(act) === JSON.stringify([99, 5]) }
    ],
    educatorFeedback: {
      strength: "Demands conceptual understanding of array index arithmetic `size - 1 - i` in C.",
      limitation: "Students may just copy elements forward if they do not trace indices.",
      enhancement: "Comparing `result[size - 1 - i]` with in-place two-pointer swapping pushes cognitive level to Evaluate (Level 5)."
    },
    reflectionPrompt: "In C, explain how the index formula `size - 1 - i` maps the first element (i=0) to the last element of the array."
  }
};

// --- APPLICATION STATE ---
let currentChallengeKey = 'find_max';
let currentChallenge = BEGINNER_CHALLENGES.find_max;
let currentMode = 'student'; // 'student' | 'educator'
let currentCodeMode = 'buggy'; // 'buggy' | 'correct'

const masteryTracker = {
  find_max: 'identified',
  count_vowels: 'identified',
  even_sum: 'identified',
  reverse_list: 'identified'
};

let currentFeedbackReport = null;

// --- INITIALIZATION ---
function init() {
  renderChallenge(currentChallenge);
  setupLineNumbers();
  updateMasteryBadge();
  init3DCardTilt();
  lucide.createIcons();
}

function switchChallenge(key) {
  currentChallengeKey = key;
  currentChallenge = BEGINNER_CHALLENGES[key] || BEGINNER_CHALLENGES.find_max;
  currentCodeMode = 'buggy';
  const btnBuggy = document.getElementById('btnBuggyMode');
  const btnCorrect = document.getElementById('btnCorrectMode');
  if (btnBuggy) btnBuggy.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm";
  if (btnCorrect) btnCorrect.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition text-slate-400 hover:text-slate-200";

  renderChallenge(currentChallenge);
  resetStarterCode();
  resetFeedbackUI();
  updateMasteryBadge();
  renderEducatorBreakdown();
  lucide.createIcons();
}

function setViewMode(mode) {
  currentMode = mode;
  const studentBtn = document.getElementById('modeStudentBtn');
  const educatorBtn = document.getElementById('modeEducatorBtn');
  const studentStudio = document.getElementById('studentStudioView');
  const educatorStudio = document.getElementById('educatorStudioView');

  if (mode === 'student') {
    studentBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#65c994] text-[#132319] shadow transition";
    educatorBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#282a2c] transition";
    studentStudio.classList.remove('hidden');
    educatorStudio.classList.add('hidden');
  } else {
    educatorBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#65c994] text-[#132319] shadow transition";
    studentBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#282a2c] transition";
    studentStudio.classList.add('hidden');
    educatorStudio.classList.remove('hidden');
    renderEducatorBreakdown();
  }
  lucide.createIcons();
}

function renderChallenge(c) {
  document.getElementById('problemTitle').innerText = c.title;
  document.getElementById('topicBadgeText').innerText = 'Topic: ' + c.targetTopic;
  
  const labName = document.getElementById('workspaceLabName');
  if (labName) labName.innerText = c.title;

  const bloomMeta = BLOOM_LEVELS[c.bloomLevel] || BLOOM_LEVELS.apply;
  const bloomBadge = document.getElementById('bloomBadge');
  bloomBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bloomMeta.color}`;
  bloomBadge.innerHTML = `<i data-lucide="brain" class="w-3.5 h-3.5"></i><span>Bloom: ${bloomMeta.name}</span>`;

  document.getElementById('difficultyBadge').innerText = c.difficulty;
  document.getElementById('problemDescription').innerText = c.description;

  // Mistake Spotlight Card
  document.getElementById('mistakeIdentifiedPreview').innerText = c.flawExplanation.identifiedMistake;

  // Dynamic Edge Cases Preview in C syntax
  const previewContainer = document.getElementById('testCasePreviewContainer');
  if (previewContainer && c.testCases) {
    previewContainer.innerHTML = c.testCases.map(tc => `
      <div class="p-2.5 rounded-xl bg-[#101113] border border-[#303236] flex items-center justify-between">
        <span class="text-slate-400">${tc.name}: <code class="text-slate-200">${tc.input}</code></span>
        <span class="text-[#82dfad] font-semibold">Exp: ${tc.expected}</span>
      </div>
    `).join('');
  }

  // Reflection Modal prompt text
  const reflectionText = document.getElementById('reflectionQuestionText');
  if (reflectionText && c.reflectionPrompt) {
    reflectionText.innerText = c.reflectionPrompt;
  }

  resetStarterCode();
}

function setCodeMode(mode) {
  currentCodeMode = mode;
  const btnBuggy = document.getElementById('btnBuggyMode');
  const btnCorrect = document.getElementById('btnCorrectMode');
  const editor = document.getElementById('codeEditor');

  if (mode === 'correct') {
    if (btnBuggy) btnBuggy.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition text-slate-400 hover:text-slate-200";
    if (btnCorrect) btnCorrect.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm";
    
    editor.value = currentChallenge.correctCode || currentChallenge.starterCode;
    updateLineNumbers();
    resetFeedbackUI();
  } else {
    if (btnBuggy) btnBuggy.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm";
    if (btnCorrect) btnCorrect.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition text-slate-400 hover:text-slate-200";

    editor.value = currentChallenge.starterCode;
    updateLineNumbers();
    resetFeedbackUI();
  }
}

function resetStarterCode() {
  setCodeMode('buggy');
}

function setupLineNumbers() {
  const editor = document.getElementById('codeEditor');
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });
}

function updateLineNumbers() {
  const editor = document.getElementById('codeEditor');
  const lines = editor.value.split('\n').length;
  const gutter = document.getElementById('lineNumbers');
  gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
}

// --- MISTAKE-TO-MASTERY TRACKER STATE ---
function updateMasteryBadge() {
  const stage = masteryTracker[currentChallengeKey] || 'identified';
  const steps = ['identified', 'corrected', 'practised', 'mastered'];

  steps.forEach((s) => {
    const el = document.getElementById(`step-${s}`);
    if (el) {
      if (s === stage) {
        el.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#65c994] text-[#132319] shadow-md ring-2 ring-[#65c994]/40 transition";
      } else if (steps.indexOf(s) < steps.indexOf(stage)) {
        el.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#243d30] text-[#8ae0b3] border border-[#3b644b] transition";
      } else {
        el.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-400 bg-[#202124] border border-[#343639] transition";
      }
    }
  });
}

function advanceMastery(nextStage) {
  masteryTracker[currentChallengeKey] = nextStage;
  updateMasteryBadge();
}

// --- C CODE TO JAVASCRIPT SIMULATION TRANSPILER ---
function compileAndRunC(cCode) {
  // Transpile C code for client-side test execution
  let js = cCode
    // Remove headers
    .replace(/#include\s*<.*?>/g, '')
    // Map C function headers
    .replace(/\bint\s+findMax\s*\([^)]*\)/g, 'function findMax(numbers, size)')
    .replace(/\bint\s+countVowels\s*\([^)]*\)/g, 'function countVowels(text)')
    .replace(/\bint\s+sumEvenNumbers\s*\([^)]*\)/g, 'function sumEvenNumbers(arr, size)')
    .replace(/\bvoid\s+reverseArray\s*\([^)]*\)/g, 'function reverseArray(arr, size, result)')
    // Map C library functions & idioms
    .replace(/tolower\s*\((.*?)\)/g, '($1.toLowerCase ? $1.toLowerCase() : String.fromCharCode($1).toLowerCase())')
    .replace(/\[i\]\s*!=\s*['"]\\0['"]/g, '.length > i')
    .replace(/text\[i\]\s*!=\s*['"]\\0['"]/g, 'i < text.length')
    .replace(/text\[i\]\s*!=\s*0/g, 'i < text.length')
    .replace(/strlen\s*\((.*?)\)/g, '$1.length')
    // Map primitive types to let
    .replace(/\bint\s+/g, 'let ')
    .replace(/\bchar\s+/g, 'let ')
    .replace(/\bfloat\s+/g, 'let ')
    .replace(/\bdouble\s+/g, 'let ');

  const fnName = currentChallengeKey === 'find_max' ? 'findMax' :
                 currentChallengeKey === 'count_vowels' ? 'countVowels' :
                 currentChallengeKey === 'even_sum' ? 'sumEvenNumbers' : 'reverseArray';

  const sandbox = new Function(`${js}; return ${fnName};`);
  return sandbox();
}

// --- TEST RUNNER & FORMATIVE FEEDBACK GENERATOR ---
function runTestsAndEvaluate() {
  const code = document.getElementById('codeEditor').value;
  const drawerBody = document.getElementById('testResultsBody');
  const title = document.getElementById('testDrawerTitle');

  let studentFn = null;
  try {
    studentFn = compileAndRunC(code);
  } catch (err) {
    drawerBody.innerHTML = `
      <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs sm:text-sm">
        <strong class="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
          <i data-lucide="alert-octagon" class="w-4 h-4"></i>
          C Compilation / Syntax Error
        </strong>
        <span>${err.message}</span>
      </div>`;
    title.innerText = 'Test Suite (C Compilation Error)';
    lucide.createIcons();
    return;
  }

  let passedCount = 0;
  const cards = currentChallenge.testCases.map((tc) => {
    let passed = false;
    let actualOutput = 'Error';
    try {
      const rawVal = tc.execute(studentFn);
      passed = tc.check(rawVal);
      actualOutput = typeof rawVal === 'object' ? JSON.stringify(rawVal) : String(rawVal);
    } catch (e) {
      actualOutput = 'Runtime Error: ' + e.message;
      passed = false;
    }
    if (passed) passedCount++;

    return `
      <div class="p-3 rounded-xl border text-xs sm:text-sm font-code transition ${passed ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-rose-950/20 border-rose-500/30 text-slate-200'}">
        <div class="flex items-center justify-between font-sans mb-1.5">
          <span class="font-bold flex items-center gap-1.5 ${passed ? 'text-emerald-400' : 'text-rose-400'}">
            <i data-lucide="${passed ? 'check-circle-2' : 'x-circle'}" class="w-4 h-4"></i>
            ${tc.name}
          </span>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full uppercase ${passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
            ${passed ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <div class="text-xs text-slate-300 space-y-1">
          <div><span class="text-slate-500 font-sans">Input: </span><code class="text-slate-200">${tc.input}</code></div>
          <div><span class="text-slate-500 font-sans">Expected: </span><span class="text-emerald-400 font-semibold">${tc.expected}</span></div>
          <div><span class="text-slate-500 font-sans">Actual: </span><span class="${passed ? 'text-emerald-400' : 'text-rose-400 font-bold'}">${actualOutput}</span></div>
        </div>
      </div>
    `;
  });

  drawerBody.innerHTML = cards.join('');
  const total = currentChallenge.testCases.length;
  title.innerText = `Test Suite Execution (${passedCount}/${total} Passed)`;
  lucide.createIcons();

  // Generate 4-Part Formative Feedback that matches the C code accurately
  generateFormativeFeedback(code, passedCount, total);

  // Advance Progress Tracker
  if (passedCount === total) {
    advanceMastery('practised');
  } else if (passedCount > 0) {
    advanceMastery('corrected');
  }
}

// --- 4-PART FORMATIVE FEEDBACK ENGINE (C LANGUAGE SPECIFIC) ---
function generateFormativeFeedback(code, passed, total) {
  let wellDone = "";
  let problem = "";
  let why = "";
  let improvement = "";
  let nextStep = "";

  // ================= LAB 1: FIND MAX IN C =================
  if (currentChallengeKey === 'find_max') {
    const hasMaxZero = /int\s+max\s*=\s*0/.test(code);

    if (passed === total) {
      wellDone = "Outstanding! You correctly initialized `int max = numbers[0];` to safely handle negative integers and maintained clean C loop bounds.";
      problem = "None detected. All positive, negative, and single-element C arrays pass cleanly.";
      why = "In C, by setting `max` to the first element `numbers[0]`, your comparison invariant holds true across the entire integer range (-2,147,483,648 to +2,147,483,647).";
      improvement = "Ready for the Socratic reflection: explain why this approach avoids magic numbers like `-999999`.";
      nextStep = "Click 'Mastery Check' to record your reasoning and claim Mastered status 🏆";
    } else if (hasMaxZero) {
      wellDone = "Your `for (int i = 0; i < size; i++)` loop iterates correctly through the array and compares elements with `numbers[i] > max`. It works for positive numbers like {3, 7, 2, 9}.";
      problem = "Failed on all-negative arrays: `{-8, -3, -10}` returned `0` instead of `-3`, and `{-42}` returned `0` instead of `-42`.";
      why = "You initialized `int max = 0;` on line 12. In C, because 0 is larger than all negative integers, `numbers[i] > max` is never true, so `max` remains 0. But 0 is not even in the array!";
      improvement = "Initialize `max` using the first element of the array: `int max = numbers[0];` so that `max` starts with a real value from the dataset.";
      nextStep = "Change line 12 to `int max = numbers[0];` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Good effort setting up the C function structure and array traversal.";
      problem = `Passed ${passed} of ${total} test cases. Check edge case handling for negative integers.`;
      why = "Ensure your comparison logic `numbers[i] > max` accurately tracks the largest value.";
      improvement = "Initialize `int max = numbers[0];` and loop from `int i = 1; i < size; i++`.";
      nextStep = "Test with `{-8, -3, -10}` and verify the output is `-3`.";
    }
  }

  // ================= LAB 2: COUNT VOWELS IN C =================
  else if (currentChallengeKey === 'count_vowels') {
    const hasToLower = /tolower\s*\(/.test(code);
    const checksUpperExplicitly = /'A'|'E'|'I'|'O'|'U'/.test(code);

    if (passed === total) {
      wellDone = hasToLower
        ? "Outstanding! You used the C standard library function `tolower()` from `<ctype.h>`, ensuring both uppercase ('A', 'E') and lowercase vowels are counted uniformly."
        : "Great job! You expanded your condition so both uppercase and lowercase vowels are correctly identified.";
      problem = "None! Handled lowercase (\"hello\"), mixed case (\"Apple\"), all uppercase (\"PROGRAMMING\"), and no vowels (\"rhythm\") cleanly.";
      why = "In C, converting characters with `tolower()` normalizes ASCII byte values (turning 'A' [65] into 'a' [97]) before equality checks.";
      improvement = "Clean C tip: Notice how `<ctype.h>` simplifies character checks without writing 10 separate || conditions!";
      nextStep = "Click 'Mastery Check' to explain character representation in C and claim Mastered status 🏆";
    } else if (!hasToLower && !checksUpperExplicitly) {
      wellDone = "Your `text[i] != '\\0'` loop correctly traverses the C-string up to the null-terminator and counts lowercase vowels (like in \"hello\" [2] and \"rhythm\" [0]).";
      problem = "Failed on uppercase inputs: \"Apple\" returned 1 instead of 2 (missed capital 'A'), and \"PROGRAMMING\" returned 0 instead of 3 (missed 'O', 'A', 'I').";
      why = "In C, characters are ASCII byte values: `'A'` is 65 and `'a'` is 97, so `'A' == 'a'` evaluates to false. Because line 17 only checks lowercase `'a', 'e', 'i', 'o', 'u'`, uppercase vowels are skipped.";
      improvement = "Use `tolower()` from `<ctype.h>` on line 14: `char ch = tolower(text[i]);` before testing vowels.";
      nextStep = "Change line 14 to `char ch = tolower(text[i]);` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "C-string traversal loop is in place.";
      problem = `Passed ${passed} of ${total} tests. Review the failing inputs in the test results below.`;
      why = "Ensure you check for all 5 vowels (a, e, i, o, u) and handle both uppercase and lowercase forms.";
      improvement = "Use `char ch = tolower(text[i]);` and check `ch == 'a' || ch == 'e' ...`.";
      nextStep = "Re-run tests after verifying character comparison checks.";
    }
  }

  // ================= LAB 3: EVEN SUM IN C =================
  else if (currentChallengeKey === 'even_sum') {
    const hasOneBasedIndex = /for\s*\(\s*int\s+i\s*=\s*1\s*;/.test(code);

    if (passed === total) {
      wellDone = "Great work! Your loop starts at index 0 and accurately sums positive even integers while filtering out odd and negative numbers.";
      problem = "No errors detected. Handled even numbers, negative evens, and mixed inputs correctly.";
      why = "In C, 0-based indexing (`i = 0; i < size`) guarantees that every element—from `arr[0]` to `arr[size - 1]`—is safely visited without out-of-bounds access.";
      improvement = "Good practice: Notice that in C, we always pass `int size` alongside `int arr[]` because C arrays do not carry a `.length` property.";
      nextStep = "Complete the Mastery Check reflection on 0-based array indexing in C.";
    } else if (hasOneBasedIndex) {
      wellDone = "Your modulo check `num > 0 && num % 2 == 0` correctly identifies positive even integers.";
      problem = "Failed on `{2, 4, 6}` (returned 10 instead of 12) and `{8, 10}` (returned 10 instead of 18). The very first item at `arr[0]` was skipped!";
      why = "You initialized the loop at `int i = 1` on line 12. In C, arrays are 0-indexed: the first element is at `arr[0]`. Starting at `i = 1` skips `arr[0]` completely, and `i <= size` reads out of bounds!";
      improvement = "Change the loop header from `int i = 1; i <= size` to standard 0-based traversal: `for (int i = 0; i < size; i++)`.";
      nextStep = "Change line 12 to `for (int i = 0; i < size; i++)` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Accumulator setup is ready.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Ensure you check both `num > 0` and `num % 2 == 0`.";
      improvement = "Verify that negative even numbers (like -2, -6) are not added to the total.";
      nextStep = "Test with `{-2, 4, -6, 8}` to verify that only 4 and 8 are summed.";
    }
  }

  // ================= LAB 4: REVERSE LIST IN C =================
  else {
    const hasForwardLoop = /result\[i\]\s*=\s*arr\[i\]/.test(code);

    if (passed === total) {
      wellDone = "Superb! You reversed the C array by calculating `arr[size - 1 - i]` and populated the `result[]` buffer correctly.";
      problem = "Zero flaws. Odd-length, single-element, and multi-element C arrays reversed correctly.";
      why = "Using the index mapping `result[i] = arr[size - 1 - i]` places the last element into index 0, reversing the sequence in a clean single pass.";
      improvement = "Advanced C tip: In C, you could also reverse in-place by swapping `arr[start]` and `arr[end]` with a temporary variable to save memory!";
      nextStep = "Proceed to the reflection to evaluate memory usage between new buffer vs in-place swap in C.";
    } else if (hasForwardLoop) {
      wellDone = "Array initialization and function signature are ready.";
      problem = "The array is not reversed. For `{1, 2, 3, 4}`, your code produced `{1, 2, 3, 4}` (an exact forward copy).";
      why = "Your assignment on line 10 assigns `result[i] = arr[i]`. This copies items from left to right in original order instead of reverse.";
      improvement = "Map the index from the back: `result[i] = arr[size - 1 - i];` so that when `i = 0`, it takes `arr[size - 1]` (the last element).";
      nextStep = "Change line 10 to `result[i] = arr[size - 1 - i];` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Function structure is in place.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Make sure each index `i` reads from `size - 1 - i`.";
      improvement = "Check your index formula: `result[i] = arr[size - 1 - i];`.";
      nextStep = "Re-run tests after adjusting the index calculation.";
    }
  }

  currentFeedbackReport = {
    passed,
    total,
    score: Math.round((passed / total) * 100),
    wellDone,
    problem,
    why,
    improvement,
    nextStep
  };

  renderFormativeFeedbackUI();
}

function renderFormativeFeedbackUI() {
  const container = document.getElementById('formativeFeedbackContent');
  if (!currentFeedbackReport) return;

  const f = currentFeedbackReport;
  const isPerfect = f.passed === f.total;

  container.innerHTML = `
    <div class="space-y-4 animate-in fade-in duration-200">
      <!-- Status Banner -->
      <div class="flex items-center justify-between p-4 rounded-2xl border ${isPerfect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 shadow-lg' : 'bg-amber-950/30 border-amber-500/40 text-amber-200 shadow-lg'}">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl ${isPerfect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
            <i data-lucide="${isPerfect ? 'check-circle-2' : 'alert-circle'}" class="w-6 h-6"></i>
          </div>
          <div>
            <h4 class="font-extrabold text-sm sm:text-base">${isPerfect ? 'All Tests Passed! Ready for Mastery Reflection' : 'Mistake Diagnosed — Fix Required'}</h4>
            <p class="text-xs text-slate-300 mt-0.5">${f.passed} of ${f.total} automated test invariants passing</p>
          </div>
        </div>
        <span class="font-mono text-lg font-extrabold px-3 py-1 rounded-xl bg-slate-950/80 border ${isPerfect ? 'text-emerald-400 border-emerald-500/30' : 'text-amber-400 border-amber-500/30'}">${f.score}%</span>
      </div>

      <!-- 1. What did I do well? -->
      <div class="bg-[#101113] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-[#243d30] text-[#8ae0b3]">
            <i data-lucide="thumbs-up" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-[#8ae0b3] tracking-wider">1. What did I do well?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.wellDone}</p>
      </div>

      <!-- 2. What is the problem? -->
      <div class="bg-[#101113] border border-rose-500/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-rose-500/20 text-rose-400">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-rose-400 tracking-wider">2. What is the problem?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.problem}</p>
      </div>

      <!-- 3. Why did it happen? -->
      <div class="bg-[#101113] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <i data-lucide="zap" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-amber-400 tracking-wider">3. Why did it happen? (Root Misconception)</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.why}</p>
      </div>

      <!-- 4. How can I improve? & Next Step -->
      <div class="bg-gradient-to-br from-[#243d30]/30 to-[#101113] border border-[#3b644b]/40 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-[#243d30] text-[#8ae0b3]">
            <i data-lucide="compass" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-[#8ae0b3] tracking-wider">4. How can I improve?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.improvement}</p>
        <div class="mt-3 pt-3 border-t border-[#3b644b]/30 flex items-start gap-2 text-xs sm:text-sm text-[#a8e7c3]">
          <strong class="font-bold text-[#8ae0b3] flex-shrink-0">Next Action:</strong>
          <span>${f.nextStep}</span>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function resetFeedbackUI() {
  currentFeedbackReport = null;
  document.getElementById('formativeFeedbackContent').innerHTML = `
    <div class="py-12 text-center text-slate-500 space-y-2.5">
      <div class="p-3 rounded-2xl bg-[#101113] inline-block border border-[#303236]">
        <i data-lucide="sparkles" class="w-8 h-8 text-[#8ae0b3]"></i>
      </div>
      <p class="text-slate-200 font-semibold text-sm">Ready to Diagnose Your C Solution</p>
      <p class="text-xs text-[#90948f] max-w-sm mx-auto leading-relaxed">
        Click <strong class="text-[#8ae0b3] font-semibold">Run Tests & Diagnose</strong> above to evaluate your C code against boundary tests and receive structured formative feedback.
      </p>
    </div>
  `;
  document.getElementById('testDrawerTitle').innerText = 'Test Suite (Ready to Run)';
  document.getElementById('testResultsBody').innerHTML = '<p class="text-slate-500 text-center py-2 text-xs">Click "Run Tests & Diagnose" to evaluate your C code.</p>';
  lucide.createIcons();
}

// --- EDUCATOR DESIGN STUDIO & BLOOM'S BREAKDOWN ---
function renderEducatorBreakdown() {
  const current = currentChallenge;
  document.getElementById('eduQuestionTitle').innerText = current.title;
  document.getElementById('eduTargetTopic').innerText = 'Topic: ' + current.targetTopic;
  document.getElementById('eduBloomLevel').innerText = current.bloomLevel.toUpperCase();
  
  // Solvability meter
  const meter = document.getElementById('eduSolvabilityMeter');
  const badge = document.getElementById('eduSolvabilityBadge');
  meter.style.width = `${current.aiSolvability}%`;
  badge.innerText = `${current.aiSolvability}% — ${current.aiSolvabilityCategory}`;

  if (current.aiSolvability > 74) {
    badge.className = "font-bold text-rose-400";
    meter.className = "h-3 rounded-full bg-rose-500 transition-all duration-300";
  } else if (current.aiSolvability >= 65) {
    badge.className = "font-bold text-amber-400";
    meter.className = "h-3 rounded-full bg-amber-500 transition-all duration-300";
  } else if (current.aiSolvability >= 50) {
    badge.className = "font-bold text-cyan-400";
    meter.className = "h-3 rounded-full bg-cyan-500 transition-all duration-300";
  } else {
    badge.className = "font-bold text-emerald-400";
    meter.className = "h-3 rounded-full bg-emerald-500 transition-all duration-300";
  }

  // Educator Design Feedback Cards
  document.getElementById('eduFeedbackStrength').innerText = current.educatorFeedback.strength;
  document.getElementById('eduFeedbackLimitation').innerText = current.educatorFeedback.limitation;
  document.getElementById('eduFeedbackEnhancement').innerText = current.educatorFeedback.enhancement;

  lucide.createIcons();
}

// --- SOCRATIC MASTERY REFLECTION MODAL ---
function openReflectionModal() {
  const modal = document.getElementById('reflectionModal');
  modal.classList.remove('hidden');
  document.getElementById('reflectionQuestionText').innerText = currentChallenge.reflectionPrompt;
  document.getElementById('reflectionInput').value = '';
  document.getElementById('reflectionFeedback').classList.add('hidden');
  lucide.createIcons();
}

function closeReflectionModal() {
  document.getElementById('reflectionModal').classList.add('hidden');
}

function submitReflectionAnswer() {
  const ans = document.getElementById('reflectionInput').value.trim();
  const feedbackBox = document.getElementById('reflectionFeedback');
  const feedbackText = document.getElementById('reflectionFeedbackText');

  if (ans.length < 15) {
    feedbackBox.className = "p-3.5 rounded-xl border bg-amber-950/30 border-amber-500/40 text-amber-300 text-xs sm:text-sm";
    feedbackText.innerText = "Please provide a more detailed conceptual explanation (at least one complete sentence) to demonstrate mastery.";
    feedbackBox.classList.remove('hidden');
    return;
  }

  // Accepted
  advanceMastery('mastered');
  feedbackBox.className = "p-3.5 rounded-xl border bg-emerald-950/30 border-emerald-500/40 text-emerald-300 text-xs sm:text-sm";
  feedbackText.innerText = "Verified! Your reasoning demonstrates authentic understanding of the core C concept. Stage updated to: Concept Mastered 🏆";
  feedbackBox.classList.remove('hidden');

  setTimeout(() => {
    closeReflectionModal();
  }, 1800);
}

// --- SUBTLE 3D CARD TILT ON HOVER (MODERN SAAS AESTHETIC) ---
function init3DCardTilt() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    let bounds = null;

    card.addEventListener('mouseenter', () => {
      bounds = card.getBoundingClientRect();
      card.classList.remove('tilt-reset');
    });

    card.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const halfWidth = bounds.width / 2;
      const halfHeight = bounds.height / 2;

      // Subtle tilt: max +/- 3.5 degrees
      const rotateX = ((mouseY - halfHeight) / halfHeight) * -3.5;
      const rotateY = ((mouseX - halfWidth) / halfWidth) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      card.style.boxShadow = `0 ${Math.abs(rotateX) * 2 + 12}px 32px rgba(0, 0, 0, 0.38), 0 0 20px rgba(101, 201, 148, 0.06)`;
    });

    card.addEventListener('mouseleave', () => {
      bounds = null;
      card.classList.add('tilt-reset');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.boxShadow = '';
    });
  });
}

// Start
if (typeof window !== 'undefined') {
  window.onload = init;
}
