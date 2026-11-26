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

// --- SUPPORTED LANGUAGES & MULTI-LANGUAGE TEMPLATES ---
const LANGUAGE_LABELS = {
  c: 'C',
  cpp: 'C++',
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  kotlin: 'Kotlin',
  swift: 'Swift',
  php: 'PHP',
  ruby: 'Ruby'
};

const MULTI_LANG_TEMPLATES = {
  find_max: {
    cpp: {
      buggy: `#include <vector>\nusing namespace std;\n\nint findMax(const vector<int>& numbers, int size) {\n    if (size <= 0) return 0;\n\n    // MISTAKE HERE: Initializing to 0 fails when all numbers are negative!\n    int max = 0;\n\n    for (int i = 0; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`,
      correct: `#include <vector>\nusing namespace std;\n\nint findMax(const vector<int>& numbers, int size) {\n    if (size <= 0) return 0;\n\n    // CORRECT: Initializing to numbers[0] handles negative numbers properly\n    int max = numbers[0];\n\n    for (int i = 1; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`
    },
    java: {
      buggy: `public class Solution {\n    public static int findMax(int[] numbers, int size) {\n        if (numbers == null || size <= 0) return 0;\n\n        // MISTAKE HERE: Initializing to 0 fails when all numbers are negative!\n        int max = 0;\n\n        for (int i = 0; i < size; i++) {\n            if (numbers[i] > max) max = numbers[i];\n        }\n        return max;\n    }\n}`,
      correct: `public class Solution {\n    public static int findMax(int[] numbers, int size) {\n        if (numbers == null || size <= 0) return 0;\n\n        // CORRECT: Initializing to numbers[0] handles negative numbers properly\n        int max = numbers[0];\n\n        for (int i = 1; i < size; i++) {\n            if (numbers[i] > max) max = numbers[i];\n        }\n        return max;\n    }\n}`
    },
    python: {
      buggy: `def find_max(numbers: list, size: int) -> int:\n    if not numbers or size <= 0:\n        return 0\n    # MISTAKE: Initializing to 0 fails for negative numbers\n    max_val = 0\n    for i in range(size):\n        if numbers[i] > max_val:\n            max_val = numbers[i]\n    return max_val`,
      correct: `def find_max(numbers: list, size: int) -> int:\n    if not numbers or size <= 0:\n        return 0\n    # CORRECT: Initializing to numbers[0] handles negative numbers\n    max_val = numbers[0]\n    for i in range(1, size):\n        if numbers[i] > max_val:\n            max_val = numbers[i]\n    return max_val`
    },
    javascript: {
      buggy: `function findMax(numbers, size) {\n    if (!numbers || size <= 0) return 0;\n    // MISTAKE: Initializing to 0 fails for negative numbers\n    let max = 0;\n    for (let i = 0; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`,
      correct: `function findMax(numbers, size) {\n    if (!numbers || size <= 0) return 0;\n    let max = numbers[0];\n    for (let i = 1; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`
    },
    typescript: {
      buggy: `export function findMax(numbers: number[], size: number): number {\n    if (!numbers || size <= 0) return 0;\n    let max = 0;\n    for (let i = 0; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`,
      correct: `export function findMax(numbers: number[], size: number): number {\n    if (!numbers || size <= 0) return 0;\n    let max = numbers[0];\n    for (let i = 1; i < size; i++) {\n        if (numbers[i] > max) max = numbers[i];\n    }\n    return max;\n}`
    },
    csharp: {
      buggy: `public class Solution {\n    public static int FindMax(int[] numbers, int size) {\n        if (numbers == null || size <= 0) return 0;\n        int max = 0;\n        for (int i = 0; i < size; i++) {\n            if (numbers[i] > max) max = numbers[i];\n        }\n        return max;\n    }\n}`,
      correct: `public class Solution {\n    public static int FindMax(int[] numbers, int size) {\n        if (numbers == null || size <= 0) return 0;\n        int max = numbers[0];\n        for (int i = 1; i < size; i++) {\n            if (numbers[i] > max) max = numbers[i];\n        }\n        return max;\n    }\n}`
    },
    go: {
      buggy: `package main\n\nfunc findMax(numbers []int, size int) int {\n    if size <= 0 {\n        return 0\n    }\n    max := 0\n    for i := 0; i < size; i++ {\n        if numbers[i] > max {\n            max = numbers[i]\n        }\n    }\n    return max\n}`,
      correct: `package main\n\nfunc findMax(numbers []int, size int) int {\n    if size <= 0 {\n        return 0\n    }\n    max := numbers[0]\n    for i := 1; i < size; i++ {\n        if numbers[i] > max {\n            max = numbers[i]\n        }\n    }\n    return max\n}`
    },
    rust: {
      buggy: `pub fn find_max(numbers: &[i32], size: usize) -> i32 {\n    if size == 0 {\n        return 0;\n    }\n    let mut max_val = 0;\n    for i in 0..size {\n        if numbers[i] > max_val {\n            max_val = numbers[i];\n        }\n    }\n    return max_val;\n}`,
      correct: `pub fn find_max(numbers: &[i32], size: usize) -> i32 {\n    if size == 0 {\n        return 0;\n    }\n    let mut max_val = numbers[0];\n    for i in 1..size {\n        if numbers[i] > max_val {\n            max_val = numbers[i];\n        }\n    }\n    return max_val;\n}`
    },
    kotlin: {
      buggy: `fun findMax(numbers: IntArray, size: Int): Int {\n    if (size <= 0) return 0\n    var max = 0\n    for (i in 0 until size) {\n        if (numbers[i] > max) max = numbers[i]\n    }\n    return max\n}`,
      correct: `fun findMax(numbers: IntArray, size: Int): Int {\n    if (size <= 0) return 0\n    var max = numbers[0]\n    for (i in 1 until size) {\n        if (numbers[i] > max) max = numbers[i]\n    }\n    return max\n}`
    },
    swift: {
      buggy: `func findMax(_ numbers: [Int], _ size: Int) -> Int {\n    if size <= 0 {\n        return 0\n    }\n    var maxVal = 0\n    for i in 0..<size {\n        if numbers[i] > maxVal {\n            maxVal = numbers[i]\n        }\n    }\n    return maxVal\n}`,
      correct: `func findMax(_ numbers: [Int], _ size: Int) -> Int {\n    if size <= 0 {\n        return 0\n    }\n    var maxVal = numbers[0]\n    for i in 1..<size {\n        if numbers[i] > maxVal {\n            maxVal = numbers[i]\n        }\n    }\n    return maxVal\n}`
    },
    php: {
      buggy: `<?php\nfunction findMax($numbers, $size) {\n    if ($size <= 0) return 0;\n    $max = 0;\n    for ($i = 0; $i < $size; $i++) {\n        if ($numbers[$i] > $max) $max = $numbers[$i];\n    }\n    return $max;\n}`,
      correct: `<?php\nfunction findMax($numbers, $size) {\n    if ($size <= 0) return 0;\n    $max = $numbers[0];\n    for ($i = 1; $i < $size; $i++) {\n        if ($numbers[$i] > $max) $max = $numbers[$i];\n    }\n    return $max;\n}`
    },
    ruby: {
      buggy: `def find_max(numbers, size)\n  if size <= 0\n    return 0\n  end\n  max_val = 0\n  for i in 0...size\n    if numbers[i] > max_val\n      max_val = numbers[i]\n    end\n  end\n  return max_val\nend`,
      correct: `def find_max(numbers, size)\n  if size <= 0\n    return 0\n  end\n  max_val = numbers[0]\n  for i in 1...size\n    if numbers[i] > max_val\n      max_val = numbers[i]\n    end\n  end\n  return max_val\nend`
    }
  },
  count_vowels: {
    cpp: {
      buggy: `#include <string>\n#include <cctype>\nusing namespace std;\n\nint countVowels(const string& text) {\n    int count = 0;\n    for (size_t i = 0; i < text.length(); i++) {\n        char ch = text[i];\n        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n            count++;\n        }\n    }\n    return count;\n}`,
      correct: `#include <string>\n#include <cctype>\nusing namespace std;\n\nint countVowels(const string& text) {\n    int count = 0;\n    for (size_t i = 0; i < text.length(); i++) {\n        char ch = std::tolower(text[i]);\n        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n            count++;\n        }\n    }\n    return count;\n}`
    },
    java: {
      buggy: `public class Solution {\n    public static int countVowels(String text) {\n        int count = 0;\n        for (int i = 0; i < text.length(); i++) {\n            char ch = text.charAt(i);\n            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n                count++;\n            }\n        }\n        return count;\n    }\n}`,
      correct: `public class Solution {\n    public static int countVowels(String text) {\n        int count = 0;\n        for (int i = 0; i < text.length(); i++) {\n            char ch = Character.toLowerCase(text.charAt(i));\n            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n                count++;\n            }\n        }\n        return count;\n    }\n}`
    },
    python: {
      buggy: `def count_vowels(text: str) -> int:\n    count = 0\n    for ch in text:\n        if ch in ('a', 'e', 'i', 'o', 'u'):\n            count += 1\n    return count`,
      correct: `def count_vowels(text: str) -> int:\n    count = 0\n    for ch in text.lower():\n        if ch in ('a', 'e', 'i', 'o', 'u'):\n            count += 1\n    return count`
    },
    javascript: {
      buggy: `function countVowels(text) {\n    let count = 0;\n    for (let i = 0; i < text.length; i++) {\n        let ch = text[i];\n        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;\n    }\n    return count;\n}`,
      correct: `function countVowels(text) {\n    let count = 0;\n    for (let i = 0; i < text.length; i++) {\n        let ch = text[i].toLowerCase();\n        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;\n    }\n    return count;\n}`
    },
    typescript: {
      buggy: `export function countVowels(text: string): number {\n    let count = 0;\n    for (let i = 0; i < text.length; i++) {\n        let ch = text[i];\n        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;\n    }\n    return count;\n}`,
      correct: `export function countVowels(text: string): number {\n    let count = 0;\n    for (let i = 0; i < text.length; i++) {\n        let ch = text[i].toLowerCase();\n        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;\n    }\n    return count;\n}`
    },
    csharp: {
      buggy: `public class Solution {\n    public static int CountVowels(string text) {\n        int count = 0;\n        for (int i = 0; i < text.Length; i++) {\n            char ch = text[i];\n            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++;\n        }\n        return count;\n    }\n}`,
      correct: `public class Solution {\n    public static int CountVowels(string text) {\n        int count = 0;\n        for (int i = 0; i < text.Length; i++) {\n            char ch = char.ToLower(text[i]);\n            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++;\n        }\n        return count;\n    }\n}`
    },
    go: {
      buggy: `package main\n\nfunc countVowels(text string) int {\n    count := 0\n    for _, ch := range text {\n        if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' {\n            count++\n        }\n    }\n    return count\n}`,
      correct: `package main\n\nimport "strings"\n\nfunc countVowels(text string) int {\n    count := 0\n    for _, ch := range strings.ToLower(text) {\n        if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' {\n            count++\n        }\n    }\n    return count\n}`
    },
    rust: {
      buggy: `pub fn count_vowels(text: &str) -> i32 {\n    let mut count = 0;\n    for ch in text.chars() {\n        if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' {\n            count += 1;\n        }\n    }\n    return count;\n}`,
      correct: `pub fn count_vowels(text: &str) -> i32 {\n    let mut count = 0;\n    for ch in text.to_ascii_lowercase().chars() {\n        if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' {\n            count += 1;\n        }\n    }\n    return count;\n}`
    },
    kotlin: {
      buggy: `fun countVowels(text: String): Int {\n    var count = 0\n    for (ch in text) {\n        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++\n    }\n    return count\n}`,
      correct: `fun countVowels(text: String): Int {\n    var count = 0\n    for (raw in text) {\n        val ch = raw.lowercaseChar()\n        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') count++\n    }\n    return count\n}`
    },
    swift: {
      buggy: `func countVowels(_ text: String) -> Int {\n    var count = 0\n    for ch in text {\n        if ch == "a" || ch == "e" || ch == "i" || ch == "o" || ch == "u" {\n            count += 1\n        }\n    }\n    return count\n}`,
      correct: `func countVowels(_ text: String) -> Int {\n    var count = 0\n    for ch in text.lowercased() {\n        if ch == "a" || ch == "e" || ch == "i" || ch == "o" || ch == "u" {\n            count += 1\n        }\n    }\n    return count\n}`
    },
    php: {
      buggy: `<?php\nfunction countVowels($text) {\n    $count = 0;\n    for ($i = 0; $i < strlen($text); $i++) {\n        $ch = $text[$i];\n        if ($ch == 'a' || $ch == 'e' || $ch == 'i' || $ch == 'o' || $ch == 'u') $count++;\n    }\n    return $count;\n}`,
      correct: `<?php\nfunction countVowels($text) {\n    $count = 0;\n    for ($i = 0; $i < strlen($text); $i++) {\n        $ch = strtolower($text[$i]);\n        if ($ch == 'a' || $ch == 'e' || $ch == 'i' || $ch == 'o' || $ch == 'u') $count++;\n    }\n    return $count;\n}`
    },
    ruby: {
      buggy: `def count_vowels(text)\n  count = 0\n  text.each_char do |ch|\n    if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'\n      count += 1\n    end\n  end\n  return count\nend`,
      correct: `def count_vowels(text)\n  count = 0\n  text.downcase.each_char do |ch|\n    if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'\n      count += 1\n    end\n  end\n  return count\nend`
    }
  },
  even_sum: {
    cpp: {
      buggy: `#include <vector>\nusing namespace std;\n\nint sumEvenNumbers(const vector<int>& arr, int size) {\n    int total = 0;\n    for (int i = 1; i <= size; i++) {\n        int num = arr[i];\n        if (num > 0 && num % 2 == 0) total += num;\n    }\n    return total;\n}`,
      correct: `#include <vector>\nusing namespace std;\n\nint sumEvenNumbers(const vector<int>& arr, int size) {\n    int total = 0;\n    for (int i = 0; i < size; i++) {\n        int num = arr[i];\n        if (num > 0 && num % 2 == 0) total += num;\n    }\n    return total;\n}`
    },
    java: {
      buggy: `public class Solution {\n    public static int sumEvenNumbers(int[] arr, int size) {\n        int total = 0;\n        for (int i = 1; i <= size; i++) {\n            int num = arr[i];\n            if (num > 0 && num % 2 == 0) total += num;\n        }\n        return total;\n    }\n}`,
      correct: `public class Solution {\n    public static int sumEvenNumbers(int[] arr, int size) {\n        int total = 0;\n        for (int i = 0; i < size; i++) {\n            int num = arr[i];\n            if (num > 0 && num % 2 == 0) total += num;\n        }\n        return total;\n    }\n}`
    },
    python: {
      buggy: `def sum_even_numbers(arr: list, size: int) -> int:\n    total = 0\n    for i in range(1, size + 1):\n        if i < len(arr) and arr[i] > 0 and arr[i] % 2 == 0:\n            total += arr[i]\n    return total`,
      correct: `def sum_even_numbers(arr: list, size: int) -> int:\n    total = 0\n    for i in range(size):\n        if i < len(arr) and arr[i] > 0 and arr[i] % 2 == 0:\n            total += arr[i]\n    return total`
    },
    javascript: {
      buggy: `function sumEvenNumbers(arr, size) {\n    let total = 0;\n    for (let i = 1; i <= size; i++) {\n        let num = arr[i];\n        if (num > 0 && num % 2 === 0) total += num;\n    }\n    return total;\n}`,
      correct: `function sumEvenNumbers(arr, size) {\n    let total = 0;\n    for (let i = 0; i < size; i++) {\n        let num = arr[i];\n        if (num > 0 && num % 2 === 0) total += num;\n    }\n    return total;\n}`
    },
    typescript: {
      buggy: `export function sumEvenNumbers(arr: number[], size: number): number {\n    let total = 0;\n    for (let i = 1; i <= size; i++) {\n        let num = arr[i];\n        if (num > 0 && num % 2 === 0) total += num;\n    }\n    return total;\n}`,
      correct: `export function sumEvenNumbers(arr: number[], size: number): number {\n    let total = 0;\n    for (let i = 0; i < size; i++) {\n        let num = arr[i];\n        if (num > 0 && num % 2 === 0) total += num;\n    }\n    return total;\n}`
    },
    csharp: {
      buggy: `public class Solution {\n    public static int SumEvenNumbers(int[] arr, int size) {\n        int total = 0;\n        for (int i = 1; i <= size; i++) {\n            int num = arr[i];\n            if (num > 0 && num % 2 == 0) total += num;\n        }\n        return total;\n    }\n}`,
      correct: `public class Solution {\n    public static int SumEvenNumbers(int[] arr, int size) {\n        int total = 0;\n        for (int i = 0; i < size; i++) {\n            int num = arr[i];\n            if (num > 0 && num % 2 == 0) total += num;\n        }\n        return total;\n    }\n}`
    },
    go: {
      buggy: `package main\n\nfunc sumEvenNumbers(arr []int, size int) int {\n    total := 0\n    for i := 1; i <= size; i++ {\n        num := arr[i]\n        if num > 0 && num%2 == 0 {\n            total += num\n        }\n    }\n    return total\n}`,
      correct: `package main\n\nfunc sumEvenNumbers(arr []int, size int) int {\n    total := 0\n    for i := 0; i < size; i++ {\n        num := arr[i]\n        if num > 0 && num%2 == 0 {\n            total += num\n        }\n    }\n    return total\n}`
    },
    rust: {
      buggy: `pub fn sum_even_numbers(arr: &[i32], size: usize) -> i32 {\n    let mut total = 0;\n    for i in 1..=size {\n        let num = arr[i];\n        if num > 0 && num % 2 == 0 {\n            total += num;\n        }\n    }\n    return total;\n}`,
      correct: `pub fn sum_even_numbers(arr: &[i32], size: usize) -> i32 {\n    let mut total = 0;\n    for i in 0..size {\n        let num = arr[i];\n        if num > 0 && num % 2 == 0 {\n            total += num;\n        }\n    }\n    return total;\n}`
    },
    kotlin: {
      buggy: `fun sumEvenNumbers(arr: IntArray, size: Int): Int {\n    var total = 0\n    for (i in 1..size) {\n        val num = arr[i]\n        if (num > 0 && num % 2 == 0) total += num\n    }\n    return total\n}`,
      correct: `fun sumEvenNumbers(arr: IntArray, size: Int): Int {\n    var total = 0\n    for (i in 0 until size) {\n        val num = arr[i]\n        if (num > 0 && num % 2 == 0) total += num\n    }\n    return total\n}`
    },
    swift: {
      buggy: `func sumEvenNumbers(_ arr: [Int], _ size: Int) -> Int {\n    var total = 0\n    for i in 1...size {\n        let num = arr[i]\n        if num > 0 && num % 2 == 0 {\n            total += num\n        }\n    }\n    return total\n}`,
      correct: `func sumEvenNumbers(_ arr: [Int], _ size: Int) -> Int {\n    var total = 0\n    for i in 0..<size {\n        let num = arr[i]\n        if num > 0 && num % 2 == 0 {\n            total += num\n        }\n    }\n    return total\n}`
    },
    php: {
      buggy: `<?php\nfunction sumEvenNumbers($arr, $size) {\n    $total = 0;\n    for ($i = 1; $i <= $size; $i++) {\n        $num = $arr[$i];\n        if ($num > 0 && $num % 2 == 0) $total += $num;\n    }\n    return $total;\n}`,
      correct: `<?php\nfunction sumEvenNumbers($arr, $size) {\n    $total = 0;\n    for ($i = 0; $i < $size; $i++) {\n        $num = $arr[$i];\n        if ($num > 0 && $num % 2 == 0) $total += $num;\n    }\n    return $total;\n}`
    },
    ruby: {
      buggy: `def sum_even_numbers(arr, size)\n  total = 0\n  for i in 1..size\n    num = arr[i]\n    if num && num > 0 && num % 2 == 0\n      total += num\n    end\n  end\n  return total\nend`,
      correct: `def sum_even_numbers(arr, size)\n  total = 0\n  for i in 0...size\n    num = arr[i]\n    if num > 0 && num % 2 == 0\n      total += num\n    end\n  end\n  return total\nend`
    }
  },
  reverse_list: {
    cpp: {
      buggy: `#include <vector>\nusing namespace std;\n\nvoid reverseArray(const vector<int>& arr, int size, vector<int>& result) {\n    for (int i = 0; i < size; i++) {\n        result[i] = arr[i];\n    }\n}`,
      correct: `#include <vector>\nusing namespace std;\n\nvoid reverseArray(const vector<int>& arr, int size, vector<int>& result) {\n    for (int i = 0; i < size; i++) {\n        result[i] = arr[size - 1 - i];\n    }\n}`
    },
    java: {
      buggy: `public class Solution {\n    public static void reverseArray(int[] arr, int size, int[] result) {\n        for (int i = 0; i < size; i++) {\n            result[i] = arr[i];\n        }\n    }\n}`,
      correct: `public class Solution {\n    public static void reverseArray(int[] arr, int size, int[] result) {\n        for (int i = 0; i < size; i++) {\n            result[i] = arr[size - 1 - i];\n        }\n    }\n}`
    },
    python: {
      buggy: `def reverse_array(arr: list, size: int, result: list) -> None:\n    for i in range(size):\n        result[i] = arr[i]`,
      correct: `def reverse_array(arr: list, size: int, result: list) -> None:\n    for i in range(size):\n        result[i] = arr[size - 1 - i]`
    },
    javascript: {
      buggy: `function reverseArray(arr, size, result) {\n    for (let i = 0; i < size; i++) {\n        result[i] = arr[i];\n    }\n}`,
      correct: `function reverseArray(arr, size, result) {\n    for (let i = 0; i < size; i++) {\n        result[i] = arr[size - 1 - i];\n    }\n}`
    },
    typescript: {
      buggy: `export function reverseArray(arr: number[], size: number, result: number[]): void {\n    for (let i = 0; i < size; i++) {\n        result[i] = arr[i];\n    }\n}`,
      correct: `export function reverseArray(arr: number[], size: number, result: number[]): void {\n    for (let i = 0; i < size; i++) {\n        result[i] = arr[size - 1 - i];\n    }\n}`
    },
    csharp: {
      buggy: `public class Solution {\n    public static void ReverseArray(int[] arr, int size, int[] result) {\n        for (int i = 0; i < size; i++) {\n            result[i] = arr[i];\n        }\n    }\n}`,
      correct: `public class Solution {\n    public static void ReverseArray(int[] arr, int size, int[] result) {\n        for (int i = 0; i < size; i++) {\n            result[i] = arr[size - 1 - i];\n        }\n    }\n}`
    },
    go: {
      buggy: `package main\n\nfunc reverseArray(arr []int, size int, result []int) {\n    for i := 0; i < size; i++ {\n        result[i] = arr[i]\n    }\n}`,
      correct: `package main\n\nfunc reverseArray(arr []int, size int, result []int) {\n    for i := 0; i < size; i++ {\n        result[i] = arr[size - 1 - i]\n    }\n}`
    },
    rust: {
      buggy: `pub fn reverse_array(arr: &[i32], size: usize, result: &mut [i32]) {\n    for i in 0..size {\n        result[i] = arr[i];\n    }\n}`,
      correct: `pub fn reverse_array(arr: &[i32], size: usize, result: &mut [i32]) {\n    for i in 0..size {\n        result[i] = arr[size - 1 - i];\n    }\n}`
    },
    kotlin: {
      buggy: `fun reverseArray(arr: IntArray, size: Int, result: IntArray) {\n    for (i in 0 until size) {\n        result[i] = arr[i]\n    }\n}`,
      correct: `fun reverseArray(arr: IntArray, size: Int, result: IntArray) {\n    for (i in 0 until size) {\n        result[i] = arr[size - 1 - i]\n    }\n}`
    },
    swift: {
      buggy: `func reverseArray(_ arr: [Int], _ size: Int, _ result: inout [Int]) {\n    for i in 0..<size {\n        result[i] = arr[i]\n    }\n}`,
      correct: `func reverseArray(_ arr: [Int], _ size: Int, _ result: inout [Int]) {\n    for i in 0..<size {\n        result[i] = arr[size - 1 - i]\n    }\n}`
    },
    php: {
      buggy: `<?php\nfunction reverseArray($arr, $size, &$result) {\n    for ($i = 0; $i < $size; $i++) {\n        $result[$i] = $arr[$i];\n    }\n}`,
      correct: `<?php\nfunction reverseArray($arr, $size, &$result) {\n    for ($i = 0; $i < $size; $i++) {\n        $result[$i] = $arr[$size - 1 - $i];\n    }\n}`
    },
    ruby: {
      buggy: `def reverse_array(arr, size, result)\n  for i in 0...size\n    result[i] = arr[i]\n  end\nend`,
      correct: `def reverse_array(arr, size, result)\n  for i in 0...size\n    result[i] = arr[size - 1 - i]\n  end\nend`
    }
  }
};

