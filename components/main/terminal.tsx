"use client";

import { useRecoilValue } from 'recoil';
import { outputState } from '../../states/outputState';

export default function Terminal() {
  const output = useRecoilValue(outputState);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
    }}>
      <div style={{
        backgroundColor: '#222',
        color: '#aaa',
        fontSize: 13,
        padding: '4px 8px',
        borderBottom: '1px solid #444',
      }}>
        출력
      </div>
      <pre style={{
        backgroundColor: '#1a1a1a',
        color: '#e8e8e8',
        fontFamily: 'monospace',
        fontSize: 14,
        margin: 0,
        padding: '8px',
        flex: 1,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        minHeight: '200px',
      }}>
        {output || <span style={{ color: '#555' }}>// 실행 결과가 여기에 표시됩니다</span>}
      </pre>
    </div>
  );
}
