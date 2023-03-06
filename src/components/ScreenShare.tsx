import { createRef, useEffect } from 'react';
import useScreenCapture from '../hooks/screenCapture';
import { SCREEN_CAPTURE_OPTIONS } from '../types';

export default function ScreenShare({
  screenStream,
  streamTrack,
}: {
  screenStream: MediaStream | null;
  streamTrack: boolean;
}) {
  const videoRef = createRef<HTMLVideoElement>();
  useEffect(() => {
    if (screenStream && videoRef.current && !videoRef.current.srcObject) {
      console.log(screenStream);
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);
  return streamTrack ? (
    <div className="grid w-[700px]">
      <video autoPlay playsInline ref={videoRef}></video>
    </div>
  ) : (
    <></>
  );
}
