import React from "react";

// rafce Snippet

// Destruct the properties
const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search icon" />

        <input
          className="placeholder-gray-900 "
          type="text"
          placeholder="Search for Anime"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
