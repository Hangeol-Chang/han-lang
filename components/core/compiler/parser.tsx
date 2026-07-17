import { Token, TokenType, tokenize, stripParticle } from './lexer';

export { tokenize };

// AST Types

export type Expression =
  | { type: 'Number'; value: number }
  | { type: 'String'; value: string }
  | { type: 'Bool'; value: boolean }
  | { type: 'Identifier'; name: string }
  | { type: 'BinaryOp'; op: string; left: Expression; right: Expression }
  | { type: 'ArrayLiteral'; elements: Expression[] }
  | { type: 'DictLiteral'; entries: [Expression, Expression][] }
  | { type: 'Index'; array: Expression; index: Expression }
  | { type: 'Call'; name: string; args: Expression[] };

export type Statement =
  | { type: 'Assign'; name: string; value: Expression }
  | { type: 'Declare'; name: string }
  | { type: 'IndexAssign'; name: string; index: Expression; value: Expression }
  | { type: 'Print'; args: Expression[] }
  | { type: 'Input'; targets: Expression[] }
  | { type: 'If'; condition: Expression; body: Statement[]; elseBody: Statement[] }
  | { type: 'While'; condition: Expression; body: Statement[] }
  | { type: 'For'; name: string; start: Expression; end: Expression; step?: Expression; body: Statement[] }
  | { type: 'FunctionDecl'; name: string; params: string[]; body: Statement[] }
  | { type: 'Return'; value: Expression }
  | { type: 'Break' }
  | { type: 'ExprStatement'; expr: Expression };

