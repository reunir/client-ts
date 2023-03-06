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
  audioTrack,
}: {
  videoRenderRef: React.RefObject<HTMLDivElement>;
  mediaStream: MediaStream | null;
  videoTrack: boolean;
  audioTrack: boolean;
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
        {videoTrack &&
        mediaStream?.getTracks().find((track) => track.kind === 'video')
          ?.enabled ? (
          <video
            className={`-scale-x-100 -top-[1px] h-full -left-[1px] pointer-events-none`}
            ref={videoRef}
            onCanPlay={handleCanPlay}
            autoPlay
            playsInline
          />
        ) : (
          <AudioVisualizer audioTrack={audioTrack} stream={mediaStream} />
        )}
      </div>
    </div>
  );
}
