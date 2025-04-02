import axios from 'axios';
import { getAppToken } from '../authControllers/getAppToken.js';
import { getRedisClient } from '../../config/redis.js';

const baseUrl = process.env.SPOTIFY_BASE_URL;
const POPULAR_ARTISTS_KEY = 'popular_artists:list';
const CACHE_EXPIRY = 6; // 12 hours in seconds

export const getPopularArtist = async (req, res) => {
  let redisClient = null;
  
  try {
    // Get a Redis client for this request
    redisClient = await getRedisClient();
    
    // Check if we have cached artists data
    const cachedArtists = await redisClient.get(POPULAR_ARTISTS_KEY);
    
    let artists = [];
    if (cachedArtists) {
      console.log('Using cached popular artists list');
      artists = JSON.parse(cachedArtists);
    } else {
      // If no cached data, fetch from Spotify API
      const limit = 8; // Fetch 5 artists
      
      // Ensure we have a valid app token
      const accessToken = await getAppToken();

      // Make the request to Spotify
      const response = await axios.get(`${baseUrl}search?q=genre:pop&type=artist&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Extract just the artists array
      artists = response.data.artists.items;
      
      // Store the artists array in Redis with 12-hour expiry
      await redisClient.set(POPULAR_ARTISTS_KEY, JSON.stringify(artists), {
        EX: CACHE_EXPIRY
      });
    }
    
    // Select a random artist from the 5 artists
    const randomIndex = Math.floor(Math.random() * artists.length);
    const randomArtist = artists[randomIndex];
    
    // Process the data to return a more formatted response
    const artistDetails = {
      name: randomArtist.name,
      id: randomArtist.id,
      popularity: randomArtist.popularity,
      followers: randomArtist.followers.total,
      genres: randomArtist.genres,
      imageUrl: randomArtist.images.length > 0 ? randomArtist.images[0].url : null,
      spotifyUrl: randomArtist.external_urls.spotify
    };
    
    // Respond with the random artist data
    res.status(200).json({ 
      artist: artistDetails,
      message: `Randomly selected from ${artists.length} popular artists`
    });
    
  } catch (error) {
    console.error('Error fetching popular artists:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular artist',
      details: error.response ? error.response.data : error.message
    });
  } finally {
    // Close the Redis connection when done
    if (redisClient) {
      await redisClient.disconnect();
    }
  }
};