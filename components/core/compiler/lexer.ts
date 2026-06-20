export type TokenType =
  | 'NUMBER' | 'STRING' | 'IDENTIFIER'
  | 'ASSIGN'      // 이다
  | 'DECLARE'     // 있다
  | 'PRINT'       // 출력한다
  | 'IF'          // 만약
  | 'IF_TRIGGER'  // 라면, 이면, 이라면, 면
  | 'ELSE'        // 아니면
  | 'WHILE'       // 동안
  | 'TRUE'        // 진실
  | 'FALSE'       // 거짓
  | 'FUNCTION'    // 함수
  | 'RETURN'      // 반환한다
  | 'LPAREN' | 'RPAREN' | 'LBRACKET' | 'RBRACKET' | 'COMMA' | 'PERIOD'
  | 'OPERATOR'
  | 'NEWLINE' | 'INDENT' | 'DEDENT' | 'EOF';

export interface Token {
  type: TokenType;
  value: string | number;
  line: number;
}

const KEYWORDS: Record<string, TokenType> = {
  '이다': 'ASSIGN',
  '있다': 'DECLARE',
  '출력한다': 'PRINT',
  '만약': 'IF',
  '라면': 'IF_TRIGGER',
  '이면': 'IF_TRIGGER',
  '이라면': 'IF_TRIGGER',
  '면': 'IF_TRIGGER',
  '아니면': 'ELSE',
  '동안': 'WHILE',
  '진실': 'TRUE',
  '거짓': 'FALSE',
  '함수': 'FUNCTION',
  '반환한다': 'RETURN',
};

// longest-first to avoid partial matches
const PARTICLES = ['이라면', '으로', '에서', '라면', '이면', '은', '는', '이', '가', '을', '를', '와', '과', '의', '에', '도', '만', '로'];

function isKorean(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    (code >= 0xac00 && code <= 0xd7a3) ||
    (code >= 0x1100 && code <= 0x11ff) ||
    (code >= 0x3130 && code <= 0x318f)
  );
}

function isIdentChar(ch: string): boolean {
  return isKorean(ch) || /[a-zA-Z_0-9]/.test(ch);
}

export function tokenize(source: string): Token[] {
  const lines = source.split('\n');
  const tokens: Token[] = [];
  const indentStack: number[] = [0];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const raw = lines[lineNum];
    const lineNo = lineNum + 1;

    // Count leading whitespace (1 tab = 4 spaces = 1 level unit of 4)
    let wsCount = 0;
    let i = 0;
    while (i < raw.length && (raw[i] === '\t' || raw[i] === ' ')) {
      wsCount += raw[i] === '\t' ? 4 : 1;
      i++;
    }

    const rest = raw.slice(i);
    if (rest.trim() === '' || rest.trimStart().startsWith('//')) continue;

    const indent = wsCount;
    const topIndent = indentStack[indentStack.length - 1];

    if (indent > topIndent) {
      indentStack.push(indent);
      tokens.push({ type: 'INDENT', value: indent, line: lineNo });
    } else if (indent < topIndent) {
      while (indentStack.length > 1 && indentStack[indentStack.length - 1] > indent) {
        indentStack.pop();
        tokens.push({ type: 'DEDENT', value: indent, line: lineNo });
      }
    }

    let pos = i;

    while (pos < raw.length) {
      const ch = raw[pos];

      if (ch === ' ' || ch === '\t') { pos++; continue; }
      if (ch === '/' && raw[pos + 1] === '/') break;

      // Number literal (including negative)
      if (/[0-9]/.test(ch)) {
        let num = '';
        while (pos < raw.length && /[0-9.]/.test(raw[pos])) num += raw[pos++];
        tokens.push({ type: 'NUMBER', value: parseFloat(num), line: lineNo });
        continue;
      }

      // String literal
      if (ch === '"') {
        pos++;
        let str = '';
        while (pos < raw.length && raw[pos] !== '"') {
          if (raw[pos] === '\\') {
            pos++;
            const ESC: Record<string, string> = { n: '\n', t: '\t', '"': '"', "'": "'" };
            str += ESC[raw[pos]] ?? raw[pos];
          } else {
            str += raw[pos];
          }
          pos++;
        }
        pos++; // closing "
        tokens.push({ type: 'STRING', value: str, line: lineNo });
        continue;
      }

      // Two-char operators
      const two = raw.slice(pos, pos + 2);
      if (['==', '!=', '<=', '>='].includes(two)) {
        tokens.push({ type: 'OPERATOR', value: two, line: lineNo });
        pos += 2;
        continue;
      }

      // Single-char operators
      if (['+', '-', '*', '/', '<', '>'].includes(ch)) {
        tokens.push({ type: 'OPERATOR', value: ch, line: lineNo });
        pos++;
        continue;
      }

      if (ch === '(') { tokens.push({ type: 'LPAREN', value: '(', line: lineNo }); pos++; continue; }
      if (ch === ')') { tokens.push({ type: 'RPAREN', value: ')', line: lineNo }); pos++; continue; }
      if (ch === '[') { tokens.push({ type: 'LBRACKET', value: '[', line: lineNo }); pos++; continue; }
      if (ch === ']') { tokens.push({ type: 'RBRACKET', value: ']', line: lineNo }); pos++; continue; }
      if (ch === ',') { tokens.push({ type: 'COMMA', value: ',', line: lineNo }); pos++; continue; }
      if (ch === '.' || ch === ';') { tokens.push({ type: 'PERIOD', value: '.', line: lineNo }); pos++; continue; }

      // Korean or Latin identifier / keyword
      if (isKorean(ch) || /[a-zA-Z_]/.test(ch)) {
        let word = '';
        while (pos < raw.length && isIdentChar(raw[pos])) word += raw[pos++];

        // Exact keyword match wins
        if (KEYWORDS[word]) {
          tokens.push({ type: KEYWORDS[word], value: word, line: lineNo });
          continue;
        }

        // Standalone particle (whole word is just a particle) — skip entirely
        // Particle stripping from identifiers is handled by the parser at statement level
        if (PARTICLES.includes(word)) continue;

        tokens.push({ type: 'IDENTIFIER', value: word, line: lineNo });
        continue;
      }

      // Unknown: skip
      pos++;
    }

    tokens.push({ type: 'NEWLINE', value: '\n', line: lineNo });
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    tokens.push({ type: 'DEDENT', value: 0, line: lines.length });
  }
  tokens.push({ type: 'EOF', value: '', line: lines.length });
  return tokens;
}
