import axios from 'axios';
import { getAppToken } from "../authControllers/getAppToken.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the genres JSON file
const genresJsonInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../genres.json'), 'utf8')
);

const baseUrl = 'https://api.spotify.com/v1/';

/**
 * Fetches 5 songs from a randomly selected genre
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Object containing 5 songs from a genre
 */

export const getGenreOfTheDay = async (req, res) => {
  const fullResponse = {
    genreName: '',
    songs: [],
    genreInfo: {}
  };

  try {
    // Get app token for Spotify API authentication
    const appToken = await getAppToken();
    
    // Select a random genre from the imported genres.json file
    const genresLength = genresJsonInfo.length;
    const randomGenreIndex = Math.floor(Math.random() * genresLength);
    const selectedGenre = genresJsonInfo[randomGenreIndex];
    const genre = selectedGenre.name;
    
    // Set the genre info in the response
    fullResponse.genreName = genre;
    fullResponse.genreInfo = selectedGenre;
    
    // First try to get songs from playlists
    try {
      const songs = await getGenreSongs(appToken, genre);
      if (Array.isArray(songs) && songs.length > 0) {
        fullResponse.songs = songs;
      } else {
        // Fallback to direct track search if playlist search returned no songs
        fullResponse.songs = await directTrackSearch(appToken, genre);
      }
    } catch (error) {
      console.log('Playlist search failed, falling back to direct track search:', error.message);
      fullResponse.songs = await directTrackSearch(appToken, genre);
    }
    
    // If still no songs, try one more generic search as last resort
    if (fullResponse.songs.length === 0) {
      console.log('No songs found through regular methods, trying generic search');
      fullResponse.songs = await lastResortSearch(appToken, genre);
    }
    
    res.status(200).json(fullResponse);
  } catch (error) {
    res.status(500).json({
      error: "Error when getting genre songs",
      errorDetails: error.message || error
    });
  }
};

/**
 * Helper function to get songs from a genre playlist
 * @param {string} appToken - Spotify API token
 * @param {string} genre - Genre name
 * @returns {Promise<Array>} Array of song objects
 */
const getGenreSongs = async (appToken, genre) => {
  try {
    // Format query to improve search results
    const searchQuery = encodeURIComponent(`${genre} playlist`);
    
    // Search for playlists related to the genre
    const playlistSearchResponse = await axios.get(
      `${baseUrl}search?q=${searchQuery}&type=playlist&limit=10`, 
      {
        headers: {
          Authorization: `Bearer ${appToken}`
        }
      }
    );
    
    // If no playlists found, throw an error to trigger fallback
    if (!playlistSearchResponse.data.playlists?.items || 
        playlistSearchResponse.data.playlists.items.length === 0) {
      throw new Error("No playlists found for this genre");
    }
    
    // Filter out playlists with no id
    const validPlaylists = playlistSearchResponse.data.playlists.items.filter(
      playlist => playlist && playlist.id
    );
    
    if (validPlaylists.length === 0) {
      throw new Error("No valid playlists found for this genre");
    }
    
    // Try playlists until we find one with tracks
    // Shuffle the playlists to avoid always trying the same ones
    const shuffledPlaylists = [...validPlaylists].sort(() => 0.5 - Math.random());
    
    // We'll try up to 3 playlists to find valid tracks
    const playlistsToTry = shuffledPlaylists.slice(0, 3);
    
    for (const selectedPlaylist of playlistsToTry) {
      try {
        // Get the tracks from the selected playlist
        const playlistTracksResponse = await axios.get(
          `${baseUrl}playlists/${selectedPlaylist.id}/tracks?limit=10`, 
          {
            headers: {
              Authorization: `Bearer ${appToken}`
            }
          }
        );
        
        // Skip if no tracks
        if (!playlistTracksResponse.data.items || 
            playlistTracksResponse.data.items.length === 0) {
          continue;
        }
        
        // Map the tracks to the format specified
        const songs = playlistTracksResponse.data.items.map(item => {
          // Skip null tracks (can happen with removed songs)
          if (!item || !item.track) return null;
          
          // Check if album and images exist before accessing them
          const albumImageUrl = item.track.album?.images && 
                              item.track.album.images.length > 0 ? 
                              item.track.album.images[0].url : null;
                              
          return {
            id: item.track.id,
            albumImageUrl: albumImageUrl,
            albumName: item.track.album?.name || "Unknown Album",
            songName: item.track.name || "Unknown Song",
            artists: item.track.artists && Array.isArray(item.track.artists) ? 
                    item.track.artists.map(artist => artist?.name || "Unknown Artist").join(" / ") : 
                    "Unknown Artist"
          };
        }).filter(song => song !== null); // Remove any null entries
        
        // If we have at least one song, return it
        if (songs.length > 0) {
          // Only return up to 5 songs
          return songs.slice(0, 5);
        }
      } catch (error) {
        console.error(`Error with playlist ${selectedPlaylist.id}:`, error.message);
        // Continue to try the next playlist
      }
    }
    
    // If we reach here, none of the playlists had valid tracks
    throw new Error("No valid tracks found in any playlist");
  } catch (error) {
    console.error("Error in getGenreSongs:", error.message);
    throw error; // Re-throw to trigger fallback
  }
};

