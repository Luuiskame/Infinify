import { useGetGenreOftheDayQuery } from "@/services/spotifyApi";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Song {
  id: string;
  songName: string;
  artists: string;
  albumImageUrl: string;
  albumName: string;
}

const GenereOfTheDay = () => {
  const { data, error, isLoading } = useGetGenreOftheDayQuery({});

  if (error) {
    return <div className="text-center text-red-500">Error loading data</div>;
  }

  if (isLoading) {
    return (
      <>
        {/* Skeleton para el título y descripción del género */}
        <div className="flex flex-col gap-6 w-[100%] md:w[50%]">
          <div className="flex flex-col gap-4">
            <Skeleton
              height={20}
              width={150}
              baseColor="#121212"
              highlightColor="#222"
            />
            <Skeleton
              height={24}
              width={200}
              baseColor="#121212"
              highlightColor="#222"
            />
          </div>

          {/* Skeleton para la lista de canciones */}
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton
                  circle
                  height={64}
                  width={64}
                  baseColor="#121212"
                  highlightColor="#222"
                />
                <div className="flex flex-col gap-2">
                  <Skeleton
                    height={16}
                    width={200}
                    baseColor="#121212"
                    highlightColor="#222"
                  />
                  <Skeleton
                    height={14}
                    width={150}
                    baseColor="#121212"
                    highlightColor="#222"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton para la sección de información del género */}
        <div className="mt-[2rem] w-[100%] items-center justify-center flex">
          <div className="flex flex-col items-center justify-center max-w-[400px] text-center">
            <Skeleton
              height={300}
              width={300}
              className="rounded-lg"
              baseColor="#121212"
              highlightColor="#222"
            />
            <Skeleton
              height={20}
              width={250}
              baseColor="#121212"
              highlightColor="#222"
            />
            <Skeleton
              height={60}
              width={300}
              baseColor="#121212"
              highlightColor="#222"
            />
          </div>
        </div>
      </>
    );
  }

  const currentGenre = data?.genreInfo;

  return (
    <div className=" mx-auto p-1 max-w-4xl">
      <div className="bg-black rounded-xl shadow-2xl p-3 md:p-6 overflow-hidden hover:bg-spotify-dark-gray transition-colors">
        <div className="p-3 md:p-6">
          {/* Header Section */}
          <div className="flex justify-start items-start mb-6 flex-col gap-2">
            <h2 className="text-start font-bold font-sans text-lg text-[#63707F]">
              Genere of the Day
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-spotify-white">
              {currentGenre.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-lg text-spotify-white italic mb-8 max-w-2xl">
            {currentGenre.genreInfo}
          </p>
          {/* Spotify Embed */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full max-w-[250px] aspect-square">
                <Image
                  src={"/default-genre-pic.webp"}
                  alt={`${currentGenre.name} playlist`}
                  fill
                  className="object-cover rounded-md shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                  <button className="h-14 w-14 rounded-full bg-spotify-green text-white flex items-center justify-center">
                    <PlayCircleIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 px-4 py-6 bg-black rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Recommended Playlist
                </h3>
                <Link
                  href={`https://open.spotify.com/playlist/${currentGenre.playlistId}?si=b0c7f3d9d6b94a1b`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors bg-spotify-green hover:bg-spotify-green/80 text-black"
                >
                  Listen on Spotify
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Songs  */}
        <div>
          <h2 className="text-2xl font-bold text-spotify-white mb-4">
            Top Tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.songs?.map((song: Song, index: number) => (
              <div
                key={index}
                className="bg-black rounded-lg p-4 flex items-center gap-4 hover:bg-spotify-dark-gray transition-colors group"
              >
                <Image
                  src={song.albumImageUrl}
                  alt={`${song.albumName}`}
                  width={30}
                  height={30}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-spotify-white font-semibold">
                    {song.songName}
                  </h3>
                  <p className="text-spotify-white/70">{song.artists}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-spotify-light-gray hover:bg-spotify-dark-gray">
                  <PlayCircleIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenereOfTheDay;
