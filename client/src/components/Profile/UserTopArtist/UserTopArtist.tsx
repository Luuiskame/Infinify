import { Artist } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  artistToDisplay: Artist[] | [];
};

const UserTopArtist = ({ artistToDisplay }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const topArtist = artistToDisplay;

  // Slice first 10 artists if not showing all
  const displayedArtists = showAll ? topArtist : topArtist?.slice(0, 10);

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-[100%] lg:w-[50%]">
      <h2 className="text-3xl text-white font-bold font-sans text-center">
        Top Artist
      </h2>
      <div className="bg-spotify-light-gray mt-4 rounded-lg mb-10">
        <div>
          {/*seccion de imagen*/}
          <div className="relative flex justify-center items-center p-5 md:p-10">
            {/*seccion de imagen izquierda*/}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#1A1D24] z-10 -mr-6 md:-mr-10 transition-transform duration-300 hover:-translate-x-6 hover:-rotate-12  cursor-pointer">
              <Image
                src={topArtist?.[1]?.artist_photo || "/userMusic.png"}
                alt={topArtist?.[1]?.artist_name || "Segunda artista"}
                fill
                className="object-cover"
              />
            </div>

            {/*seccion de imagen centro*/}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#1A1D24] bg-black flex items-center justify-center z-20 transition-transform duration-300 hover:scale-110 cursor-pointer">
              <Image
                src={topArtist?.[0]?.artist_photo || "/userMusic.png"}
                alt={topArtist?.[0]?.artist_name || "Artista principal"}
                fill
                className="object-cover"
              />
            </div>

            {/*seccion de imagen derecha*/}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#1A1D24] z-10 -ml-6 md:-ml-10 transition-transform duration-300 hover:translate-x-6 hover:rotate-12  cursor-pointer">
              <Image
                src={topArtist?.[2]?.artist_photo || "/userMusic.png"}
                alt={topArtist?.[2]?.artist_name || "Tercera artista"}
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/*fin seccion de imagen*/}

          {displayedArtists && displayedArtists.length > 0 ? (
            displayedArtists.map((artist: Artist, index: number) => (
              <div
                key={artist?.artist_id}
                className="flex items-center gap-3 p-4 rounded-lg"
              >
                <p className="text-[#63707F] font-sans font-bold text-lg">
                  {index + 1}
                </p>
                {artist?.artist_photo ? (
                  <Image
                    width={50}
                    height={50}
                    src={artist?.artist_photo || "/userMusic.png"}
                    alt={artist?.artist_name || "artist"}
                    className="rounded-full object-fill border-white"
                  />
                ) : null}
                <Link href={artist?.artist_uri}>
                  <h3 className="hover:text-spotify-green">
                    {artist?.artist_name}
                  </h3>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400 px-4 py-2 text-center italic">
              No highlight Artists available for this user.
            </p>
          )}

          {topArtist && topArtist.length > 10 && (
            <div className="text-center py-4">
              <button
                onClick={toggleShowMore}
                className="text-spotify-green hover:underline"
              >
                {showAll ? "Show Less" : `See All ${topArtist.length} Artists`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTopArtist;
