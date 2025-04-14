import express from 'express'
// import supabase from '../db'
import crypto from 'crypto';
import querystring from 'querystring';

import { getUserToken } from '../controllers/authControllers/getUserToken.js'
import { getPopularArtist } from '../controllers/spotifyControllers/getAPopularArtist.js';
import { getPopularArtistSong } from '../controllers/spotifyControllers/getPopularArtistSong.js';
import { getGenreOfTheDay } from '../controllers/spotifyControllers/getGenreOfTheDay.js';
import { topGlobalSongs } from '../controllers/spotifyControllers/getTopGlobalSongs.js';
import { getSongOfTheDay } from '../controllers/spotifyControllers/getSongOfTheDay.js';

import { getUserInfo } from '../controllers/userControllers/getUserInfo.js';
import { getNewUsertoken } from '../controllers/authControllers/getNewUserToken.js';

import { createChats } from '../controllers/chatControllers/createChats.js';
import { getChatMessages } from '../controllers/chatControllers/getChatMessages.js';
import { getUserRangeData } from '../controllers/userControllers/getUserRangeData.js';
import { getCompareData } from '../controllers/profileControllers/getCompareData.js';
import { searchUsers, searchUsersById } from '../controllers/userControllers/searchUser.js';
import { getRecentUsers } from '../controllers/userControllers/getRecentUsers.js';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const redirectUri = process.env.SPOTIFY_REDIRECT_URI; 
const scopes = 'user-read-private user-read-email user-top-read user-read-playback-state'; // Adjust scopes as needed
const stateKey = 'spotify_auth_state'

const routes = express.Router()

routes.get('/login', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex'); // Generate a random state
    const authorizeUrl = 'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
      });
  
    // Optionally, save the state in the session or cookies for verification later  
    res.cookie(stateKey, state)
    console.log(stateKey, state)
    res.redirect(authorizeUrl);
  });

routes.get('/callback', getUserToken)

// spotify req
routes.get('/any-popular-artist', getPopularArtist)
routes.post('/popular-artist/songs', getPopularArtistSong)

//genre of the day related
routes.get('/genre-of-the-day', getGenreOfTheDay)

//global top songs
routes.get('/top-global-songs', topGlobalSongs)

//song of the day
routes.get('/song-of-the-day', getSongOfTheDay)

// users profile info
routes.post('/get-profile', getUserInfo)
routes.get('/get-user-refresh-token', getNewUsertoken)
routes.get('/get-user-range-info/:range', getUserRangeData)
routes.get('/profile/:userId/compare', getCompareData)

//chats
routes.post('/chats', createChats)
routes.get('/chats/messages/:chatId', getChatMessages)


//search users
//busqueda con nombre
routes.get('/search-users', async (req, res) => {
  try {
    const { q } = req.query; // Obtener el término de búsqueda de los query params
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const results = await searchUsers(q);
    res.json(results);
  } catch (error) {
    console.error('Error en la ruta de búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});


// Búsqueda de usuario por ID
routes.get('/search-users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Se requiere un ID de usuario' });
    }
    
    const user = await searchUsersById(userId);
    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(user[0]); // Devuelve el primer usuario encontrado
  } catch (error) {
    console.error('Error en la ruta de búsqueda por ID:', error);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});


//get recently users
routes.get('/get-recent-users', async (req, res) => {
  try {
    const { limit, userId } = req.query;
    if (!limit) {
      return res.status(400).json({ error: 'Se requiere el número de usuarios' });
    }
    
    const users = await getRecentUsers(limit, userId);
    res.json(users);
  } catch (error) {
    console.error('Error en la ruta de búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});

export default routes
