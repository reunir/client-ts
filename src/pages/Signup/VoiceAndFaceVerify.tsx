import { useUserMedia } from '../../hooks/userStream';
import { CAPTURE_OPTIONS } from '../../types';

export default function VoiceAndFaceVerify() {
  const { mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera } =
    useUserMedia(CAPTURE_OPTIONS);

  return <div></div>;
}
