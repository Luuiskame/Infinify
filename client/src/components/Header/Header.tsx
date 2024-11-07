"use client";
import React from "react";
import Navbar from "./Navbar/Navbar";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

// import { DefaultEventsMap } from "@socket.io/component-emitter";


import { useEffect } from "react";
import { socket } from "@/socket-io/socket";

import { useAppSelector } from "@/redux/hooks";


const Header = () => {
  const userId = useAppSelector(state=> state.userReducer.user?.user.id)
  const chats = useAppSelector(state=> state.userReducer.user?.user_chats)

  useEffect(() => {
    console.log('socket mounted')
    console.log(userId)
    // Initialize Socket.IO connection
    if(userId){

      //! auto connect is false on socket, so we connect it when mounting the component
      if (!socket.connected) {
        socket.connect();
      }

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      chats?.forEach(chat => {
        socket.emit('join_room', chat.chatInfo.id);
        console.log(`Joining room: ${chat.chatInfo.id}`);
      });
      
      // Cleanup on component unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [userId, chats]);

  return (
    <div className=" bg-spotify-dark-gray px-8 py-6 flex justify-between gap-4 ">
      <div className="flex justify-between gap-24  w-[180%] md:w-[10%]">
        <Link href={`/`}>
        <h2 className="text-2xl font-bold text-spotify-green ">Infinify</h2>
        </Link>
        <Link
          href={`/search`}
          className=""
        >
          <span className="absolute flex text-3xl text-white items-end justify-end md:hidden w-32 ">
            <FiSearch />
          </span>
        </Link>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
