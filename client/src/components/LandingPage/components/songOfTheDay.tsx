"use client";
import Image from "next/image";
import React from "react";
import { useGetSongOfTheDayQuery } from "@/services/spotifyApi";
import { PlayIcon } from "@heroicons/react/24/solid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ArtistOfTheDay() {
  const { data: songData, isLoading, error } = useGetSongOfTheDayQuery({});

  if (error) {
    return <p className="text-center text-red-500">Error loading data</p>;
  }

  if (isLoading) {
    return (
      <article className="md:w-[50%] flex flex-col items-center">
        <h3 className="text-spotify-green text-center text-lg font-bold mb-4">
          Song Of The Day
        </h3>
        <Skeleton height={250} width={350} className="rounded-lg" baseColor="#121212" highlightColor="#222" />
        <div className="p-4 gap-2 bg-spotify-light-gray rounded-lg w-full">
          <Skeleton height={20} width={200} className="mb-4" baseColor="#121212" highlightColor="#222" />
          <Skeleton height={16} width={150} baseColor="#121212" highlightColor="#222" />
          <Skeleton height={16} width={100} baseColor="#121212" highlightColor="#222" />
          <div className="mt-3 gap-2 md:w-[70%] mb-16">
            <Skeleton height={16} width={120} baseColor="#121212" highlightColor="#222" />
            <Skeleton height={60} width="100%" baseColor="#121212" highlightColor="#222" />
          </div>
        </div>
      </article>
    );
  }

  const TopSong = songData?.songOfTheDay;
  const releaseYear = 2024;

  return (
    <article className="md:w-[50%] flex flex-col items-center">
      <h3 className="text-spotify-green text-center text-lg font-bold mb-4">
        Song Of The Day
      </h3>
      {TopSong && (
        <>
          <div className="relative">
            {/* Song Image */}
            <Image
              src={TopSong.albumImageUrl || "/placeholder-image.jpg"}
              width={620}
              height={420}
              className="rounded-lg"
              alt={TopSong.songName}
              priority
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex flex-col p-4 rounded-lg justify-end bg-gradient-to-t from-black to-transparent">
              <h2 className="text-spotify-white text-2xl font-bold">
                {TopSong.songName}
              </h2>
              <div className="relative">
                <a
                  href={TopSong.spotifyUrl}
                  className="text-spotify-green text-sm mt-1 hover:text-spotify-black flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Listen on Spotify
                  <PlayIcon className="w-5 h-5 text-spotify-green opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ml-2" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 gap-2 bg-spotify-light-gray rounded-lg">
            <h3 className="text-spotify-green text-lg font-bold mb-4">
              Artist: {TopSong.artists.join(" / ")}
            </h3>
            <p className="text-spotify-white font-bold font-sans">
              Album: {TopSong.albumName}
            </p>
            <p>Released: {releaseYear}</p>

            <div className="mt-3 gap-2 md:w-[70%] mb-16">
              <p className="text-[#63707F] font-bold font-sans">
                Did you know?
              </p>
              <span className="text-white text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio maxime quas laudantium impedit, velit nesciunt sed
                sit est earum inventore! Cum est aperiam, nobis neque quaerat
                consectetur. Adipisci, quasi? Minima.
              </span>
            </div>
          </div>
        </>
      )}
    </article>
  );
}