import { useEffect, useRef } from 'react';
import { PINNEDSTREAM, WHICHSTREAM } from '../types';
import CameraSelf from './CameraSelf';
import Camera from './Camera';
import CameraSelf from './CameraSelf';
import ScreenShare from './ScreenShare';

export default function Pinned({
  pinnedStream,
}: {
  pinnedStream: PINNEDSTREAM;
}) {
  const videoRenderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(pinnedStream);
  }, [pinnedStream]);
  return (
    <>
      {pinnedStream.type !== WHICHSTREAM.NONE ? (
        pinnedStream.type === WHICHSTREAM.USER ? (
          pinnedStream.userStream ? (
            pinnedStream.userStream[0].id === 'self' ? (
              <div ref={videoRenderRef} className="grid">
                <CameraSelf
                  mediaStream={pinnedStream.userStream[0].stream}
                  videoTrack={pinnedStream.userStream[0].videoTrack}
                  audioTrack={pinnedStream.userStream[0].audioTrack}
                  videoRenderRef={videoRenderRef}
                  id={pinnedStream.userStream[0].id}
                  unpinned={false}
                />
              </div>
            ) : (
              <div ref={videoRenderRef} className="grid">
                <Camera
                  mediaStream={pinnedStream.userStream[0].stream}
                  title={pinnedStream.userStream[0].title}
                  videoRenderRef={videoRenderRef}
                  id={pinnedStream.userStream[0].id}
                  unpinned={false}
                />
              </div>
            )
          ) : (
            <></>
          )
        ) : pinnedStream.screenMedia ? (
          <ScreenShare
            screenStream={pinnedStream.screenMedia[0].stream}
            streamTrack={pinnedStream.screenMedia[0].streamTrack}
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
