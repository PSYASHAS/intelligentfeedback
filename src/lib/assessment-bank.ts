import { AssessmentChallenge } from './types';

export const ASSESSMENT_CHALLENGES: AssessmentChallenge[] = [
  {
    id: 'find_max',
    title: 'Lab 1: Find Maximum Number in an Array (C Language)',
    targetTopic: 'Arrays, Loop Traversal, and Integer Limits in C',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: {
      score: 52,
      category: 'Medium (50–64%)',
      taskStrength: 'Tests array indexing numbers[i], loop condition i < size, and conditional updates in C.',
      limitation: 'Standard max code without context is easily memorized by AI (85% solvability).',
      suggestedImprovement: 'Providing the negative-number bug and requiring students to analyze and explain why max = numbers[0] is safer reduces AI-solvability to 52%.'
    },
    description: `A 1st-semester student wrote a C function \`int findMax(int numbers[], int size)\` to find the largest integer in an array.

However, their C code contains a **classic beginner mistake**: it works for positive numbers like \`{3, 7, 2, 9}\`, but fails completely when all numbers in the array are negative (e.g., \`{-8, -3, -10}\`).

**Your Tasks:**
1. **Identify the mistake**: Why does initializing \`int max = 0;\` fail when all integers are negative?
2. **Correct the code**: Update the initialization so that \`max\` starts at the first array element (\`numbers[0]\`).
3. **Test edge cases**: Verify your fix handles all-negative arrays and single-element arrays in C.`,
    starterCode: {
      c: `#include <stdio.h>

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
}`,
      javascript: `function findMax(numbers, size) {
    if (!numbers || size <= 0) return 0;
    // MISTAKE: Initializing to 0 fails for negative numbers
    let max = 0;
    for (let i = 0; i < size; i++) {
        if (numbers[i] > max) max = numbers[i];
    }
    return max;
}`,
      typescript: `export function findMax(numbers: number[], size: number): number {
    if (!numbers || size <= 0) return 0;
    let max = 0;
    for (let i = 0; i < size; i++) {
        if (numbers[i] > max) max = numbers[i];
    }
    return max;
}`,
      python: `def find_max(numbers: list, size: int) -> int:
    if not numbers or size <= 0:
        return 0
    # MISTAKE: Initializing to 0 fails for negative numbers
    max_val = 0
    for i in range(size):
        if numbers[i] > max_val:
            max_val = numbers[i]
    return max_val`
    },
    flawExplanation: {
      identifiedMistake: "Initializing int max = 0;. If all numbers in the array are negative (e.g. {-8, -3, -10}), max remains 0, which is incorrect because 0 was never in the array!",
      rootCause: "Mental model assumption that numbers are always positive, failing to consider negative integers.",
      remediationSuggestion: "Initialize int max = numbers[0]; (the first element of the array) instead of 0."
    },
    testCases: [
      {
        id: 'tc-max-1',
        name: 'Positive numbers {3, 7, 2, 9}',
        inputDescription: '{3, 7, 2, 9}, size = 4',
        expectedOutput: '9'
      },
      {
        id: 'tc-max-2',
        name: 'All negative numbers {-8, -3, -10}',
        inputDescription: '{-8, -3, -10}, size = 3',
        expectedOutput: '-3'
      },
      {
        id: 'tc-max-3',
        name: 'Single negative number {-42}',
        inputDescription: '{-42}, size = 1',
        expectedOutput: '-42'
      },
      {
        id: 'tc-max-4',
        name: 'Mixed numbers {-5, 0, 12, -2}',
        inputDescription: '{-5, 0, 12, -2}, size = 4',
        expectedOutput: '12'
      }
    ],
    reflectionPrompt: 'In C, why is initializing int max = numbers[0]; safer than writing int max = -999999;?',
    rubricCriteria: [
      { name: 'Boundary Invariants', weight: 40, description: 'Correctly handles all-negative and single-element arrays.' },
      { name: 'C Memory Safety', weight: 30, description: 'Ensures safe traversal within 0 to size-1 bounds.' },
      { name: 'Conceptual Reasoning', weight: 30, description: 'Understands why arbitrary constants fail as boundary sentinels.' }
    ]
  },

  {
    id: 'count_vowels',
    title: 'Lab 2: Count Vowels in a String (C Character Handling)',
    targetTopic: 'C Strings (char arrays), <ctype.h>, and ASCII Encoding',
    bloomLevel: 'apply',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: {
      score: 68,
      category: 'Medium-High (65–74%)',
      taskStrength: 'Reinforces null-terminator loop traversal text[i] != \'\\0\' and character handling in C.',
      limitation: 'AI handles basic string operations with high accuracy.',
      suggestedImprovement: 'Testing uppercase and mixed-case inputs tests student understanding of character representation in C (ASCII byte values).'
    },
    description: `Write a C function \`int countVowels(char text[])\` that counts vowels (a, e, i, o, u) in a null-terminated C string.

**The Beginner Mistake in Starter Code:**
The starter C code only checks lowercase characters: \`ch == 'a' || ch == 'e' ...\`. In C, character comparisons compare ASCII integer values (\`'A'\` is 65, while \`'a'\` is 97). Because \`'A' == 'a'\` is false, the function completely misses uppercase vowels in words like \`"Apple"\` and \`"PROGRAMMING"\`.

**Your Tasks:**
1. Ensure case insensitivity using the \`tolower()\` function from \`<ctype.h>\` (or by checking uppercase characters).
2. Verify that both uppercase and lowercase vowels are counted correctly.`,
    starterCode: {
      c: `#include <stdio.h>
#include <ctype.h>

/**
 * Lab 2: Count vowels (a, e, i, o, u) in a C string.
 * Bug: The code fails on uppercase letters like "Apple" and "PROGRAMMING".
 */
int countVowels(char text[]) {
    int count = 0;

    // Traverses until the null-terminator '\\0'
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
      javascript: `function countVowels(text) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        let ch = text[i];
        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;
    }
    return count;
}`,
      typescript: `export function countVowels(text: string): number {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        let ch = text[i];
        if (ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u') count++;
    }
    return count;
}`,
      python: `def count_vowels(text: str) -> int:
    count = 0
    for ch in text:
        if ch in ('a', 'e', 'i', 'o', 'u'):
            count += 1
    return count`
    },
    flawExplanation: {
      identifiedMistake: "The condition only checks lowercase characters ('a', 'e', 'i', 'o', 'u'). It misses uppercase vowels, returning 1 instead of 2 for 'Apple', and 0 instead of 3 for 'PROGRAMMING'.",
      rootCause: "In C, characters are numeric ASCII values ('A' is 65, 'a' is 97). Because 'A' == 'a' evaluates to false, uppercase letters are skipped.",
      remediationSuggestion: "Use tolower() from <ctype.h> on character reading: char ch = tolower(text[i]);."
    },
    testCases: [
      {
        id: 'tc-vow-1',
        name: 'Simple lowercase: "hello"',
        inputDescription: '"hello"',
        expectedOutput: '2'
      },
      {
        id: 'tc-vow-2',
        name: 'Mixed case: "Apple"',
        inputDescription: '"Apple"',
        expectedOutput: '2'
      },
      {
        id: 'tc-vow-3',
        name: 'All uppercase: "PROGRAMMING"',
        inputDescription: '"PROGRAMMING"',
        expectedOutput: '3'
      },
      {
        id: 'tc-vow-4',
        name: 'No vowels: "rhythm"',
        inputDescription: '"rhythm"',
        expectedOutput: '0'
      }
    ],
    reflectionPrompt: "In C, what is the ASCII value difference between uppercase 'A' and lowercase 'a', and what does tolower('A') return?",
    rubricCriteria: [
      { name: 'ASCII Invariant & Case Insensitivity', weight: 40, description: 'Accurately maps uppercase ASCII to lowercase.' },
      { name: 'Null-Terminator Traversal', weight: 30, description: 'Safely stops loop when reaching \\0.' },
      { name: 'Header & Function Usage', weight: 30, description: 'Properly leverages <ctype.h> functions.' }
    ]
  },

  {
    id: 'even_sum',
    title: 'Lab 3: Sum of Even Numbers (1-Based Indexing in C)',
    targetTopic: '0-Based Array Bounds and Modulo Operator in C',
    bloomLevel: 'analyse',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: {
      score: 58,
      category: 'Medium (50–64%)',
      taskStrength: 'Reinforces 0-based memory indexing and buffer boundaries in C.',
      limitation: 'Generating sum loops is trivial for standard LLMs.',
      suggestedImprovement: 'Requiring students to detect off-by-one errors and explain undefined memory access drops solvability to 58%.'
    },
    description: `Implement \`int sumEvenNumbers(int arr[], int size)\` to calculate the sum of all positive even integers in an array.

**The Beginner Mistake in Starter Code:**
A student wrote \`for (int i = 1; i <= size; i++)\`. Because C arrays are 0-indexed, starting at \`i = 1\` **skips the very first element \`arr[0]\`**, and accessing \`arr[size]\` accesses unallocated memory out of bounds! For \`{2, 4, 6}\`, the code skips 2 and returns 10 instead of 12.

**Your Tasks:**
1. Correct the loop starting index to 0: \`int i = 0\`.
2. Fix the termination condition to \`i < size\` so all elements from index 0 to size-1 are traversed.`,
    starterCode: {
      c: `#include <stdio.h>

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
      javascript: `function sumEvenNumbers(arr, size) {
    let total = 0;
    for (let i = 1; i <= size; i++) {
        let num = arr[i];
        if (num > 0 && num % 2 === 0) total += num;
    }
    return total;
}`,
      typescript: `export function sumEvenNumbers(arr: number[], size: number): number {
    let total = 0;
    for (let i = 1; i <= size; i++) {
        let num = arr[i];
        if (num > 0 && num % 2 === 0) total += num;
    }
    return total;
}`,
      python: `def sum_even_numbers(arr: list, size: int) -> int:
    total = 0
    for i in range(1, size + 1):
        if i < len(arr) and arr[i] > 0 and arr[i] % 2 == 0:
            total += arr[i]
    return total`
    },
    flawExplanation: {
      identifiedMistake: "The loop starts at i = 1 and ends at i <= size. This skips the first element arr[0] and accesses arr[size] out-of-bounds!",
      rootCause: "Misunderstanding that C arrays are 0-indexed (indices range from 0 to size-1).",
      remediationSuggestion: "Change loop header to for (int i = 0; i < size; i++)."
    },
    testCases: [
      {
        id: 'tc-sum-1',
        name: 'Even numbers {2, 4, 6}',
        inputDescription: '{2, 4, 6}, size = 3',
        expectedOutput: '12'
      },
      {
        id: 'tc-sum-2',
        name: 'First item is even {8, 10}',
        inputDescription: '{8, 10}, size = 2',
        expectedOutput: '18'
      },
      {
        id: 'tc-sum-3',
        name: 'Mixed with odd {1, 2, 3, 4, 5}',
        inputDescription: '{1, 2, 3, 4, 5}, size = 5',
        expectedOutput: '6'
      },
      {
        id: 'tc-sum-4',
        name: 'Includes negative evens {-2, 4, -6, 8}',
        inputDescription: '{-2, 4, -6, 8}, size = 4',
        expectedOutput: '12'
      }
    ],
    reflectionPrompt: "In C, what occurs when a program accesses arr[size] in an array declared with size elements?",
    rubricCriteria: [
      { name: '0-Based Indexing Invariant', weight: 40, description: 'Starts at 0 and ends strictly before size.' },
      { name: 'Memory Boundary Protection', weight: 30, description: 'Zero out-of-bounds memory accesses.' },
      { name: 'Even Number & Positive Filter', weight: 30, description: 'Correctly checks num > 0 && num % 2 == 0.' }
    ]
  },

  {
    id: 'reverse_list',
    title: 'Lab 4: Reverse an Array (C Memory & Buffer Invariant)',
    targetTopic: 'Array Index Mapping and In-Place Memory in C',
    bloomLevel: 'evaluate',
    difficulty: 'Semester 1 — Basic C',
    aiSolvability: {
      score: 45,
      category: 'Low (<50%)',
      taskStrength: 'Requires understanding index symmetry arr[size - 1 - i] without high-level library functions.',
      limitation: 'Can be solved using helper buffer or two-pointer in-place swap.',
      suggestedImprovement: 'Asking students to compare memory footprints between buffer copying and in-place swapping achieves Low AI-solvability (<50%).'
    },
    description: `In C, there is no built-in \`array.reverse()\` method. Write a C function \`void reverseArray(int arr[], int size, int result[])\` that populates \`result[]\` with elements of \`arr[]\` in reverse order.

**The Beginner Mistake in Starter Code:**
The student attempted to copy elements, but wrote \`result[i] = arr[i];\`, creating a normal forward copy instead of reversing the elements!

**Your Tasks:**
1. Update the index assignment so \`result[i]\` receives \`arr[size - 1 - i]\`.
2. Ensure odd-length, single-element, and multi-element arrays are correctly reversed.`,
    starterCode: {
      c: `#include <stdio.h>

/**
 * Lab 4: Reverse an array into a destination buffer.
 * Bug: Currently copies elements forward instead of in reverse!
 */
void reverseArray(int arr[], int size, int result[]) {
    for (int i = 0; i < size; i++) {
        // MISTAKE HERE: Copies forward arr[i] instead of arr[size - 1 - i]
        result[i] = arr[i];
    }
}`,
      javascript: `function reverseArray(arr, size, result) {
    for (let i = 0; i < size; i++) {
        result[i] = arr[i];
    }
}`,
      typescript: `export function reverseArray(arr: number[], size: number, result: number[]): void {
    for (let i = 0; i < size; i++) {
        result[i] = arr[i];
    }
}`,
      python: `def reverse_array(arr: list, size: int, result: list) -> None:
    for i in range(size):
        result[i] = arr[i]`
    },
    flawExplanation: {
      identifiedMistake: "The assignment on line 10 assigns result[i] = arr[i];. This copies items in their original order instead of reverse.",
      rootCause: "Failure to calculate the symmetric mirror index (size - 1 - i).",
      remediationSuggestion: "Assign from the rear: result[i] = arr[size - 1 - i];."
    },
    testCases: [
      {
        id: 'tc-rev-1',
        name: 'Reversing {1, 2, 3, 4}',
        inputDescription: '{1, 2, 3, 4}, size = 4',
        expectedOutput: '{4, 3, 2, 1}'
      },
      {
        id: 'tc-rev-2',
        name: 'Odd-length array {10, 20, 30}',
        inputDescription: '{10, 20, 30}, size = 3',
        expectedOutput: '{30, 20, 10}'
      },
      {
        id: 'tc-rev-3',
        name: 'Single item {100}',
        inputDescription: '{100}, size = 1',
        expectedOutput: '{100}'
      },
      {
        id: 'tc-rev-4',
        name: 'Two elements {5, 99}',
        inputDescription: '{5, 99}, size = 2',
        expectedOutput: '{99, 5}'
      }
    ],
    reflectionPrompt: "In C, what is the memory advantage of reversing an array in-place using two pointers compared to allocating a separate result buffer?",
    rubricCriteria: [
      { name: 'Symmetric Index Mapping', weight: 40, description: 'Correctly maps index i to size - 1 - i.' },
      { name: 'Odd & Even Symmetry', weight: 30, description: 'Reverses both odd and even length arrays.' },
      { name: 'Memory Tradeoff Evaluation', weight: 30, description: 'Understands O(1) in-place vs O(N) buffer tradeoff.' }
    ]
  }
];
