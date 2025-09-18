import React from 'react';
import { formatSuitGlyph, getCardValue } from '../game/rules.js';

export default function Hand({ owner, cards, disabled, label = 'Hand' }) {
  const onDragStart = (e, card) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    const payload = { source: 'hand', owner, cardId: card.id };
    const json = JSON.stringify(payload);
    e.dataTransfer.setData('application/json', json);
    e.dataTransfer.setData('text/plain', json);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`hand ${disabled ? 'disabled' : ''}`}>
      <h3>{label}</h3>
      <div className="cards">
        {cards.map((card) => {
          const glyph = formatSuitGlyph(card.suit);
          const value = getCardValue(card);
          return (
            <div
              key={card.id}
              className={`card draggable ${card.color}`}
              draggable={!disabled}
              onDragStart={(e) => onDragStart(e, card)}
              title={`${card.rank}${glyph} (${card.rank === 'A' ? 'Ace=1' : card.rank === 'J' ? 'Jack' : card.rank === 'Q' ? 'Queen' : card.rank === 'K' ? 'King' : value})`}
            >
              <div className="corner tl">
                <div className="rank">{card.rank}</div>
                <div className="suit">{glyph}</div>
              </div>
              <div className="center">{glyph}</div>
              <div className="corner br">
                <div className="rank">{card.rank}</div>
                <div className="suit">{glyph}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}