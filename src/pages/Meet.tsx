import React, { createRef, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header';
import MeetControls from '../components/MeetControls';
import Pinned from '../components/PinnedStream';
import Unpinned from '../components/UnpinnedStream';
import { useAuth } from '../context/auth-context';
import useMeetHooks from '../hooks/meetHooks';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';

export default function Meet() {
  const [isHeaderShown, setIsHeaderShown] = useState<boolean>(false);
  const [isMeetNavShown, setIsMeetNavShown] = useState<boolean>(false);
  const { user } = useAuth();
  const {
    setIsThisMeetVerified,
    meetId,
    meetData,
    streams,
    setMeetData,
    addNewUserStream,
    addNewScreenMedia,
    getAMedia,
    updateSelfStream,
    addError,
    addNotification,
    sendSocketRequest,
    peerId,
  } = useOutletContext<any>();
  const {
    mediaStream,
    videoTrack,
    audioTrack,
    toggleAudio,
    toggleCamera,
    screenStream,
    streamTrack,
    enableStream,
    pinnedStream,
    unpinnedStreams,
  } = useMeetHooks(
    meetData,
    streams,
    addNewUserStream,
    addNewScreenMedia,
    getAMedia,
    updateSelfStream
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // addError({ status: false, error: { message: 'Temporary Error!' } });
    // addNotification({ message: 'This is sample message!' });
    if (location.state) {
      if (location.state.meetVerified) {
        setIsThisMeetVerified(true);
      } else {
        navigate(`/meet/__join/`, {
          state: { meetId },
        });
      }
    } else {
      console.log('Not set!');
      navigate(`/meet/__join/`, {
        state: { meetId },
      });
    }
  }, []);
  useEffect(() => {
    if (mediaStream) {
      if (user) {
        const req: SOCKETREQUEST = {
          userId: user.id,
          meetId: meetId,
          type: '',
          data: '',
          peerId: peerId,
        };
        sendSocketRequest(SOCKETEVENTS.JOIN_ROOM, req);
      }
    }
  }, [mediaStream]);
  return (
    <div className="w-screen h-screen grid bg-slate-300">
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
      <div className="grid w-full">
        <div
          className={`m-[10px] w-[calc(100%-20px)] grid gap-[20px] ${
            unpinnedStreams ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr_auto]'
          }`}
        >
          <Pinned pinnedStream={pinnedStream} />
          <Unpinned unpinnedStream={unpinnedStreams} />
        </div>
      </div>
      <div
        className={`w-full max-h-fit ${
          isMeetNavShown ? 'h-0' : 'h-[5px]'
        } absolute bottom-0 peer/bottomNav left-0 z-[3]`}
      ></div>
      <MeetControls
        toggleAudio={toggleAudio}
        enableStream={enableStream}
        toggleCamera={toggleCamera}
        audioTrack={audioTrack}
        videoTrack={videoTrack}
        setIsMeetNavShown={setIsMeetNavShown}
        className="w-full peer-hover/bottomNav:animate-meetnav absolute left-0 bottom-0 h-[70px] meetnavOut"
      ></MeetControls>
    </div>
  );
}
