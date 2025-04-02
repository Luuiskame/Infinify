import axios from 'axios';
import { getAppToken } from '../authControllers/getAppToken.js';

const baseUrl = process.env.SPOTIFY_BASE_URL;

export const getSongOfTheDay = async (req, res) => {
  const number = 5
  console.log('index', number)

  try {
    const appToken = await getAppToken();

    const playlistId = '65dJwQvalyEwX1C30toUVc?si=pKa91PSfTLuF9mYuPf-MlA'; 

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

    // Check if the index is valid
    if (number < 0 || number >= tracks.length) {
      console.error('Invalid index:', number);
      return res.status(400).json({ error: 'Invalid index for the playlist' });
    }

    // Get the song at the specified index
    const selectedSong = tracks[number].track;

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

    return res.status(200).json({ songOfTheDay: songDetails });

  } catch (error) {
    console.error('Error fetching song of the day:', error);
    return res.status(500).json({
      error: 'Error fetching song of the day',
      errorDetails: error.response ? error.response.data : error.message,
    });
  }
};
