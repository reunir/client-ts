import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { CAPTION, CAPTIONS, MEETDATA, SCREENMEDIA, STREAMS, USERSTREAM } from "../types";

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
    const [captions, setCaptions] = useState<CAPTIONS>(null)
    const tempStreams: STREAMS = {
        userStreams: [],
        screenMedias: [],
    };
    const [streams, setStreams] = useState<STREAMS>(tempStreams);
    useEffect(() => {
        console.log('Updated Meet Data:', meetData);
    }, [meetData])
    useEffect(() => {
        console.log('Updated Streams:', streams);
    }, [streams])
    const getPinnedScreen = () => {
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

    const updateCaptions = (newCaption: CAPTION) => {

        let index = -1
        const ifPresent = captions?.find((val: CAPTION, i) => {
            if (val.username === newCaption.username) {
                index = i
                return true
            }
            return false
        })
        console.log(ifPresent);

        if (ifPresent) {
            if (captions) {
                let captionObj: CAPTION = {
                    username: captions[index].username,
                    caption: captions[index].caption + " " + newCaption.caption
                }
                const oldCaptions = captions
                oldCaptions[index] = captionObj
                setCaptions([...oldCaptions])
            }
        } else {
            if (captions) {
                let captionObj: CAPTION = {
                    username: newCaption.username,
                    caption: newCaption.caption
                }
                const newCaptions = captions
                newCaptions.push(captionObj)
                setCaptions([...newCaptions])
            } else {
                let captionObj: CAPTION = {
                    username: newCaption.username,
                    caption: newCaption.caption
                }
                setCaptions([captionObj])
            }
        }
    }

    const getPinnedUsers = () => {
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

    const clearPinnedStreams = () => {
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
    const addNewScreenMedia = (newMedia: SCREENMEDIA) => {
        clearPinnedStreams()
        const oldScreenMedia = streams.screenMedias;
        let twice = false;
        for (let stream in oldScreenMedia) {
            if (oldScreenMedia[stream].id === newMedia.id) {
                twice = true;
                break;
            }
        }
        if (!twice) {
            oldScreenMedia.push(newMedia)
            setStreams(old => ({
                ...old,
                screenMedias: oldScreenMedia
            }))
        }
    }

    const deleteScreenMedia = (id: string) => {
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

    const addNewUserStream = (newUserStream: USERSTREAM) => {
        let oldUserMedia = streams.userStreams;
        console.log(oldUserMedia);
        let twice = false;
        for (let stream in oldUserMedia) {
            if (oldUserMedia[stream].id === newUserStream.id) {
                twice = true;
                break;
            }
        }
        if (!twice) {
            oldUserMedia.push(newUserStream)
            setStreams(old => ({
                ...old,
                userStreams: oldUserMedia
            }))
            return true;
        }
    }

    const deleteUserStream = (id: string) => {
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

    return {
        meetData,
        streams,
        setStreams,
        addNewScreenMedia,
        addNewUserStream,
        deleteScreenMedia,
        deleteUserStream,
        setMeetData,
        clearPinnedStreams,
        updateCaptions,
        captions
    }
}