import { PlayCircleIcon } from "@heroicons/react/24/solid";
import React from "react";

interface MusicPlayerProps {
  onPlay: () => void;
}

const MusicPlayer = ({ onPlay }: MusicPlayerProps) => {
  return (
    <div>
      <button className="bg-transparent border-none" onClick={onPlay}>
        <PlayCircleIcon className="h-8 w-8 text-white" />
      </button>
    </div>
  );
};

export default MusicPlayer;
