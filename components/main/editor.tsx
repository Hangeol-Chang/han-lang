"use client";

import { codeState } from "../../states/codeStates";
import { outputState } from "../../states/outputState";
import { pendingInputState, isRunningState } from "../../states/terminalIOState";
import { run } from "../core/hanlang";
import type { InterpreterIO } from "../core/hanlang";
import { KeyboardEvent, useEffect, useState, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import Button from "../Common/button";
import Link from "next/link";

export default function Editor() {
  const [code, setCode] = useRecoilState(codeState);
  const setOutput = useSetRecoilState(outputState);
  const setPendingInput = useSetRecoilState(pendingInputState);
  const [isRunning, setIsRunning] = useRecoilState(isRunningState);
  const [rows, setRows] = useState([1]);
  const [cursorLine, setCursorLine] = useState(1);
  const [codeSplited, setCodeSplited] = useState<string[]>(['']);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const lines = code.split('\n');
    setCodeSplited(lines);
    setRows(lines.map((_, i) => i + 1));
  }, [code]);

  const getCursorLine = (): number => {
    if (!inputRef.current) return 1;
    const cursorPos = inputRef.current.selectionStart;
    const before = code.slice(0, cursorPos);
    return before.split('\n').length;
  };

  const handleClick = () => {
    setCursorLine(getCursorLine());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = inputRef.current!;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.slice(0, start) + '\t' + code.slice(end);
      setCode(next);
      // Restore cursor after state update
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 1;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const el = inputRef.current!;
      const start = el.selectionStart;
      // Auto-indent: count leading tabs on current line
      const lineIdx = code.slice(0, start).split('\n').length - 1;
      const currentLine = codeSplited[lineIdx] ?? '';
      const tabs = currentLine.match(/^\t*/)?.[0] ?? '';
      const next = code.slice(0, start) + '\n' + tabs + code.slice(start);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 1 + tabs.length;
      });
    } else if (e.key.startsWith('Arrow')) {
      setCursorLine(getCursorLine());
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setOutput('');
    setIsRunning(true);
    const io: InterpreterIO = {
      write: (chunk) => setOutput(prev => prev + chunk),
      input: (label) => new Promise<string>((resolve) => {
        setPendingInput({ label, resolve });
      }),
    };
    try {
      await run(code, io);
    } finally {
      setPendingInput(null);
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-panel)',
        padding: '2px 4px',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: '28px', paddingLeft: 4 }}>
          편집기
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/docs" style={{
            color: 'var(--text-secondary)',
            fontSize: 13,
            margin: '0 6px',
            textDecoration: 'none',
          }}>
            문서 보기
          </Link>
          <Button variant="default" onClick={handleClear} disabled={isRunning} style={{ marginRight: 4 }}>지우기</Button>
          <Button variant="success" onClick={handleRun} disabled={isRunning}>{isRunning ? '실행 중...' : '▶ 실행'}</Button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        backgroundColor: 'var(--bg-surface)',
        minHeight: 0,
      }}>
        {/* Line numbers */}
        <div style={{
          backgroundColor: 'var(--bg-panel)',
          color: 'var(--text-muted)',
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: '21px',
          padding: '8px 6px',
          textAlign: 'right',
          userSelect: 'none',
          minWidth: 36,
        }}>
          {rows.map(n => (
            <div key={n} style={{ color: n === cursorLine ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
              {n}
            </div>
          ))}
        </div>

        {/* Code textarea */}
        <textarea
          ref={inputRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: '21px',
            padding: '8px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre',
            overflowWrap: 'normal',
            overflowX: 'auto',
          }}
        />
      </div>
    </div>
  );
}
