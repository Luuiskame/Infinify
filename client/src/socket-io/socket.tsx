import io from 'socket.io-client'
const URL = "http://localhost:3001/"

// import { DefaultEventsMap } from "@socket.io/component-emitter";


export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
        serverOffset: 0,
        chatId: 0,
        page: 1,
        limit: 30
    }
})