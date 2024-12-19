"use client";
import React from "react";
import Navbar from "./Navbar/Navbar";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { setNewMessage, setTotalUnreadMessages, sumChatUnreadMessages } from "@/slices/chatSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ChatMessage } from "@/types";
// import { DefaultEventsMap } from "@socket.io/component-emitter";

export interface receivedMessage {
  chat: {
    id: string;
    last_message_at: string;
  };
  message: ChatMessage
  recipients: string[]
}  


import { useEffect } from "react";
import { socket } from "@/socket-io/socket";

import { useAppSelector } from "@/redux/hooks";


const Header = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(state=> state.userReducer.user?.user.id)
  const chats = useAppSelector(state=> state.userReducer.user?.user_chats)

  useEffect(() => {
    console.log("Mounting socket in Header component");
  
    if (userId) {
      // Disconnect any existing connection first
      if (socket.connected) {
        socket.disconnect();
      }
  
      // Connect the socket
      socket.connect();
  
      const onConnect = () => {
        console.log("Socket connected:", socket.id);
  
        // Join all rooms for this user's chats
        chats?.forEach(chat => {
          socket.emit("join_room", chat.chatInfo.id);
          console.log(`Joining room: ${chat.chatInfo.id}`);
        });
      };
  
      const onReceiveMessage = async (data: receivedMessage) => {
        console.log("Message received:", data);
        dispatch(setNewMessage(data.message));
        if(data){
          dispatch(setTotalUnreadMessages(1))
        dispatch(sumChatUnreadMessages({
                chatId: data?.chat?.id as string,
                numberToSum: 1}))
        }
      };
  
      // Add listeners
      socket.on("connect", onConnect);
      socket.on("receive_message", onReceiveMessage);
  
      // Cleanup on component unmount
      return () => {
        // Remove specific listeners
        socket.off("connect", onConnect);
        socket.off("receive_message", onReceiveMessage);
        socket.disconnect();
      };
    }
  }, [userId, chats, dispatch]);

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
