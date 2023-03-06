import { useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';

export default function JoinMeetMiddleware() {
  const { user } = useAuth();
  const { sendSocketRequest, isSocketConnected } = useOutletContext<any>();
  const location = useLocation();
  useEffect(() => {
    if (user && isSocketConnected) {
      const meetObject = location.state;
      const joinData: SOCKETREQUEST = {
        userId: user.id,
        type: '',
        data: null,
        meetId: meetObject.meetId,
      };
      sendSocketRequest(SOCKETEVENTS.JOIN_ROOM, joinData);
    }
  }, [user, isSocketConnected]);
  return <div></div>;
}
