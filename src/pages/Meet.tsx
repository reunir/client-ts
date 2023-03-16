import React, { createRef, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import Chat from '../components/Chat';
import Header from '../components/Header';
import MeetControls from '../components/MeetControls';
import Pinned from '../components/PinnedStream';
import Unpinned from '../components/UnpinnedStream';
import { useAuth } from '../context/auth-context';
import { ChatProvider } from '../context/chat-context';
import useHandlePinUnpin from '../hooks/handlePinUnpin';
import useMeetHooks from '../hooks/meetHooks';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Meet() {
  const [isHeaderShown, setIsHeaderShown] = useState<boolean>(false);
  const [isMeetNavShown, setIsMeetNavShown] = useState<boolean>(false);
  const { user } = useAuth();

  const {
    setIsThisMeetVerified,
    isThisMeetVerified,
    meetId,
    streams,
    pinnedStream,
    unpinnedStreams,
    toggleAudio,
    enableStream,
    toggleCamera,
    audioTrack,
    meetData,
    videoTrack,
    sendSocketRequest,
    peerId,
  } = useOutletContext<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sendFileModal, setSendFileModal] = useState(false);

  const {
    transcript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    resetTranscript();
    console.log("new transcript", transcript)
    // if (finalTranscript != "") {
    //   const req: SOCKETREQUEST = {
    //     userId: user!.id,
    //     meetId: meetId,
    //     type: '',
    //     data: {
    //       caption: finalTranscript,
    //       username: user?.firstName + " " + user?.lastName
    //     }
    //   }
    //   sendSocketRequest(SOCKETEVENTS.SEND_CAPTIONS, req);
    // }
  }, [transcript])

  useEffect(() => {
    // addError({ status: false, error: { message: 'Temporary Error!' } });
    // addNotification({ message: 'This is sample message!' });

    
    SpeechRecognition.startListening({ continuous: true });

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
    if (user && meetId && isThisMeetVerified) {
      const req: SOCKETREQUEST = {
        userId: user.id,
        meetId: meetId,
        type: '',
        data: '',
        peerId: peerId,
      };
      sendSocketRequest(SOCKETEVENTS.JOIN_ROOM, req);
    }
  }, [meetId, isThisMeetVerified]);
  return (
    <div className="w-screen h-screen grid grid-cols-[1fr_auto] bg-slate-300">
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
        {/* {JSON.stringify(streams)} */}
      </div>
      <div className="grid relative">
        <ChatProvider>
          <Chat
            chatHistory={meetData.chats}
            sendSocketRequest={sendSocketRequest}
            meetId={meetId}
            participantData={meetData.participants.data}
          />
        </ChatProvider>
      </div>
      <div
        className={`w-full max-h-fit ${
          isMeetNavShown ? 'h-0' : 'h-[5px]'
        } absolute bottom-0 peer/bottomNav left-0 z-[3]`}
      ></div>
      <MeetControls
        setSendFileModal={setSendFileModal}
        toggleAudio={toggleAudio}
        meetData={meetData}
        enableStream={enableStream}
        sendSocketRequest={sendSocketRequest}
        toggleCamera={toggleCamera}
        audioTrack={audioTrack}
        videoTrack={videoTrack}
        setIsMeetNavShown={setIsMeetNavShown}
        sendFileModal={sendFileModal}
        className="w-full peer-hover/bottomNav:animate-meetnav absolute left-0 bottom-0 h-[70px] meetnavOut"
      />
    </div>
  );
}
