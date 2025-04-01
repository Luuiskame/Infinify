
import { useGetGenreOftheDayQuery } from "@/services/spotifyApi";
import Image from "next/image";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Song {
  id: string;
  songName: string;
  artists: string;
  albumImageUrl: string;
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

  return (
    <>
      <section>
        <div className="flex flex-col gap-4">
          <p className="text-start font-bold font-sans text-lg text-[#63707F]">
            Genre of the Day
          </p>
          <h2 className="text-start font-bold font-sans text-[1.2rem] text-white">
            {data?.genreInfo?.name.toUpperCase()}
          </h2>
        </div>
        {data?.songs?.map((song: Song) => (
          <div
            key={song.id}
            className="relative flex flex-col items-start rounded-lg mt-6"
          >
            <div className="flex justify-center items-center">
              <Image
                src={song.albumImageUrl}
                width={100}
                height={100}
                className="rounded-lg w-16 h-16"
                alt={song.songName}
              />

              <div className="w-72 inset-0 flex flex-col justify-end gap-2 px-4">
                <p className="text-sm font-sans">{song.songName}</p>
                <p className="text-[#63707F] font-sans font-semibold text-sm">
                  {song.artists}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-[2rem] w-[100%] items-center justify-center flex">
        <div className="flex flex-col items-center justify-center max-w-[400px] text-center">
          <Image
            alt="Playlist"
            src="/default-genre-pic.webp"
            width={300}
            height={300}
            className="rounded-lg"
          />

          <p className="text-white font-sans font-medium mb-2">
            Relevant artist: {data?.genreInfo?.relevantArtist}
          </p>

          <p className="text-white font-sans font-light md:w-[73%] mb-4">
            {data?.genreInfo?.genreInfo}
          </p>
        </div>
      </section>
    </>
  );
};

export default GenereOfTheDay;
