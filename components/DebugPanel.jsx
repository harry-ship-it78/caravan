import React, { useState } from 'react';
import { runInvariants } from '../game/invariants.js';

export default function DebugPanel({ game }) {
  const [result, setResult] = useState(null);

  const handleRun = () => {
    const res = runInvariants(game);
    setResult(res);
  };

  const hasIssues = result?.errors?.length;

  return (
    <div style={{ marginTop: 8 }}>
      <button className="btn" onClick={handleRun}>Run Self-Check</button>
      {result && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 600 }}>
            {hasIssues ? 'Issues found:' : 'No issues detected'}
          </div>
          {hasIssues ? (
            <ul>
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          ) : (
            <div style={{ color: '#9ca3af' }}>
              Checked {result.checked} conditions across {result.moveCount} moves.
            </div>
          )}
          <details style={{ marginTop: 6 }}>
            <summary>Last 10 moves</summary>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
{JSON.stringify(game.moveLog.slice(-10), null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}