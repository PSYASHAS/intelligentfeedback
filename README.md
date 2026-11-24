# Mistake-to-Mastery: AI-Resilient Coding & Automated Formative Feedback

An educational platform for introductory programming (Semester 1 C Language), grounded in the research paper:
> **"Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback Tool to Foster Critical Thinking and Originality"**  
> *Dr. Rachel Akbar, School of Computer Science, The University of Sydney (2025).*

---

## 📖 Pedagogical Philosophy

Instead of relying on brittle AI text detectors that produce high false-positive rates and stifle learner engagement, this platform adopts the paper's core philosophy:
1. **Design Cognitively Demanding Assessments:** Move beyond simple recall (syntax) to higher-order cognitive domains (debugging, edge-case evaluation, and reflection).
2. **AI-Resilience by Design:** Questions that require diagnosing flawed starter code, explaining root misconceptions, and handling edge cases inherently reduce AI-solvability.
3. **Actionable 4-Part Formative Feedback:** Feedback answers four essential learning questions rather than providing generic pass/fail scores:
   - *What did I do well?* (Positive reinforcement)
   - *What is the problem?* (Identification of failing edge cases)
   - *Why did it happen?* (Underlying conceptual misconception)
   - *How can I improve?* (Actionable remediation guidance & next step)

---

## 🧠 Bloom's Taxonomy for Coding

The platform adapts the six cognitive levels of Bloom's Revised Taxonomy specifically for C programming:

| Level | Cognitive Domain | C Programming Adaptation | Example Assessment Task |
| :--- | :--- | :--- | :--- |
| **1. Remember** | Recall facts & syntax | Recall C keywords, headers (`<stdio.h>`, `<ctype.h>`), format specifiers | What is the syntax for declaring an integer array in C? |
| **2. Understand** | Explain code execution | Trace execution of pointers, loops, and null-terminated strings | Trace memory addresses during pointer increments. |
| **3. Apply** | Write code to solve tasks | Implement standard algorithms and string operations | Write `countVowels` using `<ctype.h>` `tolower()`. |
| **4. Analyse** | Find relationships & bugs | Diagnose logic errors, off-by-one bounds, and memory limits | Why does initializing `int max = 0;` fail on negative numbers? |
| **5. Evaluate** | Judge & justify tradeoffs | Compare memory footprints, in-place vs buffer approaches | Compare memory overhead of buffer reversal vs in-place two-pointer swap. |
| **6. Create** | Build original solutions | Design modular, memory-safe programs with multiple functions | Design a robust parsing and processing pipeline in C. |

---

## 🎯 Semester 1 (Introductory C) Lab Curriculum

Introductory coding students frequently stumble over classic mental model traps. The platform provides targeted starter challenges to guide students through the **Mistake-to-Mastery** pipeline:

### Lab 1: Find Maximum in an Array (`int findMax(int numbers[], int size)`)
- **Cognitive Level:** `Analyse` | **Estimated AI-Solvability:** `52% (Medium)`
- **The Beginner Mistake:** Initializing `int max = 0;`. If all numbers are negative (e.g. `{-8, -3, -10}`), the condition `numbers[i] > max` is never met, returning `0` (a value not even in the array!).
- **Remediation:** Initialize `int max = numbers[0];` using the first array element.

### Lab 2: Count Vowels in String (`int countVowels(char text[])`)
- **Cognitive Level:** `Apply` | **Estimated AI-Solvability:** `68% (Medium-High)`
- **The Beginner Mistake:** Checking only lowercase vowels (`ch == 'a' || ch == 'e' ...`). In C, character comparisons compare ASCII integer values (`'A'` is 65 vs `'a'` is 97).
- **Remediation:** Wrap characters using `tolower(text[i])` from `<ctype.h>` to achieve case-insensitive matching.

