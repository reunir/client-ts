import { useRef } from 'react';
import { PINNEDSTREAM, WHICHSTREAM } from '../types';
import Camera from './Camera';
import ScreenShare from './ScreenShare';

export default function Pinned({
  pinnedStream,
}: {
  pinnedStream: PINNEDSTREAM | null;
}) {
  const videoRenderRef = useRef<HTMLDivElement>(null);
  return (
    <>
      {pinnedStream ? (
        pinnedStream.type === WHICHSTREAM.USER ? (
          pinnedStream.userStream ? (
            <div ref={videoRenderRef} className="grid">
              <Camera
                mediaStream={pinnedStream.userStream.stream}
                videoTrack={pinnedStream.userStream.videoTrack}
                audioTrack={pinnedStream.userStream.audioTrack}
                videoRenderRef={videoRenderRef}
              />
            </div>
          ) : (
            <></>
          )
        ) : pinnedStream.screenMedia ? (
          <ScreenShare
            screenStream={pinnedStream.screenMedia.stream}
            streamTrack={pinnedStream.screenMedia.streamTrack}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
}
