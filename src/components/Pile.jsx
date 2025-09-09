import React from 'react';
import Card from './Card';

const Pile = ({ 
  title, 
  cards, 
  score, 
  isReversed,
  onDrop, 
  onDragOver, 
  onClick, 
  player,
  selectedCard,
  touchMode 
}) => {
  
  const handleCardClick = (cardIndex) => {
    if (touchMode && selectedCard) {
      // Only allow clicking on cards if we have a face card selected
      const isFaceCard = selectedCard.rank === 'J' || selectedCard.rank === 'Q' || selectedCard.rank === 'K';
      if (isFaceCard) {
        onClick(cardIndex);
      }
    }
  };

  const handlePileClick = (e) => {
    // Only trigger pile click if clicking on empty area, not on cards
    if (e.target.classList.contains('pile-cards') || e.target.classList.contains('empty') || e.target.classList.contains('tap-hotspot')) {
      onClick();
    }
  };

  const canPlayOnPile = selectedCard && !['J', 'Q', 'K'].includes(selectedCard.rank);
  const showHotspot = touchMode && selectedCard && canPlayOnPile;

  return (
    <div className="pile">
      <div className="pile-header">
        <span className="pile-title">{title}</span>
        <span className={`pile-score ${isReversed ? 'pile-reversed' : ''}`}>
          {score}{isReversed ? ' (R)' : ''}
        </span>
      </div>
      
      <div 
        className="pile-cards stacked"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={handlePileClick}
      >
        {cards.length === 0 ? (
          <div className="empty">Empty pile</div>
        ) : (
          cards.map((card, index) => {
            const isFaceCard = ['J', 'Q', 'K'].includes(card.rank);
            const baseStackIndex = cards.slice(0, index).filter(c => !['J', 'Q', 'K'].includes(c.rank)).length;
            
            // Face cards get positioned relative to their target card
            let stackIndex = baseStackIndex;
            let cardStyle = {};
            
            if (isFaceCard && card.targetIndex !== undefined) {
              const targetCard = cards[card.targetIndex];
              if (targetCard) {
                const targetStackIndex = cards.slice(0, card.targetIndex).filter(c => !['J', 'Q', 'K'].includes(c.rank)).length;
                cardStyle = {
                  top: `${8 + targetStackIndex * 36 + 20}px`, // 20px down-right from target
                  left: `${32}px`, // shifted right
                  zIndex: index + 10 // higher than spine cards
                };
              }
            } else if (!isFaceCard) {
              // Number/Ace cards form the spine
              cardStyle = {
                top: `${8 + baseStackIndex * 36}px`,
                left: `8px`,
                zIndex: index + 1
              };
            }

            return (
              <Card
                key={`${card.id}-${index}`}
                card={card}
                size="small"
                stackIndex={stackIndex}
                isFaceCard={isFaceCard}
                onClick={() => handleCardClick(index)}
                style={cardStyle}
                className={
                  touchMode && selectedCard && ['J', 'Q', 'K'].includes(selectedCard.rank) 
                    ? 'highlight-target' 
                    : ''
                }
              />
            );
          })
        )}
        
        {showHotspot && (
          <div className="tap-hotspot">
            Place here
          </div>
        )}
      </div>
    </div>
  );
};

export default Pile;