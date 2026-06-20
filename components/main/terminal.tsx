"use client";

import { useRecoilValue } from 'recoil';
import { outputState } from '../../states/outputState';

export default function Terminal() {
  const output = useRecoilValue(outputState);

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
      <pre style={{
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
      }}>
        {output || <span style={{ color: 'var(--text-muted)' }}>{'// 실행 결과가 여기에 표시됩니다'}</span>}
      </pre>
    </div>
  );
}