### Lab 3: Sum of Even Numbers (`int sumEvenNumbers(int arr[], int size)`)
- **Cognitive Level:** `Analyse` | **Estimated AI-Solvability:** `58% (Medium)`
- **The Beginner Mistake:** Loop starting at `i = 1` and checking `i <= size`. This 1-based indexing skips `arr[0]` and reads unallocated memory `arr[size]` out-of-bounds.
- **Remediation:** Correct bounds to 0-indexed C traversal: `for (int i = 0; i < size; i++)`.

### Lab 4: Reverse Array in Buffer (`void reverseArray(int arr[], int size, int result[])`)
- **Cognitive Level:** `Evaluate` | **Estimated AI-Solvability:** `45% (Low)`
- **The Beginner Mistake:** Forward copying assignment `result[i] = arr[i];` rather than reversing.
- **Remediation:** Map mirror index from the rear: `result[i] = arr[size - 1 - i];`.

---

## 📊 Estimated AI-Solvability Meter

Directly inspired by Table 1 of the Akbar (2025) research paper:
- **Low (< 50%):** Tasks requiring contextual justification, tradeoff evaluation, or oral reflection.
- **Medium (50–64%):** Debugging flawed starter code, finding root causes of edge-case failures.
- **Medium-High (65–74%):** Applying multi-step standard algorithms with specific language constraints.
- **High (> 74%):** Basic syntax recall or generic function implementations without edge-case context.

---

## 🏆 The Mistake-to-Mastery 4-Stage Stepper

Students progress systematically through four verified learning milestones:
1. **Identified 🔍:** Inspect the starter code and recognize the beginner flaw.
2. **Corrected ✏️:** Edit the code in the editor and fix the logic flaw.
3. **Practised 🎯:** Run the automated invariant test runner and achieve 100% pass rate.
4. **Mastered 🏆:** Complete Socratic reflection explaining *why* the fix is valid in their own words.

---

## 🚀 Running the Project

### Option A: Instant Zero-Latency Web App (Recommended)
The platform includes an ultra-fast, standalone interactive workbench (`index.html` + `app.js`):
```bash
# Run using Python's built-in HTTP server:
python -m http.server 3000

# Open in browser:
# http://localhost:3000
```

### Option B: Full-Stack Next.js Application
```bash
# 1. Install dependencies
npm install

# 2. Run local Next.js development server
npm run dev

# 3. Open in browser:
# http://localhost:3000
```

---

## 📂 Repository Structure

```
├── app.js                          # Core C transpiler, test runner, & formative feedback engine
├── index.html                      # Modern 2-column interactive Mistake-to-Mastery workbench
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── execute/route.ts    # In-browser / server sandbox test runner
│   │   │   └── feedback/route.ts   # Formative feedback generation endpoint
│   │   ├── layout.tsx              # Root HTML shell & dark theme
│   │   └── page.tsx                # Next.js 3-column assessment workbench
│   ├── components/
│   │   ├── CodeEditor.tsx          # Solution editor with line numbers & C syntax support
│   │   ├── IntelligentFeedback.tsx # 4-part actionable formative feedback UI
│   │   ├── Navbar.tsx              # Header with lab picker & cognitive metadata
│   │   ├── ProblemStatement.tsx    # Bloom's level, AI-solvability meter, & mistake spotlight
│   │   ├── SocraticDefenseModal.tsx# Socratic mastery reflection modal
│   │   └── TestRunnerPanel.tsx     # Test suite execution drawer
│   └── lib/
│       ├── assessment-bank.ts      # 4 Semester-1 C challenges with full Bloom's & AI metadata
│       ├── feedback-engine.ts      # 4-part formative feedback rule diagnostician
│       ├── socratic-agent.ts       # Socratic reflection question generator
│       ├── telemetry.ts            # Keystroke & paste cadence tracker
│       └── types.ts                # TypeScript domain models
├── package.json
└── README.md
```

---

## 📑 Citations
- Akbar, R. (2025). *Beyond Detection: Designing AI-Resilient Assessments with Automated Feedback Tool to Foster Critical Thinking and Originality*. School of Computer Science, The University of Sydney.
