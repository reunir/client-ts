import { useEffect, useState } from 'react';
import { Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import useMeetSocket from '../hooks/meetSocket';

export default function MeetOutlet() {
  const { id, encryptedhash } = useParams();
  const [meetId, setMeetId] = useState(id);
  const [isThisMeetVerified, setIsThisMeetVerified] = useState(false);
  const { user } = useAuth();
  const { addError, addNotification } = useOutletContext<any>();
  const {
    isSocketConnected,
    sendSocketRequest,
    meetData,
    addNewUserStream,
    getAMedia,
    updateSelfStream,
  } = useMeetSocket(addNotification, addError);
  return (
    <>
      <Outlet
        context={{
          meetId,
          isSocketConnected,
          addError,
          addNotification,
          sendSocketRequest,
          setMeetId,
          encryptedhash,
          isThisMeetVerified,
          setIsThisMeetVerified,
          meetData,
          addNewUserStream,
          getAMedia,
          updateSelfStream,
        }}
      />
    </>
  );
}
