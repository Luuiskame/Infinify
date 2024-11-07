import { Userinfo } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatProps {
  user: Userinfo;
}

interface ChatMessage {
  userId: string;
  user: string;
  time: string;
  avatar: string;
  message: string;
}

// Function that creates the initial chat messages
const createChatBase = (user: Userinfo): ChatMessage[] => {
  if (!user) {
    return [
      {
        userId: "system",
        user: "System",
        time: "10:00",
        avatar: "default-avatar-url",
        message: "Welcome to your music app chat! Start a conversation by sending a message.",
      },
    ];
  }

  return [
    {
      userId: "john_doe",
      user: "John Doe",
      time: "10:00",
      avatar:
        "https://i.scdn.co/image/ab6775700000ee85604fbf7c4e971678ceefd34e",
      message: "Hola, ¿cómo estás?",
    },
    {
      userId: user.spotify_id,
      user: user.display_name || "Usuario Desconocido",
      time: "10:05",
      avatar: user.profile_photo || "default-avatar-url",
      message: "¡Todo bien, gracias!",
    },
  ];
};

const Chat: React.FC<ChatProps> = ({ user }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState<ChatMessage[]>(createChatBase(user)); // Initialize the chat using the function
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [chat]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const date = new Date();
    const [hour, minute] = date.toTimeString().split(":");

    const newMessage: ChatMessage = {
      userId: user?.spotify_id,
      user: user?.display_name || "Usuario Desconocido",
      time: `${hour}:${minute}`,
      avatar: user?.profile_photo || "default-avatar-url",
      message: message.trim(),
    };

    setChat([...chat, newMessage]);
    setMessage("");
  };

  return (
    <div className="bg-spotify-light-gray mt-4 mb-4 rounded-lg w-full px-6 py-4 h-full flex flex-col min-h-screen">
      <div
        ref={ref}
        className="flex-grow overflow-y-auto border-b-2 border-gray-700 px-6"
      >
        {chat.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-spotify-gray text-lg">
              Welcome to your music app chat! Start a conversation by sending a message.
            </p>
          </div>
        ) : (
          chat.map((chatMessage, idx) => (
            <div key={idx} className="flex">
              <div
                className={`flex flex-col gap-2 p-4 max-w-[70%] mb-4 rounded-b-lg relative ${
                  chatMessage.userId === user?.spotify_id
                    ? "rounded-tl-lg mr-4 bg-spotify-green ml-auto"
                    : "rounded-tr-lg ml-4 bg-spotify-black mr-auto"
                }`}
              >
                <div
                  className={`flex gap-2 items-center ${
                    chatMessage.userId === user?.spotify_id
                      ? "justify-end text-spotify-black"
                      : ""
                  }`}
                >
                  <Image
                    src={chatMessage.avatar}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8"
                    alt={chatMessage.user}
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        chatMessage.userId === user?.spotify_id
                          ? "justify-end text-spotify-black"
                          : "text-spotify-gray"
                      }`}
                    >
                      {chatMessage.user}
                    </p>
                    <p className="text-xs text-gray-500">{chatMessage.time}</p>
                  </div>
                </div>
                <p
                  className={`text-sm flex gap-2 items-center ${
                    chatMessage.userId === user?.spotify_id
                      ? "justify-end text-spotify-light-gray"
                      : ""
                  }`}
                >
                  {chatMessage.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pb-6 mx-6">
        <form className="flex justify-center mt-4 gap-4" onSubmit={handleSend}>
          <input
            type="text"
            className="w-full p-2 rounded-lg"
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={handleMessageChange}
          />
          <button
            type="submit"
            className="bg-emerald-900 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-300"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;