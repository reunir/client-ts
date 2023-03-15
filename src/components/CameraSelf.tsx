import React, { useEffect, useRef, useState } from 'react';
import AudioVisualizer from './AudioVisualizer';
export default function Camera({
  videoRenderRef,
  mediaStream,
  videoTrack,
  audioTrack,
  id,
  unpinned,
}: {
  videoRenderRef: React.RefObject<HTMLDivElement>;
  mediaStream: MediaStream | null;
  videoTrack: boolean;
  audioTrack: boolean;
  id: string;
  unpinned: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const [initialRender, setInitialRender] = useState(false);
  function cameraDismount() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  }

  function handleCanPlay() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }
  function stopPlay() {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }

  useEffect(() => {
    if (videoRenderRef.current) {
      const boundingRect = videoRenderRef.current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setWindowSize([Math.round(width), Math.round(height)]);
    }
  }, [videoRenderRef, initialRender]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  });
  useEffect(() => {
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = mediaStream;
      setInitialRender(true);
    }
  });
  const [ifSpeaking, setIfSpeaking] = useState(false);
  return (
    <div
      className={`grid relative self-center`}
      style={{
        width: windowSize[0] + 'px',
        height: windowSize[1] + 'px',
      }}
    >
      <div
        className={`grid ${
          videoTrack ? '' : 'border border-gray-400 bg-gray-400'
        } overflow-hidden justify-center ${unpinned ? 'w-fit h-fit' : ''}`}
        style={
          unpinned
            ? {}
            : {
                width: windowSize[0] + 'px',
                height: windowSize[1] + 'px',
              }
        }
      >
        <div
          className={`${
            mediaStream?.getTracks().find((track) => track.kind === 'video')
              ?.enabled
              ? 'block'
              : 'hidden'
          } rounded-md relative overflow-hidden ${
            ifSpeaking ? 'border-[rgb(138,180,248)] border-[3px]' : ''
          }`}
        >
          <video
            className={`-scale-x-100 -top-[1px] h-full -left-[1px] pointer-events-none`}
            ref={videoRef}
            id={id + '-video'}
            onCanPlay={handleCanPlay}
            autoPlay
            playsInline
          />
          <div
            style={{
              textShadow:
                '0px 4px 3px rgba(0,0,0,0.4),0px 8px 13px rgba(0,0,0,0.1),0px 18px 23px rgba(0,0,0,0.1)',
            }}
            className="absolute left-[10px] bottom-[10px] text-white font-semibold text-[15px]"
          >
            You
          </div>
        </div>
        <AudioVisualizer
          className={
            videoTrack &&
            mediaStream?.getTracks().find((track) => track.kind === 'video')
              ?.enabled
              ? 'hidden'
              : 'block'
          }
          setIfSpeaking={setIfSpeaking}
          audioTrack={audioTrack}
          stream={mediaStream}
        />
      </div>
    </div>
  );
}
