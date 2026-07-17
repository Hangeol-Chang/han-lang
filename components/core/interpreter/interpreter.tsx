import type { Program, Statement, Expression, FunctionDecl } from '../compiler/parser';

type Value = number | string | boolean | undefined | Value[] | Map<string | number, Value>;

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

class BreakSignal {}

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
      if (e instanceof BreakSignal) throw new Error('"중단한다"는 반복문 안에서만 사용할 수 있습니다');
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
          try {
            await this.execBlock(stmt.body);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            throw e;
          }
          guard++;
        }
        if (guard >= 10000) {
          this.io.write('\n[오류: 무한 루프가 감지되어 실행을 중단했습니다]\n');
        }
        break;
      }
      case 'For': {
        const start = Number(await this.evalExpr(stmt.start));
        const end = Number(await this.evalExpr(stmt.end));
        const step = stmt.step ? Number(await this.evalExpr(stmt.step)) : 1;
        if (step === 0) throw new Error('반복 증가값(스텝)은 0이 될 수 없습니다');

        let i = start;
        let guard = 0;
        while ((step > 0 ? i <= end : i >= end) && guard < 10000) {
          this.env.set(stmt.name, i);
          try {
            await this.execBlock(stmt.body);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            throw e;
          }
          i += step;
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
      case 'Break':
        throw new BreakSignal();
      case 'ExprStatement':
        await this.evalExpr(stmt.expr);
        break;
    }
  }

  private async execIndexAssign(name: string, indexExpr: Expression, valueExpr: Expression): Promise<void> {
    const target = this.env.get(name);
    const value = await this.evalExpr(valueExpr);
    if (target instanceof Map) {
      const key = await this.evalExpr(indexExpr);
      target.set(key as string | number, value);
      return;
    }
    if (!Array.isArray(target)) throw new Error(`"${name}"는 배열 또는 사전이 아닙니다`);
    const idx = Number(await this.evalExpr(indexExpr));
    if (idx < 0) throw new Error('인덱스는 0 이상이어야 합니다');
    if (idx > target.length) throw new Error(`배열 범위를 벗어났습니다 (길이: ${target.length}, 인덱스: ${idx})`);
    target[idx] = value;
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
      const container = await this.evalExpr(target.array);
      if (container instanceof Map) {
        const key = await this.evalExpr(target.index);
        container.set(key as string | number, value);
        return;
      }
      if (!Array.isArray(container)) throw new Error('배열/사전이 아닌 값에 인덱스를 사용했습니다');
      const idx = Number(await this.evalExpr(target.index));
      if (idx < 0) throw new Error('인덱스는 0 이상이어야 합니다');
      if (idx > container.length) throw new Error(`배열 범위를 벗어났습니다 (길이: ${container.length}, 인덱스: ${idx})`);
      container[idx] = value;
      return;
    }
    throw new Error('"입력받는다"는 변수만 대상으로 할 수 있습니다');
  }

  private formatValue(v: Value): string {
    if (v === undefined) return '정의되지않음';
    if (Array.isArray(v)) return '[' + v.map(x => this.formatValue(x)).join(', ') + ']';
    if (v instanceof Map) {
      const entries = Array.from(v.entries()).map(([k, val]) => `${this.formatValue(k)} : ${this.formatValue(val)}`);
      return '{' + entries.join(', ') + '}';
    }
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
      case 'DictLiteral': {
        const dict = new Map<string | number, Value>();
        for (const [k, v] of expr.entries) {
          const key = await this.evalExpr(k);
          dict.set(key as string | number, await this.evalExpr(v));
        }
        return dict;
      }
      case 'Index': {
        const container = await this.evalExpr(expr.array);
        if (container instanceof Map) {
          const key = await this.evalExpr(expr.index);
          if (!container.has(key as string | number)) {
            throw new Error(`사전에 없는 키입니다: ${this.formatValue(key)}`);
          }
          return container.get(key as string | number);
        }
        if (!Array.isArray(container)) throw new Error('배열/사전이 아닌 값에 인덱스를 사용했습니다');
        const idx = Number(await this.evalExpr(expr.index));
        if (idx < 0 || idx >= container.length) {
          throw new Error(`배열 범위를 벗어났습니다 (길이: ${container.length}, 인덱스: ${idx})`);
        }
        return container[idx];
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
      if (v instanceof Map) return v.size;
      throw new Error('길이() 는 배열, 문자열, 사전에만 사용할 수 있습니다');
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
    if (name === '공백제거한다') {
      const s = args[0];
      if (typeof s !== 'string') throw new Error('공백제거한다는 문자열에만 사용할 수 있습니다');
      return s.trim();
    }
    if (name === '부분문자열화한다') {
      const s = args[0];
      if (typeof s !== 'string') throw new Error('부분문자열화한다는 문자열에만 사용할 수 있습니다');
      const start = Number(args[1]);
      const end = args.length > 2 ? Number(args[2]) : undefined;
      return s.slice(start, end);
    }
    if (name === '시작한다') {
      const s = args[0];
      if (typeof s !== 'string') throw new Error('시작한다는 문자열에만 사용할 수 있습니다');
      return s.startsWith(this.formatValue(args[1]));
    }
    if (name === '끝난다') {
      const s = args[0];
      if (typeof s !== 'string') throw new Error('끝난다는 문자열에만 사용할 수 있습니다');
      return s.endsWith(this.formatValue(args[1]));
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
        if (e instanceof BreakSignal) throw new Error('"중단한다"는 반복문 안에서만 사용할 수 있습니다');
        throw e;
      }
    }

    this.env = savedEnv;
    this.callDepth--;
    return returnValue;
  }
}
