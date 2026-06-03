import { Token, TokenType, tokenize } from './lexer';

export { tokenize };

// Safe particles: strip even if only 1 char remains (은/는/를/을 rarely end actual Korean nouns)
const SAFE_PARTICLES = ['을', '를', '은', '는'];
// Risky particles: require >=2 chars to remain (이/가/과/와 commonly end actual Korean nouns)
const RISKY_PARTICLES = ['이라면', '으로', '에서', '라면', '이면', '이', '가', '와', '과', '의', '에', '도', '만', '로'];

function stripParticle(word: string): string {
  for (const p of SAFE_PARTICLES) {
    if (word.endsWith(p) && word.length > p.length) return word.slice(0, word.length - p.length);
  }
  for (const p of RISKY_PARTICLES) {
    if (word.endsWith(p) && word.length - p.length >= 2) return word.slice(0, word.length - p.length);
  }
  return word;
}

// AST Types

export type Expression =
  | { type: 'Number'; value: number }
  | { type: 'String'; value: string }
  | { type: 'Bool'; value: boolean }
  | { type: 'Identifier'; name: string }
  | { type: 'BinaryOp'; op: string; left: Expression; right: Expression };

export type Statement =
  | { type: 'Assign'; name: string; value: Expression }
  | { type: 'Declare'; name: string }
  | { type: 'Print'; args: Expression[] }
  | { type: 'If'; condition: Expression; body: Statement[]; elseBody: Statement[] }
  | { type: 'While'; condition: Expression; body: Statement[] };

export type Program = { type: 'Program'; body: Statement[] };

