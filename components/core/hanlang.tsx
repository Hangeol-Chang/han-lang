import { tokenize } from './compiler/lexer';
import { Parser } from './compiler/parser';
import { Interpreter } from './interpreter/interpreter';

export function run(code: string): string {
  try {
    const tokens = tokenize(code);
    const ast = new Parser(tokens).parse();
    return new Interpreter().run(ast);
  } catch (e) {
    return `[오류] ${e instanceof Error ? e.message : String(e)}\n`;
  }
}
