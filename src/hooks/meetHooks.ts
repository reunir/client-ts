import { useEffect, useState } from "react";
import { useAuth } from "../context/auth-context";
import { CAPTURE_OPTIONS, MEETDATA, SCREENMEDIA, SCREEN_CAPTURE_OPTIONS, STREAMS, USERSTREAM } from "../types";
import useHandlePinUnpin from "./handlePinUnpin";
import useScreenCapture from "./screenCapture";
import { useUserMedia } from "./userStream";

export default function useMeetHooks(meetData: MEETDATA | null, streams: STREAMS, addNewUserStream: (newUserStream: USERSTREAM) => void, addNewScreenMedia: (newMedia: SCREENMEDIA) => void, getAMedia: (id: string) => USERSTREAM | SCREENMEDIA | null, updateSelfStream: (media: USERSTREAM) => void) {
    const { user } = useAuth();

    const [initialRender, setInitialRender] = useState(true)
}