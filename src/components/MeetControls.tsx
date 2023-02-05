import { Camera, CameraOff } from '@styled-icons/fluentui-system-filled';
import { Mic, MicOff } from '@styled-icons/ionicons-sharp';

export default function MeetControls({
  className,
  setIsMeetNavShown,
  videoTrack,
  audioTrack,
  toggleAudio,
  toggleCamera,
}: {
  className: string;
  setIsMeetNavShown: any;
  videoTrack: boolean;
  audioTrack: boolean;
  toggleCamera: () => void;
  toggleAudio: () => void;
}) {
  const headerFocusOut = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.add('meetnavOut');
    setIsMeetNavShown(false);
  };
  const headerFocusIn = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.remove('meetnavOut');
    setIsMeetNavShown(true);
  };
  return (
    <div
      onMouseOut={headerFocusOut}
      onMouseOver={headerFocusIn}
      className={`${className} grid grid-cols-[1fr_5fr_1fr] bg-slate-300/60`}
    >
      <div></div>
      <div className="grid place-content-center">
        <div className="grid grid-cols-[auto_auto_auto] gap-[10px]">
          <button
            onClick={toggleAudio}
            className={`grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full ${
              audioTrack
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-slate-400 dark:bg-red-700 dark:hover:bg-red-800 hover:bg-slate-500 text-gray-800 dark:text-white'
            } `}
          >
            {!audioTrack ? <MicOff width={30} /> : <Mic width={30} />}
          </button>
          <div className="grid grid-flow-col place-content-center w-[150px] h-[60px] font-medium dark:bg-red-700 bg-red-800 rounded-lg text-xl text-white">
            <div className="grid place-content-center place-self-start">
              Leave call
            </div>
          </div>
          <button
            onClick={toggleCamera}
            className={`grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full ${
              videoTrack
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-slate-400 dark:bg-red-700 dark:hover:bg-red-800 hover:bg-slate-500 text-gray-800 dark:text-white'
            } `}
          >
            {!videoTrack ? <CameraOff width={30} /> : <Camera width={30} />}
          </button>
        </div>
      </div>
    </div>
  );
}
