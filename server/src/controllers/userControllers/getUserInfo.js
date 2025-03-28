import axios from "axios";
import { registerUserDb, verifyUserExist } from "./registerUserOrExisting.js";

export const getUserInfo = async (req, res) => {
  console.log("All Cookies:", req.cookies);
  console.log("Spotify Access Token Cookie:", req.cookies.spotify_access_token);

  const access_token = req.body.token;
  const refresh_token = req.body.refresh_token;

  console.log("Access Token:", access_token);
  console.log("Refresh Token:", refresh_token);

  if (!access_token) {
    console.warn("Access token is undefined or empty");
    return res.status(401).json({
      error: "No access token found",
      details: "Token might be blocked due to browser privacy settings",
    });
  }

  try {
    // 1. Fetch user profile info
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = {
      country: response?.data.country,
      display_name: response?.data.display_name,
      email: response?.data.email,
      spotify_id: response?.data.id,
      followers: response?.data.followers.total,
      uri: response?.data.uri,
      profile_photo: response?.data.images?.[0]?.url || null,
      refresh_token: refresh_token,
    };

    // 2. Check if user already exists
    const userExist = await verifyUserExist(userInfo.spotify_id, req);
    if (userExist.success === true) {
      return res.status(200).json(userExist);
    }

    // 3. Fetch top tracks for all time ranges
    const userTopSongsLong = await getTopUserSongsOrTracks(
      access_token,
      "tracks",
      "long_term",
      50
    );
    const userTopSongsMedium = await getTopUserSongsOrTracks(
      access_token,
      "tracks",
      "medium_term",
      25
    );
    const userTopSongsShort = await getTopUserSongsOrTracks(
      access_token,
      "tracks",
      "short_term",
      15
    );

    // Combine all songs
    const allUserTopSongs = [
      ...userTopSongsLong,
      ...userTopSongsMedium,
      ...userTopSongsShort,
    ];

    // 4. Fetch top artists for all time ranges
    const userTopArtistsLong = await getTopUserSongsOrTracks(
      access_token,
      "artists",
      "long_term",
      50
    );
    const userTopArtistsMedium = await getTopUserSongsOrTracks(
      access_token,
      "artists",
      "medium_term",
      25
    );
    const userTopArtistsShort = await getTopUserSongsOrTracks(
      access_token,
      "artists",
      "short_term",
      15
    );

    // Combine all artists
    const allUserTopArtists = [
      ...userTopArtistsLong,
      ...userTopArtistsMedium,
      ...userTopArtistsShort,
    ];
    console.log('all artist',allUserTopArtists);

    // 5. Register the user in the DB (inserts user, top songs, top artists, etc.)
    const newUser = await registerUserDb(
      userInfo,
      allUserTopArtists,
      allUserTopSongs,
      req
    );

    if (newUser.success === true) {
      console.log(newUser);
      return res.status(200).json(newUser);
    } else {
      console.log(newUser.error);
      return res.status(400).json(newUser.error);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "error when getting users info", errorDetails: error });
  }
};

const getTopUserSongsOrTracks = async (access_token, type, timeRange, limit) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const items = response.data.items;
    if (!items || items.length === 0) {
      return [];
    }

    // Derive "long", "medium", or "short" from timeRange
    let rangeValue = 'long';
    if (timeRange === 'medium_term') rangeValue = 'medium';
    if (timeRange === 'short_term') rangeValue = 'short';

    if (type === 'tracks') {
      return items.map((topItem) => ({
        song_name: topItem.name,
        song_id: topItem.id,
        song_uri: topItem.uri,
        song_image: topItem.album?.images[0]?.url,
        artist_id: topItem.artists[0]?.id,
        artist_name: topItem.artists[0]?.name,
        // NEW: store the range
        range: rangeValue
      }));
    } else if (type === 'artists') {
      return items.map((topItem) => ({
        artist_name: topItem.name,
        artist_id: topItem.id,
        artist_uri: topItem.uri,
        artist_photo: topItem.images[0]?.url,
        unfilteredGenres: topItem.genres,
        // NEW: store the range
        range: rangeValue
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching top songs or artists:', error.message);
    return [];
  }
};
