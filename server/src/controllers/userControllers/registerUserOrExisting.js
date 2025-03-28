import { supabase } from '../../db.js';
import { filteredFavoriteArtists } from '../algorithms/filteredFavoriteArtists.js';

export const registerUserDb = async (userInfo, allUserTopArtists, allUserTopSongs, req) => {
  const favoriteUserGenres = [];
  try {
    const {
      country,
      display_name,
      email,
      spotify_id,
      followers,
      uri,
      profile_photo,
      refresh_token,
    } = userInfo;

    // Collect genres from all top artists
    allUserTopArtists.forEach((artist) => {
      if (artist.unfilteredGenres) {
        favoriteUserGenres.push(artist.unfilteredGenres);
      }
    });

    // Warn if any artist is missing the URI
    allUserTopArtists.forEach(artist => {
      if (!artist.artist_uri) {
        console.warn('Missing artist_uri for artist:', artist);
      }
    });

    // 1. Insert new user
    const filteredFav = filteredFavoriteArtists(favoriteUserGenres, 20);
    const { data: newUser, error: newUserError } = await supabase
      .from("user")
      .insert([
        {
          country,
          display_name,
          email,
          spotify_id,
          followers,
          uri,
          profile_photo,
          refresh_token,
          favorite_genres: [...filteredFav],
        },
      ])
      .select();

    if (newUserError) {
      console.error("Error when inserting new user:", newUserError);
      return {
        success: false,
        error: "Error when inserting new user",
      };
    }

    const userId = newUser[0].id;

    // 2. Insert top artists (long/medium/short all in one array)
    const topArtistData = allUserTopArtists.map((artist) => ({
      user_id: userId,
      artist_name: artist.artist_name,
      artist_id: artist.artist_id,
      artist_photo: artist.artist_photo,
      artist_uri: artist.artist_uri,
      range: artist.range, // <--- store the range
    }));

    const { error: topArtistError } = await supabase
      .from("user_top_artist")
      .insert(topArtistData);

    if (topArtistError) {
      console.error("Error inserting top artist:", topArtistError);
      return {
        success: false,
        error: "Error inserting top artist",
      };
    }

    // 3. Insert top songs (long/medium/short all in one array)
    const topSongData = allUserTopSongs.map((song) => ({
      user_id: userId,
      artist_name: song.artist_name,
      artist_id: song.artist_id,
      song_name: song.song_name,
      song_id: song.song_id,
      song_image: song.song_image,
      song_uri: song.song_uri,
      range: song.range, // <--- store the range
    }));

    const { error: topSongsError } = await supabase
      .from("user_top_songs")
      .insert(topSongData);

    if (topSongsError) {
      console.error("Error inserting top songs:", topSongsError);
      return {
        success: false,
        error: "Error when inserting top songs",
      };
    }

    // Group artists by range in one pass using reduce
    const groupedArtists = allUserTopArtists.reduce((acc, artist) => {
      if (!acc[artist.range]) {
        acc[artist.range] = [];
      }
      acc[artist.range].push(artist);
      return acc;
    }, {});

    const user_top_artist_long = groupedArtists.long || [];
    const user_top_artist_medium = groupedArtists.medium || [];
    const user_top_artist_short = groupedArtists.short || [];

    // Group songs by range in one pass using reduce
    const groupedSongs = allUserTopSongs.reduce((acc, song) => {
      if (!acc[song.range]) {
        acc[song.range] = [];
      }
      acc[song.range].push(song);
      return acc;
    }, {});

    const user_top_songs_long = groupedSongs.long || [];
    const user_top_songs_medium = groupedSongs.medium || [];
    const user_top_songs_short = groupedSongs.short || [];

    // 4. Fetch chat information
    const { data: userChats, error: chatsError } = await supabase
      .from("chat_participants")
      .select(`
        chat_id,
        user_id,
        joined_at,
        is_admin,
        chats (
          id,
          chat_type,
          chat_name,
          last_message_at
        )
      `)
      .eq("user_id", userId);

    let validChats = [];
    let totalUnreadMessages = 0;
    if (!chatsError && userChats) {
      const formattedChats = await Promise.all(
        userChats.map(async (chat) => {
          const { data: allParticipants, error: participantsError } = await supabase
            .from("chat_participants")
            .select(
              "chat_id, user_id, joined_at, is_admin, user:user_id (id, display_name, profile_photo)"
            )
            .eq("chat_id", chat.chat_id);

          const { data: unreadMessages, error: unreadError } = await supabase
            .from("chat_messages")
            .select("id")
            .eq("chat_id", chat.chat_id)
            .eq("read", false)
            .neq("sender_id", userId);

          if (participantsError || unreadError) {
            console.error("Error fetching chat info:", participantsError || unreadError);
            return null;
          }

          const formattedParticipants = allParticipants.map((participant) => ({
            chat_id: participant.chat_id,
            user_id: participant.user_id,
            joined_at: participant.joined_at,
            is_admin: participant.is_admin,
            display_name: participant.user?.display_name,
            profile_photo: participant.user?.profile_photo,
          }));

          return {
            chatInfo: {
              ...chat.chats,
              unread_messages: unreadMessages?.length || 0,
            },
            chat_participants: formattedParticipants,
          };
        })
      );

      validChats = formattedChats.filter((chat) => chat !== null);
      totalUnreadMessages = validChats.reduce(
        (total, chat) => total + (chat.chatInfo.unread_messages || 0),
        0
      );
    }

    console.log("User created successfully and returned");
    return {
      success: true,
      user: {
        ...newUser[0],
      },
      user_top_artist_long,
      user_top_artist_medium,
      user_top_artist_short,
      user_top_songs_long,
      user_top_songs_medium,
      user_top_songs_short,
      user_chats: validChats,
      total_unread_messages: totalUnreadMessages,
    };
  } catch (error) {
    console.error("Error while storing user in the database:", error);
    return {
      success: false,
      error: "An unexpected error occurred while registering the user.",
    };
  }
};




