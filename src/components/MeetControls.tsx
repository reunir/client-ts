import { ThreeDotsVertical } from "@styled-icons/bootstrap";
import {
  Camera,
  CameraOff,
  Options,
  ShareScreenStart,
} from "@styled-icons/fluentui-system-filled";
import { Mic, MicOff } from "@styled-icons/ionicons-sharp";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useOutletContext } from "react-router-dom";
import {
  LoginBody,
  MEETDATA,
  METHOD,
  ResponseType,
  WhiteBoardCreateBody,
} from "../types";
import makeRequest from "../utils/requestWrap";
import { v4 as uuid } from "uuid";
import { useAuth } from "../context/auth-context";
import { SOCKETEVENTS, SOCKETREQUEST } from "../types/Socket";
import { Share, Whiteboard } from "@styled-icons/fluentui-system-regular";
import { FileUploader } from "react-drag-drop-files";
import { CloudUpload, Share as ShareIcon } from "@styled-icons/boxicons-solid";
import axios from "axios";

export default function MeetControls({
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
  sendFileModal,
}: {
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
  sendFileModal: any;
}) {
  const headerFocusOut = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.add("meetnavOut");
    setIsMeetNavShown(false);
  };
  const { user, token } = useAuth();
  const [optionsModal, setOptionsModal] = useState(false);
  const headerFocusIn = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.remove("meetnavOut");
    setIsMeetNavShown(true);
  };
  const showOptionList = () => {
    setOptionsModal(true);
  };
  const { addError } = useOutletContext<any>();
  const [loading, setLoading] = useState(false);

  const [showFileModal, setShowFileModal] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    console.log("show file modal changed: ", files);
  }, [files]);

  const appendFiles = (fileUploaded: any) => {
    setFiles([...files, fileUploaded]);
  };

  const handleShareToEveryone = async() => {
    const urls = files.map(async file => {
      const formData = new FormData();
      formData.append('file', file)
      const res = await axios.post('fshare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log(res.data.data)
      return res.data.data.body.url;
    })

    const gotURLs = await Promise.all(urls)
    
    gotURLs.map(url => {
      const req: SOCKETREQUEST = {
        data: {
          senderName: user?.firstName + " " + user?.lastName,
          senderEmail: user?.email,
          text: url,
          inReplyTo: -1,
          reacts: [],
          type: "link",
          language: "en-US",
          timeAndDate: new Date(),
        },
        meetId: meetData.meetId,
        userId: user?.id || "",
        type: "",
      };
      sendSocketRequest(SOCKETEVENTS.SEND_MESSAGE, req);
    })

    setFiles([]);
    setShowFileModal(false);
  }

  const generateWhiteBoardSession = async () => {
    const data = {
      whiteboardId: uuid(),
      createdBy: user?.id || "",
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
      "whiteboard/create",
      data,
      addError,
      setLoading
    );
    if (response.success) {
      displaySuccessMessage();
      const whiteboardId = response.data?.body.whiteboardId;
      const req: SOCKETREQUEST = {
        data: {
          senderName: user?.firstName + " " + user?.lastName,
          senderEmail: user?.email,
          text: (process.env.REACT_APP_WHITEBOARD_URL || "") + whiteboardId,
          inReplyTo: -1,
          reacts: [],
          type: "wb-link",
          language: "en-US",
          timeAndDate: new Date(),
        },
        meetId: meetData.meetId,
        userId: user?.id || "",
        type: "",
      };
      sendSocketRequest(SOCKETEVENTS.SEND_MESSAGE, req);
      window.open(
        (process.env.REACT_APP_WHITEBOARD_URL || "") +
          whiteboardId +
          "?token=" +
          token,
        "_blank"
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
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-slate-400 dark:bg-red-700 dark:hover:bg-red-800 hover:bg-slate-500 text-gray-800 dark:text-white"
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
                  ? "bg-red-700 hover:bg-red-800 text-white"
                  : "bg-slate-400 dark:bg-red-700 dark:hover:bg-red-800 hover:bg-slate-500 text-gray-800 dark:text-white"
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
              ""
            )}
            <Whiteboard width={30} />
            <div className="grid place-content-center">Whiteboard</div>
          </div>
          <div
            onClick={() => {
              setShowFileModal(true);
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
              ""
            )}
            <Share width={30} />
            <div className="grid place-content-center">Drop file</div>
            {showFileModal == true && (
              <Transition.Root show={showFileModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10"
                  onClose={setShowFileModal}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 ">
                                {/* <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
                                <CloudUpload height={"20px"} width={"20px"} />
                              </div>
                              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <Dialog.Title
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900"
                                >
                                  Upload file
                                </Dialog.Title>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500 mb-2">
                                    Drag and drop or upload any file from your
                                    computer.
                                  </p>
                                  <FileUploader
                                    name="file"
                                    style={{ height: "200px" }}
                                    multiple="false"
                                    handleChange={(files: any[]) =>
                                      appendFiles(files[0])
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                              onClick={handleShareToEveryone}
                            >
                              Share to everyone
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setShowFileModal(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
