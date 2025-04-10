"use client";
import { useState, useEffect } from "react";
import CompatibilityBar from "@/shared/CompatibilityBar";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useGetUserCompareDataQuery } from "@/services/profileApi";
import useGetUserCompatibilityNumber from "@/hooks/useGetUserCompatibilityNumber";

const Compare = () => {
  const user1 = useAppSelector((state) => state.userReducer.user);
  const params = useParams();
  const { spotify_id } = params;

  const { data: user2, isLoading, error } = useGetUserCompareDataQuery({ userId: spotify_id as string });
  
  const { thingsInCommon } = useGetUserCompatibilityNumber(
    user2?.favorite_genres || [],
    user2?.long_term.user_top_artist || [],
    user2?.long_term.user_top_songs || []
  );

  return (
    <div className="min-h-screen bg-spotify-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center pb-6 hover:text-[#1DB954] transition-colors duration-300">
            Common Artists
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {thingsInCommon?.artistInCommon.length > 0 ? (
              thingsInCommon.artistInCommon.map((artist, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <img
                    src={artist.artist_photo}
                    alt={`${artist.artist_name} artist profile`}
                    className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-[#1DB954]"
                  />
                  <p className="text-center text-sm group-hover:text-[#1DB954] transition-colors duration-300">
                    {artist.artist_name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center italic">No artists in common yet. Keep exploring music!</p>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-6 hover:text-[#1DB954] transition-colors duration-300">
            Common Songs
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {thingsInCommon?.songsInCommon.length > 0 ? (
              thingsInCommon.songsInCommon.map((song, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                >
                  <img
                    src={song.song_image}
                    alt={`${song.song_name} by ${song.artist_name} album cover`}
                    className="w-24 h-24 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  />
                  <p className="text-center text-sm font-medium group-hover:text-[#1DB954] transition-colors duration-300">
                    {song.song_name}
                  </p>
                  <p className="text-center text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
                    {song.artist_name}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center italic p-6">No songs in common yet. Time to share some music!</p>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-6 hover:text-[#1DB954] transition-colors duration-300">
            Common Genres
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-6 justify-center">
            {thingsInCommon?.genresInCommon.length > 0 ? (
              thingsInCommon.genresInCommon.map((genre, index) => (
                <div
                  key={index}
                  className="bg-spotify-light-gray px-4 py-2 rounded-full group cursor-pointer hover:bg-[#1DB954]/20 transition-all duration-300"
                >
                  <p className="text-center text-sm group-hover:text-[#1DB954] transition-colors duration-300 capitalize">
                    {genre}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center italic p-6">No genres in common yet. Explore different music styles!</p>
            )}
          </div>
        </div>

        {/* main div for both cards, fav songs and artist */}
        <div className="grid grid-cols-1 text-center place-items-center lg:grid-cols-2 gap-4">
          <h2 className="lg:col-span-2 text-2xl font-bold hover:text-[#1DB954] transition-colors duration-300">
            VS
          </h2>

          <div className="w-full md:max-w-[600px] lg:max-w-[450px] bg-spotify-light-gray rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:shadow-[#1DB954]/20">
            <h3 className="mb-8 text-xl font-semibold hover:text-[#1DB954] transition-colors duration-300">
              Both favorite Songs
            </h3>

            {/* song main container */}
            <h4 className="text-lg font-medium mb-4 text-gray-200">Right now</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-8">
              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user1?.user_top_songs_short[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_songs_short[0].song_image}
                  alt={`${user1?.user_top_songs_short[0].song_name} album cover`}
                />
              </div>

              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user2?.short_term.user_top_songs.song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.short_term.user_top_songs.song_image}
                  alt={`${user2?.short_term.user_top_songs.song_name} album cover`}
                />
              </div>
            </div>

            <h4 className="text-lg font-medium mb-4 text-gray-200">Of all time</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user1?.user_top_songs_long[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_songs_long[0].song_image}
                  alt={`${user1?.user_top_songs_long[0].song_name} album cover`}
                />
              </div>

              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user2?.long_term.user_top_songs[0].song_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.long_term.user_top_songs[0].song_image}
                  alt={`${user2?.long_term.user_top_songs[0].song_name} album cover`}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:max-w-[600px] lg:max-w-[450px] bg-spotify-light-gray rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:shadow-[#1DB954]/20">
            <h3 className="mb-8 text-xl font-semibold hover:text-[#1DB954] transition-colors duration-300">
              Both favorite Artist 
            </h3>
            <h4 className="text-lg font-medium mb-4 text-gray-200">Right now</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-8">
              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user1?.user_top_artist_short[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_artist_short[0].artist_photo}
                  alt={`${user1?.user_top_artist_short[0].artist_name} artist profile`}
                />
              </div>

              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user2?.short_term.user_top_artist.artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.short_term.user_top_artist.artist_photo}
                  alt={`${user2?.short_term.user_top_artist.artist_name} artist profile`}
                />
              </div>
            </div>
            <h4 className="text-lg font-medium mb-4 text-gray-200">Of all time</h4>
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user1?.user_top_artist_long[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user1?.user_top_artist_long[0].artist_photo}
                  alt={`${user1?.user_top_artist_long[0].artist_name} artist profile`}
                />
              </div>

              <div className="flex flex-col items-center gap-4 mb-6 w-[50%] group cursor-pointer">
                <p className="text-center group-hover:text-[#1DB954] transition-colors duration-300 font-medium text-base">
                  {user2?.long_term.user_top_artist[0].artist_name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                  src={user2?.long_term.user_top_artist[0].artist_photo}
                  alt={`${user2?.long_term.user_top_artist[0].artist_name} artist profile`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[700px] flex flex-col items-center mx-auto mt-12 mb-6">
          <h3 className="text-xl font-semibold mb-6 text-center hover:text-[#1DB954] transition-colors duration-300">
            Compatibility
          </h3>
          <CompatibilityBar favArtists={user2?.long_term.user_top_artist} favSongs={user2?.long_term.user_top_songs} favGenres={user2?.favorite_genres} />
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
