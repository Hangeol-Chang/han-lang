import { tokenize } from './compiler/lexer';
import { Parser } from './compiler/parser';
import { Interpreter, InterpreterIO } from './interpreter/interpreter';

export type { InterpreterIO };

// Tokenize, parse, and interpret — throws on lex/parse/runtime errors so
// callers can decide how to surface them (write to the io stream, print to
// stderr with a nonzero exit code, etc).
export async function execute(code: string, io: InterpreterIO): Promise<void> {
  const tokens = tokenize(code);
  const ast = new Parser(tokens).parse();
  await new Interpreter().run(ast, io);
}

export async function run(code: string, io: InterpreterIO): Promise<void> {
  try {
    await execute(code, io);
  } catch (e) {
    io.write(`[오류] ${e instanceof Error ? e.message : String(e)}\n`);
  }
}
