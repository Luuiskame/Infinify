"use client";
import { useState, useEffect } from "react";
import CompatibilityBar from "@/shared/CompatibilityBar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useGetUserCompareDataQuery } from "@/services/profileApi";

const Compare = () => {

  const user1 = useAppSelector((state) => state.userReducer.user);
  const params = useParams();
  const { spotify_id } = params;

  const { data: user2, isLoading, error } = useGetUserCompareDataQuery({ userId: spotify_id as string });
  console.log(user2);

  const dummyData = {
    user2: {
      name: "Julian Casablancas",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      favoriteArtists: [
        {
          name: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        },
        {
          name: "Tame Impala",
          image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
        },
      ],
      favoriteSongs: [
        {
          name: "Do I Wanna Know?",
          artist: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        },
        {
          name: "The Less I Know The Better",
          artist: "Tame Impala",
          image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
        },
      ],
    },
    commonArtists: [
      {
        name: "Arctic Monkeys",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      },
      {
        name: "The Strokes",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      },
      {
        name: "Tame Impala",
        image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
      },
      {
        name: "Radiohead",
        image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
      },
      {
        name: "The Killers",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
      },
    ],
    commonSongs: [
      {
        name: "R U Mine?",
        artist: "Arctic Monkeys",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
      },
      {
        name: "Reptilia",
        artist: "The Strokes",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
      },
      {
        name: "Let It Happen",
        artist: "Tame Impala",
        image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-spotify-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center pb-6 hover:text-[#1DB954] transition-colors duration-300">
            Common Artists
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {dummyData.commonArtists.map((artist, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-[#1DB954]"
                />
                <p className="text-center text-sm group-hover:text-[#1DB954] transition-colors duration-300">
                  {artist.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-6 hover:text-[#1DB954] transition-colors duration-300">
            Common Songs
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {dummyData.commonSongs.map((song, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-24 h-24 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                />
                <p className="text-center text-sm font-medium group-hover:text-[#1DB954] transition-colors duration-300">
                  {song.name}
                </p>
                <p className="text-center text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
                  {song.artist}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* main div for both cards, fav songs and artist */}
        <div className="grid grid-cols-1 text-center place-items-center lg:grid-cols-2 gap-4">
          <h2 className="lg:col-span-2 text-2xl font-bold hover:text-[#1DB954] transition-colors duration-300">
            VS
          </h2>

          <div className="w-full md:max-w-[600px] lg:max-w-[450px] lg:bg-spotify-light-gray rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:shadow-[#1DB954]/20">
            <h3 className="mb-6 font-semibold hover:text-[#1DB954] transition-colors duration-300">
              Both favorite Songs
            </h3>

            {/* song main container */}
            <h4>Right now</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user1?.user_top_songs_short[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_songs_short[0].song_image}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user2?.short_term.user_top_songs.song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.short_term.user_top_songs.song_image}
                  alt=""
                />
              </div>
            </div>

            <h4>Of all time</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user1?.user_top_songs_long[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_songs_long[0].song_image}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user2?.long_term.user_top_songs[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.long_term.user_top_songs[0].song_image}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="w-full md:max-w-[600px] lg:max-w-[450px] lg:bg-spotify-light-gray rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:shadow-[#1DB954]/20">
            <h3 className="mb-6 font-semibold hover:text-[#1DB954] transition-colors duration-300">
              Both favorite Artist 
            </h3>
            <h4>Right now</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user1?.user_top_artist_short[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_artist_short[0].artist_photo}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user2?.short_term.user_top_artist.artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.short_term.user_top_artist.artist_photo}
                  alt=""
                />
              </div>
            </div>
            <h4>Of all time</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user1?.user_top_artist_long[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_artist_long[0].artist_photo}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium">
                  {user2?.long_term.user_top_artist[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.long_term.user_top_artist[0].artist_photo}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[700px] flex flex-col items-center mx-auto mt-12 mb-6">
          <h3 className="text-xl font-semibold mb-6 text-center hover:text-[#1DB954] transition-colors duration-300">
            Compatibility
          </h3>
          <CompatibilityBar />
        </div>

        <div className="flex justify-center mt-12 gap-12">
          <Link
            href={`/profile/${spotify_id}`}
          className="flex items-center space-x-2 hover:text-[#1DB954] hover:opacity-80 transition-all duration-300">
            <ArrowLeftIcon className="h-6 w-6" />
            <span>Back</span>
          </Link>
          <button className="bg-[#1DB954] hover:opacity-90 transition-all duration-300 px-8 py-3 rounded-full flex items-center space-x-2 hover:shadow-lg hover:scale-105">
            {/* <FaSpotify className="text-xl" /> */}
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
