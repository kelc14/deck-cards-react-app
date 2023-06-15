import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardBoard.css";

const BASE_URL = "https://deckofcardsapi.com/api/deck";

/** CardBoard component: contains
 * - buttons  (draw and shuffle)
 * - remaining card count
 * - Card components
 *
 *  Makes API calls to draw cards
 *  */

const CardBoard = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  let deckId = useRef();

  /** Get the initial deck of cards with API request */
  const getDeck = async () => {
    try {
      setCards(() => []);
      let res = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
      deckId.current = res.data.deck_id;
      setError(null);
    } catch (e) {
      setError(e);
    }
  };
  /** Run only on the first render:
   * get the initial deck of cards -
   * will NOT change */
  useEffect(() => {
    getDeck();
  }, []);

  /** Display error message if error exists */
  const getErrorView = () => {
    return (
      <div>
        Oh no! Something went wrong. {error.message}
        <br />
        <button onClick={() => getDeck()}>Try again</button>
      </div>
    );
  };

  /** Get single card from our shuffled deck after button clicked */
  const getCard = async () => {
    try {
      let res = await axios.get(`${BASE_URL}/${deckId.current}/draw/?count=1`);

      // Add card to state
      setCards((cards) => [
        ...cards,
        {
          id: res.data.cards[0].code,
          value: res.data.cards[0].value,
          suit: res.data.cards[0].suit,
        },
      ]);
    } catch (e) {
      setError(e);
    }
  };

  /** Shuffle the deck of cards when button clicked, and remove all cards from state */
  const shuffleDeck = async () => {
    try {
      await axios.get(`${BASE_URL}/${deckId.current}/shuffle`);
      setCards(() => []);
    } catch (e) {
      setError(e);
    }
  };

  let cardsRemaining = 52 - cards.length;

  /** RENDER:
   *
   */
  return (
    <div className="CardBoard">
      {!error && (
        <div>
          <div className="CardBoard-btn-container">
            {/* Removes draw card button 
                    when no cards remain */}
            {cardsRemaining > 0 && (
              <button className="CardBoard-btn" onClick={getCard}>
                GIMME A CARD
              </button>
            )}
          </div>
          <div>
            <p className="CardBoard-cards-rem">
              Cards Remaining: {cardsRemaining}
            </p>
          </div>
          <div className="CardBoard-btn-container">
            <button className="CardBoard-btn" onClick={shuffleDeck}>
              SHUFFLE DECK
            </button>
          </div>

          <div className="CardBoard-card-container">
            {/* Renders all cards in state
                with props:
                - key (card ID)
                - value (NUM/FACE CARD)
                - suit (HEARTS, etc.) */}
            {cards.map((n) => (
              <Card key={n.id} value={n.value} suit={n.suit} />
            ))}
          </div>
        </div>
      )}
      {/* Display error message if an error exists */}
      {error && getErrorView()}
    </div>
  );
};

export default CardBoard;
