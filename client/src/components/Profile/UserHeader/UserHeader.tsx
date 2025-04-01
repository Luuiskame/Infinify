"use client";
import Image from "next/image";
import { Userinfo } from "@/types";
import CompatibilityBar from "@/shared/CompatibilityBar";

import { useAppSelector } from "@/redux/hooks";

// shared components
import LoginBtn from "@/shared/LoginBtn";
import SendMessage from "./SendMessage";

type Props = {
  isOwnProfile: boolean;
  user: Userinfo | null;
};
const SpotifyLogoSVG = () => (
  <svg
    className="h-6 w-6 text-spotify-green"
    role="img"
    viewBox="0 0 496 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm111.4 365c-4.5 7.7-14.3 10.1-22.1 5.6-60.4-36.6-136.2-44.8-225.6-24-8.4 2-16.8-3.2-18.8-11.6-2-8.4 3.2-16.8 11.6-18.8 96.6-22.6 179.4-13 246.7 27.6 7.6 4.5 10 14.3 5.5 22.1zm31.4-64c-5.5 9.1-17.4 12-26.5 6.5-69.2-42-174.9-54.1-256.6-28.9-10.1 3-20.8-2.6-23.8-12.7-3-10.1 2.6-20.8 12.7-23.8 90.6-27.5 206.5-14.1 283.7 32.3 9.1 5.5 12 17.4 6.5 26.6zm34.4-76c-6.6 11-21 14.4-32 7.8-79.4-47.6-211-61.4-307.8-31.9-12 3.7-24.7-3.3-28.3-15.4-3.7-12 3.3-24.7 15.4-28.3 106.5-32.5 249.5-17.4 338.5 35.4 11.1 6.7 14.6 21.1 8 32.1z" />
  </svg>
);


const UserHeader = ({ isOwnProfile, user }: Props) => {

  const isLocalUser = useAppSelector(state=> state.userReducer?.user)  

  return (
    <section className="bg-spotify-light-gray flex flex-col md:flex-row">
      <div className="flex flex-col md:flex-row items-center gap-6 px-10 py-12 md:w-[50%]">
        <Image
          src={
            user?.profile_photo ||
            "https://i.scdn.co/image/ab6775700000ee852ba57998f0be198a92734260"
          }
          width={200}
          height={100}
          alt={user?.display_name || "user"}
          className="rounded-full object-fill border-4 border-white"
        />
        <h2 className="text-3xl font-bold font-sans mt-auto">
          {user?.display_name}
        </h2>
      </div>
      <div className="flex flex-col gap-3 px-10 font-sans items-center md:items-end justify-center md:w-[50%] mb-8">
        <p className="text-white">{`${user?.followers || 0} Followers on spotify`}</p>
        <a href={user?.uri} className="text-white flex gap-3 items-center">
          <SpotifyLogoSVG/> Open spotify profile
        </a>
        {!isOwnProfile && (
          <div className="flex flex-col gap-3 max-w[300px]">
          {/* <button
            type="button"
            className="bg-spotify-green text-white px-4 py-1 rounded-lg hover:bg-spotify-green/40 text-center font-sans font-bold text-lg"
          >
            Agregar amigo
          </button> */}
          <SendMessage localUser={isLocalUser?.user.id as string} profileUser={user?.id as string}/>
          <CompatibilityBar favGenres={user?.favorite_genres} favArtists={user?.user_top_artist} favSongs={user?.user_top_songs}/>
          </div>
          
        )}
        {isLocalUser === undefined || isLocalUser === null && (
        <div className="text-center w-[90%] mx-auto mt-6 max-w-[400px]">
          <p className="font-extrabold text-[1rem]">Log in to see your own stats and compatibility with {user?.display_name}</p>
          <LoginBtn/>
        </div>
      )}
      </div>
    </section>
  );
};

export default UserHeader;
