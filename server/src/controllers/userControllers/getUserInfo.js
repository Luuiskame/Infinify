import axios from "axios";
import { registerUserDb, verifyUserExist } from "./registerUserOrExisting.js";




export const getUserInfo = async (req, res) => {
  // Log all cookies for debugging
  console.log('All Cookies:', req.cookies);
  
  // Explicitly log the access token cookie
  console.log('Spotify Access Token Cookie:', req.cookies.spotify_access_token);

  const access_token = req.cookies.spotify_access_token;
  const refresh_token = req.cookies.spotify_refresh_token;

  console.log('Access Token:', access_token);
  console.log('Refresh Token:', refresh_token);

  // Additional checks
  if (!access_token) {
    console.warn('Access token is undefined or empty');
    return res.status(401).json({ 
      error: "No access token found", 
      details: "Token might be blocked due to browser privacy settings" 
    });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
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
      
    //! we send the req to set the userId to our session
    const userExist = await verifyUserExist(userInfo.spotify_id, req);

    if (userExist.success === true) {
      res.status(200).json(userExist)
    } else {
      const userTopSongs = await getTopUserSongsOrTracks(
        access_token,
        "tracks"
      );

      const userTopArtist = await getTopUserSongsOrTracks(
        access_token,
        "artists"
      );

      //! we send the req to set the userId to our session
      const newUser = await registerUserDb( userInfo, userTopSongs, userTopArtist, req );

      if(newUser.success === true){
        console.log(newUser)
        res.status(200).json(newUser)
      } else {
        console.log(newUser.error)
        res.status(400).json(newUser.error)
      }
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "error when getting users info", errorDetails: error });
  }
};

const getTopUserSongsOrTracks = async (access_token, type, limit = 10) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        limit, // Add the limit parameter to the request
      },
    });

    const items = response.data.items;

    if (items && items.length > 0) {
      if (type === 'tracks') {
        return items.map((topItem) => ({
          song_name: topItem.name,
          song_id: topItem.id,
          song_uri: topItem.uri,
          song_image: topItem.album?.images[0]?.url,
          artist_id: topItem.artists[0]?.id,
          artist_name: topItem.artists[0]?.name,
        }));
      } else if (type === 'artists') {
        return items.map((topItem) => ({
          artist_name: topItem.name,
          artist_id: topItem.id,
          artist_uri: topItem.uri,
          artist_photo: topItem.images[0]?.url,
          unfilteredGenres: topItem.genres
        }));
      }
    }
    return []; 
  } catch (error) {
    console.error('Error fetching top songs or artists:', error.message);
    return []; 
  }
};
