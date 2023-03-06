import { useRef } from 'react';
import { WHICHSTREAM, UNPINNEDSTREAMS } from '../types';
import Camera from './Camera';
import ScreenShare from './ScreenShare';

export default function Unpinned({
  unpinnedStream,
}: {
  unpinnedStream: UNPINNEDSTREAMS | null;
}) {
  const videoRenderRef = useRef<HTMLDivElement>(null);

  return (
    <div className="grid grid-flow-row">
      {unpinnedStream ? (
        unpinnedStream.userStreams ? (
          unpinnedStream.userStreams.map((userStream) =>
            userStream ? (
              <div ref={videoRenderRef} className="grid">
                <Camera
                  mediaStream={userStream.stream}
                  videoTrack={userStream.videoTrack}
                  audioTrack={userStream.audioTrack}
                  videoRenderRef={videoRenderRef}
                />
              </div>
            ) : (
              <></>
            )
          )
        ) : unpinnedStream.screenMedias ? (
          unpinnedStream.screenMedias.map((screenMedia) => (
            <ScreenShare
              screenStream={screenMedia.stream}
              streamTrack={screenMedia.streamTrack}
            />
          ))
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
