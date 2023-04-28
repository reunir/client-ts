import React, { useEffect, useRef, useState } from 'react';
import AudioVisualizer from '../../AudioVisualizer';
import {
  Camera as Cam,
  Mic,
  CameraOff,
  Pin,
} from '@styled-icons/fluentui-system-filled';
import { useOutletContext } from 'react-router';
import { SOCKETEVENTS, SOCKETREQUEST } from '../../../types/Socket';
export default function Camera({
  videoRenderRef,
  mediaStream,
  id,
  title,
  unpinned,
}: {
  videoRenderRef: React.RefObject<HTMLDivElement>;
  mediaStream: MediaStream | null;
  id: string;
  title: string;
  unpinned: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const [initialRender, setInitialRender] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const { meetData, sendSocketRequest } = useOutletContext<any>();
  const [videoTrack, setVideoTrack] = useState(
    mediaStream?.getTracks().find((track) => track.kind === 'video')?.enabled
      ? true
      : false
  );
  const [audioTrack, setAudioTrack] = useState(
    mediaStream?.getTracks().find((track) => track.kind === 'audio')?.enabled
      ? true
      : false
  );
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
  const turnOtherMicOn = () => {
    const req: SOCKETREQUEST = {
      data: {
        to: id,
      },
      userId: '',
      meetId: meetData.id,
      type: '',
    };
    sendSocketRequest(SOCKETEVENTS.REQUEST_TURN_MIC_ON, req);
  };
  useEffect(() => {
    if (videoRenderRef.current) {
      const boundingRect = videoRenderRef.current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setWindowSize([Math.round(width), Math.round(height)]);
    }
  }, [videoRenderRef, initialRender]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  });
  useEffect(() => {
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = mediaStream;
      setVideoStream(videoRef.current.srcObject);
      setInitialRender(true);
    }
  });
  useEffect(() => {
    if (videoStream) {
      console.log(videoStream);
      setVideoTrack(
        videoStream.getTracks().find((track) => track.kind === 'video')?.enabled
          ? true
          : false
      );
      setAudioTrack(
        videoStream.getTracks().find((track) => track.kind === 'audio')?.enabled
          ? true
          : false
      );
    }
  }, [videoStream]);
  const [ifSpeaking, setIfSpeaking] = useState(false);
  return (
    <div
      className={`grid relative self-center`}
      style={{
        width: '250px',
        height: '100px',
      }}
    >
      <div
        className={`grid ${
          videoTrack ? '' : 'border border-gray-400 bg-gray-400'
        } overflow-hidden justify-center w-fit h-fit`}
      >
        <div
          className={`${
            videoTrack &&
            videoStream?.getTracks().find((track) => track.kind === 'video')
              ?.enabled
              ? 'block'
              : 'hidden'
          } rounded-md peer cursor-pointer relative overflow-hidden ${
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
            {title}
          </div>
        </div>
        <AudioVisualizer
          className={
            videoTrack &&
            videoStream?.getTracks().find((track) => track.kind === 'video')
              ?.enabled
              ? 'hidden'
              : 'block'
          }
          setIfSpeaking={setIfSpeaking}
          audioTrack={audioTrack}
          stream={videoStream}
        />
        <div className="absolute bg-gray-700/80 cursor-pointer top-0 left-0 w-[250px] h-[189px] hover:grid hidden peer-hover:grid">
          <div className="grid gap-[15px] text-gray-200 rounded-[50%] grid-flow-col place-self-center w-fit h-fit px-[10px]">
            <div onClick={turnOtherMicOn} className="grid">
              <Mic width={25} />
            </div>
            <div className="grid">
              <Pin width={25} />
            </div>
            <div className="grid">
              {videoTrack ? <Cam width={25} /> : <CameraOff width={25} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
