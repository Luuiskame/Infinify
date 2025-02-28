"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar/Navbar";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import {
  setNewMessage,
  setTotalUnreadMessages,
  sumChatUnreadMessages,
  setOneChat,
} from "@/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChatMessage } from "@/types";
import { socket } from "@/socket-io/socket";
import { useCreateOrFindChatMutation } from "@/services/chatsApi";

export interface receivedMessage {
  chat: {
    id: string;
    last_message_at: string;
  };
  message: ChatMessage;
  recipients: string[];
}

const Header = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.userReducer?.user?.user.id);
  const chats = useAppSelector((state) => state.chatsReducer?.user_chats);
  const [createOrFindChat, {isLoading, isError}] = useCreateOrFindChatMutation();

  // chat finder
  const localChatFinder = (chatId: string) => {
    console.log('chat finder is triggered', chatId)
    const chatFound = chats?.find(chat => chat.chatInfo.id === chatId);

    if (chatFound?.chatInfo.id) {
      console.log('chat on local already exist:', chatFound.chatInfo.id)
      return chatFound.chatInfo.id;
    } else {
      return undefined
    }
  };

  // chat founder fn from db
  const dbChatFinder = async (chatInfo: { participantsIds: string[]; chatType: string }) => {
    console.log('chat db finder is triggered', chatInfo)
    const result = await createOrFindChat(chatInfo).unwrap();
    console.log(result);

    if(result.chatInfo.id){
      const completedProperties = {
        ...result,
        chat_messages: [],
        isFetched: false
    }
      dispatch(setOneChat(completedProperties));
    } else {
      console.log('something unexpected happened when dispatching one chat at chatFounder')
    }
  }

  // Manejar conexión/desconexión del socket
  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [userId]);

  // Configurar listeners permanentes
  useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("user_online", userId);
      // Unirse a las salas con los chats actualizados
      chats?.forEach((chat) => {
        socket.emit("join_room", chat.chatInfo.id);
        console.log(`Joining room: ${chat.chatInfo.id}`);
      });
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [userId, chats]);

  // Manejar mensajes entrantes
  useEffect(() => {
    const onReceiveMessage = (data: receivedMessage) => {
      console.log("Message received:", data);
      dispatch(setNewMessage(data.message));
      dispatch(setTotalUnreadMessages(1));
      dispatch(
        sumChatUnreadMessages({
          chatId: data.chat.id,
          numberToSum: 1,
        })
      );
    };

    socket.on("receive_message", onReceiveMessage);

    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, [dispatch]);

  useEffect(() => {
    const onNewChatNotification = async (data: receivedMessage) => {
      console.log("New chat notification:", data);

      const chatAlreadyExist = localChatFinder(data.chat.id);
      
      if(chatAlreadyExist === undefined && userId){
        const chatPayload = {
          participantsIds: [userId, data.message.sender_id],
          chatType: "direct"
        }
        
        await dbChatFinder(chatPayload)
        // Update UI with notification
       dispatch(setNewMessage(data.message));
       dispatch(setTotalUnreadMessages(1));
       dispatch(
         sumChatUnreadMessages({
           chatId: data.chat.id,
           numberToSum: 1,
          })
        );
      };

    };

    socket.on("new_chat_notification", onNewChatNotification);

    return () => {
      socket.off("new_chat_notification", onNewChatNotification);
    };
  }, [dispatch, userId, chats, localChatFinder, dbChatFinder]);

  return (
    <div className="bg-spotify-dark-gray px-8 py-6 flex justify-between gap-4">
      <div className="flex justify-between gap-24 w-[180%] md:w-[10%]">
        <Link href={`/`}>
          <h2 className="text-2xl font-bold text-spotify-green">Infinify</h2>
        </Link>
        <Link href={`/search`} className="">
          <span className="absolute flex text-3xl text-white items-end justify-end md:hidden w-32">
            <FiSearch />
          </span>
        </Link>
      </div>
      <Navbar />
    </div>
  );
};

export default Header;
