import React from 'react';
import { formatSuitGlyph, getCardValue } from '../game/rules.js';
import { useMobile } from '../contexts/MobileContext.jsx';
import { useTouchDrag, createTouchTransfer } from '../hooks/useTouchDrag.js';

export default function Hand({ owner, cards, disabled, label = 'Hand' }) {
  const { isMobileMode } = useMobile();

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

  // Touch drag handlers for mobile
  const handleTouchDragStart = (payload) => {
    const transfer = createTouchTransfer();
    const json = JSON.stringify(payload);
    transfer.setData('application/json', json);
    transfer.setData('text/plain', json);
  };

  const handleTouchDragEnd = (payload, targetElement) => {
    if (!targetElement) return;

    // Find the closest pile or card drop target
    const pileContainer = targetElement.closest('.pile');
    const cardTarget = targetElement.closest('.card[data-drop-target]');

    if (pileContainer && !cardTarget) {
      // Container drop
      const event = new CustomEvent('touchdrop', {
        detail: {
          dataTransfer: createTouchTransfer(),
          type: 'container'
        }
      });
      pileContainer.dispatchEvent(event);
    } else if (cardTarget) {
      // Card target drop  
      const event = new CustomEvent('touchdrop', {
        detail: {
          dataTransfer: createTouchTransfer(),
          type: 'card'
        }
      });
      cardTarget.dispatchEvent(event);
    }

    // Clean up touch data
    createTouchTransfer().clearData();
  };

  const { touchHandlers } = useTouchDrag(handleTouchDragStart, handleTouchDragEnd);

  return (
    <div className={`hand ${disabled ? 'disabled' : ''}`}>
      <h3>{label}</h3>
      <div className="cards">
        {cards.map((card) => {
          const glyph = formatSuitGlyph(card.suit);
          const value = getCardValue(card);
          const payload = { source: 'hand', owner, cardId: card.id };

          const cardProps = {
            key: card.id,
            className: `card draggable ${card.color}`,
            title: `${card.rank}${glyph} (${card.rank === 'A' ? 'Ace=1' : card.rank === 'J' ? 'Jack' : card.rank === 'Q' ? 'Queen' : card.rank === 'K' ? 'King' : value})`,
          };

          // Add drag handlers for desktop
          if (!disabled) {
            cardProps.draggable = true;
            cardProps.onDragStart = (e) => onDragStart(e, card);
          }

          // Add touch handlers for mobile
          if (!disabled && isMobileMode) {
            cardProps.onTouchStart = (e) => touchHandlers.onTouchStart(e, payload);
            cardProps.onTouchMove = touchHandlers.onTouchMove;
            cardProps.onTouchEnd = touchHandlers.onTouchEnd;
          }

          return (
            <div {...cardProps}>
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