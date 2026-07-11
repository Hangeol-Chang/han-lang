"use client";

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { outputState } from '../../states/outputState';
import { pendingInputState } from '../../states/terminalIOState';

export default function Terminal() {
  const output = useRecoilValue(outputState);
  const setOutput = useSetRecoilState(outputState);
  const [pendingInput, setPendingInput] = useRecoilState(pendingInputState);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingInput) inputRef.current?.focus();
  }, [pendingInput]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [output, pendingInput]);

  const submit = () => {
    if (!pendingInput) return;
    const value = draft;
    setOutput(prev => `${prev}${pendingInput.label}: ${value}\n`);
    pendingInput.resolve(value);
    setPendingInput(null);
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-panel)',
        color: 'var(--text-secondary)',
        fontSize: 13,
        padding: '4px 8px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        출력
      </div>
      <div
        ref={scrollRef}
        onClick={() => pendingInput && inputRef.current?.focus()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          fontFamily: 'monospace',
          fontSize: 14,
          margin: 0,
          padding: '8px',
          flex: 1,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          minHeight: 0,
        }}
      >
        {!output && !pendingInput && (
          <span style={{ color: 'var(--text-muted)' }}>{'// 실행 결과가 여기에 표시됩니다'}</span>
        )}
        {output}
        {pendingInput && (
          <span>
            {pendingInput.label}:{' '}
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--accent)',
                outline: 'none',
                color: 'inherit',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                minWidth: 80,
                width: `${Math.max(4, draft.length + 1)}ch`,
              }}
            />
          </span>
        )}
      </div>
    </div>
  );
}
