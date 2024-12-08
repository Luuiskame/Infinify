import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import Image from "next/image";

import { useAppDispatch } from "@/redux/hooks";
import { setNewMessage } from "@/slices/chatSlice";

import { socket } from "@/socket-io/socket";
import { receivedMessage } from "../Header/Header";

interface directChatProps {
  user_id: string;
  profile_photo: string;
  display_name: string;
}

const Chat = () => {
  const dispatch = useAppDispatch();
  const userProps = useAppSelector((state) => state.userReducer.user?.user);

  const [directChatNotUserProps, setDirectChatNotUserProps] = useState<
    directChatProps | undefined
  >(undefined);

  const chatId = useParams();
  console.log("chatid:", chatId.idChat);

  const chats = useAppSelector((state) => state.chatsReducer.user_chats);
  const chatMessages = chats?.find(
    (chat) => chat.chatInfo.id === chatId.idChat
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chatMessages?.chatInfo.chat_type === "direct") {
      const notUserProps = chatMessages.chat_participants.find(
        (user) => userProps?.id !== user.user_id
      );

      setDirectChatNotUserProps(notUserProps);
    }
  }, [chatId]);

  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");

      const messageInfo = {
        chatId: chatId.idChat,
        senderId: userProps?.id,
        content: message,
      };

      if (socket.connected) {
        socket.emit("send_message", messageInfo);
      } else {
        console.error("Socket is not connected");
      }
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
  }, [chatId.idChat, dispatch]);

  return (
    <div className="w-full max-w-[1060px] h-screen max-h-[800px] flex flex-col justify-between mx-auto bg-spotify-light-gray text-spotify-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-spotify-light-gray text-spotify-white border-t border-b border-spotify-green">
        <button className="p-2 text-spotify-green rounded hover:bg-spotify-black">
          🔙
        </button>
        <div className="flex items-center gap-2 ml-4 cursor-pointer hover:bg-spotify-black p-2 rounded">
          {directChatNotUserProps?.profile_photo ? (
            <Image
              src={directChatNotUserProps.profile_photo}
              alt={directChatNotUserProps?.display_name || "Receiver"}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white">
              {directChatNotUserProps?.display_name?.[0] || "?"}
            </div>
          )}
          <div>
              {directChatNotUserProps?.display_name || "?"}
            </div>
          <span className="text-green-500 ml-2">🟢</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="text-spotify-green hover:scale-110">📞</button>
          <button className="text-spotify-green hover:scale-110">📹</button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-scroll p-4 chatMiddlePartContainer">
        {chatMessages?.chat_messages.map((msg, idx) => (
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
                  ? "bg-spotify-green text-spotify-black ml-auto"
                  : "bg-spotify-black text-spotify-white"
              }`}
            >
              <span className="font-semibold">{msg.display_name}</span>
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 mt-1">
                {msg.created_at}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center p-4 bg-spotify-dark-gray rounded-lg m-4"
      >
        <button className="text-spotify-green hover:scale-110 mr-2">➕</button>
        <input
          type="text"
          placeholder="Send a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 rounded-lg bg-spotify-light-gray text-spotify-white outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          className="ml-2 bg-spotify-green text-spotify-black px-4 py-2 rounded-lg hover:bg-spotify-black hover:text-spotify-green transition-transform"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
