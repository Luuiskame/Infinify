import axios from 'axios';
import { getAppToken } from '../authControllers/getAppToken.js';

const baseUrl = process.env.SPOTIFY_BASE_URL;

export const getSongOfTheDay = async (req, res) => {
  try {
    const appToken = await getAppToken();

    const playlistId = '0Hm1tCeFv45CJkNeIAtrfF?si=ff5da50493174f21'; // HAS TO BE A USER PLAYLIST

    const playlistResponse = await axios.get(`${baseUrl}playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    });

    console.log('Playlist Response:', JSON.stringify(playlistResponse.data, null, 2));

    // Extract tracks from the response
    const tracks = playlistResponse.data.tracks?.items || [];
    if (tracks.length === 0) {
      console.error('No tracks found in the playlist');
      return res.status(404).json({ error: 'No songs found in the playlist' });
    }

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomSong = tracks[randomIndex].track;

    if (!randomSong) {
      console.error('Random song is null', tracks[randomIndex]);
      return res.status(500).json({ error: 'Unable to select a random song' });
    }

    const selectedSong = {
      songName: randomSong.name,
      artists: randomSong.artists.map(artist => artist.name),
      albumName: randomSong.album.name,
      albumImageUrl: randomSong.album.images[0]?.url,
      spotifyUrl: randomSong.external_urls.spotify,
    };

    return res.status(200).json({ songOfTheDay: selectedSong });
  } catch (error) {
    console.error('Error fetching song of the day:', error);
    return res.status(500).json({
      error: 'Error fetching song of the day',
      errorDetails: error.response ? error.response.data : error.message,
    });
  }
};
