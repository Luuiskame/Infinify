"use client";
import { useState, useEffect } from "react";
import CompatibilityBar from "@/shared/CompatibilityBar";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const Compare = () => {
  const dummyData = {
    user1: {
      name: "Alex Turner",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
      favoriteArtists: [
        {
          name: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        },
        {
          name: "The Strokes",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        },
      ],
      favoriteSongs: [
        {
          name: "505",
          artist: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
        },
        {
          name: "Last Nite",
          artist: "The Strokes",
          image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
        },
      ],
    },
    user2: {
      name: "Julian Casablancas",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      favoriteArtists: [
        {
          name: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
        },
        {
          name: "Tame Impala",
          image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
        },
      ],
      favoriteSongs: [
        {
          name: "Do I Wanna Know?",
          artist: "Arctic Monkeys",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        },
        {
          name: "The Less I Know The Better",
          artist: "Tame Impala",
          image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
        },
      ],
    },
    commonArtists: [
      {
        name: "Arctic Monkeys",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      },
      {
        name: "The Strokes",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
      },
      {
        name: "Tame Impala",
        image: "https://images.unsplash.com/photo-1501612780327-45045538702b",
      },
      {
        name: "Radiohead",
        image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
      },
      {
        name: "The Killers",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
      },
    ],
    commonSongs: [
      {
        name: "R U Mine?",
        artist: "Arctic Monkeys",
        image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae",
      },
      {
        name: "Reptilia",
        artist: "The Strokes",
        image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c",
      },
      {
        name: "Let It Happen",
        artist: "Tame Impala",
        image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-spotify-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center pb-6">
            Common Artists
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {dummyData.commonArtists.map((artist, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <p className="text-center text-sm">{artist.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-6">
            Common Songs
          </h3>
          <div className="flex flex-wrap items-center gap-3 lg:gap-12 justify-center">
            {dummyData.commonSongs.map((song, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex flex-col items-center"
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="text-center text-sm font-medium">{song.name}</p>
                <p className="text-center text-xs text-gray-400">
                  {song.artist}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* main div for both cards, fav songs and artist */}
        <div className="grid grid-cols-1 text-center place-items-center lg:grid-cols-2 gap-4">
        <h2 className="lg:col-span-2">VS</h2>


        <div className="w-full md:max-w-[600px] lg:max-w-[450px] lg:bg-spotify-light-gray rounded-lg shadow-lg p-6">
            <h3 className="mb-6">Both favorite Songs right now</h3>

            {/* song main container */}
            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%]">
                <p className="text-center">
                  {dummyData.user1.favoriteSongs[0].name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  src={dummyData.user1.favoriteSongs[0].image}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%]">
                <p className="text-center">
                  {dummyData.user2.favoriteSongs[0].name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  src={dummyData.user2.favoriteSongs[0].image}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="w-full md:max-w-[600px] lg:max-w-[450px] lg:bg-spotify-light-gray rounded-lg shadow-lg p-6">
          <h3 className="mb-6">Both favorite Artist right now</h3>

            <div className="flex justify-between text-center items-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-3 mb-6 w-[50%]">
                <p className="text-center">
                  {dummyData.user1.favoriteArtists[0].name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  src={dummyData.user1.favoriteArtists[0].image}
                  
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center gap-3 mb-6 w-[50%]">
                <p className="text-center">
                  {dummyData.user2.favoriteArtists[0].name}
                </p>
                <img
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  src={dummyData.user2.favoriteArtists[0].image}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6">Compatibility</h3>          
            <CompatibilityBar />
        </div>

        <div className="flex justify-center">
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeftIcon className="h-6 w-6" />
            <span>Back</span>
          </button>
          <button className="bg-[#1DB954] hover:opacity-90 transition-opacity px-8 py-3 rounded-full flex items-center space-x-2">
            {/* <FaSpotify className="text-xl" /> */}
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
