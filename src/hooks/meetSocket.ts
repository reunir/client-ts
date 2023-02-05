import io, { Socket } from "socket.io-client";
import React, { useState, useEffect } from 'react';
import connectSocket from "../utils/socket";
import { SOCKETEVENTS, SOCKETREQUEST } from "../types/Socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export default function useMeetSocket() {
    const [isSocketConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    function sendSocketRequest(event: SOCKETEVENTS, data: SOCKETREQUEST) {
        if (socket.connected) {
            socket.emit(event, data);
        }
    }
    useEffect(() => {
        if (socket === null)
            setSocket(() => {
                let initSocket = connectSocket();
                initSocket.on('connect', () => {
                    setIsConnected(true);
                });
                initSocket.on('disconnect', () => {
                    setIsConnected(false);
                });
                return initSocket;
            });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            if (socket && socket.connected)
                socket.disconnect()
        };
    }, [])
    return { isSocketConnected, sendSocketRequest }
}