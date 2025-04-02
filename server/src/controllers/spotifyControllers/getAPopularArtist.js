import axios from 'axios';
import { getAppToken } from '../authControllers/getAppToken.js';
import { getRedisClient } from '../../config/redis.js';

const baseUrl = process.env.SPOTIFY_BASE_URL;
const POPULAR_ARTIST_KEY = 'popular_artist:single';
const CACHE_EXPIRY = 43200; // 12 hours in seconds

export const getPopularArtist = async (req, res) => {
  let redisClient = null;
  
  try {
    // Get a Redis client for this request
    redisClient = await getRedisClient();
    
    // Check if we have a cached artist
    const cachedArtist = await redisClient.get(POPULAR_ARTIST_KEY);
    
    let artistDetails = null;
    if (cachedArtist) {
      console.log('Using cached popular artist');
      artistDetails = JSON.parse(cachedArtist);
    } else {
      // If no cached data, fetch from Spotify API
      console.log('Fetching new popular artist from Spotify API');
      
      // Ensure we have a valid app token
      const accessToken = await getAppToken();
      
      // Make the request to Spotify - we'll request several to pick one
      const limit = 8; // Request multiple artists to choose from
      const response = await axios.get(`${baseUrl}search?q=genre:pop&type=artist&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // Extract the artists array
      const artists = response.data.artists.items;
      
      // Select a random artist from the results
      const randomIndex = Math.floor(Math.random() * artists.length);
      const randomArtist = artists[randomIndex];
      
      // Format the artist details
      artistDetails = {
        name: randomArtist.name,
        id: randomArtist.id,
        popularity: randomArtist.popularity,
        followers: randomArtist.followers.total,
        genres: randomArtist.genres,
        imageUrl: randomArtist.images.length > 0 ? randomArtist.images[0].url : null,
        spotifyUrl: randomArtist.external_urls.spotify
      };
      
      // Store just the single artist in Redis with 12-hour expiry
      await redisClient.set(POPULAR_ARTIST_KEY, JSON.stringify(artistDetails), {
        EX: CACHE_EXPIRY
      });
    }
    
    // Respond with the artist data
    res.status(200).json({
      artist: artistDetails,
      message: 'Popular artist retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching popular artist:', error);
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