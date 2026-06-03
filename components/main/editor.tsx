"use client";

import { codeState } from "../../states/codeStates";
import { outputState } from "../../states/outputState";
import { run } from "../core/hanlang";
import { KeyboardEvent, useEffect, useState, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import Button from "../Common/button";
import Link from "next/link";

export default function Editor() {
  const [code, setCode] = useRecoilState(codeState);
  const setOutput = useSetRecoilState(outputState);
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

  const handleRun = () => {
    setOutput(run(code));
  };

  const handleClear = () => {
    setOutput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        padding: '2px 4px',
      }}>
        <span style={{ color: '#ccc', fontSize: 13, lineHeight: '28px', paddingLeft: 4 }}>
          편집기
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/docs" style={{
            color: '#aaa',
            fontSize: 13,
            margin: '0 6px',
            textDecoration: 'none',
          }}>
            문서 보기
          </Link>
          <Button color="primary" value="지우기" className="" onClick={handleClear} />
          <Button color="success" value="▶ 실행" className="" onClick={handleRun} />
        </div>
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        backgroundColor: '#2b2b2b',
        minHeight: '50vh',
      }}>
        {/* Line numbers */}
        <div style={{
          backgroundColor: '#252525',
          color: '#666',
          fontFamily: 'monospace',
          fontSize: 14,
          lineHeight: '21px',
          padding: '8px 6px',
          textAlign: 'right',
          userSelect: 'none',
          minWidth: 36,
        }}>
          {rows.map(n => (
            <div key={n} style={{ color: n === cursorLine ? '#aaa' : '#555' }}>
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
            backgroundColor: '#2b2b2b',
            color: '#e8e8e8',
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
