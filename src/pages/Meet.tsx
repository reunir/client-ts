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
import useScreenCapture from '../hooks/screenCapture';
import { useUserMedia } from '../hooks/userStream';
import { CAPTURE_OPTIONS, SCREEN_CAPTURE_OPTIONS, WHICHSTREAM } from '../types';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

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
    toggleAudio,
    enableStream,
    toggleCamera,
    audioTrack,
    videoTrack,
    unpinnedStreams,
    meetData,
    sendSocketRequest,
    peerId,
  } = useOutletContext<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const [sendFileModal, setSendFileModal] = useState(false);

  const {
    transcript,
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  function setSpeech() {
    return new Promise(function (resolve, reject) {
      let synth = window.speechSynthesis;
      let id: any;

      id = setInterval(() => {
        if (synth.getVoices().length !== 0) {
          resolve(synth.getVoices());
          clearInterval(id);
        }
      }, 10);
    });
  }

  function getSpeeches() {
    let s = setSpeech();
    s.then((voices: any) => {
      let speakData = new window.SpeechSynthesisUtterance();
      speakData.volume = 1;
      speakData.rate = 1;
      speakData.pitch = 2;
      speakData.lang = 'en';
      speakData.text = 'Welcome to Meet';
      speakData.voice = voices[0];
      window.speechSynthesis.speak(speakData);
    });
  }

  function speak() {}

  useEffect(() => {
    console.log(finalTranscript);
  }, [finalTranscript]);

  useEffect(() => {
    // addError({ status: false, error: { message: 'Temporary Error!' } });
    // addNotification({ message: 'This is sample message!' });
    startListening();
    getSpeeches();
    setTimeout(() => {
      console.log('Available voices', window.speechSynthesis.getVoices());
    }, 2000);
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
  const [isChatShown, setIsChatShown] = useState(false);
  return (
    <div className="w-screen h-screen overflow-hidden grid grid-cols-[1fr_auto] bg-[#3D4143]">
      <div
        id="headerHelper"
        className={`w-full max-h-fit ${
          isHeaderShown ? 'h-0' : 'h-[5px]'
        } absolute top-0 peer left-0 z-[3]`}
      ></div>
      <div className="grid w-full">
        <div
          className={`m-[10px] relative w-[calc(100%-20px)] grid gap-[20px] ${
            pinnedStream.type != WHICHSTREAM.NONE
              ? 'grid-cols-[1fr_auto]'
              : 'grid-cols-[auto_1fr]'
          }`}
        >
          {pinnedStream.type != WHICHSTREAM.NONE ? (
            <Pinned pinnedStream={pinnedStream} />
          ) : (
            <></>
          )}
          {unpinnedStreams.length > 0 ? (
            <Unpinned unpinnedStream={unpinnedStreams} />
          ) : (
            <></>
          )}
        </div>
        {/* {JSON.stringify(streams)} */}
      </div>
      <div className="grid h-full absolute place-content-center right-[15px]">
        {isChatShown ? (
          <ChatProvider>
            <Chat
              isChatShown={isChatShown}
              setIsChatShown={setIsChatShown}
              chatHistory={meetData.chats}
              sendSocketRequest={sendSocketRequest}
              meetId={meetId}
              participantData={meetData.participants.data}
            />
          </ChatProvider>
        ) : (
          <></>
        )}
      </div>
      <div
        className={`w-full max-h-fit ${
          isMeetNavShown ? 'h-0' : 'h-[5px]'
        } absolute bottom-0 peer/bottomNav left-0 z-[3]`}
      ></div>
      <MeetControls
        isChatShown={isChatShown}
        setIsChatShown={setIsChatShown}
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
