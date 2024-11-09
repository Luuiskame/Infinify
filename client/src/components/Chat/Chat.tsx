import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";

import { socket } from "@/socket-io/socket";

const Chat = () => {
  const userProps = useAppSelector(state=> state.userReducer.user?.user)
  const chatId = useParams()
  console.log('chatid:', chatId.idChat)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      userId: "1",
      user: "John Doe",
      content: "Hello, how are you?",
      time: "10:00",
      avatar:
        "https://i.scdn.co/image/ab6775700000ee85604fbf7c4e971678ceefd34e",
    },
    {
      userId: userProps?.id,
      user: "You",
      content: "I'm doing great, thanks!",
      time: "10:05",
      avatar:
        "https://i.scdn.co/image/ab6775700000ee85604fbf7c4e971678ceefd34e",
    },
  ]);

  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        userId: userProps?.id,
        user: "You",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar:
          "https://i.scdn.co/image/ab6775700000ee85604fbf7c4e971678ceefd34e",
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }

    const messageInfo = {
      chatId: chatId.idChat,
      senderId: userProps?.id,
      content: message
    } 

    if (socket.connected) {
      socket.emit('send_message', messageInfo);
    } else {
      console.error("Socket is not connected");
    }
  };

  useEffect(()=> {
    if(!socket.connected){
      socket.connect()
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };

  },[])

  return (
    <div className="w-full max-w-[1060px] h-screen max-h-[800px] flex flex-col justify-between mx-auto bg-spotify-light-gray text-spotify-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-spotify-light-gray text-spotify-white border-t border-b border-spotify-green">
        <button className="p-2 text-spotify-green rounded hover:bg-spotify-black">
          🔙
        </button>
        <div className="flex items-center gap-2 ml-4 cursor-pointer hover:bg-spotify-black p-2 rounded">
          <img
            src="https://i.scdn.co/image/ab6775700000ee85604fbf7c4e971678ceefd34e"
            alt="User"
            className="w-12 h-12 rounded-full"
          />
          <span className="text-lg font-semibold">John Doe</span>
          <span className="text-green-500 ml-2">🟢</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button className="text-spotify-green hover:scale-110">📞</button>
          <button className="text-spotify-green hover:scale-110">📹</button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-scroll p-4 chatMiddlePartContainer">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 mb-4 ${
              msg.userId === userProps?.id ? "justify-end" : ""
            }`}
          >
            {msg.userId !== userProps?.id && (
              <img
                src={msg.avatar}
                alt={msg.user}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div
              className={`flex flex-col max-w-[70%] p-3 rounded-lg ${
                msg.userId === userProps?.id
                  ? "bg-spotify-green text-spotify-black ml-auto"
                  : "bg-spotify-black text-spotify-white"
              }`}
            >
              <span className="font-semibold">{msg.user}</span>
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
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
