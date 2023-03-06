import { useEffect, useState } from "react";
import { StreamOptions } from "../types";

export default function useScreenCapture(requestedMedia: StreamOptions) {
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [streamTrack, setStreamTrack] = useState<boolean>(false);
    async function enableStream() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia(
                requestedMedia
            );
            setScreenStream(stream);
            setStreamTrack(true);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        if (!screenStream) {
        } else {
            return function cleanup() {
                screenStream.getTracks().forEach((track) => {
                    track.stop();
                });
            };
        }
    }, [requestedMedia])
    return { enableStream, screenStream, streamTrack }
}