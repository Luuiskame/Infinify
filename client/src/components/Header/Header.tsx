"use client";
import React from "react";
import Navbar from "./Navbar/Navbar";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { setNewMessage, setTotalUnreadMessages, sumChatUnreadMessages } from "@/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ChatMessage } from "@/types";
import { socket } from "@/socket-io/socket";

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
  const userId = useAppSelector(state => state.userReducer.user?.user.id);
  const chats = useAppSelector(state => state.userReducer.user?.user_chats);
  const chatsRef = React.useRef(chats);

  // Mantener referencia actualizada de los chats
  React.useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  // Manejar conexión/desconexión del socket
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (!userId) return;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
    console.log("Emitting user_online with userId:", userId);

      socket.emit('user_online', userId);

      // Unirse a las salas con los chats actualizados
      chatsRef.current?.forEach((chat) => {
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
  }, [userId]);

  React.useEffect(() => {
    const onNewChatNotification = (data: receivedMessage) => {
      console.log("New chat notification received:", data);
      
      // Update UI with notification
      dispatch(setNewMessage(data.message));
      dispatch(setTotalUnreadMessages(1));
      dispatch(
        sumChatUnreadMessages({
          chatId: data.chat.id,
          numberToSum: 1,
        })
      );
      
      // Automatically join the chat room to receive future messages
      socket.emit("join_room", data.chat.id);
      console.log(`Auto-joining new chat room: ${data.chat.id}`);
    };
  
    socket.on("new_chat_notification", onNewChatNotification);
  
    return () => {
      socket.off("new_chat_notification", onNewChatNotification);
    };
  }, [dispatch, userId]);

  // Manejar mensajes entrantes
  React.useEffect(() => {
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