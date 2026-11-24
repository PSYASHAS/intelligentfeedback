/**
 * Mistake-to-Mastery Platform (app.js)
 * Grounded in: "Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback" (Akbar 2025)
 * Focus: 1st Semester Beginner Coding, Bloom's Taxonomy, AI-Solvability, and 4-Part Formative Feedback.
 */

// --- BLOOM'S TAXONOMY METADATA ---
const BLOOM_LEVELS = {
  remember: { name: 'Remember', order: 1, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', desc: 'Recall syntax & language basics' },
  understand: { name: 'Understand', order: 2, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', desc: 'Explain how code logic executes' },
  apply: { name: 'Apply', order: 3, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Write code to solve straightforward problems' },
  analyse: { name: 'Analyse', order: 4, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Find logical bugs & explain root causes' },
  evaluate: { name: 'Evaluate', order: 5, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', desc: 'Compare approaches & justify tradeoffs' },
  create: { name: 'Create', order: 6, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', desc: 'Design original multi-step programs' }
};

// --- SEMESTER 1 (BEGINNER) CODING CHALLENGES ---
const BEGINNER_CHALLENGES = {
  find_max: {
    id: 'find_max',
    title: 'Lab 1: Find Maximum Number in an Array',
    targetTopic: 'Loops, Conditionals, and Array Traversals',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 52,
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `A 1st-semester student wrote a function \`findMax(numbers)\` to find the largest number in a list.\n\nHowever, their code contains a **classic beginner mistake**: it works for positive numbers like \`[3, 7, 2, 9]\`, but fails completely when all numbers in the list are negative (e.g., \`[-8, -3, -10]\`).\n\n**Your Tasks:**\n1. **Identify the mistake**: Why does initializing max to 0 cause errors with negative values?\n2. **Correct the code**: Update the initialization so it handles any list of numbers.\n3. **Test edge cases**: Verify your fix with all-negative lists and single-element lists.`,
    starterCode: `/**
 * Lab 1: Find the largest number in the array.
 * Notice the beginner mistake below:
 */
function findMax(numbers) {
  if (!numbers || numbers.length === 0) {
    return null;
  }

  // MISTAKE HERE: Initializing to 0 fails when all numbers are negative!
  let max = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }

  return max;
}`,
    flawExplanation: {
      identifiedMistake: "Line 11 initializes `let max = 0`. If all numbers in the array are negative (e.g. [-8, -3, -10]), `max` remains 0, which is incorrect because 0 was never in the array!",
      rootCause: "Mental model assumption that numbers are always positive, failing to consider negative integers.",
      remediationSuggestion: "Initialize `let max = numbers[0]` (the first element of the array) instead of 0."
    },
    testCases: [
      { id: 1, name: 'Positive numbers [3, 7, 2, 9]', input: '[3, 7, 2, 9]', expected: '9', execute: (fn) => fn([3, 7, 2, 9]), check: (act) => act === 9 },
      { id: 2, name: 'All negative numbers [-8, -3, -10]', input: '[-8, -3, -10]', expected: '-3', execute: (fn) => fn([-8, -3, -10]), check: (act) => act === -3 },
      { id: 3, name: 'Single negative number [-42]', input: '[-42]', expected: '-42', execute: (fn) => fn([-42]), check: (act) => act === -42 },
      { id: 4, name: 'Mixed numbers [-5, 0, 12, -2]', input: '[-5, 0, 12, -2]', expected: '12', execute: (fn) => fn([-5, 0, 12, -2]), check: (act) => act === 12 }
    ],
    educatorFeedback: {
      strength: "Tests basic iteration, variable assignment, and condition checks.",
      limitation: "Asking only for standard code is easy for AI (85% solvability).",
      enhancement: "By asking students to explain the negative number bug (Analyse) and test [-8, -3, -10], AI solvability drops to 52%, requiring authentic student reasoning."
    },
    reflectionPrompt: "Why is initializing `max = numbers[0]` safer than initializing `max = -999999`?"
  },

  count_vowels: {
    id: 'count_vowels',
    title: 'Lab 2: Count Vowels in a String (Case-Sensitivity)',
    targetTopic: 'Strings, Conditionals, and Character Encoding',
    bloomLevel: 'apply',
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 68,
    aiSolvabilityCategory: 'Medium-High (65–74%)',
    description: `Write a function \`countVowels(text)\` that counts the number of vowels (a, e, i, o, u) in a string.\n\n**The Beginner Mistake in Starter Code:**\nThe starter function only checks lowercase characters \`'a', 'e', 'i', 'o', 'u'\`. Because character comparisons in JavaScript are case-sensitive (\`'A' === 'a'\` is \`false\`), the function completely misses uppercase vowels in words like \`"Apple"\` and \`"PROGRAMMING"\`.\n\n**Your Tasks:**\n1. Ensure case insensitivity by converting text/characters to lowercase.\n2. Verify that both uppercase and lowercase vowels are counted correctly.`,
    starterCode: `/**
 * Lab 2: Count vowels (a, e, i, o, u) in text.
 * Bug: The code fails on uppercase letters like "Apple" and "PROGRAMMING".
 */
function countVowels(text) {
  if (typeof text !== 'string') return 0;

  let count = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    
    // MISTAKE: Only checks lowercase 'a', 'e', 'i', 'o', 'u'
    // It misses uppercase vowels: 'A', 'E', 'I', 'O', 'U'
    if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') {
      count++;
    }
  }

  return count;
}`,
    flawExplanation: {
      identifiedMistake: "Line 14 only checks lowercase characters ('a', 'e', 'i', 'o', 'u'). It misses uppercase vowels, returning 1 instead of 2 for 'Apple', and 0 instead of 3 for 'PROGRAMMING'.",
      rootCause: "In JavaScript, string comparison is strictly case-sensitive ('A' === 'a' is false). Without case normalization, uppercase letters are skipped.",
      remediationSuggestion: "Normalize case using `const ch = text[i].toLowerCase();` or `text = text.toLowerCase();` before checking."
    },
    testCases: [
      { id: 1, name: 'Simple lowercase: "hello"', input: '"hello"', expected: '2', execute: (fn) => fn('hello'), check: (act) => act === 2 },
      { id: 2, name: 'Mixed case: "Apple"', input: '"Apple"', expected: '2', execute: (fn) => fn('Apple'), check: (act) => act === 2 },
      { id: 3, name: 'All uppercase: "PROGRAMMING"', input: '"PROGRAMMING"', expected: '3', execute: (fn) => fn('PROGRAMMING'), check: (act) => act === 3 },
      { id: 4, name: 'No vowels: "rhythm"', input: '"rhythm"', expected: '0', execute: (fn) => fn('rhythm'), check: (act) => act === 0 }
    ],
    educatorFeedback: {
      strength: "Reinforces character inspection and logical OR conditions.",
      limitation: "AI writes clean string functions easily without human effort.",
      enhancement: "Testing uppercase vs lowercase edge cases forces students to understand character normalization, raising cognitive depth."
    },
    reflectionPrompt: "Explain why `'Apple'[0] === 'a'` evaluates to `false` in JavaScript/Python and how case normalization fixes it."
  },

  even_sum: {
    id: 'even_sum',
    title: 'Lab 3: Sum of Even Numbers (1-Based Indexing Bug)',
    targetTopic: 'Array Indexing, 0-Based Bounds, and Accumulators',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 58,
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `Implement \`sumEvenNumbers(arr)\` to calculate the sum of all positive even integers in an array.\n\n**The Beginner Mistake in Starter Code:**\nA student wrote \`for (let i = 1; i <= arr.length; i++)\`. Because arrays are 0-indexed, starting at \`i = 1\` **skips the very first element \`arr[0]\`**! For \`[2, 4, 6]\`, the code skips 2 and returns 10 instead of 12.\n\n**Your Tasks:**\n1. Correct the loop starting index to 0.\n2. Fix the termination condition to \`i < arr.length\` so all elements are traversed.`,
    starterCode: `/**
 * Lab 3: Sum of positive even numbers.
 * Bug: Loop starts at i = 1, skipping the first element arr[0]!
 */
function sumEvenNumbers(arr) {
  if (!Array.isArray(arr)) return 0;

  let total = 0;

  // MISTAKE HERE: Starting at i = 1 skips arr[0]!
  for (let i = 1; i <= arr.length; i++) {
    const num = arr[i];

    if (num > 0 && num % 2 === 0) {
      total += num;
    }
  }

  return total;
}`,
    flawExplanation: {
      identifiedMistake: "Line 10 starts the loop at `let i = 1` and stops at `i <= arr.length`. This skips the first element at `arr[0]`, returning 10 instead of 12 for `[2, 4, 6]` and 10 instead of 18 for `[8, 10]`.",
      rootCause: "Confusing 1-based natural counting with 0-based programming array indexing.",
      remediationSuggestion: "Change loop header on line 10 to standard 0-based traversal: `for (let i = 0; i < arr.length; i++)`."
    },
    testCases: [
      { id: 1, name: 'Even numbers [2, 4, 6]', input: '[2, 4, 6]', expected: '12', execute: (fn) => fn([2, 4, 6]), check: (act) => act === 12 },
      { id: 2, name: 'First item is even [8, 10]', input: '[8, 10]', expected: '18', execute: (fn) => fn([8, 10]), check: (act) => act === 18 },
      { id: 3, name: 'Mixed with odd [1, 2, 3, 4, 5]', input: '[1, 2, 3, 4, 5]', expected: '6', execute: (fn) => fn([1, 2, 3, 4, 5]), check: (act) => act === 6 },
      { id: 4, name: 'Includes negative evens [-2, 4, -6, 8]', input: '[-2, 4, -6, 8] (only positive)', expected: '12', execute: (fn) => fn([-2, 4, -6, 8]), check: (act) => act === 12 }
    ],
    educatorFeedback: {
      strength: "Targets 0-based indexing mental models and accumulator patterns.",
      limitation: "Standard loop problems are easily generated by LLMs.",
      enhancement: "Providing the 1-based index bug and asking students to diagnose why the first element is lost shifts task to Analyse (Level 4)."
    },
    reflectionPrompt: "In an array with 3 elements, what are the valid index numbers, and what does `arr[arr.length]` return?"
  },

  reverse_list: {
    id: 'reverse_list',
    title: 'Lab 4: Reverse an Array Without Built-in Methods',
    targetTopic: 'Backward Traversals and Array Direction',
    bloomLevel: 'evaluate',
    difficulty: 'Semester 1 — Intermediate',
    aiSolvability: 46,
    aiSolvabilityCategory: 'Low (<50%)',
    description: `Implement \`reverseArray(arr)\` to reverse the elements of an array **without using \`arr.reverse()\`**.\n\n**The Beginner Mistake in Starter Code:**\nThe loop currently iterates forward (\`let i = 0; i < arr.length; i++\`), which simply makes a duplicate copy of the array (\`[1, 2, 3, 4]\`) instead of reversing it to \`[4, 3, 2, 1]\`.\n\n**Your Tasks:**\n1. Modify the loop to start at the last element (\`arr.length - 1\`) and step backwards (\`i--\`).\n2. Verify that elements are pushed in reverse order.`,
    starterCode: `/**
 * Lab 4: Reverse array without using arr.reverse().
 * Bug: Forward loop copies elements in original order instead of reverse.
 */
function reverseArray(arr) {
  if (!Array.isArray(arr)) return [];

  const result = [];
  
  // MISTAKE: Loops forward (0 to length - 1) instead of backward!
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]); // Currently only copies, does not reverse!
  }

  return result;
}`,
    flawExplanation: {
      identifiedMistake: "Line 10 iterates from 0 to length - 1, producing an exact copy of the array [1, 2, 3, 4] instead of reversing it to [4, 3, 2, 1].",
      rootCause: "Confusion between forward accumulation (`i = 0; i < len; i++`) and backward accumulation (`i = len - 1; i >= 0; i--`).",
      remediationSuggestion: "Initialize loop at `let i = arr.length - 1`, decrement with `i--`, and continue while `i >= 0`."
    },
    testCases: [
      { id: 1, name: 'Reversing [1, 2, 3, 4]', input: '[1, 2, 3, 4]', expected: '[4, 3, 2, 1]', execute: (fn) => fn([1, 2, 3, 4]), check: (act) => JSON.stringify(act) === JSON.stringify([4, 3, 2, 1]) },
      { id: 2, name: 'Odd-length strings ["a", "b", "c"]', input: '["a", "b", "c"]', expected: '["c", "b", "a"]', execute: (fn) => fn(["a", "b", "c"]), check: (act) => JSON.stringify(act) === JSON.stringify(["c", "b", "a"]) },
      { id: 3, name: 'Single item [100]', input: '[100]', expected: '[100]', execute: (fn) => fn([100]), check: (act) => JSON.stringify(act) === JSON.stringify([100]) },
      { id: 4, name: 'Empty array []', input: '[]', expected: '[]', execute: (fn) => fn([]), check: (act) => JSON.stringify(act) === JSON.stringify([]) }
    ],
    educatorFeedback: {
      strength: "Demands conceptual understanding of array index boundaries and decrement loops.",
      limitation: "Students may just invoke `.reverse()` if not restricted.",
      enhancement: "Adding the constraint against built-in methods and asking for space-complexity comparison pushes this to Evaluate (Level 5)."
    },
    reflectionPrompt: "How does in-place two-pointer swapping save memory compared to creating a brand new output array?"
  }
};

// --- APPLICATION STATE ---
let currentChallengeKey = 'find_max';
let currentChallenge = BEGINNER_CHALLENGES.find_max;
let currentMode = 'student'; // 'student' | 'educator'

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
  lucide.createIcons();
}

function switchChallenge(key) {
  currentChallengeKey = key;
  currentChallenge = BEGINNER_CHALLENGES[key] || BEGINNER_CHALLENGES.find_max;
  renderChallenge(currentChallenge);
  resetStarterCode();
  resetFeedbackUI();
  updateMasteryBadge();
  lucide.createIcons();
}

function setViewMode(mode) {
  currentMode = mode;
  const studentBtn = document.getElementById('modeStudentBtn');
  const educatorBtn = document.getElementById('modeEducatorBtn');
  const studentStudio = document.getElementById('studentStudioView');
  const educatorStudio = document.getElementById('educatorStudioView');

  if (mode === 'student') {
    studentBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow transition";
    educatorBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition";
    studentStudio.classList.remove('hidden');
    educatorStudio.classList.add('hidden');
  } else {
    educatorBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow transition";
    studentBtn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition";
    studentStudio.classList.add('hidden');
    educatorStudio.classList.remove('hidden');
    renderEducatorBreakdown();
  }
  lucide.createIcons();
}

function renderChallenge(c) {
  document.getElementById('problemTitle').innerText = c.title;
  document.getElementById('topicBadgeText').innerText = 'Topic: ' + c.targetTopic;
  
  const bloomMeta = BLOOM_LEVELS[c.bloomLevel] || BLOOM_LEVELS.apply;
  const bloomBadge = document.getElementById('bloomBadge');
  bloomBadge.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bloomMeta.color}`;
  bloomBadge.innerHTML = `<i data-lucide="brain" class="w-3.5 h-3.5"></i><span>Bloom: ${bloomMeta.name}</span>`;

  document.getElementById('difficultyBadge').innerText = c.difficulty;
  document.getElementById('problemDescription').innerText = c.description;

  // Mistake Spotlight Card
  document.getElementById('mistakeIdentifiedPreview').innerText = c.flawExplanation.identifiedMistake;

  resetStarterCode();
}

function resetStarterCode() {
  const editor = document.getElementById('codeEditor');
  editor.value = currentChallenge.starterCode;
  updateLineNumbers();
}

function setupLineNumbers() {
  const editor = document.getElementById('codeEditor');
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
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
        el.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50";
      } else if (steps.indexOf(s) < steps.indexOf(stage)) {
        el.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30";
      } else {
        el.className = "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs text-slate-400 bg-slate-950 border border-slate-800";
      }
    }
  });
}

function advanceMastery(nextStage) {
  masteryTracker[currentChallengeKey] = nextStage;
  updateMasteryBadge();
}

// --- TEST RUNNER & FORMATIVE FEEDBACK GENERATOR ---
function runTestsAndEvaluate() {
  const code = document.getElementById('codeEditor').value;
  const drawerBody = document.getElementById('testResultsBody');
  const title = document.getElementById('testDrawerTitle');

  let studentFn = null;
  try {
    const fnName = currentChallengeKey === 'find_max' ? 'findMax' :
                   currentChallengeKey === 'count_vowels' ? 'countVowels' :
                   currentChallengeKey === 'even_sum' ? 'sumEvenNumbers' : 'reverseArray';
    const sandbox = new Function(`${code}; return ${fnName};`);
    studentFn = sandbox();
  } catch (err) {
    drawerBody.innerHTML = `
      <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs sm:text-sm">
        <strong class="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
          <i data-lucide="alert-octagon" class="w-4 h-4"></i>
          Syntax / Execution Error
        </strong>
        <span>${err.message}</span>
      </div>`;
    title.innerText = 'Test Suite (Compilation Error)';
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
      actualOutput = 'Error: ' + e.message;
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

  // Generate 4-Part Formative Feedback that matches the code accurately
  generateFormativeFeedback(code, passedCount, total);

  // Advance Progress Tracker
  if (passedCount === total) {
    advanceMastery('practised');
  } else if (passedCount > 0) {
    advanceMastery('corrected');
  }
}

// --- 4-PART FORMATIVE FEEDBACK ENGINE ---
// Answers the paper's 4 core educational questions:
// 1. What did I do well?
// 2. What is the problem?
// 3. Why did it happen?
// 4. How can I improve?
function generateFormativeFeedback(code, passed, total) {
  let wellDone = "";
  let problem = "";
  let why = "";
  let improvement = "";
  let nextStep = "";

  // ================= LAB 1: FIND MAX =================
  if (currentChallengeKey === 'find_max') {
    const hasMaxZero = /let\s+max\s*=\s*0|var\s+max\s*=\s*0/.test(code);

    if (passed === total) {
      wellDone = "Outstanding! You correctly initialized `max = numbers[0]` to safely handle negative values and maintained clean array traversal.";
      problem = "None detected. All positive, negative, and single-element test cases pass cleanly.";
      why = "By setting `max` to an existing element of the array, your comparison invariant holds true across the entire integer range (-∞ to +∞).";
      improvement = "Ready for the Socratic reflection: explain why this approach handles single-element arrays without bugs.";
      nextStep = "Click 'Mastery Check' to record your reasoning and complete the Mastery stage 🏆";
    } else if (hasMaxZero) {
      wellDone = "Your loop correctly iterates through the list and compares numbers using `if (numbers[i] > max)`. It works for positive numbers like [3, 7, 2, 9].";
      problem = "Failed on all-negative lists: `[-8, -3, -10]` returned 0 instead of -3, and `[-42]` returned 0 instead of -42.";
      why = "You initialized `let max = 0` on line 11. Because 0 is larger than all negative numbers, `numbers[i] > max` is never true, so `max` remains 0. But 0 is not even in the array!";
      improvement = "Initialize `max` using the first element of the array: `let max = numbers[0];`. That way, `max` starts with a real value from the list.";
      nextStep = "Change line 11 to `let max = numbers[0];` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Good effort setting up the function structure and loop.";
      problem = `Passed ${passed} of ${total} test cases. Check edge case handling for negative numbers.`;
      why = "Ensure your comparison logic `numbers[i] > max` accurately tracks the largest value.";
      improvement = "Initialize `let max = numbers[0];` and loop from `let i = 1; i < numbers.length; i++`.";
      nextStep = "Test with `[-8, -3, -10]` and verify the output is `-3`.";
    }
  }

  // ================= LAB 2: COUNT VOWELS =================
  else if (currentChallengeKey === 'count_vowels') {
    const hasLowerCase = /toLowerCase\(\)/.test(code);
    const hasUpperCase = /toUpperCase\(\)/.test(code);
    const checksUpperExplicitly = /['"]A['"]|['"]E['"]|['"]I['"]|['"]O['"]|['"]U['"]/.test(code);
    const hasCompoundBug = /===?\s*['"][a-zA-Z]['"]\s*\|\|\s*['"][a-zA-Z]['"]/.test(code);

    if (passed === total) {
      wellDone = hasLowerCase || hasUpperCase
        ? "Outstanding! You normalized letter casing using `.toLowerCase()`, ensuring that vowels in all positions are counted accurately."
        : "Great job! You expanded your conditions so both uppercase and lowercase vowels are correctly identified.";
      problem = "None! Handled lowercase ('hello'), mixed case ('Apple'), all uppercase ('PROGRAMMING'), and no vowels ('rhythm') cleanly.";
      why = "Normalizing character casing before checking eliminates discrepancies between ASCII uppercase ('A'=65) and lowercase ('a'=97).";
      improvement = "Pro-tip: Instead of 5 separate || checks, you can write `'aeiou'.includes(ch)` or `/[aeiou]/i.test(ch)` to make your code much more concise!";
      nextStep = "Click 'Mastery Check' to explain why case normalization is essential and claim Mastered status 🏆";
    } else if (hasCompoundBug) {
      wellDone = "Your loop structure and character indexing are set up properly.";
      problem = "Compound condition trap: You wrote a condition like `if (ch === 'a' || 'e')`. This evaluates to TRUE on every single character!";
      why = "In JavaScript, the logical OR (`||`) operator does not distribute across equality. `ch === 'a' || 'e'` evaluates as `(ch === 'a') || Boolean('e')`. Because any non-empty string is truthy, it counts consonants and spaces as vowels too.";
      improvement = "Compare each vowel explicitly: `ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u'`, or use `'aeiou'.includes(ch)`.";
      nextStep = "Replace the compound check with explicit comparisons or `'aeiou'.includes(ch)` and run tests again.";
    } else if (!hasLowerCase && !hasUpperCase && !checksUpperExplicitly) {
      wellDone = "Your loop visits each character in the string correctly, and successfully counts lowercase vowels in 'hello' (2) and 'rhythm' (0).";
      problem = "Failed on uppercase inputs: 'Apple' returned 1 instead of 2 (missed 'A'), and 'PROGRAMMING' returned 0 instead of 3 (missed 'O', 'A', 'I').";
      why = "In JavaScript, character comparisons are strictly case-sensitive (`'A' === 'a'` is false). Because line 14 only checks lowercase `'a', 'e', 'i', 'o', 'u'`, any uppercase vowel is skipped.";
      improvement = "Convert the character or text to lowercase before checking! Either use `const ch = text[i].toLowerCase();` inside the loop, or convert the entire string upfront with `text = text.toLowerCase();`.";
      nextStep = "Update line 11 to `const ch = text[i].toLowerCase();` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Loop setup is in place.";
      problem = `Passed ${passed} of ${total} tests. Review the failing inputs in the test results below.`;
      why = "Ensure you check for all 5 vowels (a, e, i, o, u) and handle both uppercase and lowercase forms.";
      improvement = "Verify your condition logic and ensure case normalization is applied.";
      nextStep = "Re-run tests after verifying character comparison checks.";
    }
  }

  // ================= LAB 3: EVEN SUM =================
  else if (currentChallengeKey === 'even_sum') {
    const hasOneBasedIndex = /for\s*\(\s*let\s+i\s*=\s*1\s*;/.test(code);

    if (passed === total) {
      wellDone = "Great work! Your loop starts at index 0 and accurately sums positive even numbers while filtering out odd and negative integers.";
      problem = "No errors detected. Handled even numbers, negative evens, and mixed inputs correctly.";
      why = "Using 0-based indexing (`i = 0; i < arr.length`) guarantees that every element—from the very first item at `arr[0]` to the last—is evaluated.";
      improvement = "Try exploring modern array methods: `arr.filter(n => n > 0 && n % 2 === 0).reduce((sum, n) => sum + n, 0)`.";
      nextStep = "Complete the Mastery Check reflection on 0-based array indexing.";
    } else if (hasOneBasedIndex) {
      wellDone = "Your modulo check `num % 2 === 0 && num > 0` correctly tests if a number is positive and even.";
      problem = "Failed on `[2, 4, 6]` (returned 10 instead of 12) and `[8, 10]` (returned 10 instead of 18). The very first item at index 0 was skipped!";
      why = "You initialized the loop at `let i = 1` on line 10. In JavaScript, arrays are 0-indexed: the first element is located at `arr[0]`. Starting at `i = 1` skips `arr[0]` entirely.";
      improvement = "Change the loop header from `let i = 1; i <= arr.length` to standard 0-based traversal: `let i = 0; i < arr.length; i++`.";
      nextStep = "Change line 10 to `for (let i = 0; i < arr.length; i++)` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Accumulator setup is ready.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Ensure you check both `num > 0` and `num % 2 === 0`.";
      improvement = "Verify that negative even numbers (like -2, -6) are not added to the total.";
      nextStep = "Test with `[-2, 4, -6, 8]` to verify that only 4 and 8 are summed.";
    }
  }

  // ================= LAB 4: REVERSE LIST =================
  else {
    const hasForwardLoop = /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*arr\.length\s*;\s*i\+\+\s*\)/.test(code);

    if (passed === total) {
      wellDone = "Superb! You reversed the array using backward loop traversal without calling the forbidden `.reverse()` method.";
      problem = "Zero flaws. Odd-length, single-element, and empty arrays all reversed correctly.";
      why = "Starting from `arr.length - 1` and decrementing down to 0 pushes elements in reverse order without mutating the original array.";
      improvement = "Next algorithmic step: Try the two-pointer in-place swap technique to achieve O(1) extra space!";
      nextStep = "Proceed to the reflection to evaluate memory usage between new-array vs in-place reversal.";
    } else if (hasForwardLoop) {
      wellDone = "Array initialization and return structure are ready.";
      problem = "The returned array is not reversed. For `[1, 2, 3, 4]`, your code returned `[1, 2, 3, 4]` (an exact duplicate copy).";
      why = "Your loop on line 10 starts at `i = 0` and increments forward with `i++`. This copies items in their original order instead of reverse.";
      improvement = "Loop backwards! Start at the last index: `for (let i = arr.length - 1; i >= 0; i--) { result.push(arr[i]); }`.";
      nextStep = "Change line 10 to `for (let i = arr.length - 1; i >= 0; i--)` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Function structure is in place.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Make sure the loop decrements from the end index down to 0.";
      improvement = "Check your loop bounds: start at `arr.length - 1` and continue while `i >= 0`.";
      nextStep = "Re-run tests after adjusting the loop direction.";
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
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
            <i data-lucide="thumbs-up" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">1. What did I do well?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.wellDone}</p>
      </div>

      <!-- 2. What is the problem? -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-rose-500/20 text-rose-400">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-rose-400 tracking-wider">2. What is the problem?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.problem}</p>
      </div>

      <!-- 3. Why did it happen? -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <i data-lucide="zap" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-amber-400 tracking-wider">3. Why did it happen? (Root Misconception)</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.why}</p>
      </div>

      <!-- 4. How can I improve? & Next Step -->
      <div class="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-md">
        <div class="flex items-center gap-2">
          <div class="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
            <i data-lucide="compass" class="w-4 h-4"></i>
          </div>
          <span class="text-xs uppercase font-extrabold text-indigo-300 tracking-wider">4. How can I improve?</span>
        </div>
        <p class="text-sm text-slate-100 leading-relaxed font-normal">${f.improvement}</p>
        <div class="mt-3 pt-3 border-t border-indigo-500/20 flex items-start gap-2 text-xs sm:text-sm text-indigo-200">
          <strong class="font-bold text-indigo-300 flex-shrink-0">Next Action:</strong>
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
      <div class="p-3 rounded-2xl bg-slate-950 inline-block border border-slate-800">
        <i data-lucide="sparkles" class="w-8 h-8 text-indigo-400"></i>
      </div>
      <p class="text-slate-200 font-semibold text-sm">Ready to Diagnose Your Solution</p>
      <p class="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
        Click <strong class="text-indigo-400 font-semibold">Run Tests & Diagnose</strong> above to receive structured feedback on strengths, flaws, root misconceptions, and improvement steps.
      </p>
    </div>
  `;
  document.getElementById('testDrawerTitle').innerText = 'Test Suite (Ready to Run)';
  document.getElementById('testResultsBody').innerHTML = '<p class="text-slate-500 text-center py-2 text-xs">Click "Run Tests & Diagnose" to evaluate your solution.</p>';
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
  feedbackText.innerText = "Verified! Your reasoning demonstrates authentic understanding of the core concept. Stage updated to: Concept Mastered 🏆";
  feedbackBox.classList.remove('hidden');

  setTimeout(() => {
    closeReflectionModal();
  }, 1800);
}

// Start
if (typeof window !== 'undefined') {
  window.onload = init;
}
