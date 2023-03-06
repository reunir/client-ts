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

export enum WHICHSTREAM {
    SCREEN = 'screen',
    USER = 'user'
}

export type PINNEDSTREAM = {
    type: WHICHSTREAM;
    screenMedia: SCREENMEDIA | null;
    userStream: USERSTREAM | null
}

export type UNPINNEDSTREAMS = {
    screenMedias: SCREENMEDIAS | null,
    userStreams: USERSTREAMS | null
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
        userIds: string[]
    }
    screenMedias: null | SCREENMEDIAS;
    userStreams: null | USERSTREAMS;
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