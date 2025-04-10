import { supabase } from "../../db.js";

export const getUserRangeData = async (req, res) => {
    const { range } = req.params; // Extract 'range' from URL parameters
    const { userId } = req.query; // Extract 'userId' from query parameters

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
        .eq('user_top_artist.range', range) // Filter at the database level
        .eq('user_top_songs.range', range); // Filter at the database level

    if (error) {
        console.error("Error fetching user:", error.message);
        return res.status(500).json({ error: "Database query failed" });
    }

    if (!data) {
        return res.status(404).json({ error: "User not found" });
    }

    return res.json(data[0]); // ✅ Send as a single object
};
