import { useState, useEffect } from "react";
import Search from "./components/Search";
import Spinner from "./components/Loading";
import AnimeCard from "./components/AnimeCard";
import { getTrendingAnime, updateSearchCount } from "./appwrite";

const BASE_API_URL = "https://kitsu.io/api/edge/";

// GET method for requesting in Kitsu
const API_OPTIONS = {
  method: "GET",
  headers: {
    Accept: "application/vnd.api+json",
  },
};

const limit = "20";
const offset = "0";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [Error, setError] = useState("");
  const [AnimeList, setAnimeList] = useState([]);
  const [TrendingAnime, setTrendingAnime] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setdebouncedSearchTerm] = useState("");

  // Debouncing
  // Delaying the searching to prevent too many API request for every type in key
  // the 500 is the millisecond
  useEffect(() => {
    const timer = setTimeout(() => {
      setdebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Anime function
  const fetchAnimes = async (query = "") => {
    setisLoading(true);
    setError("");

    // Try catch the fetching incase something goes wrong
    try {
      // Build the URL
      const endpoint = query
        ? `${BASE_API_URL}/anime?&${encodeURIComponent(`filter[text]=${query}&sort=userCount`)}`
        : `${BASE_API_URL}/anime?sort=popularityRank`;

      // Add the page limiting and offset for the final link
      const url = `${endpoint}&page[limit]=${limit}&page[offset]=${offset}`;

      // Get the response
      const res = await fetch(url, API_OPTIONS);

      if (!res) {
        throw new Error(`Error to fetch animes: HTTP STATUS: ${res.status}`);
      }

      // Store the in results
      const result = await res.json();

      if (result.Response == "False") {
        setError(result.Error || "Failed to fetch animes");
        setAnimeList([]);
        return;
      }

      console.log(result);

      // Store the results data array in a state
      setAnimeList(result.data || []);

      if (query && result.data?.length > 0) {
        console.log("Im updating the database");
        await updateSearchCount(query, result.data[0]);
      }
    } catch (e) {
      console.error(`Error Fetching Anime List: ${e}`);
      setError(`Error Fetching Animes, Try again later`);
    } finally {
      setisLoading(false);
    }
  };

  // Get the top 10 trending anime based on search
  const loadTrendingAnime = async () => {
    try {
      const animes = await getTrendingAnime();
      setTrendingAnime(animes);
    } catch (error) {
      console.error(`Error Fetching Trending Anime: ${error}`);
    }
  };

  // Load the list once
  // When searching it needs to load again, meaning it needs the searchTerm to change
  // Hence why its the dependency

  useEffect(() => {
    fetchAnimes(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // UseEffect for loading trending movies with no dependency
  useEffect(() => {
    loadTrendingAnime();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./poster.png" alt="Anime Poster" />
          <h1>
            Find <span className="text-gradient">Animes</span> You'll Enjoy
            Without Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {TrendingAnime.length > 0 && (
          <section className="trending">
            <h2>Trending Animes</h2>
            <ul>
              {TrendingAnime.map((anime, index) => (
                <li key={anime.$id}>
                  <p>{index + 1}</p>
                  <img src={anime.poster_url} alt={anime.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="mt-20"> All Animes</h2>

          {isLoading ? (
            <Spinner />
          ) : Error ? (
            <p className="text-red-700">Error Fetching Anime {Error}</p>
          ) : (
            <ul>
              {/* Use parenthesis not function brace, because of mandatory return call for cleaner code */}
              {/* Using function braces would require return ( <li>...etc. ) */}
              {AnimeList.map((anime) => (
                // <p key={anime.id} className="text-white">
                //   {anime.attributes.canonicalTitle}
                // </p>
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
