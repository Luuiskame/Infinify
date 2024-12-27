"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import LastMessage from "./LastMessage";
import Link from "next/link";

const PreviewChat = () => {
  const chats = useAppSelector((state) => state.chatsReducer.user_chats);
  const userId = useAppSelector((state) => state.userReducer.user?.user.id);
  const chatsNotifications = useAppSelector(
    (state) => state.chatsReducer.total_unread_messages
  );

  console.log("total unread notis", chatsNotifications);
  console.log("user chats with messages", chats);

  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto md:mx-0 md:p-3 max-w-[700px]">
      <h2 className="font-extrabold text-2xl md:text-3xl text-center md:text-left">
        Chat Preview
      </h2>
      {chats?.map((chat) =>
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
                <p className="text-xs text-gray-500">
                  {new Date(chat.chatInfo.last_message_at).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
              </div>
            </div>
            <LastMessage
              chatId={chat.chatInfo.id}
              lastMessage={chat.chat_messages[chat.chat_messages.length -1]}
              notificationsNumber={chat.chatInfo.unread_messages}
            />
          </Link>
        ) : (
          "chat group not available yet: working on the feature"
        )
      )}
    </div>
  );
};

export default PreviewChat;
