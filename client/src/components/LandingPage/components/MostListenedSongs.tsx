import React, { useState } from "react";
import Image from "next/image";
import { Artist, Song } from "@/types";

// redux
import { useGetPopularArtistPopularSongsQuery } from "@/services/spotifyApi";
import MusicPlayer from "@/components/Musicplayer/MusicPlayer";
import BottomPlayer from "@/components/Musicplayer/BottomPlayer";

interface Props {
  artistId: string;
}

export default function MostListenedSongs({ artistId }: Props) {
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);;
  const [playingSongUrl, setPlayingSongUrl] = useState<string | null>(null);
  console.log(artistId);
  const { data, error, isLoading } = useGetPopularArtistPopularSongsQuery(artistId);

  const songs = data?.tracks?.slice(0, 5); 
  console.log("songs", songs);

  const handlePlay = (songUrl: string) => {
    setPlayingSongUrl(songUrl); 
  };

 
  const handleClosePlayer = () => {
    setPlayingSongUrl(null);
  };
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading songs.</p>;

  return (
    <div className="w-[100%] mx-auto flex flex-col gap-[1rem] bg-spotify-light-gray rounded pt-3 pb-5">
    {songs?.map((song: Song) => (
      <div key={song?.id} className="flex gap-[.3em] pl-2">
        {/* Album Information */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredSongId(song.id)} // Establece el ID de la canción hovereada
          onMouseLeave={() => setHoveredSongId(null)} // Restablece el estado cuando el hover termina
        >
          <Image
            src={song?.album?.images[0]?.url}
            alt={`${song?.album?.name} cover`}
            width={50}
            height={100}
            className="rounded-lg"
          />
          {hoveredSongId === song.id && ( // Muestra el ícono solo si el ID coincide
            <div className="absolute inset-0 flex items-center justify-center">
              <MusicPlayer onPlay={() => handlePlay(song.id)} />
            </div>
          )}
        </div>
        <div>
          <h3>{song?.name}</h3>
          {song.album?.artists?.map((artist: Artist) => (
            <p key={artist?.id}>{artist?.name}</p>
          ))}
        </div>
      </div>
    ))}

    <BottomPlayer songUrl={playingSongUrl} onClose={handleClosePlayer}  />
  </div>
  );
}