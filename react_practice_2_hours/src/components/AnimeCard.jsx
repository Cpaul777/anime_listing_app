// rafce Snippet

import React from "react";

// You can de-structure it more by doing anime: {} and inside are the attributes you want
const AnimeCard = ({
  anime: {
    attributes: {
      canonicalTitle,
      subtype,
      averageRating,
      popularityRank,
      userCount,
      favoritesCount,
      status,
      posterImage: { medium, large, original },
    },
  },
}) => {
  return (
    <div className="anime-card">
      <img src={original ? original : "no-anime.png"} alt={canonicalTitle} />
      <div className="mt-4">
        <h3>{canonicalTitle}</h3>
        <div className="content">
          <div className="rating">
            <img src="rating_icon.png" alt="rating image" />
            <p className="text-orange-300">
              {averageRating ? averageRating : "N/A"}
            </p>
          </div>

          <span className="text-white">•</span>
          <p className="type">{subtype}</p>

          <span className="text-white">•</span>

          <p className="status"> {status}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
