import { DefenseQuestion, AssessmentChallenge } from './types';

export class SocraticDefenseAgent {
  /**
   * Generates tailored Socratic reflection questions that probe the student's actual code in C.
   */
  public static generateQuestions(
    challenge: AssessmentChallenge,
    studentCode: string
  ): DefenseQuestion[] {
    const questions: DefenseQuestion[] = [];

    if (challenge.id === 'find_max') {
      questions.push({
        id: 'q-max-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: 'In C, why is initializing int max = numbers[0]; safer than initializing int max = -999999;?'
      });
      questions.push({
        id: 'q-max-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: 'What occurs if an empty array or size <= 0 is passed to findMax in C without an early guard check?'
      });
      questions.push({
        id: 'q-max-3',
        questionNumber: 3,
        targetedInsight: 'alternative_tradeoff',
        prompt: 'Could this function be implemented using pointer arithmetic (e.g. *(numbers + i)) instead of array indexing, and is there any difference in machine code?'
      });
    } else if (challenge.id === 'count_vowels') {
      questions.push({
        id: 'q-vow-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: "In C, what is the numeric ASCII difference between 'A' and 'a', and what does tolower('A') evaluate to internally?"
      });
      questions.push({
        id: 'q-vow-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: "How does the null-terminator '\\0' prevent buffer overruns when looping through text[i] in a C string?"
      });
    } else if (challenge.id === 'even_sum') {
      questions.push({
        id: 'q-sum-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: 'Why do C arrays use 0-based indexing instead of 1-based indexing, referencing pointer offsets from the base address?'
      });
      questions.push({
        id: 'q-sum-2',
        questionNumber: 2,
        targetedInsight: 'edge_case_stress',
        prompt: 'In C, what is the difference between a compile error and undefined behavior when reading arr[size]?'
      });
    } else if (challenge.id === 'reverse_list') {
      questions.push({
        id: 'q-rev-1',
        questionNumber: 1,
        targetedInsight: 'code_rationale',
        prompt: 'Why does the expression (size - 1 - i) correctly map the last index down to the first index?'
      });
      questions.push({
        id: 'q-rev-2',
        questionNumber: 2,
        targetedInsight: 'alternative_tradeoff',
        prompt: 'What is the memory complexity tradeoff between allocating a separate result buffer versus in-place two-pointer swap in C?'
      });
    }

    return questions;
  }
}
