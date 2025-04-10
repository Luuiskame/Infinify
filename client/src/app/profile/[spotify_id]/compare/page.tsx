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
import LoginBtn from "@/shared/LoginBtn";
import { toast } from "react-toastify";

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

  const handleBlockedInteraction = () => {
    if (!user1?.user?.id) {
      toast.info("Please log in to compare music tastes!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const containerStyle = !user1?.user?.id ? {
    position: "relative" as const,
    opacity: 0.6,
    cursor: "not-allowed",
  } : {};

  return (
    <div className="min-h-screen bg-spotify-dark text-white p-6 mb-[6rem] lg:mb-3">
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg p-8 bg-spotify-light-gray rounded-xl shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4 text-[#1DB954]">Oops! Something's Off Beat</h2>
            <p className="text-lg mb-6 text-gray-300">
              {error 
                ? "Looks like we're having trouble connecting to the music servers. Check your internet connection and try again."
                : "We couldn't find this user's musical profile. They might have moved to a different stage."}
            </p>
            <Link
              href={`/profile/${spotify_id}`}
              className="inline-flex items-center space-x-2 bg-[#1DB954] text-black px-6 py-3 rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Profile</span>
            </Link>
          </motion.div>
        </div>
      )}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <motion.p
              className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-spotify-green to-emerald-300"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 8px rgba(29, 185, 84, 0.3)",
                  "0 0 16px rgba(29, 185, 84, 0.5)",
                  "0 0 8px rgba(29, 185, 84, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Comparing Tastes
            </motion.p>
          </motion.div>

          {/* Loading Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-xl md:text-2xl font-medium text-gray-300">
              Finding your musical connection...
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="h-1 bg-spotify-green rounded-full max-w-md mb-8"
          />

          {/* Animated Music Notes */}
          <div className="flex space-x-2 h-12 items-end">
            {[1, 2, 3, 4, 3, 2, 1].map((height, index) => (
              <motion.div
                key={index}
                animate={{
                  height: [height * 8, height * 16, height * 8],
                  backgroundColor: ["#1DB954", "#1ED760", "#1DB954"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
                className="w-3 bg-spotify-green rounded-sm"
              />
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="max-w-7xl mx-auto relative"
          style={containerStyle}
          onClick={handleBlockedInteraction}
        >
          {!user1?.user?.id && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-spotify-dark px-6 py-3 rounded-lg border border-[#1DB954] shadow-lg">
                <p className="text-[#1DB954] font-medium">Log in to compare music tastes</p>
              </div>
            </div>
          )}
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
            {user1?.user?.id ? (
              <button className="bg-[#1DB954] hover:opacity-90 transition-all duration-300 px-8 py-3 rounded-full flex items-center space-x-2 hover:shadow-lg hover:scale-105">
                <span>Message</span>
              </button>
            ) : (
              <LoginBtn />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
