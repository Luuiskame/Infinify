import { Artist } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  artistToDisplay: Artist[] | []
};

const UserTopArtist = ({artistToDisplay }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const topArtist = artistToDisplay

  // Slice first 10 artists if not showing all
  const displayedArtists = showAll ? topArtist : topArtist?.slice(0, 10);

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-[100%] lg:w-[50%]">
      <h2 className="text-3xl text-white font-bold font-sans">Top Artist</h2>
      <div className="bg-spotify-light-gray mt-4 rounded-lg mb-10">
        <div>
          <div className="relative flex justify-center items-center p-10 ">
            <Image
              src={
                topArtist?.[1]?.artist_photo ||
                "https://i.scdn.co/image/ab6775700000ee852ba57998f0be198a92734260"
              }
              alt={topArtist?.[0]?.artist_name || "artist"}
              width={120}
              height={120}
              className="rounded-full absolute left-10 hover:-translate-x-6 transition-transform hover:-rotate-12"
            />
            <Image
              src={
                topArtist?.[0]?.artist_photo ||
                "https://i.scdn.co/image/ab6775700000ee852ba57998f0be198a92734260"
              }
              alt={topArtist?.[1]?.artist_name || "artist"}
              width={160}
              height={120}
              className="rounded-full z-10 hover:scale-110 transition-transform"
            />
            <Image
              src={
                topArtist?.[2]?.artist_photo ||
                "https://i.scdn.co/image/ab6775700000ee852ba57998f0be198a92734260"
              }
              alt={topArtist?.[2]?.artist_name || "artist"}
              width={120}
              height={120}
              className="rounded-full absolute right-10 hover:translate-x-6 transition-transform hover:rotate-12"
            />
          </div>

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
                    src={artist?.artist_photo}
                    alt={artist?.artist_name}
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
            <p>No highlight Artists available for this user.</p>
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