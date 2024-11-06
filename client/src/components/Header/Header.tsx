"use client";
import React from "react";
import Navbar from "./Navbar/Navbar";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

import { DefaultEventsMap } from "@socket.io/component-emitter";


import { useEffect } from "react";
import {io, Socket} from 'socket.io-client'
let socket: Socket<DefaultEventsMap, DefaultEventsMap> 

import { useAppSelector } from "@/redux/hooks";


const Header = () => {
  const userId = useAppSelector(state=> state.userReducer.user?.user.id)
  useEffect(() => {
    console.log('socket mounted')
    console.log(userId)
    // Initialize Socket.IO connection
    if(userId){
      socket = io('http://localhost:3001/', {
        withCredentials: true,
      });
  
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });
  
      // Cleanup on component unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [userId]);

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
