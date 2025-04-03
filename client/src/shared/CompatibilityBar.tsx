"use client";

import { useState, useEffect } from "react";
import useGetUserCompatibilityNumber from "@/hooks/useGetUserCompatibilityNumber";
import { Artist, Song } from "@/types";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderRadius: "0.5rem",
        width: "100%",
      }}
     
    >
      {/* Porcentaje */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <MusicalNoteIcon
            style={{
              color: "#1DB954",
              width: "24px",
              height: "24px",
            }}
          />
          <span style={{ color: "white" }}>Musical Compatibility</span>
        </div>
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#1DB954",
            transition: "opacity 500ms",
          }}
        >
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        style={{
          height: "8px",
          backgroundColor: "#090A0C",
          borderRadius: "9999px",
          overflow: "visible",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            background:
              getBarColor(compatibilityNumber) ||
              "linear-gradient(to right, #1DB954, #1ed760)",
            width: isVisible ? `${percentage}%` : "1%",
            transition: "all 500ms ease-out",
            borderRadius: "9999px",
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
        @media (min-width: 1024px) {
          .lg-width-50 {
            width: 50% !important;
          }
        }
      `}</style>
    </div>
  );
}
