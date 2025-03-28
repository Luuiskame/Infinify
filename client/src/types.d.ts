export interface Artist {
    artist_id: string;
    artist_name: string;
    artist_photo:string;
    artist_uri: string 
    popularity: number;
    range: string;
}


export interface Song {
  artist_id: string;
  artist_name: string;
  song_id: string;
  song_image: string;
  song_name: string;
  song_uri: string;
  range: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  href: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  track: Song;
}

export interface UserTopArtistList {
  items: Artist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
}

interface UserTopSongs {
  items: Song[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

interface userTopGenres {
  favorite_genres: string[];
}

export interface Userinfo {
  spotify_id: string;
  id: string;
  country: string;
  display_name: string;
  email: string;
  followers: number;
  uri: string;
  profile_photo: string;
  user_top_artist_long: Artist[];
    user_top_artist_medium: Artist[];
    user_top_artist_short: Artist[];
  
    user_top_songs_long: Song[];
    user_top_songs_medium: Song[];
    user_top_songs_short: Song[];
  favorite_genres: string[];
  about: string;
  
  country: string,
  created_at: string

}

export interface Chats {
  chatInfo: Chat
  chat_participants: ChatParticipant[]
  chat_messages: ChatMessage[] 
  isFetched: boolean
}

export interface ChatParticipant {
  chat_id: string;
  display_name: string
  is_admin: boolean;
  joined_at: string;
  profile_photo: string;
  user_id: string
}

export interface Chat {
  id: string
  chat_type: 'direct' | 'group'
  chat_name: string | null
  created_at: string
  updated_at: string
  last_message_at: string
  unread_messages: number
}

export interface ChatParticipant {
  chat_id: string
  user_id: string
  joined_at: string
  last_read_at: string
  is_admin: boolean
}

export interface ChatMessage {
  id: string
  chat_id: string
  sender_id: string
  profile_photo: string
  display_name: string
  content: string
  created_at: string
  updated_at: string
  is_edited: boolean
  read: boolean
} 
