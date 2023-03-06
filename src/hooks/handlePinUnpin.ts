import { useEffect, useState } from 'react';
import { MEETDATA, PINNEDSTREAM, SCREENMEDIA, UNPINNEDSTREAMS, USERSTREAM, WHICHSTREAM } from '../types';

export default function useHandlePinUnpin(meetData: MEETDATA | null) {
  const [pinnedStream, setPinnedStream] = useState<
    null | PINNEDSTREAM
  >(null);
  const [unpinnedStreams, setUnpinnedStreams] =
    useState<null | UNPINNEDSTREAMS>(null);
  const updatePinUnpinScreen = (media: SCREENMEDIA) => {
    if (media.isPinned) setPinnedStream({
      screenMedia: media,
      userStream: null,
      type: WHICHSTREAM.SCREEN
    });
    else {
      if (unpinnedStreams) {
        const oldScreenMedias = unpinnedStreams.screenMedias;
        let newScreenMedias;
        if (oldScreenMedias) newScreenMedias = [...oldScreenMedias, media];
        newScreenMedias = [media];
        setUnpinnedStreams({
          ...unpinnedStreams,
          screenMedias: newScreenMedias,
        });
        return;
      }
      setUnpinnedStreams({ screenMedias: [media], userStreams: null });
    }
  };
  const updatePinUnpinUser = (media: USERSTREAM) => {
    if (media.isPinned) setPinnedStream({
      userStream: media,
      screenMedia: null,
      type: WHICHSTREAM.USER
    });
    else {
      if (unpinnedStreams) {
        const olduserStreams = unpinnedStreams.userStreams;
        let newuserStreams;
        if (olduserStreams) newuserStreams = [...olduserStreams, media];
        newuserStreams = [media];
        setUnpinnedStreams({ ...unpinnedStreams, userStreams: newuserStreams });
        return;
      }
      setUnpinnedStreams({ screenMedias: null, userStreams: [media] });
    }
  };
  const updatePinnedAndUnpinnedStreams = () => {
    let pinnedStream: USERSTREAM | SCREENMEDIA;
    if (meetData) {
      if (meetData.screenMedias) {
        // preference set to screen sharing
        meetData.screenMedias.forEach(updatePinUnpinScreen);
      } else if (meetData.userStreams) {
        meetData.userStreams.forEach(updatePinUnpinUser);
      }
    }
  };
  useEffect(() => {
    updatePinnedAndUnpinnedStreams();
  }, [meetData]);
  return {
    pinnedStream,
    unpinnedStreams,
  };
}
