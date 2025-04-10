import { supabase } from "../../db.js";

export const getCompareData = async (req, res) => {
    const { userId } = req.params; // Extract 'userId' from query parameters

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Fetch both long and short range data in parallel with the same query structure
        const [longRangeResult, shortRangeResult] = await Promise.all([
            supabase
                .from("user")
                .select(`
                    favorite_genres,
                    user_top_artist (*),
                    user_top_songs (*)
                `)
                .eq("spotify_id", userId)
                .eq('user_top_artist.range', 'long')
                .eq('user_top_songs.range', 'long')
                .single(),

            supabase
                .from("user")
                .select(`
                    user_top_artist (*),
                    user_top_songs (*)
                `)
                .eq("spotify_id", userId)
                .eq('user_top_artist.range', 'short')
                .eq('user_top_songs.range', 'short')
                .single()
        ]);

        // Check for errors in either query
        if (longRangeResult.error) {
            console.error("Error fetching long range data:", longRangeResult.error.message);
            return res.status(500).json({ error: "Failed to fetch long range data" });
        }

        if (shortRangeResult.error) {
            console.error("Error fetching short range data:", shortRangeResult.error.message);
            return res.status(500).json({ error: "Failed to fetch short range data" });
        }

        // Combine the data, taking only the first short-term artist and song
        const responseData = {
            favorite_genres: longRangeResult.data?.favorite_genres || [],
            long_term: longRangeResult.data,
            short_term: {
                user_top_artist: shortRangeResult.data?.user_top_artist?.[0] || null,
                user_top_songs: shortRangeResult.data?.user_top_songs?.[0] || null
            }
        };

        return res.json(responseData);
    } catch (error) {
        console.error("Unexpected error:", error.message);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};