// Create a standard deck of cards
export const createDeck = () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({
        id: `${rank}-${suit}`,
        rank,
        suit,
        value: getCardValue(rank)
      });
    });
  });
  
  return deck;
};

// Get numeric value for a card
export const getCardValue = (rank) => {
  switch(rank) {
    case 'A': return 1;
    case 'J': case 'Q': case 'K': return 0; // Face cards have no value
    default: return parseInt(rank);
  }
};

// Shuffle deck using Fisher-Yates algorithm
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Deal initial hands
export const dealInitialHands = (deck) => {
  const playerHand = deck.slice(0, 8);
  const opponentHand = deck.slice(8, 16);
  const remainingDeck = deck.slice(16);
  
  return { playerHand, opponentHand, remainingDeck };
};

// Calculate pile score
export const calculatePileScore = (cards) => {
  let score = 0;
  let isReversed = false;
  
  for (const card of cards) {
    if (card.rank === 'K') {
      isReversed = !isReversed;
    } else if (card.rank === 'Q') {
      // Queen doubles the current score
      score *= 2;
    } else if (card.rank === 'J') {
      // Jack removes the target card (handled elsewhere)
      continue;
    } else {
      // Number or Ace
      if (isReversed) {
        score -= card.value;
      } else {
        score += card.value;
      }
    }
  }
  
  return { score, isReversed };
};

// Check if a card can be played on a pile
export const canPlayCard = (pile, card, targetIndex = null) => {
  // Face cards (J/Q/K) can always be played if there are cards in the pile
  if (['J', 'Q', 'K'].includes(card.rank)) {
    return pile.length > 0;
  }
  
  // Number cards and Aces
  if (pile.length === 0) {
    return true; // Can always start a pile
  }
  
  // Find the last number card in the pile (ignore face cards)
  const numberCards = pile.filter(c => !['J', 'Q', 'K'].includes(c.rank));
  if (numberCards.length === 0) {
    return true; // No number cards yet, can play any number
  }
  
  const lastNumber = numberCards[numberCards.length - 1];
  const cardValue = getCardValue(card.rank);
  const lastValue = getCardValue(lastNumber.rank);
  
  // Cards must be played in ascending or descending order by value
  // Or same suit regardless of value
  return (
    card.suit === lastNumber.suit ||
    Math.abs(cardValue - lastValue) === 1
  );
};

// Play a card
export const playCard = (gameState, card, player, pileIndex, targetCardIndex = null) => {
  const isPlayerTurn = player === 'player';
  const piles = isPlayerTurn ? gameState.playerPiles : gameState.opponentPiles;
  const hand = isPlayerTurn ? gameState.playerHand : gameState.opponentHand;
  const pile = piles[pileIndex];
  
  // Check if the move is valid
  if (!canPlayCard(pile, card, targetCardIndex)) {
    return { success: false, error: 'Invalid move' };
  }
  
  // Handle Jack (removes target card)
  if (card.rank === 'J' && targetCardIndex !== null) {
    const newPile = [...pile];
    newPile.splice(targetCardIndex, 1);
    
    const newPiles = [...piles];
    newPiles[pileIndex] = newPile;
    
    const newHand = hand.filter(c => c.id !== card.id);
    
    return {
      success: true,
      newState: {
        ...gameState,
        [isPlayerTurn ? 'playerPiles' : 'opponentPiles']: newPiles,
        [isPlayerTurn ? 'playerHand' : 'opponentHand']: newHand,
        selectedCard: null,
        turn: isPlayerTurn ? 'opponent' : 'player'
      }
    };
  }
  
  // Handle other cards (add to pile)
  const newCard = { 
    ...card, 
    targetIndex: targetCardIndex,
    reversed: card.rank === 'K' ? !pile.some(c => c.reversed) : false
  };
  
  const newPile = [...pile, newCard];
  const newPiles = [...piles];
  newPiles[pileIndex] = newPile;
  
  const newHand = hand.filter(c => c.id !== card.id);
  
  return {
    success: true,
    newState: {
      ...gameState,
      [isPlayerTurn ? 'playerPiles' : 'opponentPiles']: newPiles,
      [isPlayerTurn ? 'playerHand' : 'opponentHand']: newHand,
      selectedCard: null,
      turn: isPlayerTurn ? 'opponent' : 'player'
    }
  };
};

// Check for game end conditions
export const checkGameEnd = (playerPiles, opponentPiles) => {
  const playerScores = playerPiles.map(pile => calculatePileScore(pile));
  const opponentScores = opponentPiles.map(pile => calculatePileScore(pile));
  
  // Game ends when one player has 3 piles between 21-26
  const playerWinning = playerScores.filter(s => s.score >= 21 && s.score <= 26).length >= 3;
  const opponentWinning = opponentScores.filter(s => s.score >= 21 && s.score <= 26).length >= 3;
  
  if (playerWinning && !opponentWinning) {
    return { gameOver: true, winner: 'player' };
  } else if (opponentWinning && !playerWinning) {
    return { gameOver: true, winner: 'opponent' };
  }
  
  return { gameOver: false };
};