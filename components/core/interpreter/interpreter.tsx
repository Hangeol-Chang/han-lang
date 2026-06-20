import type { Program, Statement, Expression, FunctionDecl } from '../compiler/parser';

type Value = number | string | boolean | undefined | Value[];

class ReturnSignal {
  constructor(public value: Value) {}
}

const MAX_CALL_DEPTH = 1000;

export class Interpreter {
  private env: Map<string, Value> = new Map();
  private functions: Map<string, FunctionDecl> = new Map();
  private output: string[] = [];
  private callDepth = 0;

  run(program: Program): string {
    this.env = new Map();
    this.functions = new Map();
    this.output = [];
    this.callDepth = 0;

    // Hoist top-level function declarations so they can be called before their textual position
    for (const stmt of program.body) {
      if (stmt.type === 'FunctionDecl') this.functions.set(stmt.name, stmt);
    }

    try {
      this.execBlock(program.body);
    } catch (e) {
      if (!(e instanceof ReturnSignal)) throw e;
    }
    return this.output.join('');
  }

  private execBlock(stmts: Statement[]): void {
    for (const stmt of stmts) {
      this.execStatement(stmt);
    }
  }

  private execStatement(stmt: Statement): void {
    switch (stmt.type) {
      case 'Assign':
        this.env.set(stmt.name, this.evalExpr(stmt.value));
        break;
      case 'Declare':
        this.env.set(stmt.name, undefined);
        break;
      case 'IndexAssign':
        this.execIndexAssign(stmt.name, stmt.index, stmt.value);
        break;
      case 'Print':
        this.execPrint(stmt.args);
        break;
      case 'If':
        if (this.evalExpr(stmt.condition)) {
          this.execBlock(stmt.body);
        } else if (stmt.elseBody.length > 0) {
          this.execBlock(stmt.elseBody);
        }
        break;
      case 'While': {
        let guard = 0;
        while (this.evalExpr(stmt.condition) && guard < 10000) {
          this.execBlock(stmt.body);
          guard++;
        }
        if (guard >= 10000) {
          this.output.push('\n[오류: 무한 루프가 감지되어 실행을 중단했습니다]\n');
        }
        break;
      }
      case 'FunctionDecl':
        this.functions.set(stmt.name, stmt);
        break;
      case 'Return':
        throw new ReturnSignal(this.evalExpr(stmt.value));
      case 'ExprStatement':
        this.evalExpr(stmt.expr);
        break;
    }
  }

  private execIndexAssign(name: string, indexExpr: Expression, valueExpr: Expression): void {
    const arr = this.env.get(name);
    if (!Array.isArray(arr)) throw new Error(`"${name}"는 배열이 아닙니다`);
    const idx = Number(this.evalExpr(indexExpr));
    if (idx < 0) throw new Error('인덱스는 0 이상이어야 합니다');
    if (idx > arr.length) throw new Error(`배열 범위를 벗어났습니다 (길이: ${arr.length}, 인덱스: ${idx})`);
    arr[idx] = this.evalExpr(valueExpr);
  }

  private execPrint(args: Expression[]): void {
    if (args.length === 0) {
      this.output.push('\n');
      return;
    }

    const first = this.evalExpr(args[0]);

    // printf-style: first arg is a string with % placeholders and extra args follow
    if (typeof first === 'string' && args.length > 1 && first.includes('%')) {
      let argIdx = 1;
      const result = first.replace(/%[ds]/g, (match) => {
        if (argIdx >= args.length) return match;
        const val = this.evalExpr(args[argIdx++]);
        return match === '%d' ? Math.floor(Number(val)).toString() : this.formatValue(val);
      });
      this.output.push(result);
    } else {
      // Simple print: join all args with space and append newline
      const parts = args.map(a => this.formatValue(this.evalExpr(a)));
      this.output.push(parts.join(' ') + '\n');
    }
  }

  private formatValue(v: Value): string {
    if (v === undefined) return '정의되지않음';
    if (Array.isArray(v)) return '[' + v.map(x => this.formatValue(x)).join(', ') + ']';
    return String(v);
  }

  private evalExpr(expr: Expression): Value {
    switch (expr.type) {
      case 'Number': return expr.value;
      case 'String': return expr.value;
      case 'Bool': return expr.value;
      case 'Identifier': {
        if (!this.env.has(expr.name)) {
          throw new Error(`정의되지 않은 변수: "${expr.name}"`);
        }
        return this.env.get(expr.name);
      }
      case 'ArrayLiteral':
        return expr.elements.map(e => this.evalExpr(e));
      case 'Index': {
        const arr = this.evalExpr(expr.array);
        if (!Array.isArray(arr)) throw new Error('배열이 아닌 값에 인덱스를 사용했습니다');
        const idx = Number(this.evalExpr(expr.index));
        if (idx < 0 || idx >= arr.length) {
          throw new Error(`배열 범위를 벗어났습니다 (길이: ${arr.length}, 인덱스: ${idx})`);
        }
        return arr[idx];
      }
      case 'Call':
        return this.callFunction(expr.name, expr.args.map(a => this.evalExpr(a)));
      case 'BinaryOp': {
        const left = this.evalExpr(expr.left);
        const right = this.evalExpr(expr.right);
        switch (expr.op) {
          case '+':
            return (typeof left === 'string' || typeof right === 'string')
              ? this.formatValue(left) + this.formatValue(right)
              : Number(left) + Number(right);
          case '-': return Number(left) - Number(right);
          case '*': return Number(left) * Number(right);
          case '/': {
            const r = Number(right);
            if (r === 0) throw new Error('0으로 나눌 수 없습니다');
            return Number(left) / r;
          }
          case '<': return Number(left) < Number(right);
          case '>': return Number(left) > Number(right);
          case '==': return left === right;
          case '!=': return left !== right;
          case '<=': return Number(left) <= Number(right);
          case '>=': return Number(left) >= Number(right);
          default: throw new Error(`알 수 없는 연산자: ${expr.op}`);
        }
      }
    }
  }

  private callFunction(name: string, args: Value[]): Value {
    // built-ins
    if (name === '길이') {
      const v = args[0];
      if (Array.isArray(v) || typeof v === 'string') return v.length;
      throw new Error('길이() 는 배열 또는 문자열에만 사용할 수 있습니다');
    }

    const fn = this.functions.get(name);
    if (!fn) throw new Error(`정의되지 않은 함수: "${name}"`);
    if (args.length !== fn.params.length) {
      throw new Error(`함수 "${name}"는 매개변수 ${fn.params.length}개가 필요합니다 (받은 값: ${args.length}개)`);
    }

    if (++this.callDepth > MAX_CALL_DEPTH) {
      this.callDepth--;
      throw new Error('함수 호출이 너무 깊습니다 (무한 재귀 의심)');
    }

    const savedEnv = this.env;
    const localEnv = new Map<string, Value>();
    fn.params.forEach((p, i) => localEnv.set(p, args[i]));
    this.env = localEnv;

    let returnValue: Value = undefined;
    try {
      this.execBlock(fn.body);
    } catch (e) {
      if (e instanceof ReturnSignal) {
        returnValue = e.value;
      } else {
        this.env = savedEnv;
        this.callDepth--;
        throw e;
      }
    }

    this.env = savedEnv;
    this.callDepth--;
    return returnValue;
  }
}
