import { useState } from "react";
import { MEETDATA, SCREENMEDIA, USERSTREAM } from "../types";

export default function useMeetData() {
    const [meetData, setMeetData] = useState<MEETDATA>({
        participants: {
            length: 1,
            userIds: ['1234']
        },
        userStreams: null,
        screenMedias: null
    });

    const getAMedia = (id: string): USERSTREAM | SCREENMEDIA | null => {
        if (meetData) {
            if (meetData.userStreams) {
                for (let i = 0; i < meetData.userStreams.length; i++) {
                    if (meetData.userStreams[i].id === id) {
                        return meetData.userStreams[i];
                    }
                }
            }
            if (meetData.screenMedias) {
                for (let i = 0; i < meetData.screenMedias.length; i++) {
                    if (meetData.screenMedias[i].id === id) {
                        return meetData.screenMedias[i];
                    }
                }
            }
            return null;
        }
        return null;
    }
    const addNewScreenMedia = (newMedia: SCREENMEDIA) => {
        if (meetData) {
            const oldScreenMedia = meetData.screenMedias;
            if (oldScreenMedia) {
                const newScreenMedias = [...oldScreenMedia, newMedia];
                setMeetData({ ...meetData, screenMedias: newScreenMedias })
                return;
            }
        }
    }

    const deleteScreenMedia = (id: string) => {
        if (meetData) {
            const screenMedias = meetData.screenMedias;
            let indexOfMedia = -1;
            if (screenMedias) {
                for (let i = 0; i < screenMedias.length; i++) {
                    if (screenMedias[i].id === id) {
                        indexOfMedia = i;
                        break;
                    }
                }
                if (indexOfMedia != -1) {
                    const newScreenMedias = screenMedias.splice(indexOfMedia, 1);
                    setMeetData({ ...meetData, screenMedias: newScreenMedias })
                    return;
                }
            }
        }
    }

    const addNewUserStream = (newUserStream: USERSTREAM) => {
        // console.log(newUserStream);
        if (meetData) {
            const oldUserMedia = meetData.userStreams;
            if (oldUserMedia) {
                const newUserMedias = [...oldUserMedia, newUserStream];
                setMeetData({ ...meetData, userStreams: newUserMedias })
                return;
            }
            setMeetData({ ...meetData, userStreams: [newUserStream] })
        }
    }

    const deleteUserStream = (id: string) => {
        if (meetData) {
            const userStreams = meetData.userStreams;
            let indexOfStream = -1;
            if (userStreams) {
                for (let i = 0; i < userStreams.length; i++) {
                    if (userStreams[i].id === id) {
                        indexOfStream = i;
                        break;
                    }
                }
                if (indexOfStream != -1) {
                    const newuserStreams = userStreams.splice(indexOfStream, 1);
                    setMeetData({ ...meetData, userStreams: newuserStreams })
                    return;
                }
            }
        }
    }

    const updateSelfStream = (media: USERSTREAM) => {
        if (meetData) {
            const userStreams = meetData.userStreams;
            let indexOfStream = -1;
            if (userStreams) {
                for (let i = 0; i < userStreams.length; i++) {
                    if (userStreams[i].id === 'self') {
                        indexOfStream = i;
                        break;
                    }
                }
                if (indexOfStream != -1) {
                    const newuserStreams = userStreams.splice(indexOfStream, 1);
                    setMeetData({ ...meetData, userStreams: [...newuserStreams, media] })
                    return;
                }
            }
        }
    }

    return {
        meetData,
        getAMedia,
        addNewScreenMedia,
        addNewUserStream,
        deleteScreenMedia,
        deleteUserStream,
        updateSelfStream
    }
}