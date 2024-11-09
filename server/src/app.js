// app.js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import routes from './routes/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'

import { sendMessage, validateChatParticipant } from './controllers/chatControllers/senMessage.js'

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

io.use((socket, next)=> {
  const session = socket.request.session

  if(session && session.userId){
    socket.userId = session.userId
    next()
  } else {
    next(new Error('Unathorized, no userId found in socket'))
  }
})

io.on('connection', (socket)=> {
  console.log(`user connected: ${socket.userId}`)

  socket.on('disconnected', ()=> {
    console.log(`user disconnected: ${socket.userId}`)
  })

  socket.on('join_room', (chatId)=> {
    socket.join(chatId)
    console.log(`user ${socket.userId} joined to chat ${chatId}`)
  })

  socket.on('send_message', async (messageInfo)=> {
    try {
      console.log(messageInfo)
      // Validate the message data
      const { chatId, content } = messageInfo
      if (!chatId || !content) {
        throw new Error('Missing required message information')
      }

      // Validate that the sender is a participant in the chat
      const isParticipant = await validateChatParticipant(chatId, socket.userId)
      if (!isParticipant) {
        throw new Error('User is not a participant in this chat')
      }

      // Send the message using our controller
      const messageData = await sendMessage({
        chatId,
        senderId: socket.userId,
        content
      })

      // Emit the message to all participants in the chat room
      io.to(chatId).emit('receive_message', messageData.message)

      // Send notifications to other participants
      messageData.recipients.forEach(recipientId => {
        io.to(recipientId).emit('receive_notification', {
          chatId,
          messageId: messageData.message.id,
          senderId: socket.userId
        })
      })

    } catch (error) {
      console.error('Error sending message:', error)
      // Emit error back to sender only
      socket.emit('message_error', {
        error: error.message
      })
    }
  })
})


export {app, server, io}
