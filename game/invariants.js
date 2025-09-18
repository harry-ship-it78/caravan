// Basic invariants to self-diagnose issues during runtime without a test runner.

export function runInvariants(game) {
  const errors = [];
  let checked = 0;

  const log = game.moveLog || [];

  // 1) Turn alternation: two consecutive moves should not be by the same actor.
  for (let i = 1; i < log.length; i++) {
    const prev = log[i - 1];
    const curr = log[i];
    checked++;
    if (prev.actor === curr.actor) {
      errors.push(`Turn alternation violated between moves ${i - 1} and ${i}: ${prev.actor} moved twice.`);
      break;
    }
  }

  // 2) Turn value after move: game.turn should equal opponent of last move (unless gameOver).
  if (!game.gameOver && log.length > 0) {
    const last = log[log.length - 1];
    checked++;
    const expectedTurn = last.actor === 'player' ? 'ai' : 'player';
    if (game.turn !== expectedTurn) {
      errors.push(`Turn state mismatch: expected ${expectedTurn} after last move by ${last.actor}, but turn is ${game.turn}.`);
    }
  }

  // 3) Jack on empty pile: should never occur.
  for (let i = 0; i < log.length; i++) {
    const m = log[i];
    if (m.cardRank === 'J' && m.pileBeforeSize === 0) {
      checked++;
      errors.push(`Invalid Jack play detected at move ${i}: Jack on empty pile.`);
      break;
    }
  }

  // 4) Opponent targeting with non-face cards: disallow.
  for (let i = 0; i < log.length; i++) {
    const m = log[i];
    const isOpponent = m.actor !== m.target;
    if (isOpponent) {
      checked++;
      if (!['J', 'Q', 'K'].includes(m.cardRank)) {
        errors.push(`Invalid opponent-target play at move ${i}: ${m.cardRank} onto opponent pile.`);
        break;
      }
    }
  }

  // 5) Deck non-negative
  checked++;
  if (game.deck.length < 0) {
    errors.push(`Deck length negative: ${game.deck.length}`);
  }

  return { errors, checked, moveCount: log.length };
}