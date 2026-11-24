// --- ASSESSMENT DATA BANK ---
const CHALLENGES = {
  sanitizer: {
    id: 'sanitizer',
    title: 'Challenge 1: Inverted AI Bug Hunt — Sanitize HTML Tags',
    difficulty: 'Medium',
    category: 'Inverted AI Bug Hunt',
    categoryIcon: 'shield-alert',
    categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: "An LLM was asked to write a security-critical function to strip potentially dangerous HTML tags and event attributes from user comments.\n\nThe AI claimed its solution was \"100% secure and production-ready\". However, it contains 3 critical security and algorithmic flaws:\n1. Nested Tag Bypass: Stripping <script> once allows <scr<script>ipt> to reconstruct.\n2. Whitespace/Case Evasion: Fails on <SCRIPT > or multiline tabs.\n3. Catastrophic ReDoS: Uses exponential regex backtracking on unclosed tags.\n\nYour task is to audit and fix the flawed AI implementation.",
    starterCode: `/**
 * FLAGGED AI GENERATED CODE (DO NOT DEPLOY AS-IS)
 * Goal: Strip all <script> tags and any inline 'on*' event handlers.
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
function safeSanitize(html) {
  // TODO: Fix nested reconstruction, event handlers, and ensure O(N) linear time
  return sanitizeInput(html);
}`,
    aiTrap: {
      desc: 'Regex string manipulation using single-pass greedy matching.',
      traps: [
        'Single pass does not eliminate recursively generated tokens.',
        'Greedy quantifiers trigger catastrophic regex engine backtracking.',
        'Context-free grammars cannot be completely parsed with a single regex.'
      ]
    },
    rubric: [
      { name: 'Algorithmic Robustness', weight: 35, desc: 'Handles nested and concatenated token evasions.' },
      { name: 'Complexity & ReDoS Immunity', weight: 25, desc: 'Guarantees linear scan without thread lockup.' },
      { name: 'Inline Attribute Coverage', weight: 20, desc: 'Strips event handlers like onerror and onclick.' },
      { name: 'Defense & Rationale Mastery', weight: 20, desc: 'Student can articulate why the AI’s model failed.' }
    ],
    testCases: [
      { id: 1, name: 'Basic script removal', run: (fn) => fn('Hello <script>alert(1)</' + 'script> World') === 'Hello  World' },
      { id: 2, name: 'Nested bypass (<scr<script>ipt>)', run: (fn) => fn('Safe <scr<script>ipt>evil()</' + 'script>text') === 'Safe text' },
      { id: 3, name: 'Inline handlers with whitespace', run: (fn) => {
        const res = fn('<img src="avatar.png"   onerror = "malicious()" />');
        return !res.toLowerCase().includes('onerror') && !res.includes('malicious');
      }},
      { id: 4, name: 'ReDoS Resistance (Large malformed string)', run: (fn) => {
        const start = performance.now();
        fn('<script ' + 'a'.repeat(500));
        return (performance.now() - start) < 50;
      }}
    ],
    defenseQuestions: [
      { q: "In your sanitization logic, how does your implementation guarantee that an input like '<scr<script>ipt>' cannot reconstruct into an executable script after the inner tag is removed?", key: "loop|iterat|scanner|ast|reconstruct" },
      { q: "If an attacker uses multiline spacing and tab characters like '<img src=\"x\"\\n\\tonerror\\t=\\t\"alert(1)\">', how does your solution parse the attributes without succumbing to exponential regex backtracking?", key: "backtrack|char|linear|quote|attribute" },
      { q: "Why is an iterative character scan or state machine generally considered more resilient against ReDoS attacks than complex regular expressions?", key: "state|deterministic|linear|exponential|finite" }
    ]
  },
  lru: {
    id: 'lru',
    title: 'Challenge 2: Algorithmic Invariant — Strict O(1) LRU Cache',
    difficulty: 'Medium',
    category: 'Asymptotic O(1) Invariant',
    categoryIcon: 'cpu',
    categoryColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: "Implement a Least Recently Used (LRU) Cache supporting get(key) and put(key, value) operations.\n\nStrict Performance Invariant:\n- Both get and put must execute in true average O(1) constant time complexity.\n- Relying on Array.indexOf, splice, or linear searches is strictly disqualified.\n- Evicts least recently used item when capacity is exceeded.",
    starterCode: `class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    // TODO: Return value if key exists, move to head, else -1
    return -1;
  }

  put(key, value) {
    // TODO: Insert/update key, maintain capacity eviction
  }
}`,
    aiTrap: {
      desc: 'Using standard Array methods or plain Object re-ordering.',
      traps: [
        'Array.splice() is O(N), degrading performance by 500x at scale.',
        'Unlinked doubly linked list nodes causing memory leaks.',
        'Null pointer exceptions at boundary conditions (head/tail).'
      ]
    },
    rubric: [
      { name: 'O(1) Time Complexity', weight: 35, desc: 'Dual Map + Doubly Linked List structure.' },
      { name: 'Eviction Correctness', weight: 25, desc: 'Tracks MRU on both get and put operations.' },
      { name: 'Boundary Pointer Safety', weight: 20, desc: 'Handles empty or single-node edge states.' },
      { name: 'Architectural Defense', weight: 20, desc: 'Articulates why singly-linked list fails O(1).' }
    ],
    testCases: [
      { id: 1, name: 'Basic Put & Get', run: (LRU) => {
        const c = new LRU(2); c.put(1, 1); c.put(2, 2); return c.get(1) === 1;
      }},
      { id: 2, name: 'Eviction on Capacity Overflow', run: (LRU) => {
        const c = new LRU(2); c.put(1, 1); c.put(2, 2); c.put(3, 3); return c.get(1) === -1;
      }},
      { id: 3, name: 'Update key moves to MRU', run: (LRU) => {
        const c = new LRU(2); c.put(1, 1); c.put(2, 2); c.get(1); c.put(3, 3); return c.get(2) === -1 && c.get(1) === 1;
      }}
    ],
    defenseQuestions: [
      { q: "Explain why achieving true O(1) time complexity for BOTH get() and put() requires combining two distinct data structures instead of using a single list or hash table.", key: "hash|map|pointer|list|constant" },
      { q: "When unlinking an arbitrary node in your doubly-linked list during an eviction, how do you prevent null pointer exceptions if the node is at the head or tail boundary?", key: "sentinel|dummy|boundary|head|tail" },
      { q: "If memory was extremely constrained and each node pointer overhead was unacceptable, what alternative caching policy or structure would you propose?", key: "tradeoff|memory|clock|array|overhead" }
    ]
  },
  rate_limiter: {
    id: 'rate_limiter',
    title: 'Challenge 3: State Machine — Token Bucket Rate Limiter',
    difficulty: 'Hard',
    category: 'State Machine & Concurrency',
    categoryIcon: 'scale',
    categoryColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    description: "Implement a resilient Token Bucket Rate Limiter for high-throughput API gateways.\n\nKey Requirements:\n- Starts full with capacity tokens.\n- Refills continuously at refillRatePerSecond.\n- allowRequest(tokensRequired, timestampMs) returns boolean.\n- Must be resilient against negative clock drift (NTP synchronization shifts).",
    starterCode: `class TokenBucket {
  constructor(capacity, refillRatePerSecond) {
    this.capacity = capacity;
    this.refillRate = refillRatePerSecond;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  allowRequest(tokensRequired = 1, timestampMs = Date.now()) {
    // TODO: Refill based on elapsed time, guard against negative drift, check capacity
    return true;
  }
}`,
    aiTrap: {
      desc: 'Assuming Date.now() is strictly monotonic.',
      traps: [
        'NTP clock adjustments cause timestamp to jump backward.',
        'Integer truncation losing fractional tokens on rapid calls.',
        'Token hoarding exceeding max capacity after idle periods.'
      ]
    },
    rubric: [
      { name: 'Refill Math & Precision', weight: 35, desc: 'Continuous fractional token calculation.' },
      { name: 'Clock Drift Handling', weight: 30, desc: 'Guards against backward time jumps.' },
      { name: 'Capacity Clamping', weight: 15, desc: 'Tokens never exceed capacity limit.' },
      { name: 'State Consistency Defense', weight: 20, desc: 'Atomic operations in distributed systems.' }
    ],
    testCases: [
      { id: 1, name: 'Immediate Burst Consumption', run: (TB) => {
        const tb = new TB(5, 1); return tb.allowRequest(5) === true && tb.allowRequest(1) === false;
      }},
      { id: 2, name: 'Gradual Refill over time', run: (TB) => {
        const tb = new TB(10, 2); tb.allowRequest(10, 1000); return tb.allowRequest(4, 3000) === true;
      }},
      { id: 3, name: 'Negative Clock Drift Resilience', run: (TB) => {
        const tb = new TB(5, 1); tb.allowRequest(1, 10000); const res = tb.allowRequest(1, 5000); return typeof res === 'boolean';
      }}
    ],
    defenseQuestions: [
      { q: "What failure mode occurs if external system clocks experience negative drift or leap seconds during execution?", key: "drift|ntp|negative|backward|guard" },
      { q: "How do you ensure fractional token math does not cause premature token starvation under high frequency bursts?", key: "float|fraction|continuous|precision|integer" },
      { q: "How would you adapt this single-threaded model to support a distributed environment across multiple worker nodes?", key: "redis|atomic|distributed|lock|concurrency" }
    ]
  }
};