// --- APPLICATION STATE ---
let currentChallengeKey = 'find_max';
let currentChallenge = BEGINNER_CHALLENGES.find_max;
let currentMode = 'student'; // 'student' | 'educator'
let currentCodeMode = 'buggy'; // 'buggy' | 'correct'
let currentLanguage = 'c';

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

function switchLanguage(lang) {
  currentLanguage = lang || 'c';
  setCodeMode(currentCodeMode);
}

function getCodeForLanguage(challengeKey, lang, mode) {
  if (lang === 'c') {
    const ch = BEGINNER_CHALLENGES[challengeKey];
    return mode === 'correct' ? (ch.correctCode || ch.starterCode) : ch.starterCode;
  }
  const tpl = MULTI_LANG_TEMPLATES[challengeKey]?.[lang];
  if (tpl) {
    return mode === 'correct' ? tpl.correct : tpl.buggy;
  }
  const ch = BEGINNER_CHALLENGES[challengeKey];
  return mode === 'correct' ? (ch.correctCode || ch.starterCode) : ch.starterCode;
}

function setCodeMode(mode) {
  currentCodeMode = mode;
  const btnBuggy = document.getElementById('btnBuggyMode');
  const btnCorrect = document.getElementById('btnCorrectMode');
  const editor = document.getElementById('codeEditor');

  if (mode === 'correct') {
    if (btnBuggy) btnBuggy.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition text-slate-400 hover:text-slate-200";
    if (btnCorrect) btnCorrect.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm";
    
    editor.value = getCodeForLanguage(currentChallengeKey, currentLanguage, 'correct');
    updateLineNumbers();
    resetFeedbackUI();
  } else {
    if (btnBuggy) btnBuggy.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm";
    if (btnCorrect) btnCorrect.className = "px-2.5 py-1 rounded-md text-[11px] font-medium transition text-slate-400 hover:text-slate-200";

    editor.value = getCodeForLanguage(currentChallengeKey, currentLanguage, 'buggy');
    updateLineNumbers();
    resetFeedbackUI();
  }
}

