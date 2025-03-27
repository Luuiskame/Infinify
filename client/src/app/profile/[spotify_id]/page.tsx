"use client";
import AboutMe from "@/components/Profile/About-me/AboutMe";
import UserHeader from "@/components/Profile/UserHeader/UserHeader";
import UserTopArtist from "@/components/Profile/UserTopArtist/UserTopArtist";
import UserTopSong from "@/components/Profile/UserTopSong/UserTopSong";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { searchUsersById } from "@/supabase/searchUsers";
import { Userinfo } from "@/types";
import UserTopGenres from "@/components/Profile/UserTopGenres/UserTopGenres";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Setting from "@/components/Profile/Setting/Setting";

type Params = {
  spotify_id: string;
};

type TimeRange = "short_term" | "medium_term" | "long_term";

export default function Page({ params }: { params: Params }) {
  const { spotify_id } = params;
  const [userData, setUserData] = useState<Userinfo | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("long_term");

  const data = useAppSelector((state) => state.userReducer.user);
  const currentUser = data?.user;

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.spotify_id === spotify_id) {
        setIsOwnProfile(true);
        setUserData({
          ...currentUser,
          user_top_artist: data?.user_top_artist ?? [],
          user_top_songs: data?.user_top_songs ?? [],
        });
      } else {
        const users = await searchUsersById(spotify_id);
        console.log("users", users);
        if (users.length > 0) {
          setUserData(users[0]);
        } else {
          console.error("No se encontró el usuario");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [spotify_id, currentUser, data]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const range = event.target.value as TimeRange;
    setTimeRange(range);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "Info":
        return (
          <div className="flex flex-col gap-4">
            <select
              onChange={handleChange}
              className="
        bg-spotify-light-gray 
        text-white 
        p-2
        self-center
        rounded-md 
        border-none 
        outline-none 
        focus:ring-2 
        focus:ring-spotify-green
      "
            >
              <option value="long_term">All Time</option>
              <option value="medium_term">Last 6 Months</option>
              <option value="short_term">Last 4 Weeks</option>
            </select>
            <div className="flex flex-col lg:flex-row gap-4">
              <UserTopArtist user={userData} timeRange={timeRange}/>
              <UserTopSong user={userData} timeRange={timeRange}/>
              <UserTopGenres user={userData} timeRange={timeRange}/>
            </div>
          </div>
        );
      case "about":
        return <AboutMe isOwnProfile={isOwnProfile} user={userData} />;
      case "settings":
        return <Setting />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-spotify-dark-gray h-screen">
        {/* Skeleton para el encabezado */}
        <div className="p-10">
          <div className="flex items-center gap-4">
            <Skeleton
              circle
              height={100}
              width={100}
              baseColor="#121212"
              highlightColor="#222"
            />
            <div className="flex flex-col gap-2">
              <Skeleton
                height={24}
                width={200}
                baseColor="#121212"
                highlightColor="#222"
              />
              <Skeleton
                height={16}
                width={150}
                baseColor="#121212"
                highlightColor="#222"
              />
            </div>
          </div>
        </div>

        {/* Skeleton para la barra de navegación */}
        <div className="flex justify-start bg-spotify-light-gray px-10">
          <Skeleton
            height={40}
            width={100}
            className="mr-4"
            baseColor="#121212"
            highlightColor="#222"
          />
          <Skeleton
            height={40}
            width={100}
            baseColor="#121212"
            highlightColor="#222"
          />
        </div>

        {/* Skeleton para el contenido de la pestaña activa */}
        <div className="py-2 px-10 mt-6 bg-spotify-dark-gray w-full">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton
              height={300}
              width="100%"
              baseColor="#121212"
              highlightColor="#222"
            />
            <Skeleton
              height={300}
              width="100%"
              baseColor="#121212"
              highlightColor="#222"
            />
            <Skeleton
              height={300}
              width="100%"
              baseColor="#121212"
              highlightColor="#222"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-spotify-dark-gray h-screen">
      {/* Header */}
      <div>
        <UserHeader isOwnProfile={isOwnProfile} user={userData} />
      </div>

      {/* Barra de navegación */}
      <div className="flex justify-start bg-spotify-light-gray px-10 ">
        <button
          className={`px-4 py-2 font-sans font-bold ${
            activeTab === "Info"
              ? "border-b-4 border-spotify-green text-white "
              : "text-gray-300 "
          }`}
          onClick={() => setActiveTab("Info")}
        >
          Info
        </button>
        <button
          className={`px-4 py-2 font-sans font-bold ${
            activeTab === "about"
              ? "text-white border-b-4 border-spotify-green"
              : "text-gray-300"
          }`}
          onClick={() => setActiveTab("about")}
        >
          {isOwnProfile ? `About Me` : `About ${userData?.display_name}`}
        </button>
        {isOwnProfile && (
          <button
            className={`px-4 py-2 font-sans font-bold ${
              activeTab === "settings"
                ? "text-white border-b-4 border-spotify-green"
                : "text-gray-300"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        )}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="py-2 px-10 mt-6 bg-spotify-dark-gray w-full">
        {renderSection()}
      </div>
    </div>
  );
}
