'use client'
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import LastMessage from "./LastMessage";

import Link from "next/link";

const PreviewChat = () => {
  
  const chats = useAppSelector(state=> state.userReducer.user?.user_chats)

  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto md:mx-0 md:p-3 max-w-[700px]">
      <h2 className="font-extrabold text-2xl md:text-3xl text-center md:text-left">
        Chat Preview
      </h2>
      {chats?.map((chat) => (
        <Link
          href={`/chats/${chat.chatInfo.id}`}
          key={chat.chatInfo.id}
          className="flex flex-col gap-2 p-4 rounded-lg bg-spotify-light-gray"
        >
          <div className="flex gap-2 items-center">
            <Image
              src={chat.chat_participants[1].profile_photo}
              width={24}
              height={24}
              className="w-8 h-8 rounded-full"
              alt={chat.chat_participants[1].display_name}
            />
            <div>
              <p className="text-sm font-semibold">{chat.chat_participants[1].display_name}</p>
              <p className="text-xs text-gray-500">{chat.chatInfo.last_message_at}</p>
            </div>
          </div>
          <LastMessage chatId={chat.chatInfo.id}/>
        </Link>
      ))}
    </div>
  );
};

export default PreviewChat;
