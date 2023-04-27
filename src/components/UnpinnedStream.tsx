import { useEffect, useRef, useState } from 'react';
import { WHICHSTREAM, UNPINNEDSTREAMS } from '../types';
import Camera from './Cameras/Unpinned/Camera';
import CameraSelf from './Cameras/Unpinned/CameraSelf';
import ScreenShare from './ScreenShare';

export default function Unpinned({
  unpinnedStream,
}: {
  unpinnedStream: UNPINNEDSTREAMS | null;
}) {
  const videoRenderRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shownStreamsWhenUnexpanded, setShownStreamsWhenUnexpanded] = useState(
    () => {
      if (unpinnedStream) {
        if (unpinnedStream.length < 5) {
          return 0;
        } else {
          return unpinnedStream.length / 5 - 1 + (unpinnedStream.length % 5);
        }
      } else {
        return 0;
      }
    }
  ); // starting index for showing streams when not expanded

  useEffect(() => {
    setShownStreamsWhenUnexpanded(() => {
      if (unpinnedStream) {
        if (unpinnedStream.length < 5) {
          return 0;
        } else {
          return unpinnedStream.length / 5 - 1 + (unpinnedStream.length % 5);
        }
      } else {
        return 0;
      }
    });
  }, [unpinnedStream]);

  return (
    <div className="grid absolute left-0 top-0 h-full max-h-full w-[250px] overflow-y-scroll overflow-x-hidden">
      <div className={`grid w-[250px] h-auto ${isExpanded ? '' : 'relative'}`}>
        {unpinnedStream ? (
          unpinnedStream.userStreams ? (
            unpinnedStream.userStreams.map((userStream, key) =>
              userStream ? (
                userStream.id === 'self' ? (
                  <div
                    ref={videoRenderRef}
                    key={key}
                    className={` w-auto h-fit ${
                      isExpanded
                        ? 'grid'
                        : key >= shownStreamsWhenUnexpanded
                        ? 'grid z-[' + (shownStreamsWhenUnexpanded % 5) + ']'
                        : 'hidden'
                    }`}
                  >
                    <CameraSelf
                      mediaStream={userStream.stream}
                      videoTrack={userStream.videoTrack}
                      audioTrack={userStream.audioTrack}
                      videoRenderRef={videoRenderRef}
                      id={userStream.id}
                      unpinned={false}
                    />
                  </div>
                ) : (
                  <div
                    ref={videoRenderRef}
                    key={key}
                    className={`grid w-auto h-fit ${
                      isExpanded ? '' : 'absolute'
                    }`}
                  >
                    <Camera
                      mediaStream={userStream.stream}
                      title={userStream.title}
                      videoRenderRef={videoRenderRef}
                      id={userStream.id}
                      unpinned={true}
                    />
                  </div>
                )
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
    </div>
  );
}
