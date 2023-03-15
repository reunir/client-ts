import io, { Socket } from "socket.io-client";
import React, { useState, useEffect } from 'react';
import utilSocket from "../utils/socket";
import { SOCKETEVENTS, SOCKETREQUEST, SOCKETRESPONSE } from "../types/Socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useNavigate } from "react-router-dom";
import useMeetData from "./meetData";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { AChat, MEETDATA, PeerDataType, ResponseType, SCREENMEDIA, STREAMS, USERSTREAM, userType } from "../types";
import { useAuth } from "../context/auth-context";
import axios from "axios";
export default function useMeetSocket(socket: Socket<DefaultEventsMap, DefaultEventsMap>, addNotification: any, addError: any, peerId: string, meetData: MEETDATA, addNewScreenMedia: (newMedia: SCREENMEDIA) => void, addNewUserStream: (newMedia: USERSTREAM) => void, setMeetData: React.Dispatch<React.SetStateAction<MEETDATA>>, clearPinnedStreams: () => void, enableUserStream: () => Promise<void>) {
    const [isSocketConnected, setIsConnected] = useState(false);
    const [myPeer, setMyPeer] = useState<Peer>(new Peer(peerId, {
        host: 'localhost',
        port: 9000,
        path: '/',
    }))

    const navigate = useNavigate();
    const { user } = useAuth();
    const getUserAvatars = async (participants: string[]) => {
        const data: userType[] = [];
        const pars = participants[0].split(',')
        for (let participant in pars) {
            console.log(pars[participant]);
            const res = await axios.post('user/getDetails', { id: pars[participant] });
            const userdata = res.data as ResponseType<userType>
            if (userdata.data) {
                data.push(userdata.data.body)
            }
        }
        return data;
    }
    function listenEvents(socket: Socket<DefaultEventsMap, DefaultEventsMap>) {

        socket.on(SOCKETEVENTS.HAND_RAISED, (args: SOCKETRESPONSE<any>) => {
            console.log(args)
            addNotification({ message: args.data?.body.message })
        })

        socket.on(SOCKETEVENTS.RECIEVE_MESSAGE, (args: SOCKETRESPONSE<AChat>) => {
            console.log(args);
            let oldchats = meetData.chats;
            let newChat: AChat;
            if (args.data?.body) {
                newChat = args.data.body
                if (oldchats) {
                    oldchats.concat([newChat])
                } else {
                    oldchats = [newChat]
                }
                setMeetData({
                    ...meetData,
                    chats: oldchats
                })
            }
        })

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
        socket.on(SOCKETEVENTS.SUCCESSFULL_JOIN, async (args: SOCKETRESPONSE<any>) => {
            console.log('Successfully joined:', args);

            const meetDetails = args.data?.body.meetDetails
            let meetChats = meetDetails.chatHistory;
            let finalChats: AChat[] | null = [];
            if (meetChats.length === 1 && meetChats[0] === '') {
                finalChats = null
            } else {
                for (let chat in meetChats) {
                    let chatObj = JSON.parse(chat) as AChat
                    finalChats?.push(chatObj)
                }
            }
            const data = await getUserAvatars(meetDetails.participants)
            setMeetData({
                participants: {
                    length: meetDetails.participantCount,
                    userIds: meetDetails.participants,
                    data
                },
                meetId: meetDetails.meetId,
                type: meetDetails.type,
                admin: meetDetails.admin,
                chats: finalChats,
                fileHistory: meetDetails.fileHistory
            })
            enableUserStream()
            console.log('Meeting data set');
        })
        socket.on(SOCKETEVENTS.RECEIVE_STREAM_TYPE, (args: SOCKETRESPONSE<any>) => { // recently joined user
            console.log(args)
            const req: SOCKETREQUEST = {
                data: {
                    ack: true,
                    peerId: myPeer.id,
                    to: args.data?.body.socketId,
                    user: user
                },
                meetId: '',
                userId: '',
                type: ''
            }
            socket.emit(SOCKETEVENTS.SEND_ACK, req)
            myPeer.on("call", (call) => {
                const videoElem = document.getElementById('self-video') as HTMLVideoElement;
                const stream = videoElem.srcObject as MediaStream
                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    console.log(`Stream came from remote ${remoteStream.id}`);
                    if (args.data?.body.streamType === "userstream") {
                        const newUserStream: USERSTREAM = {
                            title: args.data.body.userName,
                            stream: remoteStream,
                            id: args.data.body.socketId,
                            isPinned: false,
                            videoTrack: remoteStream.getTracks().find((track) => track.kind === 'video')?.enabled ? true : false,
                            audioTrack: remoteStream.getTracks().find((track) => track.kind === 'audio')?.enabled ? true : false,
                        }
                        addNewUserStream(newUserStream)
                    }
                    else if (args.data?.body.streamType === "screenmedia") {
                        const newScreenMedia: SCREENMEDIA = {
                            title: '',
                            stream: remoteStream,
                            id: '',
                            isPinned: false,
                            streamTrack: remoteStream ? true : false
                        }
                        addNewScreenMedia(newScreenMedia)
                    }
                })
            })

        })
        socket.on(SOCKETEVENTS.USER_JOINED, async (args: SOCKETRESPONSE<any>) => {
            console.log(args.data?.body.peerId);
            addNotification({ message: args.data?.message });
            const meetDetails = args.data?.body.meetDetails
            let meetChats = meetDetails.chatHistory;
            let finalChats: AChat[] | null = [];
            if (meetChats.length === 1 && meetChats[0] === '') {
                finalChats = null
            } else {
                for (let chat in meetChats) {
                    let chatObj = JSON.parse(chat) as AChat
                    finalChats?.push(chatObj)
                }
            }
            const data = await getUserAvatars(meetDetails.participants)
            setMeetData({
                participants: {
                    length: meetDetails.participantCount,
                    userIds: meetDetails.participants,
                    data
                },
                meetId: meetDetails.meetId,
                type: meetDetails.type,
                admin: meetDetails.admin,
                chats: finalChats,
                fileHistory: meetDetails.fileHistory
            })
        })
        socket.on(SOCKETEVENTS.USER_HAS_JOINED_SUCCESSFULLY, (args: SOCKETRESPONSE<any>) => {
            const req: SOCKETREQUEST = {
                userId: user?.id || "",
                meetId: '',
                type: '',
                data: {
                    connectedSocket: args.data?.body.socketId,
                    streamType: 'userstream',
                    user: {
                        name: user?.firstName + ' ' + user?.lastName
                    }
                }
            }
            socket.emit(SOCKETEVENTS.SEND_STREAM_TYPE, req);
        })
        socket.on(SOCKETEVENTS.RECEIVE_ACK, (args: SOCKETRESPONSE<any>) => { // old user
            console.log(args);
            const videoElem = document.getElementById('self-video') as HTMLVideoElement;
            const stream = videoElem.srcObject as MediaStream
            const remotePeerCall = myPeer.call(args.data?.body.peerId, stream)
            if (remotePeerCall) {
                remotePeerCall.on("stream", (remoteStream) => {
                    console.log('My peer:', myPeer.id);

                    console.log(`Stream came from remote ${remoteStream.id}`);
                    if (meetData?.participants.length === 1) {
                        clearPinnedStreams();
                    }
                    const user = args.data?.body.user as userType;
                    const newUserStream: USERSTREAM = {
                        title: user?.firstName + ' ' + user?.lastName || "",
                        stream: remoteStream,
                        id: user?.id || "",
                        isPinned: false,
                        videoTrack: remoteStream.getTracks().find((track) => track.kind === 'video')?.enabled ? true : false,
                        audioTrack: remoteStream.getTracks().find((track) => track.kind === 'audio')?.enabled ? true : false,
                    }
                    console.log(newUserStream);
                    addNewUserStream(newUserStream)
                })
            }
        })

    }

    function sendSocketRequest(event: SOCKETEVENTS, data: SOCKETREQUEST) {
        if (socket) {
            if (socket.connected) {
                socket.emit(event, data);
            }
        }
    }
    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                setIsConnected(true);
            });
            socket.on('disconnect', () => {
                setIsConnected(false);
            });
            listenEvents(socket)
            console.log(socket);
            return () => {
                socket.disconnect()
            };
        }
    }, [])
    return { isSocketConnected, sendSocketRequest }
}