export class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private advance(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType): Token {
    const tok = this.peek();
    if (tok.type !== type) {
      throw new Error(`${tok.line}번 줄: ${type} 토큰을 기대했지만 ${tok.type}(${tok.value})가 나왔습니다`);
    }
    return this.advance();
  }

  private skipNewlines(): void {
    while (this.peek().type === 'NEWLINE') this.advance();
  }

  parse(): Program {
    const body = this.parseBlock();
    return { type: 'Program', body };
  }

  private parseBlock(): Statement[] {
    const stmts: Statement[] = [];
    while (true) {
      this.skipNewlines();
      const { type } = this.peek();
      if (type === 'EOF' || type === 'DEDENT') break;
      const stmt = this.parseStatement();
      if (stmt) stmts.push(stmt);
    }
    return stmts;
  }

  private parseIndentedBlock(): Statement[] {
    this.expect('INDENT');
    const stmts: Statement[] = [];
    while (true) {
      this.skipNewlines();
      const { type } = this.peek();
      if (type === 'DEDENT' || type === 'EOF') break;
      const stmt = this.parseStatement();
      if (stmt) stmts.push(stmt);
    }
    if (this.peek().type === 'DEDENT') this.advance();
    return stmts;
  }

  private parseStatement(): Statement | null {
    this.skipNewlines();
    const tok = this.peek();

    if (tok.type === 'EOF' || tok.type === 'DEDENT') return null;

    if (tok.type === 'IF') return this.parseIf();
    if (tok.type === 'LPAREN') return this.parseLParenStatement();
    if (tok.type === 'IDENTIFIER') return this.parseIdentifierStatement();

    // skip unexpected token
    this.advance();
    return null;
  }

  // Determine whether (…) starts a while or a print by peeking past the closing )
  private parseLParenStatement(): Statement {
    let depth = 0;
    let look = this.pos;
    while (look < this.tokens.length) {
      if (this.tokens[look].type === 'LPAREN') depth++;
      else if (this.tokens[look].type === 'RPAREN') {
        depth--;
        if (depth === 0) { look++; break; }
      }
      look++;
    }
    return this.tokens[look]?.type === 'WHILE' ? this.parseWhile() : this.parsePrint();
  }

  // 만약 (condition) 라면/이면/이라면/면
  private parseIf(): Statement {
    this.expect('IF');
    this.expect('LPAREN');
    const condition = this.parseExpr();
    this.expect('RPAREN');
    if (this.peek().type === 'IF_TRIGGER') this.advance();
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    const body = this.parseIndentedBlock();
    this.skipNewlines();
    let elseBody: Statement[] = [];
    if (this.peek().type === 'ELSE') {
      this.advance();
      if (this.peek().type === 'PERIOD') this.advance();
      this.skipNewlines();
      elseBody = this.parseIndentedBlock();
    }
    return { type: 'If', condition, body, elseBody };
  }

  // (condition) 동안
  private parseWhile(): Statement {
    this.expect('LPAREN');
    const condition = this.parseExpr();
    this.expect('RPAREN');
    this.expect('WHILE');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    const body = this.parseIndentedBlock();
    return { type: 'While', condition, body };
  }

  // (args) 출력한다.
  private parsePrint(): Statement {
    this.expect('LPAREN');
    const args: Expression[] = [];
    if (this.peek().type !== 'RPAREN') {
      args.push(this.parseExpr());
      while (this.peek().type === 'COMMA') {
        this.advance();
        args.push(this.parseExpr());
      }
    }
    this.expect('RPAREN');
    this.expect('PRINT');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Print', args };
  }

  // IDENTIFIER[+particle] 이다 VALUE. | IDENTIFIER[+particle] 있다.
  private parseIdentifierStatement(): Statement {
    const name = stripParticle(this.advance().value as string);

    if (this.peek().type === 'DECLARE') {
      this.advance();
      if (this.peek().type === 'PERIOD') this.advance();
      this.skipNewlines();
      return { type: 'Declare', name };
    }

    // assignment: parse expression until ASSIGN keyword
    const value = this.parseExpr();
    this.expect('ASSIGN');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Assign', name, value };
  }

  // Expression grammar (comparison → addSub → mulDiv → unary → primary)
  private parseExpr(): Expression {
    return this.parseComparison();
  }

  private parseComparison(): Expression {
    let left = this.parseAddSub();
    while (this.peek().type === 'OPERATOR' && ['<', '>', '==', '!=', '<=', '>='].includes(this.peek().value as string)) {
      const op = this.advance().value as string;
      left = { type: 'BinaryOp', op, left, right: this.parseAddSub() };
    }
    return left;
  }

  private parseAddSub(): Expression {
    let left = this.parseMulDiv();
    while (this.peek().type === 'OPERATOR' && ['+', '-'].includes(this.peek().value as string)) {
      const op = this.advance().value as string;
      left = { type: 'BinaryOp', op, left, right: this.parseMulDiv() };
    }
    return left;
  }

  private parseMulDiv(): Expression {
    let left = this.parseUnary();
    while (this.peek().type === 'OPERATOR' && ['*', '/'].includes(this.peek().value as string)) {
      const op = this.advance().value as string;
      left = { type: 'BinaryOp', op, left, right: this.parseUnary() };
    }
    return left;
  }

  private parseUnary(): Expression {
    if (this.peek().type === 'OPERATOR' && this.peek().value === '-') {
      this.advance();
      return { type: 'BinaryOp', op: '-', left: { type: 'Number', value: 0 }, right: this.parsePrimary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    const tok = this.peek();
    if (tok.type === 'NUMBER') { this.advance(); return { type: 'Number', value: tok.value as number }; }
    if (tok.type === 'STRING') { this.advance(); return { type: 'String', value: tok.value as string }; }
    if (tok.type === 'TRUE') { this.advance(); return { type: 'Bool', value: true }; }
    if (tok.type === 'FALSE') { this.advance(); return { type: 'Bool', value: false }; }
    if (tok.type === 'IDENTIFIER') { this.advance(); return { type: 'Identifier', name: tok.value as string }; }
    if (tok.type === 'LPAREN') {
      this.advance();
      const expr = this.parseExpr();
      this.expect('RPAREN');
      return expr;
    }
    throw new Error(`${tok.line}번 줄: 예상치 못한 토큰 ${tok.type}(${tok.value})`);
  }
}
