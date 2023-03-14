import { useEffect, useState } from 'react';
import { MEETDATA, PINNEDSTREAM, SCREENMEDIA, STREAMS, UNPINNEDSTREAMS, USERSTREAM, WHICHSTREAM } from '../types';

export default function useHandlePinUnpin(meetData: STREAMS) {
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
    if (meetData) {
      if (meetData.screenMedias) {
        meetData.screenMedias.forEach(updatePinUnpinScreen);
      }
      if (meetData.userStreams) {
        meetData.userStreams.forEach(updatePinUnpinUser);
      }
    }
  };
  useEffect(() => {
    if (meetData) {
      updatePinnedAndUnpinnedStreams();
    }
  }, [meetData]);
  return {
    pinnedStream,
    unpinnedStreams,
  };
}
