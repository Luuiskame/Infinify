"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import LastMessage from "./LastMessage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
// Import Skeleton directly - not as a dynamic component
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define the chat skeleton component outside the main component
const ChatSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 rounded-lg bg-spotify-light-gray animate-pulse">
    <div className="flex gap-2 items-center">
      <Skeleton circle width={32} height={32} />
      <div className="w-full">
        <Skeleton width={120} height={16} />
      </div>
    </div>
    <Skeleton width="90%" height={16} />
    <Skeleton width="70%" height={16} />
  </div>
);

// Define the empty state component outside the main component
const EmptyState = () => (
  <>
    <p className="text-center text-lg">
      You are a lonely person without messages 😢
    </p>
    <Link
      href={`/connect`}
      className="mt-9 bg-spotify-green text-black rounded-full font-bold flex items-center gap-2 justify-center mx-auto px-8 py-3 whitespace-nowrap hover:scale-105 transition-transform duration-300 animate-pulse hover:animate-none hover:shadow-lg"
    >
      <UserPlusIcon className="w-6 h-6" />
      Rescue Your Social Life
    </Link>
    <p className="text-center text-sm mt-2 text-gray-500 italic">
      Your music taste is too good to not be shared!
    </p>
  </>
);

const PreviewChat = () => {
  const [loading, setLoading] = useState(true);

  const chats = useAppSelector((state) => state.chatsReducer?.user_chats);
  const userId = useAppSelector((state) => state.userReducer?.user?.user.id);

  const chatWithMessages = useMemo(() => {
    const filteredMessages = (chats ?? [])?.filter(
      (chat) =>
        chat.chatInfo.last_message_at && chat.chatInfo.chat_type === "direct"
    );
    return filteredMessages;
  }, [chats]);

  useEffect(() => {
    console.log("Chats state updated:", chats);
    // Set loading to false when chats data is available
    if (chats) {
      setLoading(false);
    }
  }, [chats, chatWithMessages]);

  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto md:mx-0 md:p-3 max-w-[700px]">
      <h2 className="font-extrabold text-2xl md:text-3xl text-center md:text-left">
        {loading ? (
          <Skeleton width={150} height={36} />
        ) : chatWithMessages.length > 0  ? (
          "Chats"
        ) : (
          <EmptyState />
        )}
      </h2>

      {/* Loading state */}
      {loading && (
        <>
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
        </>
      )}

      {/* Loaded state with chats */}
      {!loading &&
         chatWithMessages?.map((chat) =>
          chat.chatInfo.chat_type === "direct" ? (
            <Link
              href={`/chats/${chat.chatInfo.id}`}
              key={chat.chatInfo.id}
              className={`flex flex-col gap-2 p-4 rounded-lg bg-spotify-light-gray ${
                chat.chatInfo.unread_messages > 0 ? "bg-red-600" : ""
              }`}
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={
                    userId === chat.chat_participants[0].user_id
                      ? chat.chat_participants[1].profile_photo
                      : chat.chat_participants[0].profile_photo
                  }
                  width={24}
                  height={24}
                  className="w-8 h-8 rounded-full"
                  alt={
                    userId === chat.chat_participants[0].user_id
                      ? chat.chat_participants[1].display_name
                      : chat.chat_participants[0].display_name
                  }
                />
                <div>
                  <p className="text-sm font-semibold">
                    {userId === chat.chat_participants[0].user_id
                      ? chat.chat_participants[1].display_name
                      : chat.chat_participants[0].display_name}
                  </p>
                </div>
              </div>
              <div className="justify-between">
                <LastMessage
                  chatId={chat.chatInfo.id}
                  lastMessage={
                    chat.chat_messages[chat.chat_messages.length - 1]
                  }
                  notificationsNumber={chat.chatInfo.unread_messages}
                />
              </div>
            </Link>
          ) : null
        )}
    </div>
  );
};

export default PreviewChat;