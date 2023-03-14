import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { CAPTURE_OPTIONS, MEETDATA, SCREENMEDIA, SCREEN_CAPTURE_OPTIONS, STREAMS, USERSTREAM } from "../types";
import useHandlePinUnpin from "./handlePinUnpin";
import useScreenCapture from "./screenCapture";
import { useUserMedia } from "./userStream";

export default function useMeetHooks(meetData: MEETDATA | null, streams: STREAMS, addNewUserStream: (newUserStream: USERSTREAM) => void, addNewScreenMedia: (newMedia: SCREENMEDIA) => void, getAMedia: (id: string) => USERSTREAM | SCREENMEDIA | null, updateSelfStream: (media: USERSTREAM) => void) {
    const { user } = useAuth();
    const { mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera } =
        useUserMedia(CAPTURE_OPTIONS);
    const { screenStream, streamTrack, enableStream } = useScreenCapture(
        SCREEN_CAPTURE_OPTIONS
    );
    const [initialRender, setInitialRender] = useState(true)
    useEffect(() => {
        if (mediaStream && meetData?.participants.length !== 0 && initialRender) {
            console.log(mediaStream);
            setInitialRender(false)
            let name = '';
            if (user) {
                name = user.firstName + ' ' + user.lastName;
            }
            const selfStream: USERSTREAM = {
                title: name,
                stream: mediaStream,
                videoTrack,
                audioTrack,
                id: 'self',
                isPinned: meetData?.participants.length === 1 ? true : false // if self is present pin him
            }
            addNewUserStream(selfStream);
            console.log('Meeting data set with self stream');

        }
    }, [mediaStream, meetData])

    useEffect(() => {
        if (screenStream) {
            console.log(screenStream);
            let name = '';
            if (user) {
                name = user.firstName;
            }
            const newMedia: SCREENMEDIA = {
                stream: screenStream,
                title: name + ' is presenting their screen',
                streamTrack: true,
                id: 'screen',
                isPinned: true
            }
            addNewScreenMedia(newMedia)
        }
    }, [screenStream])
    const { pinnedStream, unpinnedStreams } = useHandlePinUnpin(streams)
    return {
        mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera, screenStream, streamTrack, enableStream, pinnedStream, unpinnedStreams
    }
}