export type Program = { type: 'Program'; body: Statement[] };
export type FunctionDecl = Extract<Statement, { type: 'FunctionDecl' }>;

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
    if (tok.type === 'BREAK') return this.parseBreak();
    if (tok.type === 'FUNCTION') return this.parseFunctionDecl();
    if (tok.type === 'LPAREN') return this.parseLParenStatement();
    if (tok.type === 'IDENTIFIER') {
      if (this.tokens[this.pos + 1]?.type === 'LBRACKET' && this.isIndexAssignAhead()) {
        return this.parseIndexAssign();
      }
      // 함수이름(...) used standalone (no assignment) — a call statement for side effects.
      // Distinguished from "이름은 (...)를 동사한다 이다." (an assignment whose value
      // happens to start with a parenthesized expression) by checking for ASSIGN ahead.
      if (this.tokens[this.pos + 1]?.type === 'LPAREN' && this.isPlainCallAhead()) {
        return this.parseCallStatement();
      }
    }

    // 변수가 시작부터 끝까지 [스텝씩] 동안 — counted for-loop, same trailing "동안" as while
    // so it reads as "while counting from A to B" rather than a self-contained sentence.
    if (tok.type === 'IDENTIFIER' && this.isImplicitCallAhead('WHILE')) {
      return this.parseFor();
    }

    // 인자1[조사] 인자2[조사] ... 출력한다. — paren-less call, e.g. "사과랑 배를 출력한다."
    // Any primary (identifier, literal, array) can start this, not just identifiers.
    if (Parser.PRIMARY_START.includes(tok.type) && this.isImplicitCallAhead('PRINT')) {
      return this.parseParenlessPrint();
    }

    // 변수1[조사] 변수2[조사] ... 입력받는다. — paren-less input, e.g. "사과와 배를 입력받는다."
    if (tok.type === 'IDENTIFIER' && this.isImplicitCallAhead('INPUT')) {
      return this.parseParenlessInput();
    }

    if (tok.type === 'IDENTIFIER') {
      return this.parseIdentifierStatement();
    }

    // skip unexpected token
    this.advance();
    return null;
  }

  // Distinguishes `이름[idx]는 값 이다.` (index assign) from `이름은 [값, ...] 이다.`
  // (assignment whose value happens to be an array literal) by checking what
  // follows the matching closing bracket — ASSIGN means the bracket was the value.
  private isIndexAssignAhead(): boolean {
    let depth = 0;
    let look = this.pos + 1; // at LBRACKET
    while (look < this.tokens.length) {
      if (this.tokens[look].type === 'LBRACKET') depth++;
      else if (this.tokens[look].type === 'RBRACKET') {
        depth--;
        if (depth === 0) { look++; break; }
      }
      look++;
    }
    return this.tokens[look]?.type !== 'ASSIGN';
  }

  // IDENTIFIER LPAREN ahead — true unless an ASSIGN or STRING_METHOD token appears at
  // depth 0 before the statement ends, which means the LPAREN actually starts the value
  // of an assignment (e.g. "결과는 (...)를 공백제거한다." or "...이다.") rather than a
  // bare function call.
  private isPlainCallAhead(): boolean {
    let depth = 0;
    let look = this.pos + 1; // at LPAREN
    while (look < this.tokens.length) {
      const t = this.tokens[look].type;
      if (t === 'LPAREN' || t === 'LBRACKET') depth++;
      else if (t === 'RPAREN' || t === 'RBRACKET') depth--;
      else if (depth === 0) {
        if (t === 'ASSIGN' || t === 'STRING_METHOD') return false;
        if (t === 'NEWLINE' || t === 'PERIOD' || t === 'EOF' || t === 'DEDENT') return true;
      }
      look++;
    }
    return true;
  }

  // Determine whether (…) starts a while, a print, or a return by peeking past the closing )
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
    const nextType = this.tokens[look]?.type;
    if (nextType === 'WHILE') return this.parseWhile();
    if (nextType === 'RETURN') return this.parseReturn();
    if (nextType === 'INPUT') return this.parseInput();
    if (nextType === 'STRING_METHOD') return this.parseCallStatement();
    return this.parsePrint();
  }

  // 함수 이름(매개변수, ...) NEWLINE INDENT body DEDENT
  private parseFunctionDecl(): Statement {
    this.expect('FUNCTION');
    const name = this.advance().value as string;
    this.expect('LPAREN');
    const params: string[] = [];
    if (this.peek().type !== 'RPAREN') {
      params.push(this.advance().value as string);
      while (this.peek().type === 'COMMA') {
        this.advance();
        params.push(this.advance().value as string);
      }
    }
    this.expect('RPAREN');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    const body = this.parseIndentedBlock();
    return { type: 'FunctionDecl', name, params, body };
  }

  // (값)를 반환한다.
  private parseReturn(): Statement {
    this.expect('LPAREN');
    const value = this.parseExpr();
    this.expect('RPAREN');
    this.expect('RETURN');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Return', value };
  }

  // 중단한다.
  private parseBreak(): Statement {
    this.expect('BREAK');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Break' };
  }

  // 함수이름(args) — standalone call statement, no assignment
  private parseCallStatement(): Statement {
    const expr = this.parseExpr();
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'ExprStatement', expr };
  }

  // 이름[인덱스] 는 값 이다.
  private parseIndexAssign(): Statement {
    const name = this.advance().value as string;
    this.expect('LBRACKET');
    const index = this.parseExpr();
    this.expect('RBRACKET');
    const value = this.parseExpr();
    this.expect('ASSIGN');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'IndexAssign', name, index, value };
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

  // Strips a subject particle (가/이/는/은) off the for-loop variable even when only
  // 1 char remains (e.g. "i가" → "i") — safe here because this grammar slot is always
  // immediately followed by FROM, unlike the general case stripParticle() guards against.
  private static readonly FOR_VAR_PARTICLES = ['는', '은', '가', '이'];
  private stripForVarParticle(word: string): string {
    for (const p of Parser.FOR_VAR_PARTICLES) {
      if (word.endsWith(p) && word.length > p.length) return word.slice(0, word.length - p.length);
    }
    return word;
  }

  // 변수가 시작부터 끝까지 [스텝씩] 동안
  private parseFor(): Statement {
    const name = this.stripForVarParticle(this.advance().value as string);
    const start = this.parseExpr();
    this.expect('FROM');
    const end = this.parseExpr();
    this.expect('TO');
    let step: Expression | undefined;
    if (this.peek().type !== 'WHILE') {
      step = this.parseExpr();
      this.expect('STEP');
    }
    this.expect('WHILE');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    const body = this.parseIndentedBlock();
    return { type: 'For', name, start, end, step, body };
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

  // A variable reference that can receive a value: IDENTIFIER or IDENTIFIER[index][index]...
  private parseInputTarget(): Expression {
    const tok = this.peek();
    if (tok.type !== 'IDENTIFIER') {
      throw new Error(`${tok.line}번 줄: "입력받는다"는 변수만 대상으로 할 수 있습니다`);
    }
    this.advance();
    let node: Expression = { type: 'Identifier', name: tok.value as string };
    while (this.peek().type === 'LBRACKET') {
      this.advance();
      const index = this.parseExpr();
      this.expect('RBRACKET');
      node = { type: 'Index', array: node, index };
    }
    return node;
  }

  // (변수1, 변수2, ...) 입력받는다.
  private parseInput(): Statement {
    this.expect('LPAREN');
    const targets: Expression[] = [];
    if (this.peek().type !== 'RPAREN') {
      targets.push(this.parseInputTarget());
      while (this.peek().type === 'COMMA') {
        this.advance();
        targets.push(this.parseInputTarget());
      }
    }
    this.expect('RPAREN');
    this.expect('INPUT');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Input', targets };
  }

  // 변수1[조사] 변수2[조사] ... 입력받는다.
  private parseParenlessInput(): Statement {
    const targets: Expression[] = [this.parseInputTarget()];
    while (this.peek().type !== 'INPUT') {
      targets.push(this.parseInputTarget());
    }
    this.expect('INPUT');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Input', targets };
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
    // A verb-final call (e.g. "(...)를 공백제거한다") already ends the sentence on its
    // own predicate, same as "출력한다"/"입력받는다" — a trailing "이다" is a duplicate
    // ending and is rejected rather than silently accepted.
    if (this.tokens[this.pos - 1]?.type === 'STRING_METHOD') {
      if (this.peek().type === 'ASSIGN') {
        throw new Error(`${this.peek().line}번 줄: 동사형 함수(${this.tokens[this.pos - 1].value}) 뒤에는 "이다"를 붙이지 않습니다`);
      }
    } else {
      this.expect('ASSIGN');
    }
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Assign', name, value };
  }

  // Looks ahead (without consuming) to see whether the current statement is a
  // Korean-order call: 인자1[조사] 인자2[조사] ... 인자N[조사] 동사. — where the
  // "동사" is the given trigger keyword (e.g. PRINT). Stops at the first
  // ASSIGN/DECLARE/statement-end token found at bracket depth 0, since those
  // mean this is really an assignment/declaration instead.
  //
  // This same shape — implicit particle-joined arguments ending in a verb — is
  // what future user-defined function calls will use (e.g. "사과랑 배를 갈아마신다"),
  // so `triggerType` is a parameter rather than being hardcoded to PRINT.
  private isImplicitCallAhead(triggerType: TokenType): boolean {
    let depth = 0;
    let look = this.pos;
    while (look < this.tokens.length) {
      const t = this.tokens[look].type;
      if (t === 'LPAREN' || t === 'LBRACKET') depth++;
      else if (t === 'RPAREN' || t === 'RBRACKET') depth--;
      else if (depth === 0) {
        if (t === triggerType) return true;
        if (t === 'ASSIGN' || t === 'DECLARE' || t === 'NEWLINE' || t === 'PERIOD' || t === 'EOF' || t === 'DEDENT') {
          return false;
        }
      }
      look++;
    }
    return false;
  }

  // Parses a Korean-order argument list: 인자1[조사] 인자2[조사] ... , stopping
  // right before the token matching `triggerType`. Each argument is parsed with
  // parseAddSub (not parseExpr) so that a bare identifier immediately following
  // another isn't mistaken for the Korean comparison form (see parseComparison).
  private parseImplicitArgs(triggerType: TokenType): Expression[] {
    const args: Expression[] = [this.parseAddSub()];
    while (this.peek().type !== triggerType) {
      args.push(this.parseAddSub());
    }
    return args;
  }

  // 인자1[조사] 인자2[조사] ... 출력한다.
  private parseParenlessPrint(): Statement {
    const args = this.parseImplicitArgs('PRINT');
    this.expect('PRINT');
    if (this.peek().type === 'PERIOD') this.advance();
    this.skipNewlines();
    return { type: 'Print', args };
  }

  // Expression grammar (comparison → addSub → mulDiv → unary → primary)
  private parseExpr(): Expression {
    return this.parseComparison();
  }

  // Tokens that can start a primary expression — used to detect the Korean
  // comparison form "A가 B보다 크다", where B follows A with no operator between them.
  private static readonly PRIMARY_START: TokenType[] = ['NUMBER', 'STRING', 'TRUE', 'FALSE', 'IDENTIFIER', 'LBRACKET', 'LPAREN'];

  private parseComparison(): Expression {
    let left = this.parseAddSub();
    while (true) {
      if (this.peek().type === 'OPERATOR' && ['<', '>', '==', '!=', '<=', '>='].includes(this.peek().value as string)) {
        const op = this.advance().value as string;
        left = { type: 'BinaryOp', op, left, right: this.parseAddSub() };
        continue;
      }
      if (Parser.PRIMARY_START.includes(this.peek().type)) {
        const right = this.parseAddSub();
        this.expect('THAN');
        const op = this.parseComparePredicate();
        left = { type: 'BinaryOp', op, left, right };
        continue;
      }
      break;
    }
    return left;
  }

  // 크다/작다/크거나 같다/작거나 같다/같다/다르다 → >, <, >=, <=, ==, !=
  private parseComparePredicate(): string {
    const word = this.expect('COMPARE_KEYWORD').value as string;
    switch (word) {
      case '크다': return '>';
      case '작다': return '<';
      case '같다': return '==';
      case '다르다': return '!=';
      case '크거나':
      case '작거나': {
        const next = this.peek();
        if (next.type === 'COMPARE_KEYWORD' && next.value === '같다') {
          this.advance();
          return word === '크거나' ? '>=' : '<=';
        }
        throw new Error(`${next.line}번 줄: "${word}" 다음에는 "같다"가 와야 합니다`);
      }
      default:
        throw new Error(`알 수 없는 비교 서술어: ${word}`);
    }
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
    while (this.peek().type === 'OPERATOR' && ['*', '/', '%'].includes(this.peek().value as string)) {
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

    if (tok.type === 'LBRACKET') {
      this.advance();
      const elements: Expression[] = [];
      if (this.peek().type !== 'RBRACKET') {
        elements.push(this.parseExpr());
        while (this.peek().type === 'COMMA') {
          this.advance();
          elements.push(this.parseExpr());
        }
      }
      this.expect('RBRACKET');
      return { type: 'ArrayLiteral', elements };
    }

    if (tok.type === 'LBRACE') {
      this.advance();
      const entries: [Expression, Expression][] = [];
      if (this.peek().type !== 'RBRACE') {
        const parseEntry = () => {
          const key = this.parseExpr();
          this.expect('COLON');
          const value = this.parseExpr();
          entries.push([key, value]);
        };
        parseEntry();
        while (this.peek().type === 'COMMA') {
          this.advance();
          parseEntry();
        }
      }
      this.expect('RBRACE');
      return { type: 'DictLiteral', entries };
    }

    if (tok.type === 'IDENTIFIER') {
      this.advance();
      let node: Expression = { type: 'Identifier', name: tok.value as string };

      // function call: IDENTIFIER(args)
      if (this.peek().type === 'LPAREN') {
        this.advance();
        const args: Expression[] = [];
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseExpr());
          while (this.peek().type === 'COMMA') {
            this.advance();
            args.push(this.parseExpr());
          }
        }
        this.expect('RPAREN');
        node = { type: 'Call', name: tok.value as string, args };
      }

      // index access (chainable for nested arrays): IDENTIFIER[expr][expr]...
      while (this.peek().type === 'LBRACKET') {
        this.advance();
        const index = this.parseExpr();
        this.expect('RBRACKET');
        node = { type: 'Index', array: node, index };
      }

      return node;
    }

    if (tok.type === 'LPAREN') {
      this.advance();
      const args: Expression[] = [];
      if (this.peek().type !== 'RPAREN') {
        args.push(this.parseExpr());
        while (this.peek().type === 'COMMA') {
          this.advance();
          args.push(this.parseExpr());
        }
      }
      this.expect('RPAREN');

      // (args)를 동사한다 — verb-final call expression, e.g. ("  사과 ")를 공백제거한다.
      if (this.peek().type === 'STRING_METHOD') {
        const name = this.advance().value as string;
        return { type: 'Call', name, args };
      }

      if (args.length !== 1) {
        throw new Error(`${this.peek().line}번 줄: 괄호 안에 여러 값을 쓰려면 뒤에 동사가 와야 합니다`);
      }
      return args[0];
    }
    throw new Error(`${tok.line}번 줄: 예상치 못한 토큰 ${tok.type}(${tok.value})`);
  }
}
