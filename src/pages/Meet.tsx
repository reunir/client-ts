import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Camera from '../components/Camera';
import Header from '../components/Header';
import MeetControls from '../components/MeetControls';
import { useAuth } from '../context/auth-context';
import { useUserMedia } from '../hooks/userStream';
import { CAPTURE_OPTIONS } from '../types';
import MeetOutlet from './MeetOutlet';

export default function Meet() {
  const [isHeaderShown, setIsHeaderShown] = useState<boolean>(false);
  const [isMeetNavShown, setIsMeetNavShown] = useState<boolean>(false);
  const videoRenderRef = useRef<HTMLDivElement>(null);
  const { mediaStream, videoTrack, audioTrack, toggleAudio, toggleCamera } =
    useUserMedia(CAPTURE_OPTIONS);
  const { user } = useAuth();
  const { addError, addNotification } = useOutletContext<any>();
  useEffect(() => {
    addError({ status: false, error: { message: 'Temporary Error!' } });
    addNotification({ message: 'This is sample message!' });
  }, []);
  return (
    <div className="w-screen h-screen grid fixed bg-slate-300">
      <div
        id="headerHelper"
        className={`w-full max-h-fit ${
          isHeaderShown ? 'h-0' : 'h-[5px]'
        } absolute top-0 peer left-0 z-[3]`}
      ></div>
      <Header
        className={`peer-hover:animate-header header absolute z-[2]`}
        isHeaderShown={isHeaderShown}
        setIsHeaderShown={setIsHeaderShown}
      />
      <div
        ref={videoRenderRef}
        className="w-[98%] h-[97%] place-self-center grid"
      >
        <Camera
          mediaStream={mediaStream}
          videoTrack={videoTrack}
          videoRenderRef={videoRenderRef}
        />
      </div>
      <div
        className={`w-full max-h-fit ${
          isMeetNavShown ? 'h-0' : 'h-[5px]'
        } absolute bottom-0 peer/bottomNav left-0 z-[3]`}
      ></div>
      <MeetControls
        toggleAudio={toggleAudio}
        toggleCamera={toggleCamera}
        audioTrack={audioTrack}
        videoTrack={videoTrack}
        setIsMeetNavShown={setIsMeetNavShown}
        className="w-full peer-hover/bottomNav:animate-meetnav absolute left-0 bottom-0 h-[70px] meetnavOut"
      ></MeetControls>
    </div>
  );
}
