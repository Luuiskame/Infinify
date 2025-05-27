'use client';

import ConnectHeader from '@/components/Connect/ConnectHeader';
import ConnectCard from '@/components/Connect/ConnectCard';
import { useState, useEffect } from 'react';
import { Artist, Song } from '@/types';

import { useAppSelector } from "@/redux/hooks"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetRecentUsersQuery } from '@/services/getUsersApi';

interface UserResponse {
  favorite_genres: string[];
  user_top_songs: Song[];
  user_top_artist: Artist[];
  country: string;
  display_name: string;
  profile_photo: string;
  spotify_id: string
}

export default function Page() {
  const [data, setCurrentData] = useState<UserResponse[]>([]);
  const [message, setMessage] = useState<string>('Meet The New Infify Members') // Set default message
  const [loading, setLoading] = useState<boolean>(true) // Start with loading true
  const [activeButton, setActiveButton] = useState<string>('recent') // Set default active button

  const userId = useAppSelector(state => state.userReducer?.user?.user.id) as string

    console.log(userId)

  const {data: recentUsers, isLoading: isLoadingData} = useGetRecentUsersQuery({ limit: 5, userId: userId });


  //! to do next: use effect having dep arr with active button, based on that fetchLastestUsers needs to be remake to handle all different cases which should be done within this function
  const fetchLastestUsers = async () => {
    setLoading(true);
    try {
      setCurrentData([...recentUsers]);
      console.log(recentUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Optionally handle error state here
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent users on component mount

  //! when the user refresh the page, we could see same user repeated if its recent
 useEffect(() => {
  if (recentUsers) {
    setCurrentData(recentUsers);
    setLoading(false);
  }
}, [recentUsers]);

  const fetchFilter = async (filterType: string) => {
    switch (filterType) {
      case 'recent':
        setActiveButton('recent');
        setMessage('Meet New Members');
        await fetchLastestUsers();
        break;
      case 'taste':
        setActiveButton('taste');
        setMessage('Users with a similar taste');
        // setCurrentData(fakeUsers2);
        break;
      case 'match':
        setActiveButton('match');
        setMessage('Let us find your ideal music partner');
        // setCurrentData(fakeUsers3);
        break;
      default:
        setCurrentData([]);
        break;
    }
  };

  if (loading || isLoadingData) {
    return (
      <section className="bg-spotify-dark-gray w-[90%] mx-auto md:w-[100%] md:ml-5 h-[100dvh] flex flex-col gap-[1rem]">
        {/* Skeleton para el encabezado (ConnectHeader) */}
        <div className="flex justify-between items-center p-4">
          <Skeleton height={40} width={200} baseColor="#121212" highlightColor="#222" />
          <div className="flex gap-2">
            <Skeleton height={40} width={100} baseColor="#121212" highlightColor="#222" />
            <Skeleton height={40} width={100} baseColor="#121212" highlightColor="#222" />
          </div>
        </div>
  
        {/* Skeleton para el título (h2) */}
        <Skeleton
          height={32}
          width={300}
          className="mx-auto md:mx-0 mt-5"
          baseColor="#121212"
          highlightColor="#222"
        />
  
        {/* Skeleton para las tarjetas de usuario (ConnectCard) */}
        <div className="flex flex-col gap-4 max-w-[450px] w-[100%]">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-spotify-light-gray rounded-lg">
              <Skeleton circle height={64} width={64} baseColor="#121212" highlightColor="#222" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton height={20} width={170} baseColor="#121212" highlightColor="#222" />
                <Skeleton height={16} width={170} baseColor="#121212" highlightColor="#222" />
                <Skeleton height={16} width={170} baseColor="#121212" highlightColor="#222" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-spotify-dark-gray min-h-[1100px] w-[90%] mx-auto md:w-[100%] md:mb-[4rem] md:ml-5 h-[100dvh] flex flex-col gap-[1rem] ">
      <ConnectHeader fetchFilter={fetchFilter} activeButton={activeButton} />
      <h2 className='text-center md:text-start mt-5 text-[1.8rem] font-extrabold'>{message}</h2>

      {data.map((user) => (
        <ConnectCard
          key={user.display_name}
          country={user.country}
          display_name={user.display_name}
          profile_photo={user.profile_photo}
          spotify_id={user.spotify_id}
          favGenres={user.favorite_genres}
          favArtists={user.user_top_artist}
          favSongs={user.user_top_songs}
        />
      ))}
    </div>
  );
}