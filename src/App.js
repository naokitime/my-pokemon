import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokeData } from "./api/pokeAPI";
import Card from "./components/Card";

function App() {
  const JAPANESEBDPOINT = "https://pokeapi.co/api/v2/pokemon-species/";
  const EBDPOINT = "https://pokeapi.co/api/v2/pokemon/";
  const [loading, setLoading] = useState(true);
  const [pokeDatas, setPokeDatas] = useState([]);
  const [pokeJapNameDatas, setPokeJapNameDatas] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [nextJapURL, setNextJapURL] = useState("");
  const [prevURL, setPrevURL] = useState("");
  const [prevJapURL, setPrevJapURL] = useState("");

  const fetchPokemonDataWithJapaneseName = async (url) => {
    try {
      const data = await getAllPokemon(url);
      setNextJapURL(data.next);
      setPrevJapURL(data.previous);
      const promises = data.results.map(async (pokemon) => {
        const details = await getPokeData(pokemon.url);
        const japaneseName = details.names.find(
          (name) => name.language.name === "ja-Hrkt"
        ).name;
        return {
          ...pokemon,
          japaneseName: japaneseName,
        };
      });
      const detailedData = await Promise.all(promises);
      return detailedData;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return error;
    }
  };

  const fetchPokemonData = async (url) => {
    try {
      const data = await getAllPokemon(url);
      setNextURL(data.next);
      setPrevURL(data.previous);
      const promises = data.results.map(async (pokemon) => {
        const detail = await getPokeData(pokemon.url);
        return detail;
      });
      const detailedData = await Promise.all(promises);
      return detailedData;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return error;
    }
  };

  useEffect(() => {
    fetchPokemonDataWithJapaneseName(JAPANESEBDPOINT).then((data) => {
      setPokeJapNameDatas(data);
    });
    fetchPokemonData(EBDPOINT).then((data) => {
      setPokeDatas(data);
    });
    setLoading(false);
  }, []);

  const handleNext = async () => {
    setLoading(true);
    fetchPokemonDataWithJapaneseName(nextJapURL).then((data) => {
      setPokeJapNameDatas(data);
    });
    fetchPokemonData(nextURL).then((data) => {
      setPokeDatas(data);
    });
    setLoading(false);
  };

  // Handle clicking the back button
  const handleBack = async () => {
    if (!prevURL) return;
    setLoading(true);
    fetchPokemonDataWithJapaneseName(prevJapURL).then((data) => {
      setPokeJapNameDatas(data);
    });
    fetchPokemonData(prevURL).then((data) => {
      setPokeDatas(data);
    });
    setLoading(false);
  };

  return (
    <>
      <div className="App">
        {loading ? (
          <h1 className="loading">
            ロード中<span className="loadingDot">...</span>
          </h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokeDatas.length > 0 &&
                pokeJapNameDatas.length > 0 &&
                pokeDatas.map((pokeData, index) => {
                  return (
                    <Card
                      key={index}
                      pokeData={pokeData}
                      pokemonJap={pokeJapNameDatas[index]}
                    />
                  );
                })}
            </div>
            <div className="btn">
              <button onClick={handleBack}>戻る</button>
              <button onClick={handleNext}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