/**
 * Fallback function to search tracks directly
 * @param {string} appToken - Spotify API token
 * @param {string} genre - Genre name
 * @returns {Promise<Array>} Array of song objects
 */
const directTrackSearch = async (appToken, genre) => {
  try {
    // Format query strings differently for certain genres that might have dashes
    const searchQuery = encodeURIComponent(genre.replace(/-/g, ' '));
    
    // Direct search for tracks
    const trackSearchResponse = await axios.get(
      `${baseUrl}search?q=${searchQuery}&type=track&limit=5`, 
      {
        headers: {
          Authorization: `Bearer ${appToken}`
        }
      }
    );
    
    if (!trackSearchResponse.data.tracks?.items || 
        trackSearchResponse.data.tracks.items.length === 0) {
      // If genre with hyphens doesn't work, try without specific genre
      // Just search for music with similar mood
      if (genre.includes('-')) {
        const moodWord = genre.split('-')[0]; // Use first word of hyphenated genre
        const alternateResponse = await axios.get(
          `${baseUrl}search?q=${encodeURIComponent(moodWord + ' music')}&type=track&limit=5`, 
          {
            headers: {
              Authorization: `Bearer ${appToken}`
            }
          }
        );
        
        if (alternateResponse.data.tracks?.items && 
            alternateResponse.data.tracks.items.length > 0) {
          return formatSongs(alternateResponse.data.tracks.items);
        }
      }
      
      // If all else fails, search by the relevant artist
      const relevantGenre = genresJsonInfo.find(g => g.name === genre);
      const relevantArtist = relevantGenre?.relevantArtist;
      
      if (relevantArtist) {
        const artistResponse = await axios.get(
          `${baseUrl}search?q=${encodeURIComponent(relevantArtist)}&type=track&limit=5`, 
          {
            headers: {
              Authorization: `Bearer ${appToken}`
            }
          }
        );
        
        if (artistResponse.data.tracks?.items && 
            artistResponse.data.tracks.items.length > 0) {
          return formatSongs(artistResponse.data.tracks.items);
        }
      }
      
      // Last resort - return empty array instead of error object
      return [];
    }
    
    // Map the tracks to the format specified
    return formatSongs(trackSearchResponse.data.tracks.items);
  } catch (error) {
    console.error("Error in directTrackSearch:", error.message);
    // Return empty array instead of error object
    return [];
  }
};

/**
 * Last resort function that does a generic search for popular music
 * @param {string} appToken - Spotify API token
 * @param {string} genre - Original genre name (for reference)
 * @returns {Promise<Array>} Array of song objects
 */
const lastResortSearch = async (appToken, genre) => {
  try {
    console.log(`Using last resort search for genre: ${genre}`);
    
    // Try to search for popular tracks as a last resort
    const lastResortResponse = await axios.get(
      `${baseUrl}search?q=${encodeURIComponent('popular music')}&type=track&limit=5`, 
      {
        headers: {
          Authorization: `Bearer ${appToken}`
        }
      }
    );
    
    if (lastResortResponse.data.tracks?.items && 
        lastResortResponse.data.tracks.items.length > 0) {
      return formatSongs(lastResortResponse.data.tracks.items);
    }
    
    return [];
  } catch (error) {
    console.error("Error in lastResortSearch:", error.message);
    return [];
  }
};

/**
 * Helper function to format song data consistently
 * @param {Array} songs - Array of Spotify track objects
 * @returns {Array} Formatted song objects
 */
const formatSongs = (songs) => {
  return songs.map(song => {
    if (!song) return null;
    
    const albumImageUrl = song.album?.images && 
                         song.album.images.length > 0 ? 
                         song.album.images[0].url : null;
    
    return {
      id: song.id,
      albumImageUrl: albumImageUrl,
      albumName: song.album?.name || "Unknown Album",
      songName: song.name || "Unknown Song",
      artists: song.artists && Array.isArray(song.artists) ? 
              song.artists.map(artist => artist?.name || "Unknown Artist").join(" / ") : 
              "Unknown Artist"
    };
  }).filter(song => song !== null);
};