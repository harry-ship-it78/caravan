import React, { useState, useCallback, useEffect } from 'react';
import Card from './components/Card';
import Pile from './components/Pile';
import { createDeck, shuffleDeck, dealInitialHands, canPlayCard, playCard, calculatePileScore } from './utils/gameLogic';

function App() {
  const [gameState, setGameState] = useState({
    playerHand: [],
    opponentHand: [],
    playerPiles: [[], [], []],
    opponentPiles: [[], [], []],
    deck: [],
    selectedCard: null,
    turn: 'player',
    gameOver: false
  });

  const [draggedCard, setDraggedCard] = useState(null);
  const [touchMode, setTouchMode] = useState(false);

  // Initialize game
  useEffect(() => {
    const deck = shuffleDeck(createDeck());
    const { playerHand, opponentHand, remainingDeck } = dealInitialHands(deck);
    
    setGameState(prevState => ({
      ...prevState,
      playerHand,
      opponentHand,
      deck: remainingDeck
    }));
  }, []);

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setTouchMode('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const handleCardSelect = useCallback((card) => {
    if (touchMode) {
      setGameState(prevState => ({
        ...prevState,
        selectedCard: prevState.selectedCard?.id === card.id ? null : card
      }));
    }
  }, [touchMode]);

  const handlePileClick = useCallback((pileIndex, cardIndex = null) => {
    if (!touchMode || !gameState.selectedCard) return;

    const result = playCard(gameState, gameState.selectedCard, 'player', pileIndex, cardIndex);
    if (result.success) {
      setGameState(result.newState);
    }
  }, [touchMode, gameState]);

  const handleDragStart = useCallback((e, card) => {
    if (touchMode) return;
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  }, [touchMode]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, pileIndex, cardIndex = null) => {
    e.preventDefault();
    if (!draggedCard) return;

    const result = playCard(gameState, draggedCard, 'player', pileIndex, cardIndex);
    if (result.success) {
      setGameState(result.newState);
    }
    setDraggedCard(null);
  }, [draggedCard, gameState]);

  const newGame = () => {
    const deck = shuffleDeck(createDeck());
    const { playerHand, opponentHand, remainingDeck } = dealInitialHands(deck);
    
    setGameState({
      playerHand,
      opponentHand,
      playerPiles: [[], [], []],
      opponentPiles: [[], [], []],
      deck: remainingDeck,
      selectedCard: null,
      turn: 'player',
      gameOver: false
    });
  };

  return (
    <div className="app">
      <div className="topbar">
        <h1>Caravan Card Game</h1>
        <div className="controls">
          <span>Turn: {gameState.turn}</span>
          <button className="btn" onClick={newGame}>New Game</button>
        </div>
      </div>

      <main className="board">
        {/* Opponent section */}
        <div className="side">
          <h2>Opponent ({gameState.opponentHand.length} cards)</h2>
          <div className="piles">
            {gameState.opponentPiles.map((pile, index) => (
              <Pile
                key={`opponent-${index}`}
                title={`Pile ${index + 1}`}
                cards={pile}
                score={calculatePileScore(pile).score}
                isReversed={calculatePileScore(pile).isReversed}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                onClick={() => handlePileClick(index)}
                player="opponent"
              />
            ))}
          </div>
        </div>

        {/* Player section */}
        <div className="side">
          <h2>Your Caravans</h2>
          <div className="piles">
            {gameState.playerPiles.map((pile, index) => (
              <Pile
                key={`player-${index}`}
                title={`Pile ${index + 1}`}
                cards={pile}
                score={calculatePileScore(pile).score}
                isReversed={calculatePileScore(pile).isReversed}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
                onClick={() => handlePileClick(index)}
                player="player"
                selectedCard={gameState.selectedCard}
                touchMode={touchMode}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="bottombar">
        <div className="hand">
          {gameState.playerHand.map((card) => (
            <Card
              key={card.id}
              card={card}
              size="normal"
              selected={gameState.selectedCard?.id === card.id}
              draggable={!touchMode}
              onDragStart={(e) => handleDragStart(e, card)}
              onClick={() => handleCardSelect(card)}
              className={draggedCard?.id === card.id ? 'dragging' : ''}
            />
          ))}
        </div>
        {touchMode && gameState.selectedCard && (
          <div style={{ textAlign: 'center', padding: '8px', color: 'var(--muted)' }}>
            Selected: {gameState.selectedCard.rank} of {gameState.selectedCard.suit}
            {gameState.selectedCard.rank === 'J' || gameState.selectedCard.rank === 'Q' || gameState.selectedCard.rank === 'K' 
              ? ' - Tap a card in a pile to play it'
              : ' - Tap a pile to play it'
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default App;