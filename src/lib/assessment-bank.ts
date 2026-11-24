import { AssessmentChallenge } from './types';

export const ASSESSMENT_CHALLENGES: AssessmentChallenge[] = [
  {
    id: 'inverted-ai-sanitizer',
    title: 'Challenge 1: Inverted AI Bug Hunt — Sanitize HTML Tags',
    category: 'inverted_ai_critique',
    difficulty: 'Medium',
    description: `An LLM was asked to write a security-critical function to strip potentially dangerous HTML tags and event attributes from user comments. 

The AI claimed its solution was "100% secure and production-ready". However, it contains **3 critical security and algorithmic flaws**:
1. **Nested Tag Bypass:** Stripping \`<script>\` once allows \`<scr<script>ipt>\` to reconstruct after deletion.
2. **Case Sensitivity & Whitespace Evasion:** Fails on \`<SCRIPT >\` or multiline tags with tabs/newlines.
3. **Catastrophic ReDoS Backtracking:** Uses an exponential regex pattern that locks the main thread on long malformed strings.

Your task is to **audit, fix, and explain** why the AI's mental model failed, producing an $O(N)$ linear pass or deterministic state sanitizer.`,
    starterCode: {
      javascript: `/**
 * FLAGGED AI GENERATED CODE (DO NOT DEPLOY AS-IS)
 * Goal: Strip all <script> tags and any inline 'on*' event handlers (e.g. onerror, onclick).
 */
function sanitizeInput(html) {
  if (typeof html !== 'string') return '';

  // AI Flaw 1: Single regex replace with greedy matching (ReDoS + Nested bypass)
  let cleaned = html.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');

  // AI Flaw 2: Vulnerable to event handler bypass like <img src=x onerror="alert(1)">
  cleaned = cleaned.replace(/\\s*on\\w+\\s*=\\s*["'][^"']*["']/gi, '');

  return cleaned;
}

// Write your corrected, resilient version below:
export function safeSanitize(html) {
  // TODO: Fix nested reconstruction, event handlers, and ensure O(N) linear time
  return sanitizeInput(html);
}
`,
      typescript: `export function safeSanitize(html: string): string {
  if (!html) return '';
  // TODO: Refactor the flawed AI implementation
  return html.replace(/<script.*?>.*?<\\/script>/gi, '');
}
`,
      python: `import re

def sanitize_input(html: str) -> str:
    """
    AI Flawed Attempt:
    Vulnerable to ReDoS, nested bypasses, and multi-line evasions.
    """
    if not isinstance(html, str):
        return ""
    # Incomplete single-pass regex
    cleaned = re.sub(r'<script.*?>.*?</script>', '', html, flags=re.IGNORECASE)
    cleaned = re.sub(r'\\son\\w+\\s*=\\s*["\'][^"\']*["\']', '', cleaned)
    return cleaned
`
    },
    testCases: [
      {
        id: 'tc-1',
        name: 'Basic script tag removal',
        inputDescription: '"Hello <script>alert(1)</script> World"',
        expectedOutput: '"Hello  World"'
      },
      {
        id: 'tc-2',
        name: 'Nested Tag Bypass (<scr<script>ipt>)',
        inputDescription: '"Safe <scr<script>ipt>evil()</script>text"',
        expectedOutput: '"Safe text"'
      },
      {
        id: 'tc-3',
        name: 'Inline Event Handlers with whitespace',
        inputDescription: '"<img src=\\"avatar.png\\"   onerror = \\"malicious()\\" />"',
        expectedOutput: '"<img src=\\"avatar.png\\"    />"'
      },
      {
        id: 'tc-4',
        name: 'ReDoS Resistance (Large malformed string)',
        inputDescription: '"<script " + "a".repeat(1000) + " (no closing tag)"',
        expectedOutput: 'Should execute in < 15ms without CPU lockup',
        isSecret: true
      }
    ],
    aiTrapContext: {
      claimedFlawlessDescription: 'Regex string manipulation using single-pass greedy matching.',
      hiddenVulnerabilities: [
        'Single pass does not eliminate recursively generated tokens.',
        'Greedy .* causes catastrophic regex engine backtracking.',
        'Missing HTML entity decoding before attribute checks.'
      ],
      commonCopyPasteHallucinations: [
        'Using dangerouslySetInnerHTML or trusting innerText in non-browser Node environments',
        'Asserting that regex alone is sufficient for full HTML parsing'
      ]
    },
    rubricCriteria: [
      { name: 'Algorithmic Robustness', weight: 35, description: 'Handles recursive and nested token bypasses cleanly without infinite loops.' },
      { name: 'Complexity & ReDoS Immunity', weight: 25, description: 'Guarantees O(N) linear scan without catastrophic regex backtracking.' },
      { name: 'Edge Case & Attribute Coverage', weight: 20, description: 'Strips sneaky inline handlers (tabs, multiline, quote variations).' },
      { name: 'Defense & Rationale Mastery', weight: 20, description: 'Student can articulate why the AI’s single-pass model failed in the Socratic defense.' }
    ]
  },
  {
    id: 'algorithmic-lru-cache',
    title: 'Challenge 2: Algorithmic Invariant — Strict O(1) LRU Cache',
    category: 'algorithmic',
    difficulty: 'Medium',
    description: `Implement a Least Recently Used (LRU) Cache supporting \`get(key)\` and \`put(key, value)\` operations.

**Strict Performance Invariant:**
- Both \`get\` and \`put\` must execute in true **average $O(1)$ time complexity**.
- Simply relying on JavaScript array searching (\`indexOf\`, \`splice\`) or naive linked lists that search $O(N)$ for key lookups is strictly disqualified.
- Memory usage must remain bounded by \`capacity\`. When capacity is reached, the least recently used key must be evicted.

*Note for AI-Assisted Submissions:* The defense engine will interrogate you on pointer manipulations, garbage collection churn, and why your chosen data structure satisfies constant time.`,
    starterCode: {
      javascript: `class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    // Initialize dummy head and tail nodes for clean pointer swaps
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * @param {number} key
   * @return {number}
   */
  get(key) {
    // TODO: Return value if key exists, move to head (most recently used), else -1
    return -1;
  }

  /**
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    // TODO: Insert or update key, maintain capacity eviction
  }
}
`,
      typescript: `class DNode {
  key: number;
  val: number;
  prev: DNode | null = null;
  next: DNode | null = null;
  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
  }
}

export class LRUCache {
  private capacity: number;
  constructor(capacity: number) {
    this.capacity = capacity;
  }
  get(key: number): number {
    return -1;
  }
  put(key: number, val: number): void {
  }
}
`,
      python: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.map = {}
        self.head = DNode()
        self.tail = DNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: int) -> int:
        return -1

    def put(self, key: int, value: int) -> None:
        pass
`
    },
    testCases: [
      {
        id: 'tc-lru-1',
        name: 'Basic Put & Get',
        inputDescription: 'put(1, 1), put(2, 2), get(1)',
        expectedOutput: '1'
      },
      {
        id: 'tc-lru-2',
        name: 'Eviction on Capacity Overflow',
        inputDescription: 'capacity=2, put(1,1), put(2,2), put(3,3) -> get(1)',
        expectedOutput: '-1 (evicted key 1)'
      },
      {
        id: 'tc-lru-3',
        name: 'Update existing key moves to MRU',
        inputDescription: 'capacity=2, put(1,1), put(2,2), get(1), put(3,3) -> get(2)',
        expectedOutput: '-1 (key 2 evicted, key 1 was accessed)'
      }
    ],
    rubricCriteria: [
      { name: 'Time Complexity Invariant O(1)', weight: 35, description: 'Dual structure (HashMap + Doubly Linked List) eliminates array scan overhead.' },
      { name: 'Eviction Correctness', weight: 25, description: 'Accurately tracks MRU/LRU updates upon both read and write operations.' },
      { name: 'Boundary Conditions & Pointer Safety', weight: 20, description: 'No null pointer exceptions or memory leaks when unlinking nodes.' },
      { name: 'Architectural Defense', weight: 20, description: 'Ability to explain node deletion mechanics and why singly-linked list would fail O(1).' }
    ]
  },
  {
    id: 'token-bucket-rate-limiter',
    title: 'Challenge 3: State Machine — Token Bucket with Clock Precision',
    category: 'concurrency_state',
    difficulty: 'Hard',
    description: `Implement a resilient **Token Bucket Rate Limiter** class designed for distributed API gateways.

Key requirements:
1. Bucket starts full with \`capacity\` tokens.
2. Tokens refill continuously at \`refillRatePerSecond\`.
3. \`allowRequest(tokensRequired, timestampMs)\` returns \`true\` and consumes tokens if enough are available, else returns \`false\`.
4. Must handle **sub-millisecond intervals**, negative time drift, and integer overflow gracefully.`,
    starterCode: {
      javascript: `export class TokenBucket {
  /**
   * @param {number} capacity - Max tokens stored
   * @param {number} refillRatePerSecond - Tokens added per second
   */
  constructor(capacity, refillRatePerSecond) {
    this.capacity = capacity;
    this.refillRatePerSecond = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * @param {number} tokensRequired
   * @param {number} [timestampMs]
   * @return {boolean}
   */
  allowRequest(tokensRequired = 1, timestampMs = Date.now()) {
    // TODO: Refill based on elapsed time, guard against negative drift, check capacity
    return true;
  }
}
`,
      typescript: `export class TokenBucket {
  private capacity: number;
  private refillRate: number;
  private tokens: number;
  private lastRefill: number;

  constructor(capacity: number, refillRatePerSecond: number) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(tokensRequired: number = 1, timestampMs: number = Date.now()): boolean {
    return true;
  }
}
`,
      python: `import time

class TokenBucket:
    def __init__(self, capacity: float, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill = time.time()

    def allow_request(self, tokens_required: float = 1.0, timestamp_s: float = None) -> bool:
        return True
`
    },
    testCases: [
      {
        id: 'tc-tb-1',
        name: 'Immediate Burst Consumption',
        inputDescription: 'capacity=5, request(5) -> true, request(1) -> false',
        expectedOutput: 'Second request denied'
      },
      {
        id: 'tc-tb-2',
        name: 'Gradual Refill over time',
        inputDescription: 'capacity=10, rate=2/sec, after 2 seconds -> +4 tokens',
        expectedOutput: '4 tokens restored'
      },
      {
        id: 'tc-tb-3',
        name: 'Negative Clock Drift Resilience',
        inputDescription: 'timestampMs goes backwards by 5000ms due to NTP clock sync',
        expectedOutput: 'Should not crash or deduct negative tokens'
      }
    ],
    rubricCriteria: [
      { name: 'Refill Math & Precision', weight: 35, description: 'Accurate fractional token calculation without premature integer floor.' },
      { name: 'Clock Drift & Invariant Handling', weight: 30, description: 'Resistant to non-monotonic timestamps and out-of-order calls.' },
      { name: 'Capacity Clamping', weight: 15, description: 'Tokens never exceed capacity regardless of long idle periods.' },
      { name: 'State Consistency Defense', weight: 20, description: 'Explaining atomic updates and race condition mitigations in high-throughput systems.' }
    ]
  }
];
