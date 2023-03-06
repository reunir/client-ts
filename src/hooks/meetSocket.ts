import io, { Socket } from "socket.io-client";
import React, { useState, useEffect } from 'react';
import connectSocket from "../utils/socket";
import { SOCKETEVENTS, SOCKETREQUEST, SOCKETRESPONSE } from "../types/Socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useNavigate } from "react-router-dom";
import useMeetData from "./meetData";

export default function useMeetSocket(addNotification: any, addError: any) {
    const [isSocketConnected, setIsConnected] = useState(false);
    const { meetData, addNewScreenMedia, addNewUserStream, deleteScreenMedia, deleteUserStream, getAMedia, updateSelfStream } = useMeetData();
    const [socket, setSocket] = useState<any>(null);
    const navigate = useNavigate();
    function listenEvents(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on(SOCKETEVENTS.SUCCESSFULL_CREATE, (args: SOCKETRESPONSE<any>) => {
            console.log(args)
            navigate(`/meet/__join/`, {
                state: { meetId: args.data?.body.meetId },
            })
        })
        socket.on(SOCKETEVENTS.ALLOW_IN, (args: SOCKETRESPONSE<any>) => {
            console.log(args);
            navigate(`/meet/${args.data?.body.meetId}`, {
                state: {
                    meetVerified: true
                }
            })
        })
        socket.on(SOCKETEVENTS.USER_JOINED, (args: SOCKETRESPONSE<any>) => {
            console.log(args);
            addNotification({ message: args.data?.message });
        })
    }

    function sendSocketRequest(event: SOCKETEVENTS, data: SOCKETREQUEST) {
        if (socket.connected) {
            socket.emit(event, data);
        }
    }
    useEffect(() => {
        let initSocket: Socket<DefaultEventsMap, DefaultEventsMap>;
        if (socket === null) {
            initSocket = connectSocket();
            initSocket.on('connect', () => {
                setIsConnected(true);
            });
            initSocket.on('disconnect', () => {
                setIsConnected(false);
            });
            setSocket(initSocket);
            listenEvents(initSocket)
        }
        return () => {
            initSocket.off("connect");
            initSocket.off("disconnect");
            initSocket.disconnect()
        };
    }, [])
    return { isSocketConnected, sendSocketRequest, meetData, addNewScreenMedia, addNewUserStream, deleteScreenMedia, deleteUserStream, getAMedia, updateSelfStream }
}