import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { socket } from "@/socket-io/socket";
import {useRouter} from "next/navigation";

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

    // Primero verificar si ya existe un chat local entre ambos usuarios
    const existingChatId = findExistingDirectChat();

    if (existingChatId) {
        router.push(`/chats/${existingChatId}`)
      setIsLoading(false);
      return;
    }

    // Si no existe localmente, enviar datos para crear un nuevo chat
    const chatPayload = {
      participantsIds: [chatInfo.localUser, chatInfo.profileUser],
      chatType: "direct",
    };

    console.log("Creating new chat with payload:", chatPayload);

    // Emitir evento para crear chat a través del socket - no manejamos la respuesta aquí
    socket.emit("new_chat", chatPayload);
    setIsLoading(false);
  };

  return (
    <button
      onClick={trigger}
      type="button"
      className="bg-spotify-green text-white px-4 py-1 rounded-lg hover:bg-spotify-green/40 text-center font-sans font-bold text-lg"
    >
      {isLoading ? "loading" : "Send Message"}
    </button>
  );
}
