
import React from "react";

interface BottomPlayerProps {
  songUrl: string | null;
  onClose: () => void;
}

const BottomPlayer = ({ songUrl, onClose }: BottomPlayerProps) => {
  if (!songUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-dark-gray p-4 shadow-lg">
    <div className="container mx-auto">
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-white hover:text-spotify-green  mb-2 mr-5"
        >
          Cerrar
        </button>
      </div>
      <iframe
        src={`https://open.spotify.com/embed/track/${songUrl}`}
        allow="encrypted-media"
        className="rounded-lg w-full h-[80px]"
      ></iframe>
    </div>
  </div>
  );
};

export default BottomPlayer;
