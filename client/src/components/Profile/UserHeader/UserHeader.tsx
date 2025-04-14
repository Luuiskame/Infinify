"use client";
import Image from "next/image";
import { Userinfo } from "@/types";
import CompatibilityBar from "@/shared/CompatibilityBar";

import { useAppSelector } from "@/redux/hooks";

// shared components
import SendMessage from "./SendMessage";

type Props = {
  isOwnProfile: boolean;
  user: Userinfo | null;
};
const SpotifyLogoSVG = () => (
  <svg
    className="h-6 w-6 text-white"
    role="img"
    viewBox="0 0 496 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm111.4 365c-4.5 7.7-14.3 10.1-22.1 5.6-60.4-36.6-136.2-44.8-225.6-24-8.4 2-16.8-3.2-18.8-11.6-2-8.4 3.2-16.8 11.6-18.8 96.6-22.6 179.4-13 246.7 27.6 7.6 4.5 10 14.3 5.5 22.1zm31.4-64c-5.5 9.1-17.4 12-26.5 6.5-69.2-42-174.9-54.1-256.6-28.9-10.1 3-20.8-2.6-23.8-12.7-3-10.1 2.6-20.8 12.7-23.8 90.6-27.5 206.5-14.1 283.7 32.3 9.1 5.5 12 17.4 6.5 26.6zm34.4-76c-6.6 11-21 14.4-32 7.8-79.4-47.6-211-61.4-307.8-31.9-12 3.7-24.7-3.3-28.3-15.4-3.7-12 3.3-24.7 15.4-28.3 106.5-32.5 249.5-17.4 338.5 35.4 11.1 6.7 14.6 21.1 8 32.1z" />
  </svg>
);

const UserHeader = ({ isOwnProfile, user }: Props) => {
  const isLocalUser = useAppSelector((state) => state.userReducer?.user);

  console.log("user", user?.favorite_genres);

  const favoritesGenres = user?.favorite_genres.slice(0, 3);

  return (
    <section className="w-full bg-spotify-light-gray px-20 py-6  transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="relative group">
          <Image
            src={
              user?.profile_photo ||
              "/userImage.png"
            }
            alt={user?.display_name || ""}
            width={300}
            height={100}
            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-contain border-2 border-[#1DB954] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.display_name}
          </h1>
          <p className="text-spotify-green mb-4">
            {user?.followers.toLocaleString()} Followers
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-full transition-all duration-300 transform hover:scale-105"
              title="View Spotify Profile"
            >
              <SpotifyLogoSVG />
              <span>Spotify Profile</span>
            </button>
            {!isOwnProfile && (
              <SendMessage
                localUser={isLocalUser?.user.id as string}
                profileUser={user?.id as string}
              />
            )}
          </div>

          {!isOwnProfile && (
            <div className="flex flex-col gap-2 mb-2">
              <CompatibilityBar
                favGenres={user?.favorite_genres}
                favArtists={user?.user_top_artist}
                favSongs={user?.user_top_songs}
              />
            </div>
          )}

          <div className="sr-only lg:not-sr-only flex flex-wrap gap-2 lg:mt-6">
            {favoritesGenres &&
              favoritesGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-[#090A0C] text-gray-300 rounded-full text-sm hover:bg-[#17171C] transition-colors duration-300"
                >
                  {genre}
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserHeader;
