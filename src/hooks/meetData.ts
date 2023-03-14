import { useEffect, useState } from "react";
import { MEETDATA, SCREENMEDIA, STREAMS, USERSTREAM } from "../types";

export default function useMeetData() {
    const tempMeetData: MEETDATA = {
        participants: {
            length: 0,
            userIds: []
        },
        meetId: "",
        type: "",
        admin: "",
    }
    const tempStreams: STREAMS = {
        userStreams: null,
        screenMedias: null,
    }
    const [meetData, setMeetData] = useState<MEETDATA>(tempMeetData);
    const [streams, setStreams] = useState<STREAMS>(tempStreams)
    useEffect(() => {
        console.log('Updated Meet Data:', meetData);
    }, [meetData])
    useEffect(() => {
        console.log('Updated Streams:', streams);
    }, [streams])
    const getPinnedScreen = () => {
        if (streams) {
            if (streams.screenMedias) {
                let pinnedStream: SCREENMEDIA | undefined;
                let pinnedIndex = -1;
                pinnedStream = streams.screenMedias.find((stream, index) => {
                    if (stream.isPinned)
                        pinnedIndex = index
                    return stream.isPinned;
                });
                if (pinnedIndex === -1) {
                    return undefined
                }
                return { pinnedIndex, pinnedStream };
            }
        }
    }
    const getPinnedUsers = () => {
        if (streams) {
            if (streams.userStreams) {
                let pinnedStream: USERSTREAM | undefined;
                let pinnedIndex = -1;
                pinnedStream = streams.userStreams.find((stream, index) => {
                    if (stream.isPinned)
                        pinnedIndex = index
                    return stream.isPinned;
                });
                if (pinnedIndex === -1) {
                    return undefined
                }
                return { pinnedIndex, pinnedStream };
            }
        }
    }

    const clearPinnedStreams = () => {
        if (streams) {
            let pinnedStream = getPinnedScreen();
            if (pinnedStream) {
                if (pinnedStream.pinnedStream) {
                    pinnedStream.pinnedStream.isPinned = false
                    const allScreenStreams = streams.screenMedias;
                    if (allScreenStreams) {
                        allScreenStreams.splice(pinnedStream.pinnedIndex, 1);
                        allScreenStreams.unshift(pinnedStream.pinnedStream);
                        setStreams({ ...streams, screenMedias: allScreenStreams })
                    }
                }
            } else {
                let pinnedUserStream = getPinnedUsers();
                if (pinnedUserStream) {
                    if (pinnedUserStream.pinnedStream) {
                        pinnedUserStream.pinnedStream.isPinned = false
                        const allUserStreams = streams.userStreams;
                        if (allUserStreams) {
                            allUserStreams.splice(pinnedUserStream.pinnedIndex, 1);
                            allUserStreams.unshift(pinnedUserStream.pinnedStream);
                            setStreams({ ...streams, userStreams: allUserStreams })
                        }
                    }
                }
            }
        }
    }

    const getAMedia = (id: string): USERSTREAM | SCREENMEDIA | null => {
        if (streams) {
            if (streams.userStreams) {
                for (let i = 0; i < streams.userStreams.length; i++) {
                    if (streams.userStreams[i].id === id) {
                        return streams.userStreams[i];
                    }
                }
            }
            if (streams.screenMedias) {
                for (let i = 0; i < streams.screenMedias.length; i++) {
                    if (streams.screenMedias[i].id === id) {
                        return streams.screenMedias[i];
                    }
                }
            }
            return null;
        }
        return null;
    }
    const addNewScreenMedia = (newMedia: SCREENMEDIA) => {
        clearPinnedStreams()
        if (streams) {
            const oldScreenMedia = streams.screenMedias;
            if (oldScreenMedia) {
                const newScreenMedias = [...oldScreenMedia, newMedia];
                setStreams({ ...streams, screenMedias: newScreenMedias })
                return;
            } else {
                setStreams({ ...streams, screenMedias: [newMedia] })
            }
        }
    }

    const deleteScreenMedia = (id: string) => {
        if (streams) {
            const screenMedias = streams.screenMedias;
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
                    setStreams({ ...streams, screenMedias: newScreenMedias })
                    return;
                }
            }
        }
    }

    const addNewUserStream = (newUserStream: USERSTREAM) => {
        console.log(streams);
        if (streams) {
            const oldUserMedia = streams.userStreams;
            if (oldUserMedia) {
                const newUserMedias = [...oldUserMedia, newUserStream];
                console.log("updated media:", newUserMedias);
                setStreams({ ...streams, userStreams: newUserMedias })
                return;
            }
            setStreams({ ...streams, userStreams: [newUserStream] })
        }
    }

    const deleteUserStream = (id: string) => {
        if (streams) {
            const userStreams = streams.userStreams;
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
                    setStreams({ ...streams, userStreams: newuserStreams })
                    return;
                }
            }
        }
    }

    const updateSelfStream = (media: USERSTREAM) => {
        if (streams) {
            const userStreams = streams.userStreams;
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
                    setStreams({ ...streams, userStreams: [...newuserStreams, media] })
                    return;
                }
            }
        }
    }

    return {
        meetData,
        streams,
        getAMedia,
        addNewScreenMedia,
        addNewUserStream,
        deleteScreenMedia,
        deleteUserStream,
        updateSelfStream,
        setMeetData,
        clearPinnedStreams
    }
}