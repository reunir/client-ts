import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { MEETDATA, SCREENMEDIA, STREAMS, USERSTREAM } from "../types";

export default function useMeetData() {
    const tempMeetData: MEETDATA = {
        participants: {
            length: 0,
            userIds: [],
            data: []
        },
        meetId: "",
        type: "",
        admin: "",
        chats: null,
        fileHistory: null
    }
    const [meetData, setMeetData] = useState<MEETDATA>(tempMeetData);
    const tempStreams: STREAMS = {
        userStreams: null,
        screenMedias: null,
    };
    const [streams, setStreams] = useState<STREAMS>(tempStreams);
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
            let oldUserMedia = streams.userStreams;
            let newStreams: STREAMS;
            if (oldUserMedia) {
                console.log(oldUserMedia.concat(newUserStream));
            } else {
                oldUserMedia = [newUserStream]
            }
            console.log("User streams:", oldUserMedia);

            setStreams(old => ({
                ...old,
                userStreams: oldUserMedia
            }))
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

    return {
        meetData,
        streams,
        setStreams,
        addNewScreenMedia,
        addNewUserStream,
        deleteScreenMedia,
        deleteUserStream,
        setMeetData,
        clearPinnedStreams
    }
}