import axios from 'axios';
import { getAppToken } from '../authControllers/getAppToken.js';
import { getRedisClient } from '../../config/redis.js';
const baseUrl = process.env.SPOTIFY_BASE_URL;
const SONG_INDEX_KEY = 'song_of_the_day:current_index';
const SONG_DATA_KEY = 'song_of_the_day:current_song';
const MAX_INDEX = 14; // 0-14 gives 15 songs
const CACHE_EXPIRY = 43200; // 12 hours in seconds

export const getSongOfTheDay = async (req, res) => {
  let redisClient = null;
  
  try {
    // Get a Redis client for this request
    redisClient = await getRedisClient();
    
    // Check if we have a cached song
    const cachedSong = await redisClient.get(SONG_DATA_KEY);
    
    if (cachedSong) {
      console.log('Returning cached song of the day');
      return res.status(200).json({ songOfTheDay: JSON.parse(cachedSong) });
    }
    

    // If no cached song, get the current index from Redis or initialize it
    let currentIndex = await redisClient.get(SONG_INDEX_KEY);
    
    if (currentIndex === null) {
      currentIndex = 0;
      await redisClient.set(SONG_INDEX_KEY, currentIndex);
    } else {
      currentIndex = parseInt(currentIndex, 10);
    }
    
    console.log('Current song index:', currentIndex);

    // Get access token
    const appToken = await getAppToken();

    const playlistId = '65dJwQvalyEwX1C30toUVc?si=pKa91PSfTLuF9mYuPf-MlA'; 

    const playlistResponse = await axios.get(`${baseUrl}playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });

    // Extract tracks from the response
    const tracks = playlistResponse.data.tracks?.items || [];
    if (tracks.length === 0) {
      console.error('No tracks found in the playlist');
      return res.status(404).json({ error: 'No songs found in the playlist' });
    }

    if(currentIndex >= tracks.length) {
      currentIndex = 0
    }

    // Check if the index is valid
    if (currentIndex < 0 || currentIndex >= tracks.length) {
      console.error('Invalid index:', currentIndex);
      return res.status(400).json({ error: 'Invalid index for the playlist' });
    }

    // Get the song at the specified index
    const selectedSong = tracks[currentIndex].track;

    if (!selectedSong) {
      console.error('Song not found at the specified index');
      return res.status(500).json({ error: 'Unable to find song at the specified index' });
    }

    const songDetails = {
      songName: selectedSong.name,
      artists: selectedSong.artists.map(artist => artist.name),
      albumName: selectedSong.album.name,
      albumImageUrl: selectedSong.album.images[0]?.url,
      spotifyUrl: selectedSong.external_urls.spotify,
    };

    // Store the song in Redis with 12-hour expiry
    await redisClient.set(SONG_DATA_KEY, JSON.stringify(songDetails), {
      EX: CACHE_EXPIRY
    });
    
    // Increment the index for next time and handle rollover
    const nextIndex = currentIndex >= MAX_INDEX ? 0 : currentIndex + 1;
    await redisClient.set(SONG_INDEX_KEY, nextIndex);
    
    return res.status(200).json({ songOfTheDay: songDetails });

  } catch (error) {
    console.error('Error fetching song of the day:', error);
    return res.status(500).json({
      error: 'Error fetching song of the day',
      errorDetails: error.response ? error.response.data : error.message,
    });
  } finally {
    // Close the Redis connection when done
    if (redisClient) {
      await redisClient.disconnect();
    }
  }
};