"use client";
import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { socket } from "@/socket-io/socket";
import { receivedMessage } from "../Header/Header";
import { ChatMessage } from "@/types";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import {
  setNewMessage,
  substractTotalUnreadMessages,
  substractChatUnreadMessages,
  setMultipleChatMessages,
  setIsFetched,
} from "@/slices/chatSlice";
import { useGetAllChatMessagesMutation } from "@/services/chatsApi";

interface directChatProps {
  user_id: string;
  profile_photo: string;
  display_name: string;
}

interface readResponse {
  message: string;
  updatedMessages: ChatMessage[];
  viewerId: string;
}

const Chat = () => {
  const dispatch = useAppDispatch();
  const userProps = useAppSelector((state) => state.userReducer.user?.user);
  const [getAllChatMessages] = useGetAllChatMessagesMutation();
  const [isFetching, setIsFetching] = useState(false);
  const [directChatNotUserProps, setDirectChatNotUserProps] = useState<
    directChatProps | undefined
  >(undefined);
  const chatId = useParams();
  const chats = useAppSelector((state) => state.chatsReducer.user_chats);
  const chatMessages = chats?.find(
    (chat) => chat.chatInfo.id === chatId.idChat
  );

  console.log("chatMessages", chatMessages?.chat_messages);

  const chatTotalUnreadMessages = chatMessages?.chatInfo.unread_messages;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatMessages?.chatInfo.chat_type === "direct") {
      const notUserProps = chatMessages.chat_participants.find(
        (user) => userProps?.id !== user.user_id
      );
      setDirectChatNotUserProps(notUserProps);
    }
  }, [chatId, chatMessages, userProps]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      const messageInfo = {
        chatId: chatId.idChat,
        senderId: userProps?.id,
        content: message,
      };

      if (socket.connected) {
        console.log("messageInfo", messageInfo);
        socket.emit("send_message", messageInfo);
      } else {
        console.error("Socket is not connected");
      }

      setMessage("");
    }
  };

  useEffect(() => {

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join_room", chatId.idChat);
    };

    const handleReceiveMessage = (data: receivedMessage) => {
      console.log("Message received:", data);
      dispatch(setNewMessage(data.message));

      if (data.message.sender_id !== userProps?.id) {
        socket.emit("markAsRead", {
          chatId: chatId.idChat,
          userId: userProps?.id,
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceiveMessage);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [
    chatMessages?.chatInfo.id,
    dispatch,
    userProps?.id,
    chatId.idChat,
  ]);

  useEffect(() => {
    if (chatTotalUnreadMessages && chatTotalUnreadMessages > 0) {
      dispatch(
        substractChatUnreadMessages({
          chatId: chatId.idChat as string,
          numberToSubstract: chatTotalUnreadMessages,
        })
      );
      dispatch(substractTotalUnreadMessages(chatTotalUnreadMessages));
      socket.emit("markAsRead", {
        chatId: chatMessages?.chatInfo.id,
        userId: userProps?.id,
      });
    }
    //eslint-disable-next-line
  }, [chatTotalUnreadMessages, chatId.idChat, userProps?.id, dispatch]);

  useEffect(() => {
    const handleMarkAsRead = async (data: readResponse) => {
      if (userProps?.id === data?.viewerId) {
        console.log("message read updated");
      } else {
        console.log(data);
      }
    };

    socket.on("marked_as_read", handleMarkAsRead);

    return () => {
      socket.off("marked_as_read", handleMarkAsRead);
    };
    //eslint-disable-next-line
  }, [userProps?.id]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMessages = async () => {
      if (isFetching || chatMessages?.isFetched) {
        return;
      }

      try {
        setIsFetching(true);
        const idToString = chatId?.idChat?.toString();

        if (!idToString) {
          return;
        }

        const data = await getAllChatMessages(idToString).unwrap();

        if (!controller.signal.aborted && !chatMessages?.isFetched) {
          dispatch(setMultipleChatMessages(data.messages));
          dispatch(setIsFetched({ chatId: idToString, isFetched: true }));
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (chatId?.idChat && chatMessages?.isFetched === false) {
      fetchMessages();
    }

    return () => {
      controller.abort();
    };
    
  }, 
  //eslint-disable-next-line
  [
    chatId?.idChat,
    chatMessages?.isFetched,
]);



  return (
    <div className="w-[100%] max-w-[1060px] h-screen flex flex-col text-spotify-white">
      <div className="flex items-center bg-spotify-dark-gray text-spotify-white border-t border-b border-spotify-green p-1">
        <Link href="/messages">
          <div className="flex items-center gap-2 ml-4 cursor-pointer hover:bg-spotify-black p-2 rounded">
            <ArrowLeftIcon className="h-6 w-6 text-spotify-green" />
          </div>
        </Link>
        <div className="flex items-center gap-2 ml-4 cursor-pointer hover:bg-spotify-black p-2 rounded">
          {directChatNotUserProps?.profile_photo ? (
            <Image
              src={directChatNotUserProps.profile_photo}
              alt={directChatNotUserProps?.display_name || "Receiver"}
              width={36}
              height={36}
              className="md:w-12 md:h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white">
              {directChatNotUserProps?.display_name?.[0] || "?"}
            </div>
          )}
          <div>{directChatNotUserProps?.display_name || "?"}</div>
        </div>
        <div className="ml-auto flex items-center gap-4 p-4">
          <button
            className="text-spotify-green hover:scale-110 text-lg md:text-2xl"
          >
            <PhoneIcon className="text-spotify-green w-6 h-6" />
          </button>
          <button
            className="text-spotify-green hover:scale-110 text-lg md:text-2xl"
          >
            <VideoCameraIcon className="text-spotify-green w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-scroll p-2 w-[90%] mx-auto chatMiddlePartContainer">
        {chatMessages?.chat_messages?.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 mb-4 ${
              msg.sender_id === userProps?.id ? "justify-end" : ""
            }`}
          >
            {msg.sender_id !== userProps?.id && (
              <Image
                src={msg.profile_photo}
                alt={msg.display_name}
                height={10}
                width={10}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div
              className={`flex flex-col max-w-[70%] p-3 rounded-lg ${
                msg.sender_id === userProps?.id
                  ? "bg-spotify-green/75 text-spotify-black ml-auto"
                  : "bg-spotify-black text-spotify-white"
              }`}
            >
              <span className="font-semibold">{msg.display_name}</span>
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 mt-1">
                {new Date(msg.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex  items-center p-4 bg-spotify-dark-gray rounded-lg m-4"
      >
        <button
          type="button"
          className="text-spotify-green hover:scale-110 mb-2 sm:mb-0 sm:mr-2"
        >
          ➕
        </button>
        <input
          type="text"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 rounded-lg bg-spotify-light-gray text-spotify-white outline-none placeholder-gray-400 mb-2 sm:mb-0"
        />
        <button
          type="submit"
          className="ml-0 sm:ml-2 bg-spotify-green text-spotify-black px-4 py-2 rounded-lg hover:bg-spotify-black hover:text-spotify-green transition-transform"
        >
          <PaperAirplaneIcon className="text-black w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
