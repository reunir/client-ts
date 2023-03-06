import { dataInterface, errorInterface } from ".";

export enum SOCKETEVENTS {
    CREATE = 'create',
    JOIN_ROOM = "join_room",
    ALLOW_IN = "allow_in",
    DENY = "deny",
    SUCCESSFULL_CREATE = "successfully_create",
    USER_JOINED = "user_joined"
}
export interface SOCKETREQ {
    data: any,
    userId: string,
    type: string,
    meetId: string
}

export interface SOCKETRESPONSE<T> {
    success: boolean,
    data: dataInterface<T> | null,
    error: errorInterface | null,
}

export type SOCKETREQUEST = SOCKETREQ | null;