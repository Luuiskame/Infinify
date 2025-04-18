"use client";
import React, { useState, useEffect } from "react";
import AboutMe from "@/components/Profile/About-me/AboutMe";
import UserHeader from "@/components/Profile/UserHeader/UserHeader";
import UserTopArtist from "@/components/Profile/UserTopArtist/UserTopArtist";
import UserTopSong from "@/components/Profile/UserTopSong/UserTopSong";
import UserTopGenres from "@/components/Profile/UserTopGenres/UserTopGenres";
import Setting from "@/components/Profile/Setting/Setting";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAppSelector } from "@/redux/hooks";
import { Userinfo, Artist, Song } from "@/types";
import {  useGetUserTopDataWithRangeQuery } from "@/services/profileApi";
import LoginBtn from "@/shared/LoginBtn";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { useSearchUsersByIdQuery } from "@/services/getUsersApi";

type Params = {
  spotify_id: string;
};

type TimeRange = "short" | "medium" | "long";

export default function Page({ params }: { params: Params }) {
  const [timeRange, setTimeRange] = useState<TimeRange>("long");
  const { spotify_id } = params;
  const [userData, setUserData] = useState<Userinfo | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("Info");
  const [loading, setLoading] = useState(true);

  const [artistToDisplay, setArtistToDisplay] = useState<Artist[]>([]);
  const [songToDisplay, setSongToDisplay] = useState<Song[]>([]);
  const [genreToDisplay, setGenreToDisplay] = useState<string[]>([]);

  const data = useAppSelector((state) => state.userReducer.user);
  const currentUser = data?.user;

  const {data: users, isLoading: isLoadingData} = useSearchUsersByIdQuery({ userId: spotify_id });
 


  
  // Fetch user data for the profile
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (currentUser?.spotify_id === spotify_id) {
        setIsOwnProfile(true);
        setUserData(currentUser);
      } else {
        if (users) {
          console.log("User found:", users);
          setUserData(users);
          setGenreToDisplay(users.favorite_genres ?? []);
        } else {
          console.error("User not found");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [spotify_id, currentUser, users]);
  





  // When viewing own profile, update based on local state
  useEffect(() => {
    if (isOwnProfile && data) {
      switch (timeRange) {
        case "short":
          setArtistToDisplay(data.user_top_artist_short ?? []);
          setSongToDisplay(data.user_top_songs_short ?? []);
          setGenreToDisplay(data.user.favorite_genres ?? []);
          break;
        case "medium":
          setArtistToDisplay(data.user_top_artist_medium ?? []);
          setSongToDisplay(data.user_top_songs_medium ?? []);
          setGenreToDisplay(data.user.favorite_genres ?? []);
          break;
        case "long":
          setArtistToDisplay(data.user_top_artist_long ?? []);
          setSongToDisplay(data.user_top_songs_long ?? []);
          setGenreToDisplay(data.user.favorite_genres ?? []);
          break;
        default:
          break;
      }
    }
  }, [timeRange, isOwnProfile, data]);

  // RTK Query: fetch top data when viewing someone else's profile
  const { data: topData, isLoading: topDataLoading } =
    useGetUserTopDataWithRangeQuery({
      timeRange,
      userId: !isOwnProfile ? spotify_id : null, // only call if not own profile
    });

  useEffect(() => {
    if (!isOwnProfile && topData) {
      setArtistToDisplay(topData.user_top_artist ?? []);
      setSongToDisplay(topData.user_top_songs ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topData, isOwnProfile]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const range = event.target.value as TimeRange;
    setTimeRange(range);
  };

  if (isLoadingData || (!isOwnProfile && topDataLoading)) {
    return (
      <div className="bg-spotify-dark-gray h-screen">
        {/* Skeleton for header */}
        <div className="p-10">
          <div className="flex items-center gap-4">
            <Skeleton circle height={100} width={100} baseColor="#121212" highlightColor="#222" />
            <div className="flex flex-col gap-2">
              <Skeleton height={24} width={200} baseColor="#121212" highlightColor="#222" />
              <Skeleton height={16} width={150} baseColor="#121212" highlightColor="#222" />
            </div>
          </div>
        </div>
        {/* Skeleton for navigation bar */}
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
        {/* Skeleton for active tab content */}
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

  const renderSection = () => {
    switch (activeTab) {
      case "Info":
        return (
          <div className="flex flex-col gap-4">
            {!currentUser?.id && (
              <div className="flex flex-col items-center gap-2 mb-4">
                <p className="text-gray-300 text-center">{`Log in to compare your music tastes with ${userData?.display_name}`}</p>
                <LoginBtn />
              </div>
            )}
            <div className="flex flex-row justify-between max-w-[400px] md:max-w-[800px]  md:mx-auto gap-3 md:gap-6 items-stretch">
              {!isOwnProfile &&
                (currentUser?.id ? (
                  <Link
                    href={`/profile/${spotify_id}/compare`}
                    className="bg-spotify-light-gray flex px-4 text-white items-center self-center rounded-md border-none outline-none focus:ring-2 hover:bg-spotify-green min-h-[60px] gap-2 min-w-[130px]"
                  >
                    <ArrowsRightLeftIcon className="h-6 w-6" />{" "}
                    <p className="text-sm"> Compare</p>
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      toast.info("Please log in to compare stats", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      })
                    }
                    className="bg-spotify-light-gray/50 flex p-2 text-gray-400 items-center self-center rounded-md border-none outline-none cursor-not-allowed min-h-[60px] min-w-[130px]"
                  >
                    Compare
                  </button>
                ))}
              <ToastContainer />

              <select
                value={timeRange}
                onChange={handleChange}
                className="bg-spotify-light-gray text-white p-2 self-center rounded-md border-none outline-none focus:ring-2 focus:ring-spotify-green h-full min-h-[60px] min-w-[130px]"
              >
                <option value="long">All Time</option>
                <option value="medium">Last 6 Months</option>
                <option value="short">Last 4 Weeks</option>
              </select>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <UserTopArtist artistToDisplay={artistToDisplay} />
              <UserTopSong songToDisplay={songToDisplay} />
              <UserTopGenres genreToDisplay={genreToDisplay} />
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

  if (loading || (!isOwnProfile && topDataLoading)) {
    return (
      <div className="bg-spotify-dark-gray h-screen">
        {/* Skeleton for header */}
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
        {/* Skeleton for navigation bar */}
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
        {/* Skeleton for active tab content */}
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

      {/* Navigation Bar */}
      <div className="flex justify-start bg-spotify-light-gray px-10">
        <button
          className={`px-4 py-2 font-sans font-bold ${
            activeTab === "Info"
              ? "border-b-4 border-spotify-green text-white"
              : "text-gray-300"
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
          {isOwnProfile ? "About Me" : `About ${userData?.display_name}`}
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

      {/* Active Tab Content */}
      <div className="py-2 px-10 mt-6 bg-spotify-dark-gray w-full">
        {renderSection()}
      </div>
    </div>
  );
}
