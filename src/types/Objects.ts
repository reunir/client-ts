import { userType } from "./User";

export type SignupObject = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    seed: string;
    stripe: string;
    backgroundColor: string;
    phone: string,
    isEmailVerified: boolean
};

export type ChatObject = {
    allChats: AChat[] | null
}

export type AChat = {
    senderEmail: string,
    inReplyTo: number,
    senderName: string,
    text: string,
    timeAndDate: string
    language: string,
    reacts: [],
    type: string
}


export type ModifiedChatObject = {
    allChats?: AChat[]
}

export enum WHICHSTREAM {
    SCREEN = 'screen',
    USER = 'user',
    NONE = ''
}

export type PINNEDSTREAM = {
    type: WHICHSTREAM;
    screenMedia: SCREENMEDIAS;
    userStream: USERSTREAMS
}

export type UNPINNEDSTREAMS = {
    screenMedias: SCREENMEDIAS,
    userStreams: USERSTREAMS,
    length: number
}

export type SCREENMEDIA = {
    id: string;
    stream: null | MediaStream;
    title: string;
    isPinned: boolean;
    streamTrack: boolean
}

export type USERSTREAM = {
    title: string;
    stream: null | MediaStream;
    id: string;
    isPinned: boolean;
    videoTrack: boolean;
    audioTrack: boolean;
}

export type USERSTREAMS = USERSTREAM[]
export type SCREENMEDIAS = SCREENMEDIA[]

export type MEETDATA = {
    participants: {
        length: number,
        userIds: string[],
        data: userType[]
    },
    type: string,
    meetId: string,
    admin: string,
    chats: AChat[] | null
    fileHistory: [string] | null
}

export type STREAMS = {
    screenMedias: SCREENMEDIAS;
    userStreams: USERSTREAMS;
}
export type ModifiedSignupObject = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    seed?: string;
    stripe?: string;
    backgroundColor?: string
    isEmailVerified?: boolean
    phone?: string,
}