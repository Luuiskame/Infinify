import { supabase } from './supabaseClient';

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
    .eq('spotify_id', userId)
    .eq('user_top_artist.range', 'long') // Filter at the database level
    .eq('user_top_songs.range', 'long'); // Filter at the database level

  if (error) {
    console.error("Error buscando usuario:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn("No se encontró el usuario");
    return [];
  }

  return data; // No need for additional filtering
};

