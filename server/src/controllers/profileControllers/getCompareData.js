import { supabase } from "../../db.js";

export const getCompareData = async (req, res) => {
    const { userId } = req.params; // Extract 'userId' from query parameters

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const { data, error } = await supabase
        .from("user")
        .select(`
            user_top_artist (*),
            user_top_songs (*)
        `)
        .eq("spotify_id", userId)
        .single(); // Ensure we get only one user

    if (error) {
        console.error("Error fetching user:", error.message);
        return res.status(500).json({ error: "Database query failed" });
    }

    if (!data) {
        return res.status(404).json({ error: "User not found" });
    }

    // Extract and filter only the relevant top artist and songs based on the range
    const responseData = {
        user_top_artist: data.user_top_artist?.filter(artist => artist.range === range) || [],
        user_top_songs: data.user_top_songs?.filter(song => song.range === range) || [],
    };

    return res.json(responseData); // ✅ Send as a single object
};
