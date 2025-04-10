import { supabase } from "../../db.js";

export async function searchUsers(searchTerm) {

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


export async function searchUsersById(userId) {
    try {
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
        return [];
      }
  
      if (!data || data.length === 0) {
        console.warn("No se encontró el usuario");
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("Error inesperado en searchUsersById:", err);
      return [];
    }
  }
  
