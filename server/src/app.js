// app.js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import routes from './routes/index.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import cors from 'cors'

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
})


export {app, server, io}
