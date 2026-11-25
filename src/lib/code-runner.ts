import { ProgrammingLanguage } from './types';

const CHALLENGE_FN_MAP: Record<string, string> = {
  find_max: 'findMax',
  count_vowels: 'countVowels',
  even_sum: 'sumEvenNumbers',
  reverse_list: 'reverseArray',
};

const PYTHON_FN_MAP: Record<string, string> = {
  find_max: 'findMax(numbers, size)',
  count_vowels: 'countVowels(text)',
  even_sum: 'sumEvenNumbers(arr, size)',
  reverse_list: 'reverseArray(arr, size, result)',
};

function getTargetFnName(challengeId: string): string {
  return CHALLENGE_FN_MAP[challengeId] || 'reverseArray';
}

function stripLineComment(line: string, commentToken: string): string {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const prev = i > 0 ? line[i - 1] : '';
    if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
    else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
    else if (!inSingle && !inDouble && line.startsWith(commentToken, i)) {
      return line.slice(0, i);
    }
  }
  return line;
}

function replaceFunctionSignatures(code: string): string {
  return code
    .replace(
      /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:findMax|find_max|FindMax)\s*\([^)]*\)[^\{;\n]*(?=\{)/g,
      'function findMax(numbers, size) '
    )
    .replace(
      /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:countVowels|count_vowels|CountVowels)\s*\([^)]*\)[^\{;\n]*(?=\{)/g,
      'function countVowels(text) '
    )
    .replace(
      /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:int|fn|func|fun|void|function)\s+(?:sumEvenNumbers|sum_even_numbers|SumEvenNumbers)\s*\([^)]*\)[^\{;\n]*(?=\{)/g,
      'function sumEvenNumbers(arr, size) '
    )
    .replace(
      /(?:public\s+|private\s+|protected\s+)?(?:static\s+)?(?:pub\s+)?(?:export\s+)?(?:void|fn|func|fun|function)\s+(?:reverseArray|reverse_array|ReverseArray)\s*\([^)]*\)[^\{;\n]*(?=\{)/g,
      'function reverseArray(arr, size, result) '
    );
}

function transpileTypeScript(code: string): string {
  return code
    .replace(/\bexport\s+/g, '')
    .replace(/(\b\w+)\s*:\s*(?:number\[\]|string\[\]|(?:number|string|boolean|void|any)\b)/g, '$1')
    .replace(
      /(function\s+\w+\s*\([^)]*\))\s*:\s*[A-Za-z0-9_<>\[\]\s|]+(\s*\{)/g,
      '$1$2'
    );
}

function transpileCStyle(code: string, language: ProgrammingLanguage): string {
  let js = code
    .replace(/#include\s*<.*?>/g, '')
    .replace(/#include\s*".*?"/g, '')
    .replace(/using\s+namespace\s+\w+\s*;/g, '')
    .replace(/^\s*import\s+[^;]+;/gm, '')
    .replace(/^\s*using\s+[^;]+;/gm, '');

  if (language === 'java' || language === 'csharp') {
    const classRegex = /^\s*(?:public\s+|internal\s+)?class\s+\w+\s*\{/m;
    if (classRegex.test(js)) {
      js = js.replace(classRegex, '').replace(/\}\s*$/, '');
    }
  }

  js = replaceFunctionSignatures(js)
    .replace(/std::tolower\s*\(/g, '__tolower(')
    .replace(/\btolower\s*\(/g, '__tolower(')
    .replace(/Character\.toLowerCase\s*\(/g, '__tolower(')
    .replace(/(?:char|Char)\.ToLower\s*\(/g, '__tolower(')
    .replace(/\.ToLower\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/(\w+)\.charAt\s*\(([^)]+)\)/g, '$1[$2]')
    .replace(/\.toCharArray\s*\(\s*\)/g, ".split('')")
    .replace(/\[i\]\s*!=\s*['"]\\0['"]/g, '.length > i')
    .replace(/text\[i\]\s*!=\s*['"]\\0['"]/g, 'i < text.length')
    .replace(/text\[i\]\s*!=\s*0/g, 'i < text.length')
    .replace(/strlen\s*\(([^)]+)\)/g, '($1).length')
    .replace(/\.size\s*\(\s*\)/g, '.length')
    .replace(/\.length\s*\(\s*\)/g, '.length')
    .replace(/\.Length\b/g, '.length')
    .replace(/\bforeach\s*\(\s*(?:var|char|int|string|String)\s+(\w+)\s+in\s+([^)]+)\)/g, 'for (let $1 of $2)')
    .replace(/\b(?:const\s+)?(?:std::)?(?:vector\s*<[^>]+>|string|String|int\[\]|size_t|int|char|float|double|long|boolean|bool|var)\s*&?\s+/g, 'let ');

  return js;
}

function transpileGo(code: string): string {
  let js = code
    .replace(/^\s*package\s+\w+\s*$/gm, '')
    .replace(/^\s*import\s*\([\s\S]*?\)\s*$/gm, '')
    .replace(/^\s*import\s+"[^"]+"\s*$/gm, '');

  js = replaceFunctionSignatures(js)
    .replace(/unicode\.ToLower\s*\(/g, '__tolower(')
    .replace(/strings\.ToLower\s*\(([^)]+)\)/g, 'String($1).toLowerCase()')
    .replace(/\blen\s*\(([^)]+)\)/g, '($1).length')
    .replace(/for\s+_,\s*(\w+)\s*:=\s*range\s+([^\{]+)\{/g, 'for (let $1 of $2) {')
    .replace(/for\s+(\w+)\s*:=\s*([^;]+);\s*([^;]+);\s*([^\{]+)\{/g, 'for (let $1 = $2; $3; $4) {')
    .replace(/\bvar\s+(\w+)\s+\w+\s*=/g, 'let $1 =')
    .replace(/^(\s*)(\w+)\s*:=/gm, '$1let $2 =')
    .replace(/\belse\s+if\s+([^\{]+)\{/g, 'else if ($1) {')
    .replace(/\bif\s+([^\{]+)\{/g, 'if ($1) {');

  return js;
}

function transpileRust(code: string): string {
  let js = replaceFunctionSignatures(code)
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

  return js;
}

function transpileKotlin(code: string): string {
  let js = replaceFunctionSignatures(code)
    .replace(/\b(?:val|var)\s+/g, 'let ')
    .replace(/\.lowercaseChar\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/\.lowercase\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/(\w+)\.size\b/g, '$1.length')
    .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+?)\s+until\s+([^)]+)\s*\)/g, 'for (let $1 = $2; $1 < $3; $1++)')
    .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+?)\.\.([^)]+)\s*\)/g, 'for (let $1 = $2; $1 <= $3; $1++)')
    .replace(/for\s*\(\s*(\w+)\s+in\s+([^)]+)\s*\)/g, 'for (let $1 of $2)');

  return js;
}

function transpileSwift(code: string): string {
  let js = replaceFunctionSignatures(code)
    .replace(/\b(?:var|let)\s+/g, 'let ')
    .replace(/\.lowercased\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/\.count\b/g, '.length')
    .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.\.([^\{]+)\{/g, 'for (let $1 = $2; $1 <= $3; $1++) {')
    .replace(/for\s+(\w+)\s+in\s+([^.\s]+)\.\.<([^\{]+)\{/g, 'for (let $1 = $2; $1 < $3; $1++) {')
    .replace(/for\s+(\w+)\s+in\s+([^\{]+)\{/g, 'for (let $1 of $2) {')
    .replace(/\belse\s+if\s+([^\{]+)\{/g, 'else if ($1) {')
    .replace(/\bif\s+([^\{]+)\{/g, 'if ($1) {');

  return js;
}

function transpilePhp(code: string): string {
  let js = code
    .replace(/<\?php/gi, '')
    .replace(/\?>/g, '')
    .replace(/&\$/g, '$')
    .replace(/\$([A-Za-z_]\w*)/g, '$1')
    .replace(/\b(?:count|strlen)\s*\(([^)]+)\)/g, '($1).length')
    .replace(/\bstrtolower\s*\(([^)]+)\)/g, 'String($1).toLowerCase()')
    .replace(/\bisset\s*\(([^)]+)\)/g, '($1 !== undefined)')
    .replace(/for\s*\(\s*(\w+)\s*=/g, 'for (let $1 =');

  // Ensure local scalar assignments declare with let on first assignment
  const declared = new Set<string>(['numbers', 'size', 'text', 'arr', 'result', 'i']);
  js = js
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\s*)([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
      if (m && !declared.has(m[2])) {
        declared.add(m[2]);
        return `${m[1]}let ${m[2]} = ${m[3]}`;
      }
      return line;
    })
    .join('\n');

  return js;
}

function transpilePythonExpr(expr: string): string {
  return expr
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\s+/g, '!')
    .replace(/\blen\s*\(([^)]+)\)/g, '($1).length')
    .replace(/\.lower\s*\(\s*\)/g, '.toLowerCase()')
    .replace(/(\w+)\s+not\s+in\s+\(([^)]+)\)/g, '![$2].includes($1)')
    .replace(/(\w+)\s+in\s+\(([^)]+)\)/g, '[$2].includes($1)')
    .replace(/(\w+)\s+in\s+\[([^\]]+)\]/g, '[$2].includes($1)')
    .replace(/(\w+)\s+in\s+(['"][^'"]+['"])/g, '$2.includes($1)');
}

function transpilePython(code: string, challengeId: string): string {
  const rawLines = code.split('\n');
  const out: string[] = [];
  const indentStack: number[] = [0];
  const declared = new Set<string>(['numbers', 'size', 'text', 'arr', 'result']);

  for (const rawLine of rawLines) {
    const clean = stripLineComment(rawLine, '#').replace(/\s+$/, '');
    if (!clean.trim()) continue;

    const indent = clean.match(/^(\s*)/)?.[1].length ?? 0;
    const trimmed = clean.trim();

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      out.push('}');
    }

    if (/^def\s+\w+\s*\([^)]*\)\s*(?:->\s*[^:]+)?\s*:/.test(trimmed)) {
      const signature = PYTHON_FN_MAP[challengeId] || `${getTargetFnName(challengeId)}()`;
      out.push(`function ${signature} {`);
      indentStack.push(indent + 1);
      continue;
    }

    if (trimmed.startsWith('elif ') && trimmed.endsWith(':')) {
      const cond = transpilePythonExpr(trimmed.slice(5, -1).trim());
      out.push(`else if (${cond}) {`);
      indentStack.push(indent + 1);
      continue;
    }

    if (trimmed === 'else:') {
      out.push('else {');
      indentStack.push(indent + 1);
      continue;
    }

    if (trimmed.startsWith('if ') && trimmed.endsWith(':')) {
      const cond = transpilePythonExpr(trimmed.slice(3, -1).trim());
      out.push(`if (${cond}) {`);
      indentStack.push(indent + 1);
      continue;
    }

    const rangeTwo = trimmed.match(/^for\s+(\w+)\s+in\s+range\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*:$/);
    if (rangeTwo) {
      const [, v, start, end] = rangeTwo;
      out.push(`for (let ${v} = ${transpilePythonExpr(start)}; ${v} < ${transpilePythonExpr(end)}; ${v}++) {`);
      declared.add(v);
      indentStack.push(indent + 1);
      continue;
    }

    const rangeOne = trimmed.match(/^for\s+(\w+)\s+in\s+range\s*\(\s*([^)]+)\s*\)\s*:$/);
    if (rangeOne) {
      const [, v, end] = rangeOne;
      out.push(`for (let ${v} = 0; ${v} < ${transpilePythonExpr(end)}; ${v}++) {`);
      declared.add(v);
      indentStack.push(indent + 1);
      continue;
    }

    const forEach = trimmed.match(/^for\s+(\w+)\s+in\s+(.+)\s*:$/);
    if (forEach) {
      const [, v, iterable] = forEach;
      out.push(`for (let ${v} of ${transpilePythonExpr(iterable)}) {`);
      declared.add(v);
      indentStack.push(indent + 1);
      continue;
    }

    let stmt = transpilePythonExpr(trimmed);
    const assignMatch = stmt.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
    if (assignMatch && !declared.has(assignMatch[1])) {
      declared.add(assignMatch[1]);
      stmt = `let ${assignMatch[1]} = ${assignMatch[2]}`;
    }
    out.push(`${stmt};`);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    out.push('}');
  }

  return out.join('\n');
}

function transpileRuby(code: string, challengeId: string): string {
  const rawLines = code.split('\n');
  const out: string[] = [];
  const declared = new Set<string>(['numbers', 'size', 'text', 'arr', 'result']);

  for (const rawLine of rawLines) {
    const clean = stripLineComment(rawLine, '#').trim();
    if (!clean) continue;

    if (/^def\s+\w+\s*\([^)]*\)/.test(clean)) {
      const signature = PYTHON_FN_MAP[challengeId] || `${getTargetFnName(challengeId)}()`;
      out.push(`function ${signature} {`);
      continue;
    }

    if (clean === 'end') {
      out.push('}');
      continue;
    }

    if (clean === 'else') {
      out.push('} else {');
      continue;
    }

    if (clean.startsWith('elsif ')) {
      const cond = clean.slice(6).replace(/\.downcase/g, '.toLowerCase()');
      out.push(`} else if (${cond}) {`);
      continue;
    }

    if (clean.startsWith('if ')) {
      const cond = clean.slice(3).replace(/\.downcase/g, '.toLowerCase()');
      out.push(`if (${cond}) {`);
      continue;
    }

    const forExcl = clean.match(/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.\.([^\s]+)$/);
    if (forExcl) {
      const [, v, start, end] = forExcl;
      declared.add(v);
      out.push(`for (let ${v} = ${start}; ${v} < ${end}; ${v}++) {`);
      continue;
    }

    const forIncl = clean.match(/^for\s+(\w+)\s+in\s+([^\s.]+)\.\.([^\s]+)$/);
    if (forIncl) {
      const [, v, start, end] = forIncl;
      declared.add(v);
      out.push(`for (let ${v} = ${start}; ${v} <= ${end}; ${v}++) {`);
      continue;
    }

    const eachChar = clean.match(/^(.+?)\.each_char\s+do\s+\|(\w+)\|$/);
    if (eachChar) {
      const [, expr, v] = eachChar;
      declared.add(v);
      out.push(`for (let ${v} of ${expr.replace(/\.downcase/g, '.toLowerCase()')}) {`);
      continue;
    }

    let stmt = clean.replace(/\.downcase/g, '.toLowerCase()');
    const assignMatch = stmt.match(/^([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
    if (assignMatch && !declared.has(assignMatch[1])) {
      declared.add(assignMatch[1]);
      stmt = `let ${assignMatch[1]} = ${assignMatch[2]}`;
    }
    out.push(`${stmt};`);
  }

  return out.join('\n');
}

export function compileAndRunSolution(
  code: string,
  language: ProgrammingLanguage,
  challengeId: string
) {
  let js = code;

  switch (language) {
    case 'javascript':
      js = code;
      break;
    case 'typescript':
      js = transpileTypeScript(code);
      break;
    case 'c':
    case 'cpp':
    case 'java':
    case 'csharp':
      js = transpileCStyle(code, language);
      break;
    case 'go':
      js = transpileGo(code);
      break;
    case 'rust':
      js = transpileRust(code);
      break;
    case 'kotlin':
      js = transpileKotlin(code);
      break;
    case 'swift':
      js = transpileSwift(code);
      break;
    case 'php':
      js = transpilePhp(code);
      break;
    case 'python':
      js = transpilePython(code, challengeId);
      break;
    case 'ruby':
      js = transpileRuby(code, challengeId);
      break;
    default:
      js = transpileCStyle(code, 'c');
  }

  const fnName = getTargetFnName(challengeId);
  const helper = `const __tolower = (c) => (typeof c === 'number' ? String.fromCharCode(c).toLowerCase() : String(c).toLowerCase());`;
  const sandbox = new Function(`${helper}\n${js};\nreturn ${fnName};`);
  return sandbox();
}
