import React from 'react';

export default function Scoreboard({ title, perPile, total }) {
  return (
    <div className="scoreboard">
      <div className="sb-title">{title}</div>
      <div className="sb-rows">
        {perPile.map((t, i) => (
          <div key={`pile-score-${i}`} className={`sb-row ${t >= 21 ? 'locked' : ''}`}>
            Pile {i + 1}: {t}
          </div>
        ))}
      </div>
      <div className="sb-total">Total: {total}</div>
    </div>
  );
}