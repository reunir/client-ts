import { createContext, useContext, useEffect, useState } from 'react';
import {
  AChat,
  AppProp,
  ChatObject,
  ModifiedChatObject,
  userType,
} from '../types';
import { useAuth } from './auth-context';

type chatContextType = {
  chatData: ChatObject;
  updateChatData: (updatedObject: [AChat]) => void;
  me: userType;
  replyTo: number;
  updateReplyTo: (replyTo: number) => void;
  updateMe: (me: userType) => void;
  participants: userType[];
  updateParticipants: (participants: userType[]) => void;
  someoneTyping: boolean;
  updateSomeoneTyping: (someoneTyping: boolean) => void;
  whoTyping: string;
  updateWhoTyping: (whoTyping: string) => void;
};

const formDefaultData: ChatObject = {
  allChats: null,
};

const chatContextDefaultValues: chatContextType = {
  chatData: formDefaultData,
  updateChatData: (updatedObject: [AChat]) => {},
  me: null,
  replyTo: -1,
  updateReplyTo: (replyTo: number) => {},
  updateMe: (me: userType) => {},
  participants: [null],
  updateParticipants: (participants: userType[]) => {},
  someoneTyping: false,
  updateSomeoneTyping: (someoneTyping: boolean) => {},
  whoTyping: '',
  updateWhoTyping: (whoTyping: string) => {},
};
export const chatContext = createContext<chatContextType>(
  chatContextDefaultValues
);
chatContext.displayName = 'ChatContext';

function ChatProvider(props: AppProp) {
  const partTitles = ['Your Profile', 'Accept terms and conditions'];
  const [chatData, setchatData] = useState<ChatObject>(formDefaultData);
  const { user } = useAuth();
  const [me, setme] = useState<userType>(user);
  const [replyTo, setReplyTo] = useState(-1);
  const updateReplyTo = (replyTo: number) => {
    setReplyTo(replyTo);
  };
  const [participants, setParticipants] = useState<[userType]>([null]);
  const updateParticipants = (newParticipants: userType[]) => {
    participants.push(...newParticipants);
    setParticipants(participants);
  };
  const updateMe = (me: userType) => {
    setme(me);
  };
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const updateSomeoneTyping = (someoneTyping: boolean) => {
    setSomeoneTyping(someoneTyping);
  };
  const [whoTyping, setWhoTyping] = useState('');
  const updateWhoTyping = (whoTyping: string) => {
    setWhoTyping(whoTyping);
  };
  const updateChatData = (updatedObject: [AChat]) => {
    const allChats = chatData.allChats;
    console.log(allChats);
    console.log(updatedObject);
    if (allChats) {
      allChats.push(...updatedObject);
      setchatData({ allChats: allChats });
    } else {
      setchatData({ ...chatData, allChats: updatedObject });
    }
  };
  return (
    <chatContext.Provider
      value={{
        chatData,
        updateChatData,
        me,
        replyTo,
        updateReplyTo,
        updateMe,
        participants,
        updateParticipants,
        someoneTyping,
        updateSomeoneTyping,
        whoTyping,
        updateWhoTyping,
      }}
      {...props}
    ></chatContext.Provider>
  );
}
function useChat() {
  const context = useContext(chatContext);
  if (context === undefined) {
    throw new Error(`useChat must be used within a ChatProvider`);
  }
  return context;
}
export { ChatProvider, useChat };
