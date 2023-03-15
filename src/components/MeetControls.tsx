import { ThreeDotsVertical } from '@styled-icons/bootstrap';
import {
  Camera,
  CameraOff,
  Options,
  ShareScreenStart,
} from '@styled-icons/fluentui-system-filled';
import { Mic, MicOff } from '@styled-icons/ionicons-sharp';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LoginBody,
  MEETDATA,
  METHOD,
  ResponseType,
  WhiteBoardCreateBody,
} from '../types';
import makeRequest from '../utils/requestWrap';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../context/auth-context';

export default function MeetControls({
  className,
  setIsMeetNavShown,
  videoTrack,
  audioTrack,
  toggleAudio,
  toggleCamera,
  enableStream,
  meetData,
}: {
  className: string;
  setIsMeetNavShown: any;
  videoTrack: boolean;
  audioTrack: boolean;
  toggleCamera: () => void;
  toggleAudio: () => void;
  enableStream: () => Promise<void>;
  meetData: MEETDATA;
}) {
  const headerFocusOut = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.add('meetnavOut');
    setIsMeetNavShown(false);
  };
  const { user, token } = useAuth();
  const [optionsModal, setOptionsModal] = useState(false);
  const headerFocusIn = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.remove('meetnavOut');
    setIsMeetNavShown(true);
  };
  const showOptionList = () => {
    setOptionsModal(true);
  };
  const { addError } = useOutletContext<any>();
  const [loading, setLoading] = useState(false);
  const generateWhiteBoardSession = async () => {
    const data = {
      whiteboardId: uuid(),
      createdBy: user?.id || '',
      type: meetData.type,
    };
    const {
      response,
      displaySuccessMessage,
    }: {
      response: ResponseType<WhiteBoardCreateBody> | null;
      displaySuccessMessage: () => void;
    } = await makeRequest(
      METHOD.POST,
      'whiteboard/create',
      data,
      addError,
      setLoading
    );
    if (response.success) {
      displaySuccessMessage();
      const whiteboardId = response.data?.body.whiteboardId;
      console.log(
        (process.env.REACT_APP_WHITEBOARD_URL || '') +
          whiteboardId +
          '?token=' +
          token
      );

      window.open(
        (process.env.REACT_APP_WHITEBOARD_URL || '') +
          whiteboardId +
          '?token=' +
          token,
        '_blank'
      );
    }
  };
  return (
    <>
      <div
        onMouseOut={headerFocusOut}
        onMouseOver={headerFocusIn}
        className={`${className} grid grid-cols-[1fr_5fr_1fr] bg-slate-300/60`}
      >
        <div></div>
        <div className="grid place-content-center">
          <div className="grid grid-cols-[auto_auto_auto_auto_auto] gap-[10px]">
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
            <button
              onClick={enableStream}
              className="grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full bg-red-700 hover:bg-red-800 text-white"
            >
              {<ShareScreenStart width={30} />}
            </button>
            <button
              onClick={showOptionList}
              className="grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full bg-red-700 hover:bg-red-800 text-white"
            >
              {<ThreeDotsVertical width={30} />}
            </button>
          </div>
        </div>
      </div>
      {optionsModal ? (
        <div
          className={`grid grid-flow-row bottom-[75px] left-[850px] bg-gray-100 border-gray-500 w-fit rounded absolute`}
        >
          <div
            className="hover:bg-gray-200 p-[10px] grid grid-cols-[auto_1fr] cursor-pointer"
            onClick={generateWhiteBoardSession}
          >
            {loading ? (
              <div className="grid w-[20px] h-[20px]">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              ''
            )}
            Start Whiteboard Session
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
