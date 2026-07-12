import type { Program, Statement, Expression, FunctionDecl } from '../compiler/parser';

type Value = number | string | boolean | undefined | Value[];

// Bridges the interpreter to whatever is driving it (the terminal UI, a test
// harness, ...). write() streams output as it's produced instead of buffering
// the whole run, and input() suspends execution until a value is supplied —
// letting "입력받는다" read from a live console instead of a blocking modal.
export interface InterpreterIO {
  write(chunk: string): void;
  input(label: string): Promise<string>;
}

class ReturnSignal {
  constructor(public value: Value) {}
}

const MAX_CALL_DEPTH = 1000;

export class Interpreter {
  private env: Map<string, Value> = new Map();
  private functions: Map<string, FunctionDecl> = new Map();
  private callDepth = 0;
  private io!: InterpreterIO;

  async run(program: Program, io: InterpreterIO): Promise<void> {
    this.env = new Map();
    this.functions = new Map();
    this.callDepth = 0;
    this.io = io;

    // Hoist top-level function declarations so they can be called before their textual position
    for (const stmt of program.body) {
      if (stmt.type === 'FunctionDecl') this.functions.set(stmt.name, stmt);
    }

    try {
      await this.execBlock(program.body);
    } catch (e) {
      if (!(e instanceof ReturnSignal)) throw e;
    }
  }

  private async execBlock(stmts: Statement[]): Promise<void> {
    for (const stmt of stmts) {
      await this.execStatement(stmt);
    }
  }

  private async execStatement(stmt: Statement): Promise<void> {
    switch (stmt.type) {
      case 'Assign':
        this.env.set(stmt.name, await this.evalExpr(stmt.value));
        break;
      case 'Declare':
        this.env.set(stmt.name, undefined);
        break;
      case 'IndexAssign':
        await this.execIndexAssign(stmt.name, stmt.index, stmt.value);
        break;
      case 'Print':
        await this.execPrint(stmt.args);
        break;
      case 'Input':
        await this.execInput(stmt.targets);
        break;
      case 'If':
        if (await this.evalExpr(stmt.condition)) {
          await this.execBlock(stmt.body);
        } else if (stmt.elseBody.length > 0) {
          await this.execBlock(stmt.elseBody);
        }
        break;
      case 'While': {
        let guard = 0;
        while ((await this.evalExpr(stmt.condition)) && guard < 10000) {
          await this.execBlock(stmt.body);
          guard++;
        }
        if (guard >= 10000) {
          this.io.write('\n[오류: 무한 루프가 감지되어 실행을 중단했습니다]\n');
        }
        break;
      }
      case 'FunctionDecl':
        this.functions.set(stmt.name, stmt);
        break;
      case 'Return':
        throw new ReturnSignal(await this.evalExpr(stmt.value));
      case 'ExprStatement':
        await this.evalExpr(stmt.expr);
        break;
    }
  }

  private async execIndexAssign(name: string, indexExpr: Expression, valueExpr: Expression): Promise<void> {
    const arr = this.env.get(name);
    if (!Array.isArray(arr)) throw new Error(`"${name}"는 배열이 아닙니다`);
    const idx = Number(await this.evalExpr(indexExpr));
    if (idx < 0) throw new Error('인덱스는 0 이상이어야 합니다');
    if (idx > arr.length) throw new Error(`배열 범위를 벗어났습니다 (길이: ${arr.length}, 인덱스: ${idx})`);
    arr[idx] = await this.evalExpr(valueExpr);
  }

  private async execPrint(args: Expression[]): Promise<void> {
    if (args.length === 0) {
      this.io.write('\n');
      return;
    }

    const values: Value[] = [];
    for (const a of args) values.push(await this.evalExpr(a));

    const first = values[0];

    // printf-style: first arg is a string with % placeholders and extra args follow
    if (typeof first === 'string' && values.length > 1 && first.includes('%')) {
      let argIdx = 1;
      const result = first.replace(/%[ds]/g, (match) => {
        if (argIdx >= values.length) return match;
        const val = values[argIdx++];
        return match === '%d' ? Math.floor(Number(val)).toString() : this.formatValue(val);
      });
      this.io.write(result);
    } else {
      // Simple print: join all args with space and append newline
      const parts = values.map(v => this.formatValue(v));
      this.io.write(parts.join(' ') + '\n');
    }
  }

