import { sendMessage, validateChatParticipant } from '../../controllers/chatControllers/senMessage.js';
import { createChats } from '../../controllers/chatControllers/createChats.js';
import { markMessagesAsRead } from '../../controllers/chatControllers/markMessageAsRead.js';

// Wrap session middleware for Socket.IO

export function setupSocketHandlers(io) {
  const onlineUsers = new Map(); // userId -> socketId
  
  // Apply session middleware

  io.on("connection", (socket) => {
    console.log(`User connected with socket id: ${socket.id}`);

    socket.on("user_online", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });

    // Other events like join_room, send_message, new_chat, markAsRead, etc.
    socket.on("join_room", (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("send_message", async (messageInfo) => {
      try {
        console.log(messageInfo);
        // Validate the message data
        const { chatId, content, senderId } = messageInfo;
        if (!chatId || !content) {
          throw new Error("Missing required message information");
        }

        // Validate that the sender is a participant in the chat
        const isParticipant = await validateChatParticipant(chatId, senderId);
        if (!isParticipant) {
          throw new Error("User is not a participant in this chat");
        }

        // Send the message using our controller
        const messageData = await sendMessage({
          chatId,
          senderId,
          content,
        });

        console.log(messageData);

        // Emit the message to all participants in the chat room
        io.to(chatId).emit("receive_message", messageData);
      } catch (error) {
        console.error("Error sending message:", error);
        // Emit error back to sender only
        socket.emit("message_error", {
          error: error.message,
        });
      }
    });

    socket.on("new_chat", async (data) => {
      try {
        const { participantsIds, chatType, chatName } = data;
        const result = await createChats(participantsIds, chatType, chatName);
        console.log(result);

        result.json.chat_participants.forEach((participant) => {
          // Skip notification to the creator of the chat (optional)
          const recipientSocketId = onlineUsers.get(participant.user_id);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("new_chat_notification", result.json);
          }
        });
      } catch (error) {
        console.error("Error creating new chat:", error);
        socket.emit("chat_error", {
          error: error.message,
        });
      }
    });

    socket.on("markAsRead", async (info) => {
      const { chatId, userId } = info;
      const result = await markMessagesAsRead(info);
      console.log("read result: ", result);

      io.to(chatId).emit("marked_as_read", result);
    });
  });
}