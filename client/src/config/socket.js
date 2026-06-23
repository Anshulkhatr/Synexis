import { io } from 'socket.io-client';

const socketUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8080' 
  : window.location.origin;

const socket = io(socketUrl, {
  autoConnect: false // We will manually connect when user logs in
});

export default socket;
