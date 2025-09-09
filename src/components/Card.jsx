import React from 'react';

const Card = ({ 
  card, 
  size = 'small', 
  selected = false, 
  draggable = false, 
  onDragStart, 
  onClick, 
  className = '',
  stackIndex = 0,
  isFaceCard = false,
  ...props 
}) => {
  const getSuitSymbol = (suit) => {
    switch(suit) {
      case 'Hearts': return '♥';
      case 'Diamonds': return '♦';
      case 'Clubs': return '♣';
      case 'Spades': return '♠';
      default: return suit;
    }
  };

  const isRed = card.suit === 'Hearts' || card.suit === 'Diamonds';
  const suitSymbol = getSuitSymbol(card.suit);
  
  const cardClasses = [
    'card',
    size,
    isRed ? 'red' : 'black',
    selected ? 'selected' : '',
    isFaceCard ? 'face-card' : '',
    className
  ].filter(Boolean).join(' ');

  const cardStyle = {
    ...(size === 'small' && stackIndex !== undefined ? {
      zIndex: stackIndex + 1
    } : {})
  };

  return (
    <div
      className={cardClasses}
      style={cardStyle}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      data-stack-index={stackIndex}
      {...props}
    >
      <div className="corner tl">
        <div className="rank">{card.rank}</div>
        <div className="suit">{suitSymbol}</div>
      </div>
      <div className="corner br">
        <div className="rank">{card.rank}</div>
        <div className="suit">{suitSymbol}</div>
      </div>
      <div className="center small">
        {suitSymbol}
      </div>
    </div>
  );
};

export default Card;