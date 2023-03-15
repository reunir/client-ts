import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import useMeetSocket from '../hooks/meetSocket';
import { v4 as uuid } from 'uuid';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import connectSocket from '../utils/socket';
import { useUserMedia } from '../hooks/userStream';
import Sound from 'react-sound';
import joinSound from '../assets/sounds/joinmeet.mp3';
import {
  CAPTURE_OPTIONS,
  SCREENMEDIA,
  SCREEN_CAPTURE_OPTIONS,
  STREAMS,
  USERSTREAM,
} from '../types';
import useScreenCapture from '../hooks/screenCapture';
import useMeetData from '../hooks/meetData';
import useHandlePinUnpin from '../hooks/handlePinUnpin';

export default function MeetOutlet() {
  const { id, encryptedhash } = useParams();
  const [meetId, setMeetId] = useState(id);
  const [isThisMeetVerified, setIsThisMeetVerified] = useState(false);
  const [peerId, setPeerId] = useState<string>(uuid());
  const { user } = useAuth();
  const { addError, addNotification } = useOutletContext<any>();
  const socket = connectSocket();
  const {
    mediaStream,
    videoTrack,
    audioTrack,
    toggleAudio,
    toggleCamera,
    enableUserStream,
  } = useUserMedia(CAPTURE_OPTIONS);
  const { screenStream, streamTrack, enableStream } = useScreenCapture(
    SCREEN_CAPTURE_OPTIONS
  );

  const {
    meetData,
    streams,
    setStreams,
    addNewScreenMedia,
    setMeetData,
    addNewUserStream,
    deleteScreenMedia,
    deleteUserStream,
    clearPinnedStreams,
  } = useMeetData();
  const { isSocketConnected, sendSocketRequest } = useMeetSocket(
    socket,
    addNotification,
    addError,
    peerId,
    meetData,
    addNewScreenMedia,
    addNewUserStream,
    setMeetData,
    clearPinnedStreams,
    enableUserStream
  );

  const { pinnedStream, unpinnedStreams } = useHandlePinUnpin(streams);

  const [ifUserStreamReady, setIfUserStreamReady] = useState(false);
  useEffect(() => {
    console.log(pinnedStream);
  }, [pinnedStream]);
  useEffect(() => {
    if (id) setMeetId(id);
  }, [id]);

  useEffect(() => {
    // for my media
    if (mediaStream) {
      console.log(mediaStream);
      let name = '';
      if (user) {
        name = user.firstName + ' ' + user.lastName;
      }
      const selfStream: USERSTREAM = {
        title: name,
        stream: mediaStream,
        videoTrack,
        audioTrack,
        id: 'self',
        isPinned: true, // if self is present pin him
      };
      setIfUserStreamReady(addNewUserStream(selfStream) || false);
    }
  }, [mediaStream]);
  const [playSound, setplaySound] = useState(false);
  useEffect(() => {
    if (meetId) {
      const req: SOCKETREQUEST = {
        data: {
          ack: true,
          socketId: socket.id,
        },
        type: '',
        userId: '',
        meetId: meetId,
      };
      socket.emit(SOCKETEVENTS.I_JOINED_SUCCESSFULLY, req);
      setplaySound(true);
    }
  }, [ifUserStreamReady, meetId]);
  useEffect(() => {
    // for screen share
    if (screenStream) {
      let name = '';
      if (user) {
        name = user.firstName;
      }
      const newMedia: SCREENMEDIA = {
        stream: screenStream,
        title: name + ' is presenting their screen',
        streamTrack: true,
        id: 'screen',
        isPinned: true,
      };
      let oldStreams = streams.screenMedias;
      if (oldStreams) {
        oldStreams.push(newMedia);
      } else {
        oldStreams = [newMedia];
      }
      setStreams({ ...streams, screenMedias: oldStreams });
    }
  }, [screenStream]);

  useEffect(() => {
    return function cleanup() {
      console.log('cleanup');
      if (user && meetId) {
        const req: SOCKETREQUEST = {
          userId: user.id,
          meetId: meetId,
          type: '',
          data: '',
          peerId: peerId,
        };
        sendSocketRequest(SOCKETEVENTS.LEAVE_ROOM, req);
      }
    };
  }, []);

  return (
    <>
      {playSound ? (
        <Sound
          url={joinSound}
          playStatus={Sound.status.PLAYING}
          playFromPosition={0}
          onFinishedPlaying={() => setplaySound(false)}
        />
      ) : (
        <></>
      )}
      <Outlet
        context={{
          meetId,
          streams,
          meetData,
          toggleAudio,
          enableStream,
          toggleCamera,
          pinnedStream,
          unpinnedStreams,
          audioTrack,
          videoTrack,
          isSocketConnected,
          addError,
          addNotification,
          sendSocketRequest,
          addNewScreenMedia,
          setMeetId,
          encryptedhash,
          isThisMeetVerified,
          setIsThisMeetVerified,
          setMeetData,
          addNewUserStream,
          peerId,
          enableUserStream,
        }}
      />
    </>
  );
}