  private async execInput(targets: Expression[]): Promise<void> {
    for (const target of targets) {
      const label = target.type === 'Identifier' ? target.name : this.describeInputTarget(target);
      const raw = await this.io.input(label);
      const value: Value = raw === '' ? undefined : (isNaN(Number(raw)) ? raw : Number(raw));
      await this.assignToLValue(target, value);
    }
  }

  private describeInputTarget(expr: Expression): string {
    if (expr.type === 'Identifier') return expr.name;
    if (expr.type === 'Index') return this.describeInputTarget(expr.array);
    return '값';
  }

  private async assignToLValue(target: Expression, value: Value): Promise<void> {
    if (target.type === 'Identifier') {
      this.env.set(target.name, value);
      return;
    }
    if (target.type === 'Index') {
      const arr = await this.evalExpr(target.array);
      if (!Array.isArray(arr)) throw new Error('배열이 아닌 값에 인덱스를 사용했습니다');
      const idx = Number(await this.evalExpr(target.index));
      if (idx < 0) throw new Error('인덱스는 0 이상이어야 합니다');
      if (idx > arr.length) throw new Error(`배열 범위를 벗어났습니다 (길이: ${arr.length}, 인덱스: ${idx})`);
      arr[idx] = value;
      return;
    }
    throw new Error('"입력받는다"는 변수만 대상으로 할 수 있습니다');
  }

  private formatValue(v: Value): string {
    if (v === undefined) return '정의되지않음';
    if (Array.isArray(v)) return '[' + v.map(x => this.formatValue(x)).join(', ') + ']';
    return String(v);
  }

  private async evalExpr(expr: Expression): Promise<Value> {
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
      case 'ArrayLiteral': {
        const elements: Value[] = [];
        for (const e of expr.elements) elements.push(await this.evalExpr(e));
        return elements;
      }
      case 'Index': {
        const arr = await this.evalExpr(expr.array);
        if (!Array.isArray(arr)) throw new Error('배열이 아닌 값에 인덱스를 사용했습니다');
        const idx = Number(await this.evalExpr(expr.index));
        if (idx < 0 || idx >= arr.length) {
          throw new Error(`배열 범위를 벗어났습니다 (길이: ${arr.length}, 인덱스: ${idx})`);
        }
        return arr[idx];
      }
      case 'Call': {
        const args: Value[] = [];
        for (const a of expr.args) args.push(await this.evalExpr(a));
        return await this.callFunction(expr.name, args);
      }
      case 'BinaryOp': {
        const left = await this.evalExpr(expr.left);
        const right = await this.evalExpr(expr.right);
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
          case '%': {
            const r = Number(right);
            if (r === 0) throw new Error('0으로 나눌 수 없습니다');
            return Number(left) % r;
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

  private async callFunction(name: string, args: Value[]): Promise<Value> {
    // built-ins
    if (name === '길이') {
      const v = args[0];
      if (Array.isArray(v) || typeof v === 'string') return v.length;
      throw new Error('길이() 는 배열 또는 문자열에만 사용할 수 있습니다');
    }

    if (name === '정수') {
      const n = Math.trunc(Number(args[0]));
      if (Number.isNaN(n)) throw new Error(`정수()로 변환할 수 없는 값: ${this.formatValue(args[0])}`);
      return n;
    }
    if (name === '실수') {
      const n = Number(args[0]);
      if (Number.isNaN(n)) throw new Error(`실수()로 변환할 수 없는 값: ${this.formatValue(args[0])}`);
      return n;
    }
    if (name === '문자열') {
      return this.formatValue(args[0]);
    }
    if (name === '논리') {
      const v = args[0];
      if (typeof v === 'string') return v !== '' && v !== '거짓';
      return Boolean(v);
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
      await this.execBlock(fn.body);
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
