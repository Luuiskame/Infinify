import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Artist, Song } from '@/types';

interface ThingsInCommon {
  songsInCommon: Song[] | [];
  artistInCommon: Artist[] | [];
  genresInCommon: string[] | [];
}

export default function useGetUserCompatibilityNumber(
  favGenres: string[],
  favArtists: Artist[],
  favSongs: Song[]
) {
  const [compatibilityNumber, setCompatibilityNumber] = useState<number>(0);
  const currentUserInfo = useAppSelector(state => state.userReducer.user);

  const [thingsInCommon, setThingsInCommon] = useState<ThingsInCommon>({
    songsInCommon: [],
    artistInCommon: [],
    genresInCommon: []
  });

  // For genres: each common genre adds 0.8 weighted points.
  const calculateRateBasedOnGenre = (): number => {
    const userGenres = currentUserInfo?.user.favorite_genres || [];
    let commonCount = 0;
    userGenres.forEach(genre => {
      if (favGenres.includes(genre)) {
        commonCount += 1;
        console.log(`Genre ${genre} matched!`);
      }
    });
    return commonCount * 0.8;
  };

  // For artists: each common artist adds 1.2 weighted points.
  const calculateBasedOnArtist = (): number => {
    const userFavArtists = currentUserInfo?.user_top_artist_long || [];
    const artistMap: Record<string, boolean> = {};
    userFavArtists.forEach((artist: Artist) => {
      artistMap[artist.artist_id] = true;
    });

    let commonCount = 0;
    favArtists.forEach(artist => {
      if (artistMap[artist.artist_id]) {
        commonCount += 1;
        console.log(`Artist ${artist.artist_name} matched!`);
      }
    });
    return commonCount * 1.2;
  };

  // For songs: each common song adds 1.2 weighted points.
  const calculateBasedOnSongs = (): number => {
    const userFavSongs = currentUserInfo?.user_top_songs_long || [];
    const songMap: Record<string, boolean> = {};
    userFavSongs.forEach(song => {
      songMap[song.song_id] = true;
    });
    
    let commonCount = 0;
    favSongs.forEach(song => {
      if (songMap[song.song_id]) {
        commonCount += 1;
        console.log(`Song ${song.song_name} matched!`);
      }
    });
    return commonCount * 1.2; 
  };

  useEffect(() => {
    // Sum the weighted matches from each category.
    const totalWeightedMatches = 
      calculateRateBasedOnGenre() +
      calculateBasedOnArtist() +
      calculateBasedOnSongs();

      console.log(`Total weighted matches: ${totalWeightedMatches}`);

    // Cap the weighted matches at 30 for the maximum score.
    // Scale the result to a 10-point system.
    const normalizedCompatibility = Math.min(totalWeightedMatches, 30) * (10 / 30);
    setCompatibilityNumber(normalizedCompatibility);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favGenres, favArtists, favSongs, currentUserInfo]);

  return {
    compatibilityNumber,
    thingsInCommon
  };
}
