"use client";

import { useState, useEffect } from "react";
import useGetUserCompatibilityNumber from "@/hooks/useGetUserCompatibilityNumber";
import { Artist, Song } from "@/types";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

interface Props {
  favSongs?: Song[];
  favArtists?: Artist[];
  favGenres?: string[];
}

export default function CompatibilityBar({
  favGenres = [],
  favArtists = [],
  favSongs = [],
}: Props) {
  const { compatibilityNumber } = useGetUserCompatibilityNumber(
    favGenres,
    favArtists,
    favSongs
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setIsVisible(true);
  }, []);

  const percentage = compatibilityNumber * 10;

  const getBarColor = (num: number) => {
    const baseColor = "#1DB954"; // spotify-green
    const brighterColor = "#23fa6d"; // brighter green

    if (num <= 3) {
      return `linear-gradient(90deg, ${baseColor} 0%, ${baseColor} 100%)`;
    } else if (num <= 6) {
      return `linear-gradient(90deg, ${baseColor} 0%, ${brighterColor} 120%)`;
    } else {
      return `linear-gradient(90deg, ${baseColor} 0%, ${brighterColor} 70%, #90ff90 120%)`;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-[100%] lg:w-[50%] rounded-lg ">
      {/* Porcentaje */}
      <div className="flex gap-2 -mt-2">
        <div className="flex items-center gap-2 mb-2">
          <MusicalNoteIcon className="text-[#1DB954] w-6 h-6" />
          <span className="text-white">Musical Compatibility</span>
        </div>
        <span
          className={`text-md font-bold  text-spotify-green mb-2 transition-opacity duration-500`}
        >
          {" "}
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-2 bg-[#17171C] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] transition-all duration-500 ease-out"
          style={{
            background: getBarColor(compatibilityNumber),
            width: isVisible ? `${percentage}%` : "0%",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
