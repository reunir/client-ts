import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import useMeetSocket from '../hooks/meetSocket';
import { SOCKETREQUEST } from '../types/Socket';

export default function MeetOutlet() {
  const { id } = useParams();
  const [meetId, setMeetId] = useState(id);
  const { isSocketConnected, sendSocketRequest } = useMeetSocket();
  const { user } = useAuth();
  const { addError, addNotification } = useOutletContext<any>();
  const SOCKETREQUEST: SOCKETREQUEST = {
    data: null,
    roomId: id || '',
    userId: user?.id || '',
  };
  return (
    <>
      <Outlet
        context={{
          meetId,
          isSocketConnected,
          addError,
          addNotification,
          SOCKETREQUEST,
          sendSocketRequest,
          setMeetId,
        }}
      />
    </>
  );
}
