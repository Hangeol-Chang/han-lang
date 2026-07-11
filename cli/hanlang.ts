#!/usr/bin/env node
import * as fs from 'fs';
import * as readline from 'readline';
import { execute, InterpreterIO } from '../components/core/hanlang';

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('사용법: hanlang <파일.hl>');
    process.exit(1);
  }

  let code: string;
  try {
    code = fs.readFileSync(filePath, 'utf-8');
  } catch {
    console.error(`파일을 읽을 수 없습니다: ${filePath}`);
    process.exit(1);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const io: InterpreterIO = {
    write: (chunk) => process.stdout.write(chunk),
    input: (label) => new Promise<string>((resolve) => {
      rl.question(`${label}: `, resolve);
    }),
  };

  try {
    await execute(code, io);
  } catch (e) {
    process.stderr.write(`[오류] ${e instanceof Error ? e.message : String(e)}\n`);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
