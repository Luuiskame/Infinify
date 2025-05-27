"use client";
import React from "react";
import { useGetPopularArtistsQuery } from "@/services/spotifyApi";
import MostListenedSongs from "./MostListenedSongs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Image from "next/image";

export default function MostListened() {
  // Fetch popular artists from Spotify API
  const { data, error, isLoading } = useGetPopularArtistsQuery({});


  if (error) return <p className="text-center text-red-500">Error</p>;

  if (isLoading) {
    return (
      <article className="md:w-[50%] flex flex-col items-center">
        <h3 className="text-spotify-green text-center text-lg font-bold">
          Artist Of The Day
        </h3>
        <Skeleton
          height={420}
          width={520}
          className="rounded-lg"
          baseColor="#121212"
          highlightColor="#222"
        />
        <Skeleton
          height={220}
          width={520}
          className=""
          baseColor="#121212"
          highlightColor="#222"
          />
      </article>
    );
  }

  return (
    <article className="md:w-[50%] flex flex-col items-center">
      <h3 className="text-spotify-green text-center text-lg font-bold mb-4">
        Artist Of The Day
      </h3>
      {data && (
        <>
          <div className="relative  max-w-[360px] aspect-[420/420] md:max-w-[620px] md:aspect-auto">
            {/* Artist Image */}
            {data && data.artist.imageUrl && (
              <Image
                key={data.artist.imageUrl}
                src={data.artist.imageUrl}
                width={620} 
                height={420}
                className="rounded-lg"
                alt={data?.artist.name}
                placeholder="blur"
                blurDataURL="/placeholder-image.jpg"
                fetchPriority="high"
              />
            )}

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black to-transparent p-4 rounded-lg">
              <h2 className="text-spotify-white text-2xl font-bold">
                {data?.artist.name}
              </h2>
              <p className="text-spotify-light-gray text-sm">
                Popularity: {data?.artist.popularity}
              </p>
            </div>
          </div>

          <MostListenedSongs artistId={data?.artist.id} />
        </>
      )}
    </article>
  );
}
