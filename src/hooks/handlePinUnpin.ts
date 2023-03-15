import { useEffect, useState } from 'react';
import { MEETDATA, PINNEDSTREAM, SCREENMEDIA, STREAMS, UNPINNEDSTREAMS, USERSTREAM, WHICHSTREAM } from '../types';

export default function useHandlePinUnpin(streams: STREAMS) {
  const tempPinnedStream: PINNEDSTREAM = {
    screenMedia: [],
    userStream: [],
    type: WHICHSTREAM.NONE
  }
  const [pinnedStream, setPinnedStream] = useState<PINNEDSTREAM>(tempPinnedStream);
  const tempUnpinnedStreams: UNPINNEDSTREAMS = {
    screenMedias: [],
    userStreams: [],
    length: 0
  }
  const [unpinnedStreams, setUnpinnedStreams] =
    useState<UNPINNEDSTREAMS>(tempUnpinnedStreams);
  const updatePinUnpinScreen = (media: SCREENMEDIA) => {
    if (media.isPinned) setPinnedStream({
      screenMedia: [media],
      userStream: [],
      type: WHICHSTREAM.SCREEN
    });
    else {
      const oldScreenMedias = unpinnedStreams.screenMedias;
      oldScreenMedias.push(media)
      setUnpinnedStreams({
        ...unpinnedStreams,
        length: oldScreenMedias.length + unpinnedStreams.userStreams.length,
        screenMedias: oldScreenMedias,
      });
      return;
    }
  };
  const updatePinUnpinUser = (media: USERSTREAM) => {
    if (media.isPinned) setPinnedStream({
      userStream: [media],
      screenMedia: [],
      type: WHICHSTREAM.USER
    });
    else {
      const olduserStreams = unpinnedStreams.userStreams;
      olduserStreams.push(media)
      setUnpinnedStreams({ ...unpinnedStreams, userStreams: olduserStreams, length: olduserStreams.length + unpinnedStreams.screenMedias.length, });
      return;
    }
  };
  const updatePinnedAndUnpinnedStreams = () => {
    if (streams.screenMedias.length != 0) {
      streams.screenMedias.forEach(updatePinUnpinScreen);
    }
    if (streams.userStreams.length != 0) {
      streams.userStreams.forEach(updatePinUnpinUser);
    }
  };
  useEffect(() => {
    if (streams) {
      updatePinnedAndUnpinnedStreams();
    }
  }, [streams]);
  return {
    pinnedStream,
    unpinnedStreams,
  };
}
