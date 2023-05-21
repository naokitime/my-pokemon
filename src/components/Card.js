import React from "react";

const Card = ({ pokeData, pokemonJap }) => {
  return (
    <div className="card">
      <img src={pokeData.sprites.front_default} alt={pokeData.name} />
      <h2>{pokemonJap.japaneseName}</h2>
    </div>
  );
};

export default Card;
