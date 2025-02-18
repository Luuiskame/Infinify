import io from 'socket.io-client'
const URL = "http://localhost:3001/"

// import { DefaultEventsMap } from "@socket.io/component-emitter";


export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
        serverOffset: 0,
        chatId: 0,
        page: 1,
        limit: 30
    }
})