export interface userInterface {
    email: string,
    firstName: string,
    lastName: string,
    seed: string,
    stripe: string,
    backgroundColor: string,
    role: string,
    id: string
}
export type userType = userInterface | null;

export type StreamOptions = {
    audio: boolean;
    video: boolean;
}

export const SCREEN_CAPTURE_OPTIONS: StreamOptions = {
    audio: false,
    video: true
}

export const CAPTURE_OPTIONS: StreamOptions = {
    audio: true,
    video: true,
};
export const AUDIO_CAPTURE_OPTIONS: StreamOptions = {
    audio: true,
    video: false,
};
export const VIDEO_CAPTURE_OPTIONS: StreamOptions = {
    audio: false,
    video: true,
};

export enum TEMPLATETYPE {
    VERIFY = 'VERIFY',
    FORGET = 'FORGET'
}