export const verifyUserExist = async (spotify_id, req) => {
  const { data: existingUserWithDetails, error: selectError } = await supabase
    .from('user')
    .select(`*, user_top_artist (*), user_top_songs (*)`)
    .eq('spotify_id', spotify_id);

  if (selectError) {
    console.error('Error when getting user from the database:', selectError);
    return {
      success: false,
      message: 'Error when getting user from the database',
    };
  }

  if (existingUserWithDetails && existingUserWithDetails.length > 0) {
    console.log('User found and data retrieved');

    const user = existingUserWithDetails[0];
    const { user_top_artist, user_top_songs, ...userData } = user;
    const userId = userData.id;

    // Set userId in the session
    if (req && req.session) {
      req.session.userId = userId;
    }

    // Group artists by range (long, medium, short)
    const groupedArtists = (user_top_artist || []).reduce((acc, artist) => {
      if (!acc[artist.range]) {
        acc[artist.range] = [];
      }
      acc[artist.range].push(artist);
      return acc;
    }, {});

    const user_top_artist_long = groupedArtists.long || [];
    const user_top_artist_medium = groupedArtists.medium || [];
    const user_top_artist_short = groupedArtists.short || [];

    // Group songs by range (long, medium, short)
    const groupedSongs = (user_top_songs || []).reduce((acc, song) => {
      if (!acc[song.range]) {
        acc[song.range] = [];
      }
      acc[song.range].push(song);
      return acc;
    }, {});

    const user_top_songs_long = groupedSongs.long || [];
    const user_top_songs_medium = groupedSongs.medium || [];
    const user_top_songs_short = groupedSongs.short || [];

    // Fetch all chats the user is part of
    const { data: userChats, error: chatsError } = await supabase
      .from('chat_participants')
      .select(`
        chat_id,
        user_id,
        joined_at,
        is_admin,
        chats (
          id,
          chat_type,
          chat_name,
          last_message_at
        )
      `)
      .eq('user_id', userId);

    if (chatsError) {
      console.error('Error fetching user chats:', chatsError);
      return {
        success: false,
        message: 'Error fetching user chats',
      };
    }

    // Format chat data with participants and unread messages
    const formattedChats = await Promise.all(
      userChats.map(async (chat) => {
        const { data: allParticipants, error: participantsError } = await supabase
          .from('chat_participants')
          .select(
            'chat_id, user_id, joined_at, is_admin, user:user_id (id, display_name, profile_photo)'
          )
          .eq('chat_id', chat.chat_id);

        const { data: unreadMessages, error: unreadError } = await supabase
          .from('chat_messages')
          .select('id')
          .eq('chat_id', chat.chat_id)
          .eq('read', false)
          .neq('sender_id', userId); // Only count messages not sent by the current user

        if (participantsError || unreadError) {
          console.error('Error fetching chat info:', participantsError || unreadError);
          return null;
        }

        const formattedParticipants = allParticipants.map((participant) => ({
          chat_id: participant.chat_id,
          user_id: participant.user_id,
          joined_at: participant.joined_at,
          is_admin: participant.is_admin,
          display_name: participant.user?.display_name,
          profile_photo: participant.user?.profile_photo,
        }));

        return {
          chatInfo: {
            ...chat.chats,
            unread_messages: unreadMessages?.length || 0,
          },
          chat_participants: formattedParticipants,
        };
      })
    );

    const validChats = formattedChats.filter((chat) => chat !== null);

    // Calculate the total number of unread messages
    const totalUnreadMessages = validChats.reduce(
      (total, chat) => total + (chat.chatInfo.unread_messages || 0),
      0
    );

    return {
      success: true,
      user: userData,
      user_top_artist_long,
      user_top_artist_medium,
      user_top_artist_short,
      user_top_songs_long,
      user_top_songs_medium,
      user_top_songs_short,
      user_chats: validChats,
      total_unread_messages: totalUnreadMessages,
    };
  }

  // User not found
  return {
    success: false,
    message: 'User does not exist',
  };
};
