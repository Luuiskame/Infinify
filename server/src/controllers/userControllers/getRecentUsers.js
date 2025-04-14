import { supabase } from "../../db.js"; 

export const getRecentUsers = async (limit, userId) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("user")
        .select("*, user_top_artist(*), user_top_songs(*)")
        .eq("user_top_artist.range", "long")
        .eq("user_top_songs.range", "long")
        .not("id", "eq", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return {
          error: `error when getting ${limit} users`,
          errorDetails: error,
        };
      }

      return data;
    } else {
        const { data, error } = await supabase
        .from("user")
        .select("*, user_top_artist(*), user_top_songs(*)").eq("user_top_artist.range", "long").eq("user_top_songs.range", "long")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return {
          error: `error when getting ${limit} users`,
          errorDetails: error,
        };
      }

      return data;
    }
  } catch (error) {
    return {
      error: "error when getting users from database",
      errorDetails: error,
    };
  }
};

