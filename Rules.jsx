import React from 'react';

export default function Rules() {
  return (
    <div className="rules">
      <h3>Rules</h3>
      <ul>
        <li>Deck: Standard 52-card deck. Suits: ♥ ♦ (red), ♠ ♣ (black).</li>
        <li>Each player has three piles (caravans). Start with 5 cards in hand.</li>
        <li>Turns: Play one card to a pile, then draw one card (if the deck has cards).</li>
        <li>Number cards (2–10) and Ace (1): Add to the pile total.</li>
        <li>Direction on your piles: Once the first two numeric/Ace cards establish a direction (ascending or descending), the next numeric/Ace must continue strictly in that direction. Equal values are not allowed to establish or continue direction. Queens flip the pile, which flips the direction context.</li>
        <li>Jack: Place onto a specific card to remove it (Jack remains as 0).</li>
        <li>Queen: Place anywhere; it reverses the order of the pile.</li>
        <li>King: Place onto a specific card to double its value; consecutive Kings stack multiplicatively.</li>
        <li>Opponent piles: You may only play J/Q/K and must drop onto a specific card (opponent piles must not be empty).</li>
        <li>Interaction: Drag a number/Ace to the pile box (top). Drag a picture card (J/Q/K) onto a specific card; targets highlight on hover. Picture cards render slightly to the right to reveal the suit beneath.</li>
        <li>End Condition: When all six piles (both players’ 3 each) are at least 21, the game ends. Highest total wins. J/Q are worth 0; K modifies the card beneath.</li>
      </ul>
    </div>
  );
}