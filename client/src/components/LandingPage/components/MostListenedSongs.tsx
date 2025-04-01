"use client";
import React from "react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import { Artist, Song } from "@/types";

//!temporary types

import { useGetPopularArtistPopularSongsQuery } from "@/services/spotifyApi";

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Artist {
  id: string;
  name: string;
}

interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: Image[];
}

interface Song {
  id: string;
  name: string;
  album: Album;
}

interface Props {
  artistId: string;
}

export default function MostListenedSongs({ artistId }: Props) {
  const { data, error, isLoading } =
    useGetPopularArtistPopularSongsQuery(artistId);
  const songs = data?.tracks?.slice(0, 5); // Limit to 5 songs

  if (error) return <p>Error loading songs.</p>;

  if (isLoading) {
    return (
      <div className="w-[100%] mx-auto flex flex-col gap-[1rem] bg-spotify-light-gray rounded pt-3 pb-5">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex gap-[.3em] pl-2">
              <Skeleton
                width={50}
                height={50}
                className="rounded-lg"
                baseColor="#121212"
                highlightColor="#222"
              />
              <div className="flex-1">
                <Skeleton
                  width={100}
                  height={20}
                  baseColor="#121212"
                  highlightColor="#222"
                />
                <Skeleton
                  width={150}
                  height={16}
                  baseColor="#121212"
                  highlightColor="#222"
                />
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="w-[100%] mx-auto flex flex-col gap-[1rem] bg-spotify-light-gray rounded pt-3 pb-5">
      {songs?.map((song: Song) => (
        <div key={song.id} className="flex gap-[.3em] pl-2">
          <Image
            src={song.album.images[0].url}
            alt={`${song.album.name} cover`}
            width={50}
            height={50}
            className="rounded-lg w-[50px] h-[50px] object-cover"
            priority={true}
          />
          <div>
            <p>{song.name}</p>
            <p className="flex text-sm text-[#63707F]">
              {song.album.artists.map((artist) => artist.name).join(" / ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
