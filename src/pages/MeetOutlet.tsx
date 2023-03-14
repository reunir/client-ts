import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import useMeetSocket from '../hooks/meetSocket';
import { v4 as uuid } from 'uuid';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import connectSocket from '../utils/socket';

export default function MeetOutlet() {
  const { id, encryptedhash } = useParams();
  const [meetId, setMeetId] = useState(id);
  const [isThisMeetVerified, setIsThisMeetVerified] = useState(false);
  const [peerId, setPeerId] = useState<string>(uuid());
  const { user } = useAuth();
  const { addError, addNotification } = useOutletContext<any>();
  const socket = connectSocket();
  const {
    isSocketConnected,
    sendSocketRequest,
    meetData,
    addNewUserStream,
    getAMedia,
    updateSelfStream,
    addNewScreenMedia,
    setMeetData,
    streams,
  } = useMeetSocket(socket, addNotification, addError, peerId);

  useEffect(() => {
    if (id) setMeetId(id);
  }, [id]);

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
      <Outlet
        context={{
          meetId,
          streams,
          isSocketConnected,
          addError,
          addNotification,
          sendSocketRequest,
          addNewScreenMedia,
          setMeetId,
          encryptedhash,
          isThisMeetVerified,
          setIsThisMeetVerified,
          meetData,
          setMeetData,
          addNewUserStream,
          getAMedia,
          updateSelfStream,
          peerId,
        }}
      />
    </>
  );
}
