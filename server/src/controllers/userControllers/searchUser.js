import { supabase } from "../../db.js";

export async function searchUsers(searchTerm) {
  if (!searchTerm || typeof searchTerm !== 'string') {
    throw new Error('Término de búsqueda inválido');
  }

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .ilike('display_name', `%${searchTerm}%`)
    .limit(10); 

  if (error) {
    console.error("Error buscando usuarios:", error.message);
    throw error;
  }

  return data;
}

export async function searchUsersById(userId) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('ID de usuario inválido');
  }

  const { data, error } = await supabase
    .from('user')
    .select(`
      *,
      user_top_artist (*),
      user_top_songs (*)
    `)
    .eq('spotify_id', userId)
    .eq('user_top_artist.range', 'long')
    .eq('user_top_songs.range', 'long');

  if (error) {
    console.error("Error buscando usuario:", error.message);
    throw error;
  }

  if (!data || data.length === 0) {
    return null; 
  }

  return data;
}