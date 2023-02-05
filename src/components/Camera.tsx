import React, { useEffect, useRef, useState } from 'react';
import { useCardRatio } from '../hooks/useRatio';
import Measure, { ContentRect } from 'react-measure';
import { useUserMedia } from '../hooks/userStream';
import { CAPTURE_OPTIONS } from '../types';
import Avatar from './Avatar';
import AudioVisualizer from './AudioVisualizer';
export default function Camera({
  videoRenderRef,
  mediaStream,
  videoTrack,
}: {
  videoRenderRef: React.RefObject<HTMLDivElement>;
  mediaStream: MediaStream | null;
  videoTrack: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }
  function handleCanPlay() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }
  useEffect(() => {
    if (videoRenderRef.current) {
      setWindowSize([
        videoRenderRef.current?.clientWidth,
        videoRenderRef.current?.clientHeight,
      ]);
    }
  }, [
    videoRenderRef.current?.clientWidth,
    videoRenderRef.current?.clientHeight,
  ]);

  return (
    <div
      className={`grid relative self-center`}
      style={{
        width: windowSize[0] + 'px',
        height: windowSize[1] + 'px',
      }}
    >
      <div
        className={`grid rounded-[10px] ${
          videoTrack ? 'justify-center' : 'border border-gray-400 bg-gray-400'
        } overflow-hidden`}
        style={{
          width: windowSize[0] + 'px',
          height: windowSize[1] + 'px',
        }}
      >
        {videoTrack ? (
          <video
            className={`-scale-x-100 -top-[1px] h-full -left-[1px] pointer-events-none`}
            ref={videoRef}
            onCanPlay={handleCanPlay}
            autoPlay
            playsInline
            muted
          />
        ) : (
          <AudioVisualizer stream={mediaStream} />
        )}
      </div>
    </div>
  );
}