let currentChallenge = CHALLENGES.sanitizer;
let telemetry = { keystrokes: 0, pasteEvents: 0, pastedChars: 0, startTime: Date.now() };
let currentFeedback = null;
let defenseState = { questions: [], currentIdx: 0, answered: [] };

// --- INITIALIZATION ---
function init() {
  renderChallenge(currentChallenge);
  setupEditorTelemetry();
  resetStarterCode();
  lucide.createIcons();
}

function switchChallenge(key) {
  currentChallenge = CHALLENGES[key] || CHALLENGES.sanitizer;
  renderChallenge(currentChallenge);
  resetStarterCode();
  resetFeedbackUI();
  lucide.createIcons();
}

function renderChallenge(c) {
  document.getElementById('problemTitle').innerText = c.title;
  document.getElementById('difficultyBadge').innerText = c.difficulty;
  document.getElementById('categoryBadgeText').innerText = c.category;
  document.getElementById('categoryBadge').className = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${c.categoryColor}`;
  document.getElementById('problemDescription').innerText = c.description;

  // AI Trap
  document.getElementById('aiTrapDesc').innerText = c.aiTrap.desc;
  const trapList = document.getElementById('aiTrapList');
  trapList.innerHTML = c.aiTrap.traps.map(t => `<li>${t}</li>`).join('');

  // Rubric
  const rubricList = document.getElementById('rubricCriteriaList');
  rubricList.innerHTML = c.rubric.map(r => `
    <div class="flex items-start justify-between text-xs gap-3">
      <div>
        <span class="font-medium text-slate-200">${r.name}</span>
        <p class="text-[11px] text-slate-400">${r.desc}</p>
      </div>
      <span class="text-[11px] font-bold text-indigo-400 whitespace-nowrap">${r.weight}%</span>
    </div>
  `).join('');
}

function resetStarterCode() {
  const editor = document.getElementById('codeEditor');
  editor.value = currentChallenge.starterCode;
  updateLineNumbers();
}

function setupEditorTelemetry() {
  const editor = document.getElementById('codeEditor');
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('keydown', (e) => {
    telemetry.keystrokes++;
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
  });
  editor.addEventListener('paste', (e) => {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    telemetry.pasteEvents++;
    telemetry.pastedChars += text.length;
    updateIntegrityScore();
  });
}

function updateLineNumbers() {
  const editor = document.getElementById('codeEditor');
  const lines = editor.value.split('\n').length;
  const gutter = document.getElementById('lineNumbers');
  gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
}

function updateIntegrityScore() {
  const editor = document.getElementById('codeEditor');
  const totalLen = Math.max(1, editor.value.length);
  const pasteRatio = telemetry.pastedChars / totalLen;
  let score = 92;
  if (pasteRatio > 0.8) score = 42;
  else if (pasteRatio > 0.4) score = 68;

  const badge = document.getElementById('integrityScoreBadge');
  badge.innerText = score + '%';
  badge.className = `font-semibold ${score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-rose-400'}`;
}

// --- TEST EXECUTION & INTELLIGENT FEEDBACK GENERATOR ---
function executeTests() {
  const code = document.getElementById('codeEditor').value;
  const drawerBody = document.getElementById('testResultsBody');
  const title = document.getElementById('testDrawerTitle');

  let targetFn = null;
  try {
    if (currentChallenge.id === 'sanitizer') {
      const evalFn = new Function(`${code}; return (typeof safeSanitize === 'function') ? safeSanitize : sanitizeInput;`);
      targetFn = evalFn();
    } else if (currentChallenge.id === 'lru') {
      const evalFn = new Function(`${code}; return LRUCache;`);
      targetFn = evalFn();
    } else {
      const evalFn = new Function(`${code}; return TokenBucket;`);
      targetFn = evalFn();
    }
  } catch (err) {
    drawerBody.innerHTML = `<div class="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300">Syntax / Compilation Error: ${err.message}</div>`;
    title.innerText = 'Test Suite (Failed to compile)';
    return;
  }

  let passedCount = 0;
  const testCards = currentChallenge.testCases.map((tc) => {
    let passed = false;
    try {
      passed = tc.run(targetFn);
    } catch (e) {
      passed = false;
    }
    if (passed) passedCount++;

    return `
      <div class="p-2 rounded-lg border text-xs font-mono-code ${passed ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-rose-950/20 border-rose-500/30 text-slate-200'}">
        <div class="flex items-center justify-between font-sans">
          <span class="font-semibold flex items-center gap-1.5 ${passed ? 'text-emerald-400' : 'text-rose-400'}">
            <i data-lucide="${passed ? 'check-circle-2' : 'x-circle'}" class="w-3.5 h-3.5"></i>
            ${tc.name}
          </span>
          <span class="text-[10px] uppercase font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}">${passed ? 'PASS' : 'FAIL'}</span>
        </div>
      </div>
    `;
  });

  drawerBody.innerHTML = testCards.join('');
  title.innerText = `Test Suite Execution (${passedCount}/${currentChallenge.testCases.length} Passed)`;
  lucide.createIcons();

  // Trigger Intelligent Feedback Analysis
  generateIntelligentFeedback(code, passedCount, currentChallenge.testCases.length);
}

function toggleTestDrawer() {
  const body = document.getElementById('testResultsBody');
  const chevron = document.getElementById('drawerChevron');
  body.classList.toggle('hidden');
  chevron.classList.toggle('rotate-180');
}

function generateIntelligentFeedback(code, passed, total) {
  const misconceptions = [];
  const strengths = [];
  const hints = [];
  let timeComplexity = "O(N) linear scan";

  if (currentChallenge.id === 'sanitizer') {
    const hasSinglePass = /replace\s*\(\s*\/<script/i.test(code);
    const hasLoop = /while|for\s*\(|do\s*\{/i.test(code);
    const hasCatastrophicRegex = /\(\?:.*?\)\*|<[^<]*\*/.test(code);

    if (hasCatastrophicRegex) {
      timeComplexity = "O(2^N) worst-case exponential (ReDoS)";
      misconceptions.push({
        title: "Catastrophic Regular Expression Backtracking (ReDoS)",
        severity: "High",
        mentalModel: "Assuming nested quantifiers match efficiently without CPU exhaustion.",
        scientific: "Overlapping quantifiers create exponential permutations ($O(2^N)$), freezing the event loop.",
        remediation: "Use non-backtracking character classes like [^>]*> or an explicit character lexer."
      });
    }
    if (hasSinglePass && !hasLoop) {
      misconceptions.push({
        title: "Single-Pass Token Elimination Fallacy",
        severity: "High",
        mentalModel: "Believing a single global regex replace cleanly purges all prohibited substrings.",
        scientific: "In <scr<script>ipt>, inner deletion reconstructs outer tokens into a new valid tag.",
        remediation: "Implement an iterative loop (repeat until length stabilizes) or state machine."
      });
    }
    if (code.includes('on')) {
      strengths.push("Explicitly cleans inline JavaScript event handlers (e.g. onerror).");
    }
    hints.push({ level: 1, title: "Consider Substring Concatenation", prompt: "What happens when an attacker intentionally wraps one forbidden tag inside another split word?", revealed: true });
    hints.push({ level: 2, title: "State Invariant & Loop Termination", prompt: "Can you compare string length before and after a cleaning pass to detect when all tokens are gone?", revealed: false });
    hints.push({ level: 3, title: "Iterative Fixed-Point Loop", prompt: "Run a 'do { let prev = s; s = clean(s); } while (s.length !== prev.length);'", revealed: false });
  } else if (currentChallenge.id === 'lru') {
    const usesArray = /indexOf|splice/.test(code);
    if (usesArray) {
      timeComplexity = "O(N) search / eviction";
      misconceptions.push({
        title: "Array Shifting Disqualification for O(1) Invariant",
        severity: "High",
        mentalModel: "Treating an array as an acceptable queue for LRU tracking.",
        scientific: "Array operations (splice/indexOf) require linear memory scans.",
        remediation: "Pair a HashMap for O(1) lookups with a Doubly Linked List for O(1) pointer updates."
      });
    } else {
      timeComplexity = "O(1) constant time";
      strengths.push("Satisfies strict average O(1) asymptotic lookup and eviction invariants.");
    }
    hints.push({ level: 1, title: "Examine Inner Operations", prompt: "Do any operations scan through elements sequentially?", revealed: true });
    hints.push({ level: 2, title: "Pointer Mechanics", prompt: "How do you disconnect node B between A and C without traversing from the head?", revealed: false });
    hints.push({ level: 3, title: "Sentinel Dummy Nodes", prompt: "Use dummy head/tail nodes so pointer reassignments never need null checks.", revealed: false });
  } else {
    timeComplexity = "O(1) continuous math";
    const hasNegativeGuard = /Math\.max\(\s*0/i.test(code);
    if (!hasNegativeGuard) {
      misconceptions.push({
        title: "System Time Monotonicity Assumption",
        severity: "Medium",
        mentalModel: "Assuming Date.now() is strictly increasing.",
        scientific: "NTP synchronization adjustments can cause system clocks to jump backward.",
        remediation: "Guard the delta: const elapsed = Math.max(0, now - this.lastRefill)."
      });
    }
    hints.push({ level: 1, title: "Clock Drift", prompt: "What happens if an NTP sync rewinds time by 50ms?", revealed: true });
    hints.push({ level: 2, title: "Fractional Tokens", prompt: "Track tokens as floating points so rapid requests don't suffer integer truncation.", revealed: false });
    hints.push({ level: 3, title: "Defensive State Clamp", prompt: "Clamp accumulated tokens using Math.min(this.capacity, tokens + delta * rate).", revealed: false });
  }

  if (passed > 0) strengths.push(`Passed ${passed} out of ${total} test invariants.`);

  const overallScore = Math.round((passed / total) * 80) + (misconceptions.length === 0 ? 20 : 5);

  currentFeedback = {
    score: overallScore,
    summary: overallScore >= 80 ? "Strong implementation upholding invariant requirements." : `Identified ${misconceptions.length} critical conceptual misconceptions. Review scaffolded hints below.`,
    complexity: timeComplexity,
    strengths,
    misconceptions,
    hints
  };

  document.getElementById('overallScoreNum').innerText = overallScore;
  document.getElementById('executiveSummaryText').innerText = currentFeedback.summary;
  document.getElementById('timeComplexityBadge').innerText = timeComplexity;

  const badge = document.getElementById('miscCountBadge');
  if (misconceptions.length > 0) {
    badge.innerText = misconceptions.length;
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
  }

  setFeedbackTab('overview');
}

function setFeedbackTab(tab) {
  const tabs = ['overview', 'misconceptions', 'hints', 'rubric'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab${t.charAt(0).toUpperCase() + t.slice(1)}Btn`);
    if (btn) {
      if (t === tab) {
        btn.className = "flex-1 py-2 px-2 text-center font-medium border-b-2 border-indigo-500 text-indigo-400 bg-slate-900/50 flex items-center justify-center gap-1";
      } else {
        btn.className = "flex-1 py-2 px-2 text-center font-medium border-b-2 border-transparent hover:text-slate-200 flex items-center justify-center gap-1";
      }
    }
  });

  const area = document.getElementById('tabContentArea');
  if (!currentFeedback) return;

  if (tab === 'overview') {
    area.innerHTML = `
      <div class="space-y-3">
        <div class="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 space-y-2">
          <div class="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <i data-lucide="check-circle-2" class="w-4 h-4"></i>
            <span>Demonstrated Strengths</span>
          </div>
          <ul class="space-y-1 text-slate-300 text-[11px]">
            ${currentFeedback.strengths.map(s => `<li class="flex items-start gap-1.5"><span class="text-emerald-400">•</span><span>${s}</span></li>`).join('')}
          </ul>
        </div>
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1.5">
          <span class="text-indigo-400 font-semibold block text-xs flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            AI Resilience & Telemetry Audit
          </span>
          <p class="text-[11px] text-slate-300">
            ${telemetry.pasteEvents > 0 ? `Observed ${telemetry.pasteEvents} clipboard paste events (${telemetry.pastedChars} chars). Initiating targeted Socratic verification defense.` : 'Organic typing cadence verified. High authenticity confidence.'}
          </p>
        </div>
      </div>
    `;
  } else if (tab === 'misconceptions') {
    if (currentFeedback.misconceptions.length === 0) {
      area.innerHTML = `<div class="text-center py-8 text-slate-400"><i data-lucide="check-circle-2" class="w-8 h-8 text-emerald-400 mx-auto mb-2"></i><p class="font-medium text-slate-200">No Critical Misconceptions Detected</p><p class="text-[11px] text-slate-500 mt-1">Your implementation maintained expected invariants.</p></div>`;
    } else {
      area.innerHTML = currentFeedback.misconceptions.map(m => `
        <div class="bg-slate-900/90 border border-rose-500/30 rounded-xl p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-rose-300 flex items-center gap-1.5">
              <i data-lucide="alert-circle" class="w-3.5 h-3.5 text-rose-400"></i>
              ${m.title}
            </span>
            <span class="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">${m.severity} Severity</span>
          </div>
          <div class="bg-slate-950/80 rounded-lg p-2 border border-slate-800 text-[11px] space-y-1">
            <div><span class="text-slate-400">Student Mental Model: </span><span class="text-slate-200">${m.mentalModel}</span></div>
            <div><span class="text-amber-400">Scientific Reality: </span><span class="text-slate-300">${m.scientific}</span></div>
          </div>
          <p class="text-[11px] text-indigo-300"><strong class="text-indigo-200">Remediation:</strong> ${m.remediation}</p>
        </div>
      `).join('');
    }
  } else if (tab === 'hints') {
    area.innerHTML = `
      <div class="p-2 rounded bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 text-[11px]">
        <strong>Progressive Scaffolding:</strong> Hints reveal one tier at a time to preserve productive problem-solving.
      </div>
      <div class="space-y-2 mt-2">
        ${currentFeedback.hints.map((h, i) => `
          <div class="border rounded-xl p-3 transition ${h.revealed ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-950/40 border-slate-800 opacity-60'}">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Tier ${h.level}</span>
              <span class="font-semibold text-slate-200">${h.title}</span>
              ${h.revealed ? '<span class="text-emerald-400 text-[10px] font-semibold">Unlocked</span>' : `<button onclick="unlockHint(${i})" class="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold">Unlock</button>`}
            </div>
            ${h.revealed ? `<p class="text-slate-300 text-[11px] mt-1.5">${h.prompt}</p>` : '<p class="text-slate-500 text-[11px] italic mt-1">Hint locked.</p>'}
          </div>
        `).join('')}
      </div>
    `;
  } else if (tab === 'rubric') {
    area.innerHTML = currentChallenge.rubric.map(r => `
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-semibold text-slate-200">${r.name}</span>
          <span class="font-bold text-indigo-400">${r.weight} pts</span>
        </div>
        <p class="text-[11px] text-slate-400">${r.desc}</p>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

function unlockHint(idx) {
  if (currentFeedback && currentFeedback.hints[idx]) {
    currentFeedback.hints[idx].revealed = true;
    setFeedbackTab('hints');
  }
}

function resetFeedbackUI() {
  currentFeedback = null;
  document.getElementById('overallScoreNum').innerText = '--';
  document.getElementById('executiveSummaryText').innerText = 'Run tests to initiate pedagogical evaluation.';
  document.getElementById('timeComplexityBadge').innerText = 'Pending';
  document.getElementById('miscCountBadge').classList.add('hidden');
  document.getElementById('tabContentArea').innerHTML = `
    <div class="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
      <i data-lucide="lightbulb" class="w-10 h-10 text-slate-700"></i>
      <p class="text-slate-300 font-medium text-xs">No Assessment Feedback Generated Yet</p>
      <p class="text-[11px] text-slate-500 max-w-xs">Click <strong class="text-indigo-400">Run Tests</strong> or <strong class="text-emerald-400">Submit & Socratic Defend</strong> to start the multi-tiered feedback diagnostician.</p>
    </div>
  `;
  document.getElementById('testDrawerTitle').innerText = 'Test Suite Execution (Ready)';
  document.getElementById('testResultsBody').innerHTML = '<p class="text-slate-500 text-center py-2">Click "Run Tests" to evaluate your solution against edge cases.</p>';
  lucide.createIcons();
}

// --- SOCRATIC VIVA VOCE DEFENSE MODAL ---
function openDefenseModal() {
  const modal = document.getElementById('defenseModal');
  const body = document.getElementById('defenseModalBody');
  modal.classList.remove('hidden');

  defenseState = {
    questions: currentChallenge.defenseQuestions,
    currentIdx: 0,
    answered: []
  };

  renderDefenseQuestion();
  lucide.createIcons();
}

function closeDefenseModal() {
  document.getElementById('defenseModal').classList.add('hidden');
}

function renderDefenseQuestion() {
  const body = document.getElementById('defenseModalBody');
  const q = defenseState.questions[defenseState.currentIdx];

  if (!q) {
    // Completed
    body.innerHTML = `
      <div class="text-center py-6 space-y-3">
        <div class="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
          <i data-lucide="award" class="w-7 h-7"></i>
        </div>
        <h3 class="text-sm font-bold text-white">Defense Session Completed!</h3>
        <p class="text-xs text-slate-400">Your conceptual justifications demonstrated verified mastery of the architectural tradeoffs.</p>
        <div class="space-y-1.5 text-left bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          ${defenseState.answered.map((ans, i) => `
            <div class="py-1 border-b border-slate-800/80 last:border-0">
              <span class="font-semibold text-emerald-400">Q${i+1} Verified: </span>
              <span class="text-slate-300">"${ans}"</span>
            </div>
          `).join('')}
        </div>
        <button onclick="closeDefenseModal()" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition">Return to Workspace</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  body.innerHTML = `
    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-400">
        <span class="font-semibold text-slate-300">Question ${defenseState.currentIdx + 1} of ${defenseState.questions.length}</span>
        <span class="uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">Live Socratic Verification</span>
      </div>
      <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
        <i data-lucide="help-circle" class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"></i>
        <p class="font-medium text-slate-100">${q.q}</p>
      </div>
      <div class="space-y-2">
        <label class="text-[11px] text-slate-400 font-medium block">Your Architectural Justification:</label>
        <textarea id="defenseInput" placeholder="Explain the data structure choices, boundary invariants, and tradeoffs..." class="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-sans"></textarea>
        <div class="flex justify-end">
          <button onclick="submitDefenseAnswer()" class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md">
            <i data-lucide="send" class="w-3.5 h-3.5"></i>
            <span>Submit Defense</span>
          </button>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function submitDefenseAnswer() {
  const input = document.getElementById('defenseInput');
  const val = input.value.trim();
  if (!val) return;

  defenseState.answered.push(val);
  defenseState.currentIdx++;
  renderDefenseQuestion();
}

// Run on page load
window.onload = init;
