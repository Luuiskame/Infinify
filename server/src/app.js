// app.js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import routes from './routes/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'

import { createChats } from './controllers/chatControllers/createChats.js'
import { sendMessage, validateChatParticipant } from './controllers/chatControllers/senMessage.js'
import { markMessagesAsRead } from './controllers/chatControllers/markMessageAsRead.js'

dotenv.config()

// Crear la aplicación de Express
const app = express()
const server = http.createServer(app)

// Middlewares
app.use(express.json())
app.use(cookieParser())

const sessionMiddleware = session(
  {
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 1 day
    },
  }
)

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
  })
);

app.use(sessionMiddleware);

// Configurar rutas
app.use('/infinify', routes)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  connectionStateRecovery: {
    // Optional: enables client recovery of missed messages
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  },
})

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))

// io.use((socket, next)=> {
//   const session = socket.request.session

//   if(session && session.userId){
//     socket.userId = session.userId
//     next()
//   } else {
//     next(new Error('Unathorized, no userId found in socket'))
//   }
// })


const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`user with socket id ${socket.id} connected`);
  
  // Add user tracking
  socket.on('user_online', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ${socket.id}`);
    }
  });

  socket.on('disconnect', () => {
    // Remove from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
    console.log(`user disconnected, socket id: ${socket.id}`);
  });

  socket.on('join_room', (chatId) => {
    socket.join(chatId);
    console.log(`user ${socket.id} joined to chat ${chatId}`);
  });

  socket.on('send_message', async (messageInfo) => {
    try {
      console.log(messageInfo);
      // Validate the message data
      const { chatId, content, senderId } = messageInfo;
      if (!chatId || !content) {
        throw new Error('Missing required message information');
      }

      // Validate that the sender is a participant in the chat
      const isParticipant = await validateChatParticipant(chatId, senderId);
      if (!isParticipant) {
        throw new Error('User is not a participant in this chat');
      }

      // Send the message using our controller
      const messageData = await sendMessage({
        chatId,
        senderId,
        content
      });

      console.log(messageData);

      // Emit the message to all participants in the chat room
      io.to(chatId).emit('receive_message', messageData);


    } catch (error) {
      console.error('Error sending message:', error);
      // Emit error back to sender only
      socket.emit('message_error', {
        error: error.message
      });
    }
  });

  socket.on('new_chat', async (data) => {
    try {
      const { participantsIds, chatType, chatName } = data;
      const result = await createChats(participantsIds, chatType, chatName);
      console.log(result)
      
            
      // Si quieres notificar al otro usuario
      result.json.chat_participants.forEach(participant => {
        // Skip notification to the creator of the chat (optional)
          const recipientSocketId = onlineUsers.get(participant.user_id);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('new_chat_notification', result.json);
          }
      });
    } catch (error) {
      console.error('Error creating new chat:', error);
      socket.emit('chat_error', {
        error: error.message
      });
    }
  });

  socket.on('markAsRead', async (info) => {
    const {chatId, userId} = info;
    const result = await markMessagesAsRead(info);
    console.log('read result: ', result);

    io.to(chatId).emit('marked_as_read', result);
  });
});


export {app, server, io}
