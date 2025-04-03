import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/socket-io/socket";
import {useRouter} from "next/navigation";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface chatUsersInfo {
  localUser: string;
  profileUser: string;
}

export default function SendMessage(chatInfo: chatUsersInfo) {
  const router = useRouter()
  const chats = useAppSelector((state) => state.chatsReducer.user_chats);
  const [isLoading, setIsLoading] = useState(false);

  // Función para verificar si ya existe un chat directo entre ambos usuarios
  const findExistingDirectChat = () => {
    if (!chats || chats.length === 0) return null;

    // Buscar un chat directo que tenga a ambos usuarios como participantes
    const existingChat = chats.find((chat) => {
      // Verificar que sea un chat directo
      if (chat.chatInfo.chat_type !== "direct") return false;

      // Verificar que ambos usuarios están en los participantes
      const participants = chat.chat_participants || [];
      const hasLocalUser = participants.some(
        (p) => p.user_id === chatInfo.localUser
      );
      const hasProfileUser = participants.some(
        (p) => p.user_id === chatInfo.profileUser
      );

      return hasLocalUser && hasProfileUser;
    });

    return existingChat ? existingChat.chatInfo.id : null;
  };

  const trigger = () => {
    setIsLoading(true);

    const existingChatId = findExistingDirectChat();

    if (existingChatId) {
        router.push(`/chats/${existingChatId}`)
      setIsLoading(false);
      return;
    }

    const chatPayload = {
      participantsIds: [chatInfo.localUser, chatInfo.profileUser],
      chatType: "direct",
    };

    console.log("Creating new chat with payload:", chatPayload);

    socket.emit("new_chat", chatPayload);
    setIsLoading(false);
  };

  return (
    <button
    onClick={trigger}
    className="flex items-center justify-center gap-2 px-6 py-3 hover:bg-[#252529]/50 bg-[#252529] text-white rounded-full transition-all duration-300 transform hover:scale-105"
    title="Send Message"
  >
    <PaperAirplaneIcon className="text-xl w-6 h-6" />
    <span>  {isLoading ? "loading" : "Send Message"}</span>
  </button>
  );
}
