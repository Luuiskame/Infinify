import { supabase } from './supabaseClient';
import { Artist, Song } from '@/types';

export async function searchUsers(searchTerm: string) {

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .ilike('display_name', `%${searchTerm}%`);

 
  if (error) {
    console.error("Error buscando usuarios:", error.message);
    return [];
  }


  return data;
}

//buscar por id:
export const searchUsersById = async (userId: string) => {
  const { data, error } = await supabase
    .from('user')
    .select(`
      *,
      user_top_artist (*),
      user_top_songs (*)
    `)
    .eq('spotify_id', userId);

  if (error) {
    console.error("Error buscando usuario:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn("No se encontró el usuario");
    return [];
  }

  // Filter related tables to only include items with range = 'long'
  const filteredData = data.map(user => ({
    ...user,
    user_top_artist: user.user_top_artist?.filter((artist: Artist) => artist.range === 'long') || [],
    user_top_songs: user.user_top_songs?.filter((song: Song) => song.range === 'long') || [],
  }));

  return filteredData;
};
