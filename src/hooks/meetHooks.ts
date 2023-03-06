import { useEffect } from "react";
import { CAPTURE_OPTIONS, MEETDATA, SCREENMEDIA, SCREEN_CAPTURE_OPTIONS, USERSTREAM } from "../types";
import useHandlePinUnpin from "./handlePinUnpin";
import useScreenCapture from "./screenCapture";
import { useUserMedia } from "./userStream";

export default function useMeetHooks(meetData: MEETDATA | null, addNewUserStream: (newUserStream: USERSTREAM) => void, getAMedia: (id: string) => USERSTREAM | SCREENMEDIA | null, updateSelfStream: (media: USERSTREAM) => void) {
    const { mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera } =
        useUserMedia(CAPTURE_OPTIONS);
    const { screenStream, streamTrack, enableStream } = useScreenCapture(
        SCREEN_CAPTURE_OPTIONS
    );
    useEffect(() => {
        const selfStream: USERSTREAM = {
            title: 'Self',
            stream: mediaStream,
            videoTrack,
            audioTrack,
            id: 'self',
            isPinned: meetData?.participants.length === 1 // if self is present pin him
        }
        // if (!getAMedia('self')) {
        addNewUserStream(selfStream);
        // } else {
        //     updateSelfStream(selfStream)
        // }
    }, [mediaStream])
    const { pinnedStream, unpinnedStreams } = useHandlePinUnpin(meetData)
    return {
        mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera, screenStream, streamTrack, enableStream, pinnedStream, unpinnedStreams
    }
}