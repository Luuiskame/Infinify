import React from "react";
import { useGetPopularArtistsQuery } from "@/services/spotifyApi";
import MostListenedSongs from "./MostListenedSongs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Image from "next/image";
import { Artist } from "@/types";

export default function MostListened() {

  // Fetch popular artists from Spotify API
  const { data, error, isLoading } = useGetPopularArtistsQuery({})

  // Get the list of artists from the API response
  const artistList = data?.artists?.items;

  // Sort the artists by popularity and take the first one (most popular)
  const mostPopularArtist = artistList
    ?.slice()
    .sort((a: Artist, b: Artist) => b.popularity - a.popularity)[0];

    console.log({mostPopularArtist})

 
  if (error) return <p className="text-center text-red-500">Error</p>;

  if (isLoading) {
    <article className="md:w-[50%] flex flex-col items-center">
      <Skeleton height={420} width={520} className="rounded-lg" baseColor="#121212" highlightColor="#222" />
      <Skeleton height={20} width={200} className="mb-4" baseColor="#121212" highlightColor="#222" />
      <Skeleton height={16} width={150} baseColor="#121212" highlightColor="#222" />
      <Skeleton height={16} width={100} baseColor="#121212" highlightColor="#222" />
    </article>
  }

  return (
    <article className="md:w-[50%] flex flex-col items-center">
      <h3 className="text-spotify-green text-center text-lg font-bold mb-4">
        Artist Of The Day
      </h3>
      {mostPopularArtist && (
        <>
          <div className="relative">
            {/* Artist Image */}
            <Image
              src={mostPopularArtist.images[0]?.url}
              width={620}
              height={420}
              className="rounded-lg"
              alt={mostPopularArtist.name}
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-4 rounded-lg">
              <h2 className="text-spotify-white text-2xl font-bold">
                {mostPopularArtist.name}
              </h2>
              <p className="text-spotify-light-gray text-sm">
                Popularity: {mostPopularArtist.popularity}
              </p>
            </div>
          </div>

            <MostListenedSongs artistId={mostPopularArtist?.id}/>
          

        </>
      )}
    </article>
  );
}