function resetStarterCode() {
  setCodeMode('buggy');
}

function setupLineNumbers() {
  const editor = document.getElementById('codeEditor');
  const gutter = document.getElementById('lineNumbers');

  const syncGutterScroll = () => {
    if (gutter && editor) {
      gutter.scrollTop = editor.scrollTop;
    }
  };

  if (editor) {
    editor.addEventListener('scroll', syncGutterScroll);
    editor.addEventListener('input', () => {
      updateLineNumbers();
      syncGutterScroll();
    });
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
        updateLineNumbers();
        syncGutterScroll();
      }
    });
  }

  updateLineNumbers();
}

function updateLineNumbers() {
  const editor = document.getElementById('codeEditor');
  if (!editor) return;
  const lines = editor.value.split('\n').length;
  const gutter = document.getElementById('lineNumbers');
  if (!gutter) return;

  gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div class="h-6 leading-6 text-right">${i + 1}</div>`).join('') + '<div class="h-10"></div>';
  gutter.scrollTop = editor.scrollTop;
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

// --- MULTI-LANGUAGE EXECUTION TRANSPILER ---
function stripLineCommentForLang(line, commentToken) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const prev = i > 0 ? line[i - 1] : '';
    if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble && line.startsWith(commentToken, i)) return line.slice(0, i);
  }
  return line;
}

function replaceMultiLangSignatures(code) {
  return code
    .replace(/(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:findMax|find_max|FindMax)\s*\([^)]*\)[^\{;\n]*(?=\{)/g, 'function findMax(numbers, size) ')
    .replace(/(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:countVowels|count_vowels|CountVowels)\s*\([^)]*\)[^\{;\n]*(?=\{)/g, 'function countVowels(text) ')
    .replace(/(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:sumEvenNumbers|sum_even_numbers|SumEvenNumbers)\s*\([^)]*\)[^\{;\n]*(?=\{)/g, 'function sumEvenNumbers(arr, size) ')
    .replace(/(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:void|fn|func|fun|function)\s+(?:reverseArray|reverse_array|ReverseArray)\s*\([^)]*\)[^\{;\n]*(?=\{)/g, 'function reverseArray(arr, size, result) ');
}

function transpilePythonToJs(code, challengeKey) {
  const fnMap = {
    find_max: 'findMax(numbers, size)',
    count_vowels: 'countVowels(text)',
    even_sum: 'sumEvenNumbers(arr, size)',
    reverse_list: 'reverseArray(arr, size, result)'
  };
  const expr = (s) => s
    .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\s+/g, '!')
    .replace(/\blen\s*\(([^)]+)\)/g, '($1).length')
    .replace(/\.lower\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/(\w+)\s+not\s+in\s+\(([^)]+)\)/g, '![$2].includes($1)')
    .replace(/(\w+)\s+in\s+\(([^)]+)\)/g, '[$2].includes($1)')
    .replace(/(\w+)\s+in\s+\[([^\]]+)\]/g, '[$2].includes($1)')
    .replace(/(\w+)\s+in\s+(['"][^'"]+['"])/g, '$2.includes($1)');

  const out = [];
  const indentStack = [0];
  const declared = new Set(['numbers', 'size', 'text', 'arr', 'result']);
  for (const rawLine of code.split('\n')) {
    const clean = stripLineCommentForLang(rawLine, '#').replace(/\s+$/, '');
    if (!clean.trim()) continue;
    const indent = (clean.match(/^(\s*)/) || ['', ''])[1].length;
    const t = clean.trim();
    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      out.push('}');
    }
    if (/^def\s+\w+\s*\([^)]*\)/.test(t)) {
      out.push(`function ${fnMap[challengeKey]} {`);
      indentStack.push(indent + 1);
    } else if (t.startsWith('elif ') && t.endsWith(':')) {
      out.push(`else if (${expr(t.slice(5, -1).trim())}) {`);
      indentStack.push(indent + 1);
    } else if (t === 'else:') {
      out.push('else {');
      indentStack.push(indent + 1);
    } else if (t.startsWith('if ') && t.endsWith(':')) {
      out.push(`if (${expr(t.slice(3, -1).trim())}) {`);
      indentStack.push(indent + 1);
    } else if (/^for\s+(\w+)\s+in\s+range\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*:$/.test(t)) {
      const m = t.match(/^for\s+(\w+)\s+in\s+range\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*:$/);
      declared.add(m[1]);
      out.push(`for (let ${m[1]} = ${expr(m[2])}; ${m[1]} < ${expr(m[3])}; ${m[1]}++) {`);
      indentStack.push(indent + 1);
    } else if (/^for\s+(\w+)\s+in\s+range\s*\(\s*([^)]+)\s*\)\s*:$/.test(t)) {
      const m = t.match(/^for\s+(\w+)\s+in\s+range\s*\(\s*([^)]+)\s*\)\s*:$/);
      declared.add(m[1]);
      out.push(`for (let ${m[1]} = 0; ${m[1]} < ${expr(m[2])}; ${m[1]}++) {`);
      indentStack.push(indent + 1);
    } else if (/^for\s+(\w+)\s+in\s+(.+)\s*:$/.test(t)) {
      const m = t.match(/^for\s+(\w+)\s+in\s+(.+)\s*:$/);
      declared.add(m[1]);
      out.push(`for (let ${m[1]} of ${expr(m[2])}) {`);
      indentStack.push(indent + 1);
    } else {
      let stmt = expr(t);
      const am = stmt.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (am && !declared.has(am[1])) {
        declared.add(am[1]);
        stmt = `let ${am[1]} = ${am[2]}`;
      }
      out.push(`${stmt};`);
    }
  }
  while (indentStack.length > 1) {
    indentStack.pop();
    out.push('}');
  }
  return out.join('\n');
}

function transpileRubyToJs(code, challengeKey) {
  const fnMap = {
    find_max: 'findMax(numbers, size)',
    count_vowels: 'countVowels(text)',
    even_sum: 'sumEvenNumbers(arr, size)',
    reverse_list: 'reverseArray(arr, size, result)'
  };
  const out = [];
  const declared = new Set(['numbers', 'size', 'text', 'arr', 'result']);
  for (const rawLine of code.split('\n')) {
    const t = stripLineCommentForLang(rawLine, '#').trim();
    if (!t) continue;
    if (/^def\s+\w+\s*\([^)]*\)/.test(t)) {
      out.push(`function ${fnMap[challengeKey]} {`);
    } else if (t === 'end') {
      out.push('}');
    } else if (t === 'else') {
      out.push('} else {');
    } else if (t.startsWith('elsif ')) {
      out.push(`} else if (${t.slice(6).replace(/\.downcase/g, '.toLowerCase()')}) {`);
    } else if (t.startsWith('if ')) {
      out.push(`if (${t.slice(3).replace(/\.downcase/g, '.toLowerCase()')}) {`);
    } else if (/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.\.([^\s]+)$/.test(t)) {
      const m = t.match(/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.\.([^\s]+)$/);
      declared.add(m[1]);
      out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} < ${m[3]}; ${m[1]}++) {`);
    } else if (/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.([^\s]+)$/.test(t)) {
      const m = t.match(/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.([^\s]+)$/);
      declared.add(m[1]);
      out.push(`for (let ${m[1]} = ${m[2]}; ${m[1]} <= ${m[3]}; ${m[1]}++) {`);
    } else if (/^(.+?)\.each_char\s+do\s+\|(\w+)\|$/.test(t)) {
      const m = t.match(/^(.+?)\.each_char\s+do\s+\|(\w+)\|$/);
      declared.add(m[2]);
      out.push(`for (let ${m[2]} of ${m[1].replace(/\.downcase/g, '.toLowerCase()')}) {`);
    } else {
      let stmt = t.replace(/\.downcase/g, '.toLowerCase()');
      const am = stmt.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (am && !declared.has(am[1])) {
        declared.add(am[1]);
        stmt = `let ${am[1]} = ${am[2]}`;
      }
      out.push(`${stmt};`);
    }
  }
  return out.join('\n');
}

function compileAndRunSolution(code, language, challengeKey) {
  let js = code;
  if (language === 'javascript') {
    js = code;
  } else if (language === 'typescript') {
    js = code
      .replace(/\bexport\s+/g, '')
      .replace(/(\b\w+)\s*:\s*(?:number\[\]|string\[\]|(?:number|string|boolean|void|any)\b)/g, '$1')
      .replace(/(function\s+\w+\s*\([^)]*\))\s*:\s*[A-Za-z0-9_<>\[\]\s|]+(\s*\{)/g, '$1$2');
  } else if (language === 'python') {
    js = transpilePythonToJs(code, challengeKey);
  } else if (language === 'ruby') {
    js = transpileRubyToJs(code, challengeKey);
  } else if (language === 'go') {
    js = replaceMultiLangSignatures(
      code.replace(/^\s*package\s+\w+\s*$/gm, '').replace(/^\s*import\s*\([\s\S]*?\)\s*$/gm, '').replace(/^\s*import\s+"[^"]+"\s*$/gm, '')
    )
      .replace(/unicode\.ToLower\s*\(/g, '__tolower(')
      .replace(/strings\.ToLower\s*\(([^)]+)\)/g, 'String($1).toLowerCase()')
      .replace(/\blen\s*\(([^)]+)\)/g, '($1).length')
      .replace(/for\s+_,\s*(\w+)\s*:=\s*range\s+([^\{]+)\{/g, 'for (let $1 of $2) {')
      .replace(/for\s+(\w+)\s*:=\s*([^;]+);\s*([^;]+);\s*([^\{]+)\{/g, 'for (let $1 = $2; $3; $4) {')
      .replace(/\bvar\s+(\w+)\s+\w+\s*=/g, 'let $1 =')
      .replace(/^(\s*)(\w+)\s*:=/gm, '$1let $2 =')
      .replace(/\belse\s+if\s+([^\{]+)\{/g, 'else if ($1) {')
      .replace(/\bif\s+([^\{]+)\{/g, 'if ($1) {');
  } else if (language === 'rust') {
    js = replaceMultiLangSignatures(code)
      .replace(/\blet\s+mut\s+/g, 'let ')
      .replace(/\.to_ascii_lowercase\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/\.to_lowercase\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/\.chars\s*\(\s*\)/g, '')
      .replace(/\.len\s*\(\s*\)/g, '.length')
      .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.=([^\{]+)\{/g, 'for (let $1 = $2; $1 <= $3; $1++) {')
      .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.([^\{]+)\{/g, 'for (let $1 = $2; $1 < $3; $1++) {')
      .replace(/for\s+(\w+)\s+in\s+([^\{]+)\{/g, 'for (let $1 of $2) {')
      .replace(/\belse\s+if\s+([^\{]+)\{/g, 'else if ($1) {')
      .replace(/\bif\s+([^\{]+)\{/g, 'if ($1) {');
  } else if (language === 'kotlin') {
    js = replaceMultiLangSignatures(code)
      .replace(/\b(?:val|var)\s+/g, 'let ')
      .replace(/\.lowercaseChar\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/\.lowercase\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/(\w+)\.size\b/g, '$1.length')
      .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+?)\s+until\s+([^)]+)\s*\)/g, 'for (let $1 = $2; $1 < $3; $1++)')
      .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+?)\.\.([^)]+)\s*\)/g, 'for (let $1 = $2; $1 <= $3; $1++)')
      .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+)\s*\)/g, 'for (let $1 of $2)');
  } else if (language === 'swift') {
    js = replaceMultiLangSignatures(code)
      .replace(/\b(?:var|let)\s+/g, 'let ')
      .replace(/\.lowercased\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/\.count\b/g, '.length')
      .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.\.([^\{]+)\{/g, 'for (let $1 = $2; $1 <= $3; $1++) {')
      .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.<([^\{]+)\{/g, 'for (let $1 = $2; $1 < $3; $1++) {')
      .replace(/for\s+(\w+)\s+in\s+([^\{]+)\{/g, 'for (let $1 of $2) {')
      .replace(/\belse\s+if\s+([^\{]+)\{/g, 'else if ($1) {')
      .replace(/\bif\s+([^\{]+)\{/g, 'if ($1) {');
  } else if (language === 'php') {
    const declared = new Set(['numbers', 'size', 'text', 'arr', 'result', 'i']);
    js = code
      .replace(/<\?php/gi, '').replace(/\?>/g, '').replace(/&\$/g, '$').replace(/\$([A-Za-z_]\w*)/g, '$1')
      .replace(/\b(?:count|strlen)\s*\(([^)]+)\)/g, '($1).length')
      .replace(/\bstrtolower\s*\(([^)]+)\)/g, 'String($1).toLowerCase()')
      .replace(/for\s*\(\s*(\w+)\s*=/g, 'for (let $1 =')
      .split('\n').map((l) => {
        const m = l.match(/^(\s*)([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
        if (m && !declared.has(m[2])) { declared.add(m[2]); return `${m[1]}let ${m[2]} = ${m[3]}`; }
        return l;
      }).join('\n');
  } else {
    js = code
      .replace(/#include\s*<.*?>/g, '').replace(/#include\s*".*?"/g, '')
      .replace(/using\s+namespace\s+\w+\s*;/g, '')
      .replace(/^\s*import\s+[^;]+;/gm, '').replace(/^\s*using\s+[^;]+;/gm, '');
    if (language === 'java' || language === 'csharp') {
      const classRx = /^\s*(?:public\s+|internal\s+)?class\s+\w+\s*\{/m;
      if (classRx.test(js)) js = js.replace(classRx, '').replace(/\}\s*$/, '');
    }
    js = replaceMultiLangSignatures(js)
      .replace(/std::tolower\s*\(/g, '__tolower(')
      .replace(/\btolower\s*\(/g, '__tolower(')
      .replace(/Character\.toLowerCase\s*\(/g, '__tolower(')
      .replace(/(?:char|Char)\.ToLower\s*\(/g, '__tolower(')
      .replace(/\.ToLower\s*\(\s*\)/g, '.toLowerCase()')
      .replace(/(\w+)\.charAt\s*\(([^)]+)\)/g, '$1[$2]')
      .replace(/\[i\]\s*!=\s*['"]\\0['"]/g, '.length > i')
      .replace(/text\[i\]\s*!=\s*['"]\\0['"]/g, 'i < text.length')
      .replace(/text\[i\]\s*!=\s*0/g, 'i < text.length')
      .replace(/strlen\s*\(([^)]+)\)/g, '($1).length')
      .replace(/\.size\s*\(\s*\)/g, '.length')
      .replace(/\.length\s*\(\s*\)/g, '.length')
      .replace(/\.Length\b/g, '.length')
      .replace(/\b(?:const\s+)?(?:std::)?(?:vector\s*<[^>]+>|string|String|int\[\]|size_t|int|char|float|double|long|boolean|bool|var)\s*&?\s+/g, 'let ');
  }

  const fnName = challengeKey === 'find_max' ? 'findMax' :
                 challengeKey === 'count_vowels' ? 'countVowels' :
                 challengeKey === 'even_sum' ? 'sumEvenNumbers' : 'reverseArray';

  const helper = `const __tolower = (c) => (typeof c === 'number' ? String.fromCharCode(c).toLowerCase() : String(c).toLowerCase());`;
  const sandbox = new Function(`${helper}\n${js};\nreturn ${fnName};`);
  return sandbox();
}

// --- DRAWER TAB SWITCHER (WASM, TERMINAL, WAT, RAM) ---
let currentDrawerTab = 'invariants';

function switchDrawerTab(tab) {
  currentDrawerTab = tab;
  const tabBtnInvariants = document.getElementById('tabBtnInvariants');
  const tabBtnTerminal = document.getElementById('tabBtnTerminal');
  const tabBtnWat = document.getElementById('tabBtnWat');
  const tabBtnMemory = document.getElementById('tabBtnMemory');

  const tabViewInvariants = document.getElementById('tabViewInvariants');
  const tabViewTerminal = document.getElementById('tabViewTerminal');
  const tabViewWat = document.getElementById('tabViewWat');
  const tabViewMemory = document.getElementById('tabViewMemory');

  const activeCls = "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#65c994] text-[#132319] shadow transition";
  const inactiveCls = "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition";

  if (tabBtnInvariants) tabBtnInvariants.className = tab === 'invariants' ? activeCls : inactiveCls;
  if (tabBtnTerminal) tabBtnTerminal.className = tab === 'terminal' ? activeCls : inactiveCls;
  if (tabBtnWat) tabBtnWat.className = tab === 'wat' ? activeCls : inactiveCls;
  if (tabBtnMemory) tabBtnMemory.className = tab === 'memory' ? activeCls : inactiveCls;

  if (tabViewInvariants) tabViewInvariants.className = tab === 'invariants' ? "space-y-2 max-h-56 overflow-y-auto" : "hidden";
  if (tabViewTerminal) tabViewTerminal.className = tab === 'terminal' ? "" : "hidden";
  if (tabViewWat) tabViewWat.className = tab === 'wat' ? "" : "hidden";
  if (tabViewMemory) tabViewMemory.className = tab === 'memory' ? "" : "hidden";

  if (window.lucide) lucide.createIcons();
}

// --- TEST RUNNER & FORMATIVE FEEDBACK GENERATOR (WASM + MULTI-LANG) ---
async function runTestsAndEvaluate() {
  const code = document.getElementById('codeEditor').value;
  const drawerBody = document.getElementById('testResultsBody');
  const title = document.getElementById('testDrawerTitle');
  const terminalBody = document.getElementById('terminalBody');
  const watBody = document.getElementById('watBody');
  const memoryBody = document.getElementById('memoryBody');
  const badgeWarnings = document.getElementById('badgeWarnings');
  const compStatus = document.getElementById('compilationStatusText');

  // 1. REAL IN-BROWSER C TO WEBASSEMBLY COMPILATION
  if (currentLanguage === 'c' && typeof CWasmEngine !== 'undefined') {
    const wasmEngine = new CWasmEngine();
    try {
      const wasmResult = await wasmEngine.compileAndRunTests(code, currentChallengeKey, currentChallenge.testCases);

      // Populate WebAssembly Disassembly (WAT)
      if (watBody) watBody.innerText = wasmResult.watText;

      // Populate Linear Memory RAM Inspector
      if (memoryBody) memoryBody.innerText = wasmResult.memoryHex;

      // Populate Clang Terminal Diagnostic
      if (terminalBody) terminalBody.innerText = wasmResult.terminalOutput;

      // Update compilation status badge
      if (compStatus) {
        compStatus.innerText = `WASM 1.0 (${wasmResult.binarySize}B in ${wasmResult.compileTimeMs}ms)`;
      }

      // Update compiler warning badge
      if (badgeWarnings) {
        if (wasmResult.warnings && wasmResult.warnings.length > 0) {
          badgeWarnings.innerText = String(wasmResult.warnings.length);
          badgeWarnings.classList.remove('hidden');
        } else {
          badgeWarnings.classList.add('hidden');
        }
      }

      // Render Test Cards
      let passedCount = 0;
      const cards = wasmResult.results.map((res) => {
        if (res.pass) passedCount++;
        return `
          <div class="p-3 rounded-xl border text-xs sm:text-sm font-code transition ${res.pass ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-rose-950/20 border-rose-500/30 text-slate-200'}">
            <div class="flex items-center justify-between font-sans mb-1.5">
              <span class="font-bold flex items-center gap-1.5 ${res.pass ? 'text-emerald-400' : 'text-rose-400'}">
                <i data-lucide="${res.pass ? 'check-circle-2' : 'x-circle'}" class="w-4 h-4"></i>
                ${res.name}
              </span>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full uppercase ${res.pass ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
                ${res.pass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div class="text-xs text-slate-300 space-y-1">
              <div><span class="text-slate-500 font-sans">Input: </span><code class="text-slate-200">${res.input}</code></div>
              <div><span class="text-slate-500 font-sans">Expected: </span><span class="text-emerald-400 font-semibold">${res.expected}</span></div>
              <div><span class="text-slate-500 font-sans">Actual: </span><span class="${res.pass ? 'text-emerald-400' : 'text-rose-400 font-bold'}">${res.actual}</span></div>
            </div>
          </div>
        `;
      });

      if (drawerBody) drawerBody.innerHTML = cards.join('');
      const total = currentChallenge.testCases.length;
      if (title) title.innerText = `Unit Invariants (${passedCount}/${total} Passed)`;

      generateFormativeFeedback(code, passedCount, total);

      if (passedCount === total) {
        advanceMastery('practised');
      } else if (passedCount > 0) {
        advanceMastery('corrected');
      }

      if (window.lucide) lucide.createIcons();
      return;
    } catch (compileErr) {
      const errLine = compileErr.line || 1;
      const errCol = compileErr.col || 1;
      const errMsg = compileErr.message || 'C Compilation Error';
      const lines = code.split('\n');
      const offendingLine = lines[errLine - 1] || '';
      const caret = ' '.repeat(Math.max(0, errCol - 1)) + '^';

      const clangError = [
        `$ clang -Wall -Wextra -std=c99 -pedantic solution.c -o solution.wasm`,
        `solution.c:${errLine}:${errCol}: error: ${errMsg}`,
        `    ${offendingLine}`,
        `    ${caret}`,
        `1 error generated. Compilation terminated.`
      ].join('\n');

      if (terminalBody) terminalBody.innerText = clangError;
      if (compStatus) compStatus.innerText = 'Compilation Failed (1 Error)';
      if (badgeWarnings) {
        badgeWarnings.innerText = '!';
        badgeWarnings.classList.remove('hidden');
      }

      if (drawerBody) {
        drawerBody.innerHTML = `
          <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs sm:text-sm">
            <strong class="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
              <i data-lucide="alert-octagon" class="w-4 h-4"></i>
              Clang Compilation / Syntax Error (Line ${errLine}:${errCol})
            </strong>
            <p class="font-mono text-xs text-rose-200 mt-1">${errMsg}</p>
            <p class="text-xs text-slate-400 mt-2 font-sans">Check the <strong>Clang Terminal</strong> tab for caret diagnostics.</p>
          </div>
        `;
      }
      if (title) title.innerText = 'Compilation Error';

      // Show formative feedback on compiler error
      generateFormativeFeedback(code, 0, currentChallenge.testCases.length, compileErr);
      if (window.lucide) lucide.createIcons();
      return;
    }
  }

  // 2. MULTI-LANGUAGE SANDBOX RUNNER (For JS, Python, Rust, Go, etc.)
  let studentFn = null;
  try {
    studentFn = compileAndRunSolution(code, currentLanguage, currentChallengeKey);
    if (terminalBody) {
      terminalBody.innerText = `$ ${currentLanguage} --eval solution\nCompilation clean. Executing unit test suite.`;
    }
    if (compStatus) compStatus.innerText = `${LANGUAGE_LABELS[currentLanguage]} Execution`;
  } catch (err) {
    if (drawerBody) {
      drawerBody.innerHTML = `
        <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs sm:text-sm">
          <strong class="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
            <i data-lucide="alert-octagon" class="w-4 h-4"></i>
            ${LANGUAGE_LABELS[currentLanguage] || 'Code'} Compilation / Syntax Error
          </strong>
          <span>${err.message}</span>
        </div>`;
    }
    if (title) title.innerText = `Compilation Error`;
    if (window.lucide) lucide.createIcons();
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

  if (drawerBody) drawerBody.innerHTML = cards.join('');
  const total = currentChallenge.testCases.length;
  if (title) title.innerText = `Unit Invariants (${passedCount}/${total} Passed)`;
  if (window.lucide) lucide.createIcons();

  generateFormativeFeedback(code, passedCount, total);

  if (passedCount === total) {
    advanceMastery('practised');
  } else if (passedCount > 0) {
    advanceMastery('corrected');
  }
}

// --- 4-PART FORMATIVE FEEDBACK ENGINE (MULTI-LANGUAGE) ---
function generateFormativeFeedback(code, passed, total, compileError = null) {
  const langName = LANGUAGE_LABELS[currentLanguage] || 'C';
  let wellDone = "";
  let problem = "";
  let why = "";
  let improvement = "";
  let nextStep = "";

  if (compileError) {
    wellDone = `Your ${langName} code was submitted to the in-browser Clang / WebAssembly compiler.`;
    problem = `Compilation failed on line ${compileError.line || 1}, col ${compileError.col || 1}: "${compileError.message || 'Syntax Error'}".`;
    why = "In C99/C11, the compiler strictly enforces punctuation: all statements must terminate with a semicolon ';', types must match, and parentheses/braces must balance.";
    improvement = `Examine line ${compileError.line || 1} in the code editor, resolve the syntax mismatch, and click 'Compile & Run (WASM)'.`;
    nextStep = "Click the 'Clang Terminal' tab below to view the compiler error and caret pointer ^.";

    currentFeedbackReport = {
      passed: 0,
      total,
      score: 0,
      wellDone,
      problem,
      why,
      improvement,
      nextStep
    };
    renderFormativeFeedbackUI();
    return;
  }

  // ================= LAB 1: FIND MAX =================
  if (currentChallengeKey === 'find_max') {
    const hasMaxZero = /(?:max|max_val|maxVal)\s*(?::?=)\s*0\b/.test(code);

    if (passed === total) {
      wellDone = `Outstanding! In ${langName}, you initialized the maximum variable to \`numbers[0]\` to safely handle negative integers and maintained clean loop bounds.`;
      problem = "None detected. All positive, negative, and single-element arrays pass cleanly.";
      why = "By setting the baseline maximum to the first element `numbers[0]`, your comparison invariant holds true across both positive and negative numbers.";
      improvement = "Ready for the Socratic reflection: explain why this approach avoids magic numbers like `-999999`.";
      nextStep = "Click 'Mastery Check' to record your reasoning and claim Mastered status 🏆";
    } else if (hasMaxZero) {
      wellDone = `Your ${langName} loop iterates through the array and compares elements against the running maximum. It works for positive numbers like {3, 7, 2, 9}.`;
      problem = "Failed on all-negative arrays: `{-8, -3, -10}` returned `0` instead of `-3`, and `{-42}` returned `0` instead of `-42`.";
      why = "You initialized the maximum variable to `0`. Because 0 is larger than all negative integers, `numbers[i] > max` is never true, so it remains 0—a value not even in the array!";
      improvement = "Initialize the maximum variable using the first element of the array (`numbers[0]`) so it starts with a real value from the dataset.";
      nextStep = "Update the initialization to `numbers[0]` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = `Good effort setting up the ${langName} function structure and array traversal.`;
      problem = `Passed ${passed} of ${total} test cases. Check edge case handling for negative integers.`;
      why = "Ensure your comparison logic `numbers[i] > max` accurately tracks the largest value.";
      improvement = "Initialize the maximum variable to `numbers[0]` and loop from index `1` to `size - 1`.";
      nextStep = "Test with `{-8, -3, -10}` and verify the output is `-3`.";
    }
  }

  // ================= LAB 2: COUNT VOWELS =================
  else if (currentChallengeKey === 'count_vowels') {
    const hasToLower = /tolower|toLower|ToLower|lower\(|lowercase|downcase|strtolower/i.test(code);
    const checksUpperExplicitly = /['"]A['"]|['"]E['"]|['"]I['"]|['"]O['"]|['"]U['"]/.test(code);

    if (passed === total) {
      wellDone = hasToLower
        ? `Outstanding! In ${langName}, you normalized character casing so both uppercase ('A', 'E') and lowercase vowels are counted uniformly.`
        : `Great job! Your ${langName} condition handles both uppercase and lowercase vowels accurately.`;
      problem = "None! Handled lowercase (\"hello\"), mixed case (\"Apple\"), all uppercase (\"PROGRAMMING\"), and no vowels (\"rhythm\") cleanly.";
      why = "Normalizing characters to lowercase converts uppercase ASCII/Unicode values ('A' [65] -> 'a' [97]) before equality checks.";
      improvement = "Clean tip: Normalizing case once per character avoids duplicating 10 separate vowel comparisons!";
      nextStep = "Click 'Mastery Check' to explain character representation and claim Mastered status 🏆";
    } else if (!hasToLower && !checksUpperExplicitly) {
      wellDone = `Your ${langName} loop traverses the string and counts lowercase vowels (like in "hello" [2] and "rhythm" [0]).`;
      problem = "Failed on uppercase inputs: \"Apple\" returned 1 instead of 2 (missed capital 'A'), and \"PROGRAMMING\" returned 0 instead of 3 (missed 'O', 'A', 'I').";
      why = "Characters are distinct by case ('A' is 65 and 'a' is 97, so `'A' == 'a'` is false). Checking only lowercase `'a', 'e', 'i', 'o', 'u'` skips uppercase vowels.";
      improvement = `Normalize each character to lowercase in ${langName} (e.g., \`tolower()\` in C/C++, \`toLowerCase()\` in JS/Java, \`.lower()\` in Python) before testing vowels.`;
      nextStep = "Add lowercase normalization and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "String traversal loop is in place.";
      problem = `Passed ${passed} of ${total} tests. Review the failing inputs in the test results below.`;
      why = "Ensure you check for all 5 vowels (a, e, i, o, u) and handle both uppercase and lowercase forms.";
      improvement = "Normalize each character to lowercase before checking `'a', 'e', 'i', 'o', 'u'`.";
      nextStep = "Re-run tests after verifying character comparison checks.";
    }
  }

  // ================= LAB 3: EVEN SUM =================
  else if (currentChallengeKey === 'even_sum') {
    const hasOneBasedIndex = /for\s*\([^;]*\bi\s*:?=\s*1\b|range\s*\(\s*1\b|\b1\s*\.\.=?\.?\s*size\b|\b1\s+until\b/.test(code);

    if (passed === total) {
      wellDone = `Great work in ${langName}! Your loop starts at index 0 and accurately sums positive even integers while filtering out odd and negative numbers.`;
      problem = "No errors detected. Handled even numbers, negative evens, and mixed inputs correctly.";
      why = "0-based indexing (`0` up to `size - 1`) guarantees that every element—from `arr[0]` to `arr[size - 1]`—is safely visited without out-of-bounds access.";
      improvement = "Good practice: Strict `< size` loop bounds prevent off-by-one errors across every mainstream language.";
      nextStep = "Complete the Mastery Check reflection on 0-based array indexing.";
    } else if (hasOneBasedIndex) {
      wellDone = "Your even-number filter (`num > 0 && num % 2 == 0`) correctly identifies positive even integers.";
      problem = "Failed on `{2, 4, 6}` (returned 10 instead of 12) and `{8, 10}` (returned 10 instead of 18). The very first item at `arr[0]` was skipped!";
      why = "Arrays are 0-indexed: the first element is at `arr[0]`. Starting at `1` skips `arr[0]` completely, and looping through `size` inclusively reads out of bounds!";
      improvement = `Change the ${langName} loop to start at \`0\` and stop strictly before \`size\`.`;
      nextStep = "Fix the loop bounds to `0 .. size - 1` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Accumulator setup is ready.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Ensure you check both `num > 0` and `num % 2 == 0`.";
      improvement = "Verify that negative even numbers (like -2, -6) are not added to the total.";
      nextStep = "Test with `{-2, 4, -6, 8}` to verify that only 4 and 8 are summed.";
    }
  }

  // ================= LAB 4: REVERSE LIST =================
  else {
    const hasForwardLoop = /result\s*\[\s*(?:\$)?i\s*\]\s*=\s*(?:\$)?arr\s*\[\s*(?:\$)?i\s*\]/.test(code);

    if (passed === total) {
      wellDone = `Superb ${langName} solution! You reversed the array by calculating \`arr[size - 1 - i]\` and populated \`result\` correctly.`;
      problem = "Zero flaws. Odd-length, single-element, and multi-element arrays reversed correctly.";
      why = "Using the index mapping `result[i] = arr[size - 1 - i]` places the last element into index 0, reversing the sequence in a clean single pass.";
      improvement = "Next-level tip: You could also reverse in-place by swapping `arr[start]` and `arr[end]` with a temporary variable to save memory!";
      nextStep = "Proceed to the reflection to evaluate memory usage between new buffer vs in-place swap.";
    } else if (hasForwardLoop) {
      wellDone = "Array initialization and function signature are ready.";
      problem = "The array is not reversed. For `{1, 2, 3, 4}`, your code produced `{1, 2, 3, 4}` (an exact forward copy).";
      why = "Your assignment sets `result[i] = arr[i]`. This copies items from left to right in original order instead of reverse.";
      improvement = "Map the index from the back: `result[i] = arr[size - 1 - i]` so that when `i = 0`, it takes `arr[size - 1]` (the last element).";
      nextStep = "Update the assignment to `arr[size - 1 - i]` and click 'Run Tests & Diagnose'.";
    } else {
      wellDone = "Function structure is in place.";
      problem = `Passed ${passed} of ${total} tests.`;
      why = "Make sure each index `i` reads from `size - 1 - i`.";
      improvement = "Check your index formula: `result[i] = arr[size - 1 - i]`.";
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
        Click <strong class="text-[#8ae0b3] font-semibold">Compile & Run (WASM)</strong> above to compile your C code to real WebAssembly and receive structured formative feedback.
      </p>
    </div>
  `;
  const title = document.getElementById('testDrawerTitle');
  if (title) title.innerText = 'Unit Invariants';
  const testResultsBody = document.getElementById('testResultsBody');
  if (testResultsBody) testResultsBody.innerHTML = '<p class="text-slate-500 text-center py-2 text-xs">Click "Compile & Run (WASM)" to evaluate your C code.</p>';
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) terminalBody.innerText = `$ clang -Wall -Wextra -std=c99 -pedantic solution.c -o solution.wasm\nTarget: wasm32-unknown-wasi (Linear Memory 64KB)\nReady to compile. Press "Compile & Run (WASM)" above.`;
  const watBody = document.getElementById('watBody');
  if (watBody) watBody.innerText = ';; WebAssembly Text representation (WAT)\n;; Disassembled WASM 1.0 instructions will be generated upon compilation.';
  const memoryBody = document.getElementById('memoryBody');
  if (memoryBody) memoryBody.innerText = ';; WebAssembly Linear Memory (Page 0: 64KB)\n;; Offset 0x1000 holds array and string buffers. Run compilation to inspect raw byte addresses.';
  const badgeWarnings = document.getElementById('badgeWarnings');
  if (badgeWarnings) badgeWarnings.classList.add('hidden');
  const compStatus = document.getElementById('compilationStatusText');
  if (compStatus) compStatus.innerText = 'WASM In-Browser Clang JIT';
  switchDrawerTab('invariants');
  if (window.lucide) lucide.createIcons();
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
