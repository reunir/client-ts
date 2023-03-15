import { ChatLeftTextFill, ThreeDotsVertical } from '@styled-icons/bootstrap';
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
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import { Share, Whiteboard } from '@styled-icons/fluentui-system-regular';
import { CallEnd } from '@styled-icons/material-rounded';
import ModeSwitcher from './ModeSwitcher';
import Avatar from './Avatar';

export default function MeetControls({
  isChatShown,
  setIsChatShown,
  className,
  setIsMeetNavShown,
  videoTrack,
  audioTrack,
  toggleAudio,
  toggleCamera,
  enableStream,
  meetData,
  sendSocketRequest,
  setSendFileModal,
}: {
  isChatShown: boolean;
  setIsChatShown: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
  setIsMeetNavShown: any;
  videoTrack: boolean;
  audioTrack: boolean;
  toggleCamera: () => void;
  toggleAudio: () => void;
  enableStream: () => Promise<void>;
  meetData: MEETDATA;
  sendSocketRequest: (event: SOCKETEVENTS, data: SOCKETREQUEST) => void;
  setSendFileModal: any;
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
    console.log(data);
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
      const req: SOCKETREQUEST = {
        data: {
          senderName: user?.firstName + ' ' + user?.lastName,
          senderEmail: user?.email,
          text: (process.env.REACT_APP_WHITEBOARD_URL || '') + whiteboardId,
          inReplyTo: -1,
          reacts: [],
          type: 'wb-link',
          language: 'en-US',
          timeAndDate: new Date(),
        },
        meetId: meetData.meetId,
        userId: user?.id || '',
        type: '',
      };
      sendSocketRequest(SOCKETEVENTS.SEND_MESSAGE, req);
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
        className={`${className} grid bg-[#202124]`}
      >
        <div className="grid relative">
          <div className="absolute left-[30px] grid h-full text-white text-lg place-content-center">
            &#169; reunir
          </div>
          <div className="grid place-self-center grid-cols-[auto_auto_auto_auto_auto] gap-[10px]">
            <button
              onClick={toggleAudio}
              className={`grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full ${
                audioTrack
                  ? 'bg-[#202124] hover:bg-[#3D4143] text-white'
                  : 'bg-slate-400 dark:bg-[#202124] dark:hover:bg-[#3D4143] hover:bg-slate-500 text-gray-800 dark:text-white'
              } `}
            >
              {!audioTrack ? <MicOff width={30} /> : <Mic width={30} />}
            </button>
            <div className="grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full dark:bg-[#EA4335] bg-[#EA4335] text-xl text-white">
              <div className="grid place-content-center place-self-start">
                <CallEnd width={30} />
              </div>
            </div>
            <button
              onClick={toggleCamera}
              className={`grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full ${
                videoTrack
                  ? 'bg-[#202124] hover:bg-[#3D4143] text-white'
                  : 'bg-slate-400 dark:bg-[#202124] dark:hover:bg-[#3D4143] hover:bg-slate-500 text-gray-800 dark:text-white'
              } `}
            >
              {!videoTrack ? <CameraOff width={30} /> : <Camera width={30} />}
            </button>
            <button
              onClick={enableStream}
              className="grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full bg-[#202124] hover:bg-[#3D4143] text-white"
            >
              {<ShareScreenStart width={30} />}
            </button>
            <button
              onClick={showOptionList}
              className="grid cursor-pointer place-content-center place-self-center w-[50px] h-[50px] rounded-full bg-[#202124] hover:bg-[#3D4143] text-white"
            >
              {<ThreeDotsVertical width={30} />}
            </button>
          </div>
          <div className="absolute w-fit grid grid-cols-[auto_auto_auto] gap-[30px] h-full right-[30px]">
            <div className="grid place-content-center place-self-center">
              <button
                onClick={() => setIsChatShown(!isChatShown)}
                className="grid cursor-pointer bg-[#202124] hover:bg-[#3D4143] place-content-center place-self-center w-[50px] h-[50px] rounded-full text-white"
              >
                <ChatLeftTextFill width={20} />
              </button>
            </div>
            <div className="grid place-content-center place-self-center">
              <ModeSwitcher />
            </div>
            <div className="grid lg:w-[60px] w-[40px] cursor-pointer rounded-full place-self-center overflow-hidden">
              <Avatar className="" />
            </div>
          </div>
        </div>
      </div>
      {optionsModal ? (
        <div
          className={`grid gap-[1px] grid-flow-row bottom-[75px] left-[850px] bg-gray-300 border-gray-500 w-[200px] rounded-md overflow-hidden absolute`}
        >
          <div className="grid bg-gray-300 pl-[10px] py-[10px]">Tools</div>
          <div
            className="hover:bg-gray-200 grid gap-[4px] bg-gray-100 p-[10px] grid-cols-[auto_auto_1fr] cursor-pointer"
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
            <Whiteboard width={30} />
            <div className="grid place-content-center">Whiteboard</div>
          </div>
          <div
            onClick={() => {
              setSendFileModal(true);
            }}
            className="hover:bg-gray-200 grid gap-[4px] bg-gray-100 p-[10px] grid-cols-[auto_auto_1fr] cursor-pointer"
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
            <Share width={30} />
            <div className="grid place-content-center">Share File</div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
