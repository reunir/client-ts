import { useUserMedia } from '../../hooks/userStream';
import { CAPTURE_OPTIONS } from '../../types';

export default function VoiceSetup() {
  const {
    mediaStream,
    videoTrack,
    audioTrack,
    toggleAudio,
    toggleCamera,
    enableUserStream,
  } = useUserMedia(CAPTURE_OPTIONS);

  return <div></div>;
}
