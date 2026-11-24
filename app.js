/**
 * Mistake-to-Mastery Platform (app.js)
 * Grounded in: "Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback"
 * Focus: 1st Semester Beginner Coding, Bloom's Taxonomy, AI-Solvability, and 4-Part Formative Feedback.
 */

// --- BLOOM'S TAXONOMY CONSTANTS ---
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
    bloomLevel: 'analyse', // Evaluates higher-order debugging of negative numbers
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 52, // Medium: basic question is 80%, but requiring bug explanation drops AI ease
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `A 1st-semester student wrote a function \`findMax(numbers)\` to find the largest number in a list.\n\nHowever, their code contains a **classic beginner mistake**: it works for positive numbers like \`[3, 7, 2, 9]\`, but fails completely when all numbers in the list are negative (e.g., \`[-8, -3, -10]\`).\n\n**Your Tasks:**\n1. **Identify the mistake**: Why does initializing max to 0 cause errors with negative values?\n2. **Correct the code**: Update the initialization so it handles any list of numbers.\n3. **Test edge cases**: Verify your fix with all-negative lists and single-element lists.`,
    starterCode: `/**
 * Lab 1: Find the largest number in the array.
 * Notice the beginner mistake below:
 */
function findMax(numbers) {
  if (!numbers || numbers.length === 0) {
    return null; // Empty array guard
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
      identifiedMistake: "Initialized `max = 0`. If all numbers in the array are negative (e.g. [-8, -3, -10]), `max` remains 0, which is incorrect because 0 was never in the array!",
      rootCause: "Mental model assumption that numbers are always positive, failing to consider negative integers.",
      remediationSuggestion: "Initialize `let max = numbers[0]` (the first element of the array) instead of 0."
    },
    testCases: [
      { id: 1, name: 'Positive numbers [3, 7, 2, 9]', input: '[3, 7, 2, 9]', expected: '9', run: (fn) => fn([3, 7, 2, 9]) === 9 },
      { id: 2, name: 'Negative numbers [-8, -3, -10]', input: '[-8, -3, -10]', expected: '-3', run: (fn) => fn([-8, -3, -10]) === -3 },
      { id: 3, name: 'Single negative number [-42]', input: '[-42]', expected: '-42', run: (fn) => fn([-42]) === -42 },
      { id: 4, name: 'Mixed numbers [-5, 0, 12, -2]', input: '[-5, 0, 12, -2]', expected: '12', run: (fn) => fn([-5, 0, 12, -2]) === 12 }
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
    title: 'Lab 2: Count Vowels in a String',
    targetTopic: 'Strings, Conditionals, and Logical Operators',
    bloomLevel: 'apply',
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 68,
    aiSolvabilityCategory: 'Medium-High (65–74%)',
    description: `Write a function \`countVowels(text)\` that counts the number of vowels (a, e, i, o, u) in a string.\n\n**Common 1st-Semester Pitfalls:**\n1. **Case Sensitivity**: Forgetting that inputs can have uppercase letters like \`"Apple"\` or \`"HELLO"\`.\n2. **Compound Condition Bug**: Writing \`if (ch === 'a' || 'e' || 'i')\` which is a classic beginner bug where truthy string evaluation always evaluates to true!\n\n**Your Tasks:**\n1. Ensure case insensitivity by converting text to lowercase.\n2. Correctly increment vowel count without string comparison logic traps.`,
    starterCode: `/**
 * Lab 2: Count vowels (a, e, i, o, u) in text.
 * Fix the beginner case-sensitivity and condition flaws below:
 */
function countVowels(text) {
  if (typeof text !== 'string') return 0;

  let count = 0;
  
  // MISTAKE 1: Missing toLowerCase() ignores uppercase vowels
  // MISTAKE 2: Watch out for invalid compound if statements
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    
    // Incomplete check: misses uppercase 'A', 'E', 'I', 'O', 'U'
    if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') {
      count++;
    }
  }

  return count;
}`,
    flawExplanation: {
      identifiedMistake: "Function only checks lowercase characters. It fails on 'Apple' (returns 1 instead of 2) and 'HELLO' (returns 0 instead of 2).",
      rootCause: "Overlooking string case normalization and ASCII character differences.",
      remediationSuggestion: "Convert the string or character to lowercase using `text.toLowerCase()` before or during loop checks."
    },
    testCases: [
      { id: 1, name: 'Simple lowercase: "hello"', input: '"hello"', expected: '2', run: (fn) => fn('hello') === 2 },
      { id: 2, name: 'Mixed case: "Apple"', input: '"Apple"', expected: '2', run: (fn) => fn('Apple') === 2 },
      { id: 3, name: 'All uppercase: "PROGRAMMING"', input: '"PROGRAMMING"', expected: '3', run: (fn) => fn('PROGRAMMING') === 3 },
      { id: 4, name: 'No vowels: "rhythm"', input: '"rhythm"', expected: '0', run: (fn) => fn('rhythm') === 0 }
    ],
    educatorFeedback: {
      strength: "Reinforces character inspection and logical OR conditions.",
      limitation: "AI writes clean string functions easily without human effort.",
      enhancement: "Ask students to analyze why `if (char === 'a' || 'e')` is a logic trap, shifting cognitive load to Analyse."
    },
    reflectionPrompt: "Explain what happens in JavaScript/Python if someone writes `if (char === 'a' || 'e')`."
  },

  even_sum: {
    id: 'even_sum',
    title: 'Lab 3: Sum of Even Numbers (Off-by-One Guard)',
    targetTopic: 'Array Indexing, Modulo Operator, and Bounds',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic',
    aiSolvability: 58,
    aiSolvabilityCategory: 'Medium (50–64%)',
    description: `Implement \`sumEvenNumbers(arr)\` to calculate the sum of all positive even integers in an array.\n\n**Common 1st-Semester Pitfalls:**\n1. **Off-by-One Loop Bug**: Writing \`i <= arr.length\` instead of \`i < arr.length\`, causing access to \`arr[arr.length]\` which is \`undefined\`.\n2. **Modulo Pitfall**: Forgetting to check if \`num > 0\` or handling non-numeric items.\n\n**Your Tasks:**\n1. Fix the boundary condition in the loop header.\n2. Correctly use the modulo operator \`% 2 === 0\` and ensure only positive even numbers are added.`,
    starterCode: `/**
 * Lab 3: Sum of positive even numbers.
 * Notice the index boundary and condition bug below:
 */
function sumEvenNumbers(arr) {
  if (!Array.isArray(arr)) return 0;

  let total = 0;

  // MISTAKE HERE: i <= arr.length causes index out-of-bounds on last step!
  for (let i = 0; i <= arr.length; i++) {
    const num = arr[i];

    // Flaw: undefined % 2 is NaN, corrupting total to NaN!
    if (num % 2 === 0 && num > 0) {
      total += num;
    }
  }

  return total;
}`,
    flawExplanation: {
      identifiedMistake: "Loop condition `i <= arr.length` iterates one step beyond the array bounds. When `i === arr.length`, `arr[i]` is `undefined`. Evaluating `undefined % 2` yields `NaN`, causing the entire sum to become `NaN`!",
      rootCause: "Confusing 0-based indexing with 1-based length measurement (the classic Off-by-One Error).",
      remediationSuggestion: "Change loop header condition from `i <= arr.length` to `i < arr.length`."
    },
    testCases: [
      { id: 1, name: 'Standard even numbers [2, 4, 6]', input: '[2, 4, 6]', expected: '12', run: (fn) => fn([2, 4, 6]) === 12 },
      { id: 2, name: 'Mixed with odd [1, 2, 3, 4, 5]', input: '[1, 2, 3, 4, 5]', expected: '6', run: (fn) => fn([1, 2, 3, 4, 5]) === 6 },
      { id: 3, name: 'Negative evens [-2, 4, -6, 8]', input: '[-2, 4, -6, 8] (only positive evens)', expected: '12', run: (fn) => fn([-2, 4, -6, 8]) === 12 },
      { id: 4, name: 'Empty array []', input: '[]', expected: '0', run: (fn) => fn([]) === 0 }
    ],
    educatorFeedback: {
      strength: "Targets critical boundary condition mental models and modulo arithmetic.",
      limitation: "Standard loop problems are easily generated by LLMs.",
      enhancement: "Provide the student with the broken code and ask them to trace what `arr[arr.length]` produces in memory."
    },
    reflectionPrompt: "What does `undefined + 4` produce in JavaScript, and why does an off-by-one loop produce `NaN`?"
  },

  reverse_list: {
    id: 'reverse_list',
    title: 'Lab 4: Reverse an Array Without Built-in Methods',
    targetTopic: 'Two-Pointer Technique and Array Mutation',
    bloomLevel: 'evaluate',
    difficulty: 'Semester 1 — Intermediate',
    aiSolvability: 46, // Low solvability due to in-place constraint and comparison requirement
    aiSolvabilityCategory: 'Low (<50%)',
    description: `Implement \`reverseArray(arr)\` to reverse the elements of an array **without using the built-in \`.reverse()\` method**.\n\n**Two Ways to Think About This (Evaluate):**\n- **Approach A (Extra Array)**: Push elements from back to front into a new array ($O(N)$ extra space).\n- **Approach B (Two Pointers In-Place)**: Swap elements at index \`left\` and \`right\` moving towards the center ($O(1)$ extra space).\n\n**Your Tasks:**\n1. Implement either in-place swap or reversed loop.\n2. Explain in the reflection why an in-place swap uses less memory.`,
    starterCode: `/**
 * Lab 4: Reverse array without using arr.reverse().
 */
function reverseArray(arr) {
  if (!Array.isArray(arr)) return [];

  // MISTAKE TO AVOID: Do not use arr.reverse()!
  // Write an explicit loop or two-pointer swap:
  const result = [];
  
  // TODO: Loop from the last index down to 0 and push elements
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]); // Currently only copies, does not reverse!
  }

  return result;
}`,
    flawExplanation: {
      identifiedMistake: "Loop iterates from 0 to length - 1, producing an exact copy of the array instead of a reversed array.",
      rootCause: "Confusion between forward traversal (`let i = 0; i < len; i++`) and backward traversal (`let i = len - 1; i >= 0; i--`).",
      remediationSuggestion: "Initialize loop at `let i = arr.length - 1`, decrement `i--`, and continue while `i >= 0`."
    },
    testCases: [
      { id: 1, name: 'Reversing [1, 2, 3, 4]', input: '[1, 2, 3, 4]', expected: '[4, 3, 2, 1]', run: (fn) => JSON.stringify(fn([1, 2, 3, 4])) === JSON.stringify([4, 3, 2, 1]) },
      { id: 2, name: 'Odd-length array ["a", "b", "c"]', input: '["a", "b", "c"]', expected: '["c", "b", "a"]', run: (fn) => JSON.stringify(fn(["a", "b", "c"])) === JSON.stringify(["c", "b", "a"]) },
      { id: 3, name: 'Single item [100]', input: '[100]', expected: '[100]', run: (fn) => JSON.stringify(fn([100])) === JSON.stringify([100]) },
      { id: 4, name: 'Empty array []', input: '[]', expected: '[]', run: (fn) => JSON.stringify(fn([])) === JSON.stringify([]) }
    ],
    educatorFeedback: {
      strength: "Demands conceptual understanding of pointer movement and array bounds.",
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

// Mistake-to-Mastery progress tracking
const masteryTracker = {
  find_max: 'identified', // 'identified' | 'corrected' | 'practised' | 'mastered'
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
    studentBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow";
    educatorBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition";
    studentStudio.classList.remove('hidden');
    educatorStudio.classList.add('hidden');
  } else {
    educatorBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow";
    studentBtn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition";
    studentStudio.classList.add('hidden');
    educatorStudio.classList.remove('hidden');
    renderEducatorBreakdown();
  }
  lucide.createIcons();
}

function renderChallenge(c) {
  // Title & Level Badges
  document.getElementById('problemTitle').innerText = c.title;
  document.getElementById('topicBadgeText').innerText = c.targetTopic;
  
  const bloomMeta = BLOOM_LEVELS[c.bloomLevel] || BLOOM_LEVELS.apply;
  const bloomBadge = document.getElementById('bloomBadge');
  bloomBadge.className = `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${bloomMeta.color}`;
  bloomBadge.innerHTML = `<i data-lucide="brain" class="w-3 h-3"></i><span>Bloom: ${bloomMeta.name}</span>`;

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
      <div class="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs">
        <strong class="font-bold flex items-center gap-1.5 mb-1">
          <i data-lucide="alert-octagon" class="w-4 h-4 text-rose-400"></i>
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
      passed = tc.run(studentFn);
      actualOutput = passed ? tc.expected : 'Incorrect Return';
    } catch (e) {
      actualOutput = e.message;
      passed = false;
    }
    if (passed) passedCount++;

    return `
      <div class="p-2.5 rounded-lg border text-xs font-mono ${passed ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-rose-950/20 border-rose-500/30 text-slate-200'}">
        <div class="flex items-center justify-between font-sans mb-1">
          <span class="font-semibold flex items-center gap-1.5 ${passed ? 'text-emerald-400' : 'text-rose-400'}">
            <i data-lucide="${passed ? 'check-circle-2' : 'x-circle'}" class="w-3.5 h-3.5"></i>
            ${tc.name}
          </span>
          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
            ${passed ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <div class="text-[11px] text-slate-400 space-y-0.5">
          <div><span class="text-slate-500 font-sans">Input: </span><span>${tc.input}</span></div>
          <div><span class="text-slate-500 font-sans">Expected: </span><span class="text-emerald-400">${tc.expected}</span></div>
        </div>
      </div>
    `;
  });

  drawerBody.innerHTML = cards.join('');
  const total = currentChallenge.testCases.length;
  title.innerText = `Test Suite Execution (${passedCount}/${total} Passed)`;
  lucide.createIcons();

  // Generate Actionable 4-Part Formative Feedback
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

  if (currentChallengeKey === 'find_max') {
    const hasMaxZero = /let\s+max\s*=\s*0|var\s+max\s*=\s*0/.test(code);
    const usesFirstElem = /numbers\[0\]/.test(code);

    if (passed === total) {
      wellDone = "Outstanding! You correctly initialized `max = numbers[0]` to safely handle negative values and maintained the array traversal.";
      problem = "None detected. All positive and negative boundary test cases pass cleanly.";
      why = "By setting `max` to an existing element of the array, your comparison invariant holds true across the entire integer range (-∞ to +∞).";
      improvement = "Ready for the Socratic reflection: explain why this approach handles single-element arrays without bugs.";
      nextStep = "Click 'Mastery Reflection' to record your reasoning and complete the Mastery stage.";
    } else if (hasMaxZero) {
      wellDone = "Your loop correctly iterates through the list and compares numbers with `if (numbers[i] > max)`.";
      problem = "The program fails when all numbers in the array are negative (e.g. [-8, -3, -10] returns 0 instead of -3).";
      why = "You initialized `let max = 0`. Because 0 is larger than all negative numbers, `max` is never updated during the loop.";
      improvement = "Initialize `max` using the first element: `let max = numbers[0]`.";
      nextStep = "Change line 11 to `let max = numbers[0];`, re-run tests, and observe the negative test case turn green.";
    } else {
      wellDone = "Good effort setting up the function structure and loop.";
      problem = `Passed ${passed} of ${total} test cases. Check boundary conditions.`;
      why = "Ensure the comparison logic `numbers[i] > max` updates `max` on every higher value.";
      improvement = "Verify your loop starting index and initial `max` assignment.";
      nextStep = "Test with `[-8, -3, -10]` and verify the output is `-3`.";
    }
  } else if (currentChallengeKey === 'count_vowels') {
    const hasLowerCase = /toLowerCase\(\)/.test(code);

    if (passed === total) {
      wellDone = "Excellent! You converted text to lowercase and accurately counted vowels across all casing permutations.";
      problem = "None. Handled mixed case, uppercase words, and vowel-less strings.";
      why = "Normalizing case before comparing eliminates dual checking for 'a' and 'A'.";
      improvement = "Consider checking character membership using `Set(['a','e','i','o','u'])` or a lookup string `'aeiou'.includes(ch)`.";
      nextStep = "Proceed to the reflective check to solidify your understanding of compound condition evaluation.";
    } else if (!hasLowerCase) {
      wellDone = "Your loop correctly checks individual characters and increments the counter.";
      problem = "The function misses uppercase vowels like 'A' in 'Apple' or 'PROGRAMMING'.";
      why = "JavaScript character comparison is strict (`'A' !== 'a'`). Without case normalization, uppercase letters are skipped.";
      improvement = "Add `text = text.toLowerCase()` at the beginning of the function or check `ch.toLowerCase()`.";
      nextStep = "Add `const lowerText = text.toLowerCase();` and run tests again.";
    } else {
      wellDone = "Loop structure is sound.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Look out for compound condition bugs like `if (ch === 'a' || 'e')`.";
      improvement = "Ensure each equality comparison is explicit: `ch === 'a' || ch === 'e'`.";
      nextStep = "Re-run tests after verifying individual character checks.";
    }
  } else if (currentChallengeKey === 'even_sum') {
    const hasOffByOne = /i\s*<=\s*arr\.length/.test(code);

    if (passed === total) {
      wellDone = "Great work! You fixed the loop boundary condition and correctly accumulated positive even numbers.";
      problem = "No errors. Handled negative evens and empty arrays safely.";
      why = "Using `i < arr.length` ensures indexes never exceed the valid range `[0 ... length-1]`.";
      improvement = "Try refactoring using functional programming: `arr.filter(n => n > 0 && n % 2 === 0).reduce((s, n) => s + n, 0)`.";
      nextStep = "Complete the reflection on why accessing `arr[arr.length]` returns `undefined`.";
    } else if (hasOffByOne) {
      wellDone = "Your modulo check `num % 2 === 0 && num > 0` correctly identifies positive even integers.";
      problem = "The loop causes `NaN` output because `i <= arr.length` reaches an out-of-bounds index.";
      why = "In a 3-element array, valid indexes are 0, 1, 2. When `i = 3`, `arr[3]` is `undefined`. Evaluating `undefined % 2` produces `NaN`.";
      improvement = "Change the loop condition from `i <= arr.length` to `i < arr.length`.";
      nextStep = "Fix line 11 to `i < arr.length` and click Run Tests.";
    } else {
      wellDone = "Loop setup is in place.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Ensure you check both `num > 0` and `num % 2 === 0`.";
      improvement = "Guard against negative numbers like -2 or -4.";
      nextStep = "Test with `[-2, 4, -6, 8]` to confirm only 4 and 8 are summed.";
    }
  } else {
    // Reverse array
    if (passed === total) {
      wellDone = "Superb! You reversed the array using genuine algorithmic loop manipulation without relying on built-in `.reverse()`.";
      problem = "Zero flaws. Edge cases with single elements and odd lengths pass cleanly.";
      why = "Iterating backwards from `arr.length - 1` down to 0 correctly pushes elements in reverse order.";
      improvement = "Next challenge: Try implementing the in-place two-pointer swap to achieve O(1) extra space!";
      nextStep = "Proceed to the reflection to evaluate space complexity differences.";
    } else {
      wellDone = "Array initialization and return structure are ready.";
      problem = "The returned array is not reversed (or currently produces a forward copy).";
      why = "Forward loop `let i = 0; i < arr.length; i++` copies elements in original order.";
      improvement = "Start the loop at the end: `for (let i = arr.length - 1; i >= 0; i--) { result.push(arr[i]); }`.";
      nextStep = "Update loop index to start at `arr.length - 1` and decrement with `i--`.";
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
  // 1. Calculate Bloom's distribution across the 4 semester-1 questions
  const total = Object.keys(BEGINNER_CHALLENGES).length;
  const counts = { remember: 0, understand: 1, apply: 1, analyse: 1, evaluate: 1, create: 0 };
  
  const current = currentChallenge;
  document.getElementById('eduQuestionTitle').innerText = current.title;
  document.getElementById('eduTargetTopic').innerText = current.targetTopic;
  document.getElementById('eduBloomLevel').innerText = current.bloomLevel.toUpperCase();
  
  // Solvability meter
  const meter = document.getElementById('eduSolvabilityMeter');
  const badge = document.getElementById('eduSolvabilityBadge');
  meter.style.width = `${current.aiSolvability}%`;
  badge.innerText = `${current.aiSolvability}% — ${current.aiSolvabilityCategory}`;

  if (current.aiSolvability > 74) {
    badge.className = "font-bold text-rose-400";
    meter.className = "h-2.5 rounded-full bg-rose-500 transition-all duration-300";
  } else if (current.aiSolvability >= 65) {
    badge.className = "font-bold text-amber-400";
    meter.className = "h-2.5 rounded-full bg-amber-500 transition-all duration-300";
  } else if (current.aiSolvability >= 50) {
    badge.className = "font-bold text-cyan-400";
    meter.className = "h-2.5 rounded-full bg-cyan-500 transition-all duration-300";
  } else {
    badge.className = "font-bold text-emerald-400";
    meter.className = "h-2.5 rounded-full bg-emerald-500 transition-all duration-300";
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
    feedbackBox.className = "p-3 rounded-xl border bg-amber-950/20 border-amber-500/30 text-amber-300 text-xs";
    feedbackText.innerText = "Please provide a more detailed conceptual explanation to demonstrate mastery.";
    feedbackBox.classList.remove('hidden');
    return;
  }

  // Accepted
  advanceMastery('mastered');
  feedbackBox.className = "p-3 rounded-xl border bg-emerald-950/20 border-emerald-500/30 text-emerald-300 text-xs";
  feedbackText.innerText = "Verified! Your reasoning demonstrates authentic understanding of the core concept. Stage updated to: Concept Mastered 🏆";
  feedbackBox.classList.remove('hidden');

  setTimeout(() => {
    closeReflectionModal();
  }, 2000);
}

// Start
window.onload = init;
