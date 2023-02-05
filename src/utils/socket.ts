import { io } from "socket.io-client";

const connectSocket = () => {
    const socket = io('http://localhost:8001/', {
        // withCredentials: true,
        transports: ["websocket"]
    })
    return socket;
}
export default connectSocket;