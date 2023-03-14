import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
const connectSocket = () => {
    if (socket == null) {
        socket = io('http://localhost:8001/socketio', {
            // withCredentials: true,
            transports: ["websocket"],
        })
    }
    return socket;
}
export default connectSocket;