import { createRef, useEffect, useState } from 'react';
import { useChat } from '../context/chat-context';
import { Input, Button } from 'react-chat-elements';
import dateFormat, { masks } from 'dateformat';
import {
  generateAndReturnAvatar,
  getUserAvatar,
} from '../utils/generateAvatar';
import parse from 'html-react-parser';
import { ArrowReply } from '@styled-icons/fluentui-system-filled';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import { AChat, userType } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
export default function Chat({
  chatHistory,
  sendSocketRequest,
  meetId,
  participantData,
}: {
  chatHistory: [AChat];
  sendSocketRequest: (event: SOCKETEVENTS, data: SOCKETREQUEST) => void;
  meetId: string;
  participantData: userType[];
}) {
  const {
    chatData,
    updateChatData,
    me,
    updateMe,
    someoneTyping,
    updateSomeoneTyping,
    whoTyping,
    participants,
    updateParticipants,
    updateWhoTyping,
    replyTo,
    updateReplyTo,
  } = useChat();
  useEffect(() => {
    if (participantData) {
      updateParticipants(participantData);
      console.log(participantData);
    }
  }, [participantData]);
  useEffect(() => {
    updateChatData(chatHistory);
  }, [chatHistory]);
  const { token } = useAuth();
  const findUser = (email: string) => {
    if (participants) {
      return participants.find((p) => p?.email === email);
    }
  };
  const userAvatar = async (email: string) => {
    const user = findUser(email);
    let data: any;
    if (user) {
      const data = await generateAndReturnAvatar(
        user.stripe,
        user.seed,
        user.backgroundColor
      );
      return data.data;
    }
  };
  const convertToLocale = (date: string) => {
    return dateFormat(date, 'shortTime');
  };
  const sendMessage = () => {
    const elem = document.getElementById('newChat') as HTMLInputElement;
    let message = elem?.value;
    if (message !== '') {
      updateChatData([
        {
          senderName: me?.firstName + ' ' + me?.lastName,
          senderEmail: me?.email || '',
          text: message,
          inReplyTo: replyTo,
          reacts: [],
          type: 'text',
          language: 'en-US',
          timeAndDate: new Date().toString(),
        },
      ]);
      const res: SOCKETREQUEST = {
        data: {
          senderName: me?.firstName + ' ' + me?.lastName,
          senderEmail: me?.email,
          text: message,
          inReplyTo: replyTo,
          reacts: [],
          type: 'text',
          language: 'en-US',
          timeAndDate: new Date(),
        },
        meetId,
        userId: me?.id || '',
        type: '',
      };
      sendSocketRequest(SOCKETEVENTS.SEND_MESSAGE, res);
      elem.value = '';
      elem.focus();
      const scrollToBottom = document.getElementById('chat-scrollbar');
      if (scrollToBottom) {
        scrollToBottom.scrollTop = scrollToBottom.scrollHeight;
      }
      updateReplyTo(-1);
    }
  };
  const [chats, setChats] = useState(chatData.allChats);
  useEffect(() => {
    console.log(chatData);
    setChats(chatData.allChats);
  }, [chatData]);
  return (
    <div className="w-[400px] grid grid-rows-[auto_1fr] h-[95%] self-center border rounded-md bg-gray-200 border-gray-400">
      <div
        className={`overflow-y-scroll h-[660px]
        } grid`}
        id="chat-scrollbar"
      >
        <div className="h-fit relative self-end pr-[10px]">
          <div className="grid bottom-0 left-0 w-full">
            {chats != null && chats.length != 0
              ? chats.map((chat, id) =>
                  chat.senderEmail !== me?.email ? (
                    <div
                      key={id}
                      className={`grid group grid-cols-[30px_auto_auto] gap-[10px] w-full place-content-start ${
                        id === 0
                          ? 'pt-0'
                          : chats[id - 1].senderEmail === chat.senderEmail
                          ? 'pt-[4px]'
                          : 'pt-[10px]'
                      }`}
                    >
                      <div
                        className={` place-self-center overflow-hidden w-[30px] h-[30px] rounded-lg ${
                          id === 0
                            ? 'grid'
                            : chats[id - 1].senderEmail === chat.senderEmail
                            ? 'hidden'
                            : 'grid'
                        }`}
                      ></div>
                      <div className="break-words bg-slate-300 select-text dark:bg-gray-900 px-[10px] py-[5px] rounded-xl rounded-bl-none grid text-left text-gray-900 dark:text-slate-300 w-fit max-w-[250px]">
                        {chat.inReplyTo === -1 ? (
                          ''
                        ) : (
                          <div className="grid bg-slate-400 dark:bg-gray-800 place-content-start pl-[4px] rounded-md cursor-pointer">
                            <div className="font-bold pt-[3px] grid content-center text-purple-700 text-sm pr-[30px]">
                              {chats[chat.inReplyTo].senderEmail === me?.email
                                ? 'You'
                                : chats[chat.inReplyTo].senderEmail}
                            </div>
                            <div className=" text-gray-700 dark:text-gray-500 pb-[3px]">
                              {chats[chat.inReplyTo].text}
                            </div>
                          </div>
                        )}
                        {chat.type === 'wb-link' ? (
                          <div>
                            {chat.senderName} shared a whiteboard link:
                            <br />
                            <Link
                              to={chat.text + '?token=' + token}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <div className="text-blue-500 underline">
                                {chat.text}
                              </div>
                            </Link>
                          </div>
                        ) : (
                          chat.type === 'link' ? (
                            <div>
                            {chat.senderName} shared a link:
                            <br />
                            <Link
                              to={chat.text}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <div className="text-blue-500 underline">
                                {chat.text}
                              </div>
                            </Link>
                          </div>
                          )
                          :
                          <>{chat.text}</>
                        )}
                      </div>
                      <div className="opacity-0 grid grid-flow-col place-content-center place-self-center w-max h-fit group-hover:opacity-100 text-gray-500 dark:text-gray-300 text-xs">
                        <div className="grid place-content-center place-self-center cursor-pointer hover:dark:text-gray-300 hover:text-gray-700">
                          <ArrowReply
                            onClick={() => {
                              updateReplyTo(id);
                            }}
                            width={20}
                          />
                        </div>
                        {convertToLocale(chat.timeAndDate)}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={id}
                      className={`grid group justify-self-end grid-cols-[auto_auto_30px] gap-[10px] w-full place-content-end ${
                        id === 0
                          ? 'pt-0'
                          : chats[id - 1].senderEmail === chat.senderEmail
                          ? 'pt-[4px]'
                          : 'pt-[10px]'
                      }`}
                    >
                      <div className="opacity-0 grid grid-flow-col place-content-center place-self-center w-max h-fit group-hover:opacity-100 text-gray-500 dark:text-gray-300 text-xs">
                        {convertToLocale(chat.timeAndDate)}
                        <div className="grid place-content-center place-self-center cursor-pointer hover:dark:text-gray-300 hover:text-gray-700">
                          <ArrowReply
                            onClick={() => {
                              updateReplyTo(id);
                            }}
                            width={20}
                          />
                        </div>
                      </div>
                      <div className="break-words gap-[3px] bg-slate-300 select-text dark:bg-gray-900 px-[10px] py-[5px] rounded-xl rounded-br-none grid text-left text-gray-900 dark:text-slate-300 w-fit max-w-[250px]">
                        {chat.inReplyTo === -1 ? (
                          ''
                        ) : (
                          <div className="grid bg-slate-400 dark:bg-gray-800 place-content-start pl-[4px] rounded-md cursor-pointer">
                            <div className="font-bold pt-[3px] grid content-center text-purple-700 text-sm pr-[30px]">
                              {chats[chat.inReplyTo].senderName}
                            </div>
                            <div className=" text-gray-700 dark:text-gray-500 pb-[3px]">
                              {chat.type === 'wb-link' ? (
                                <Link
                                  to={chats[chat.inReplyTo].text}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              ) : (
                                chats[chat.inReplyTo].text
                              )}
                            </div>
                          </div>
                        )}
                        {chat.text}
                      </div>
                      <div
                        className={` place-self-center overflow-hidden w-[30px] h-[30px] rounded-lg text-sm ${
                          id === 0
                            ? 'grid'
                            : chats[id - 1].senderEmail === chat.senderEmail
                            ? 'hidden'
                            : 'grid'
                        }`}
                      >
                        {parse(getUserAvatar())}
                      </div>
                    </div>
                  )
                )
              : ''}
          </div>
        </div>
      </div>
      <div className="grid w-[95%] border-t-[1px] border-gray-400 h-[90%] place-self-center">
        <div
          className={`grid grid-flow-row ${
            replyTo !== -1 ? 'grid-rows-[auto_1fr]' : ''
          }`}
        >
          <></>
          {replyTo === -1 ? (
            ''
          ) : chats ? (
            <div className={`w-full`}>
              {
                <div className="grid grid-flow-col gap-[5px] text-xs text-gray-900 dark:text-slate-300 place-content-start pl-[4px]">
                  <ArrowReply width={15} />
                  In reply to {chats[replyTo].senderName}
                </div>
              }
            </div>
          ) : (
            ''
          )}
          <div className="grid grid-flow-col">
            <div className="w-[90%] h-[70%] place-self-center">
              <input
                type="text"
                name="newChat"
                id="newChat"
                placeholder="Type a message..."
                className="w-full h-full bg-gray-300 pl-[5px] rounded outline-none text-gray-800 dark:text-slate-200"
              />
            </div>
            <div
              onClick={sendMessage}
              className="grid place-content-center w-[100px] h-[70%] rounded-md cursor-pointer hover:bg-green-600 text-lg mx-[10px] place-self-center bg-green-500 text-white"
            >
              Send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
