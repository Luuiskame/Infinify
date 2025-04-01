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
import { searchUsersById } from "@/supabase/searchUsers";
import { Userinfo, Artist, Song } from "@/types";
import { useGetUserTopDataWithRangeQuery } from "@/services/profileApi";

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

  // Fetch user data for the profile
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (currentUser?.spotify_id === spotify_id) {
        setIsOwnProfile(true);
        setUserData(currentUser);
      } else {
        const users = await searchUsersById(spotify_id);
        if (users.length > 0) {
          console.log("User found:", users[0]);
          setUserData(users[0]);
          setGenreToDisplay(users[0].favorite_genres ?? []);
          // For other profiles, we will fetch top data via RTK Query.
        } else {
          console.error("User not found");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [spotify_id, currentUser]);

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

  // Update display state when RTK Query data arrives
  useEffect(() => {
    if (!isOwnProfile && topData) {
      console.log("Top data:", topData);
      setArtistToDisplay(topData.user_top_artist ?? []);
      setSongToDisplay(topData.user_top_songs ?? []);
      setGenreToDisplay(userData?.favorite_genres ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topData, isOwnProfile]);

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
              value={timeRange}
              onChange={handleChange}
              className="bg-spotify-light-gray text-white p-2 self-center rounded-md border-none outline-none focus:ring-2 focus:ring-spotify-green"
            >
              <option value="long">All Time</option>
              <option value="medium">Last 6 Months</option>
              <option value="short">Last 4 Weeks</option>
            </select>
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
            <Skeleton circle height={100} width={100} baseColor="#121212" highlightColor="#222" />
            <div className="flex flex-col gap-2">
              <Skeleton height={24} width={200} baseColor="#121212" highlightColor="#222" />
              <Skeleton height={16} width={150} baseColor="#121212" highlightColor="#222" />
            </div>
          </div>
        </div>
        {/* Skeleton for navigation bar */}
        <div className="flex justify-start bg-spotify-light-gray px-10">
          <Skeleton height={40} width={100} className="mr-4" baseColor="#121212" highlightColor="#222" />
          <Skeleton height={40} width={100} baseColor="#121212" highlightColor="#222" />
        </div>
        {/* Skeleton for active tab content */}
        <div className="py-2 px-10 mt-6 bg-spotify-dark-gray w-full">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton height={300} width="100%" baseColor="#121212" highlightColor="#222" />
            <Skeleton height={300} width="100%" baseColor="#121212" highlightColor="#222" />
            <Skeleton height={300} width="100%" baseColor="#121212" highlightColor="#222" />
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
            activeTab === "Info" ? "border-b-4 border-spotify-green text-white" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("Info")}
        >
          Info
        </button>
        <button
          className={`px-4 py-2 font-sans font-bold ${
            activeTab === "about" ? "text-white border-b-4 border-spotify-green" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("about")}
        >
          {isOwnProfile ? "About Me" : `About ${userData?.display_name}`}
        </button>
        {isOwnProfile && (
          <button
            className={`px-4 py-2 font-sans font-bold ${
              activeTab === "settings" ? "text-white border-b-4 border-spotify-green" : "text-gray-300"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        )}
      </div>

      {/* Active Tab Content */}
      <div className="py-2 px-10 mt-6 bg-spotify-dark-gray w-full">{renderSection()}</div>
    </div>
  );
}
