'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../redux/hooks';
import { useGetUserProfileInfoQuery } from '@/services/profileApi';
import { setUser } from '@/slices/userSlice';
import { setChat, setTotalUnreadMessages } from '@/slices/chatSlice';
import Loading from '../Loading/Loading';
import { Chats } from '../../types';

export default function VerifyInfo() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Flag to indicate if tokens have been processed
  const [tokenExtracted, setTokenExtracted] = useState(false);
  const { data, isLoading, error } = useGetUserProfileInfoQuery({}, { skip: !tokenExtracted });

  // Extract tokens from URL hash on first load.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');

        if (accessToken) {
          // Store tokens in localStorage (or consider Redux for additional security)
          localStorage.setItem('spotify_access_token', accessToken);
          localStorage.setItem('spotify_refresh_token', refreshToken || '');
          localStorage.setItem('spotify_expires_in', expiresIn || '');
          
          // Clear the URL fragment for security/cleanliness
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
      // Set tokenExtracted to true if token exists in localStorage or was just extracted.
      if (localStorage.getItem('spotify_access_token')) {
        setTokenExtracted(true);
      }
    }
  }, []);

  // Once profile data is fetched, update Redux and redirect.
  useEffect(() => {
    if (data && !error) {
      dispatch(setUser(data));
      const newChats = data?.user_chats.map((chat: Chats) => ({
        ...chat,
        chat_messages: [],
        isFetched: false,
      }));
      dispatch(setChat(newChats));
      dispatch(setTotalUnreadMessages(data?.total_unread_messages));
      router.push(`/profile/${data?.user?.spotify_id}`);
    }
  }, [data, error, dispatch, router]);

  if (!tokenExtracted || isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        Error: { 'status' in error ? error.status : error.message }
      </div>
    );
  }

  // Optionally, if everything is loaded, you might render nothing or a simple message.
  return (
    <div className='bg-spotify-black'>
      <Loading />
    </div>
  );
}
