import React, { useState } from "react";
import "./Card.css";

/** Renders a single card component with props:
 * key: card id
 * value: NUM (2, 3, 4) or FACE VALUE (K, Q, etc.)
 * suit: HEARTS, SPADES, DIAMONDS, CLUBS
 */

const Card = ({ value, suit }) => {
  const [angle, setAngle] = useState(Math.floor(Math.random() * 90) - 45);

  return (
    <img
      className="Card-img"
      src={`/card_images/${value}_of_${suit}.png`}
      style={{
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

export default Card;
