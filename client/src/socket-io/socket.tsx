import io from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_WS_SERVER_URL // this endpoint goes to our backend in local and to railway dev in production

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  auth: {
    serverOffset: 0,
    chatId: 0,
    page: 1,
    limit: 30
  }
});