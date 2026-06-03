import type { Program, Statement, Expression } from '../compiler/parser';

type Value = number | string | boolean | undefined;

export class Interpreter {
  private env: Map<string, Value> = new Map();
  private output: string[] = [];

  run(program: Program): string {
    this.env = new Map();
    this.output = [];
    this.execBlock(program.body);
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
    }
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
        return match === '%d' ? Math.floor(Number(val)).toString() : String(val ?? '');
      });
      this.output.push(result);
    } else {
      // Simple print: join all args with space and append newline
      const parts = args.map(a => {
        const v = this.evalExpr(a);
        return v === undefined ? '정의되지않음' : String(v);
      });
      this.output.push(parts.join(' ') + '\n');
    }
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
      case 'BinaryOp': {
        const left = this.evalExpr(expr.left);
        const right = this.evalExpr(expr.right);
        switch (expr.op) {
          case '+':
            return (typeof left === 'string' || typeof right === 'string')
              ? String(left ?? '') + String(right ?? '')
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
}
