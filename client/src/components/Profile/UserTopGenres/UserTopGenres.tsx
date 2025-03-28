import { useState } from "react";
import React from "react";

type Props = {
  genreToDisplay: string[] | []
};

const UserTopGenres = ({ genreToDisplay }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const topGenres = genreToDisplay

  const displayedGenres = showAll ? topGenres : topGenres?.slice(0, 10);

  const toggleShowMore = () => {
    setShowAll(!showAll);
  }


  return (
    <div className="mb-20 w-[100%] lg:w-[50%]">
      <h2 className="text-3xl font-bold text-white font-sans text-center">
        Favorite Genres
      </h2>
      <div className="bg-spotify-light-gray mt-4 rounded-lg mb-10">
        {displayedGenres?.map((genre: string, index: number) => (
          <div
            key={genre}
            className="flex items-center gap-3 p-4 rounded-lg"
          >
            <p className="text-[#63707F] font-sans font-bold text-lg">{index + 1} </p>
            <p className="text-white font-sans text-lg">  {genre}</p>
          </div>
        ))}
        {topGenres && topGenres.length > 10 && (
              <div className="text-center py-4">
                <button onClick={toggleShowMore} className="text-spotify-green hover:underline"
                >
                  {showAll ? "Show less" : "Show more"}
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

export default UserTopGenres;
