import { useState, useEffect } from 'react';
import { StreamOptions } from '../types';
export function useUserMedia(requestedMedia: StreamOptions) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoTrack, setVideoTrack] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<boolean>(false);

  const toggleCamera = () => {
    let localVideoTrack = mediaStream?.getTracks().find((track) => track.kind === 'video');
    if (localVideoTrack) {
      if (localVideoTrack.enabled) {
        localVideoTrack.enabled = false;
        setVideoTrack(false);
      } else {
        localVideoTrack.enabled = true;
        setVideoTrack(true);
      }
    }
  }

  const toggleAudio = () => {
    let localAudioTrack = mediaStream?.getTracks().find((track) => track.kind === 'audio');
    if (localAudioTrack) {
      if (localAudioTrack.enabled) {
        localAudioTrack.enabled = false;
        setAudioTrack(false);
      } else {
        localAudioTrack.enabled = true;
        setAudioTrack(true);
      }
    }
  }

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          requestedMedia
        );
        setMediaStream(stream);
        setAudioTrack(true);
        setVideoTrack(true);
      } catch (err) {
        console.log(err);
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return { mediaStream, toggleAudio, toggleCamera, videoTrack, audioTrack };
}
