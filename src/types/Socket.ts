import { dataInterface, errorInterface } from ".";

export enum SOCKETEVENTS {
    CREATE = 'create',
    JOIN_ROOM = "join_room",
    ALLOW_IN = "allow_in",
    DENY = "deny",
    VERIFY = "verify",
    SUCCESSFULL_CREATE = "successfully_create",
    SUCCESSFULL_JOIN = "successfully_join",
    USER_JOINED = "user_joined",
    LEAVE_ROOM = "leave_room",
    USER_LEAVE = "user_leave",
    SEND_STREAM_TYPE = "send_stream_type",
    RECEIVE_STREAM_TYPE = "receive_stream_type",
    SEND_ACK = "send_ack",
    RECEIVE_ACK = "receive_ack",
    GET_MEET_DATA = "get_meet_data",
    SEND_MEET_DATA = "send_meet_data",
    SHARE_FILE = "share_file",
    RECIEVED_FILE = 'recieved_file',
    SEND_CAPTIONS = 'send_captions',
    RECIEVED_CAPTIONS = 'recieve_captions',
    SEND_MESSAGE = 'share_message',
    RECIEVE_MESSAGE = 'recieve_message',
    USER_HAS_JOINED_SUCCESSFULLY = "user_has_joined_successfully",
    I_JOINED_SUCCESSFULLY = "i_joined_successfully",
    RAISE_HAND = "raise_hand",
    HAND_RAISED = "hand_raised",
    POLL_SHARED = 'poll_shared',
    POLL_RECEIVED = 'poll_received',
    VIOLATION = "violation",
    REQUEST_TURN_MIC_ON = "request_turn_mic_on",
    ADMIN_SAY_TURN_MIC_ON = "admin_say_turn_mic_on"
}
export interface SOCKETREQ {
    data: any,
    userId: string,
    type: string,
    meetId: string,
    peerId?: string,
}

export interface SOCKETRESPONSE<T> {
    success: boolean,
    data: dataInterface<T> | null,
    error: errorInterface | null,
}

export type SOCKETREQUEST = SOCKETREQ | null;