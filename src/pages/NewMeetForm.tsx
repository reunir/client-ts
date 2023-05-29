import { createRef, useEffect, useState } from 'react';
import NormalButton from '../components/Buttons/NormalButton';
import FormInfo from '../components/FormInfo';
import {
  useLinkClickHandler,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';
import { SOCKETEVENTS, SOCKETREQUEST } from '../types/Socket';
import { generate } from 'randomstring';
export default function NewMeetForm({
  sendSocketRequest,
  isSocketConnected,
}: {
  sendSocketRequest: (event: SOCKETEVENTS, data: SOCKETREQUEST) => void;
  isSocketConnected: boolean;
}) {
  const [typeSelected, setTypeSelected] = useState('');
  const [meetCode, setMeetCode] = useState('');
  const startMeetRef = createRef<HTMLButtonElement>();
  useEffect(() => {
    startMeetRef.current?.setAttribute('disabled', 'true');
  });
  useEffect(() => {
    if (typeSelected === '') {
      startMeetRef.current?.setAttribute('disabled', 'true');
    } else {
      startMeetRef.current?.removeAttribute('disabled');
    }
  }, [typeSelected]);
  const randomGenerate = (len: number): string => {
    return generate({
      length: len,
      charset: 'alphabetic',
      capitalization: 'lowercase',
    });
  };
  const { setButtonLoading, Button } = NormalButton();
  const { user } = useOutletContext<any>();
  const navigate = useNavigate();
  const { setButtonLoading: setjoinButtonLoading, Button: JoinButton } =
    NormalButton();
  const createMeeting = () => {
    const meetId =
      randomGenerate(3) + '-' + randomGenerate(4) + '-' + randomGenerate(3);
    const meetData = {
      meetId,
      type: typeSelected,
    };
    navigate(`/meet/__create/`, {
      state: meetData,
    });
  };
  return (
    <div className="grid bg-[#3D4143]">
      <div className="grid w-[75%] rounded h-[80%] place-self-center">
        <div className="grid grid-rows-[1fr_4fr_4fr] rounded-md bg-gray-50 p-[10px]">
          <div className="grid place-content-center font-bold text-lg text-gray-800">
            Start a new meeting
          </div>
          <div className="grid grid-rows-[2fr_2fr_1fr]">
            <div className="grid grid-cols-[1fr_4fr]">
              <div className="grid place-content-center w-full place-self-center">
                Type:
              </div>
              <div className="grid grid-flow-col">
                <div
                  className={`grid relative place-self-center place-content-center rounded ${
                    typeSelected === 'restricted'
                      ? 'border-violet-500 border-[2px] text-violet-500'
                      : 'border-gray-400 border text-gray-500'
                  } p-[10px]`}
                >
                  <div className="grid grid-flow-col gap-[3px]">
                    Restricted
                    <div className="grid group relative border border-[#1C64F2] text-[#1C64F2] cursor-pointer rounded-full w-[17px] h-[17px] text-xs self-center place-content-center">
                      <div className="z-[1]">?</div>
                      <FormInfo
                        className="left-[25px] -top-[300%] w-[200px] lg:w-[300px]"
                        title="What is a meeting type?"
                        description="Meetings are of two types: <strong>Restricted</strong> and <b>Unrestricted.</b><br/>"
                      />
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full grid opacity-0">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      onInputCapture={() => {
                        setTypeSelected('restricted');
                      }}
                      name="type"
                      id="restricted"
                    />
                  </div>
                </div>
                <div
                  className={`grid grid-flow-col gap-[3px] relative place-self-center place-content-center cursor-pointer rounded ${
                    typeSelected === 'unrestricted'
                      ? 'border-violet-500 border-[2px] text-violet-500'
                      : 'border-gray-400 border text-gray-500'
                  } p-[10px]`}
                >
                  Unrestricted
                  <div className="grid z-[2] group relative border border-[#1C64F2] text-[#1C64F2] cursor-pointer rounded-full w-[17px] h-[17px] text-xs self-center place-content-center">
                    ?
                    <FormInfo
                      className="left-[25px] -top-[300%] w-[200px] lg:w-[300px]"
                      title="What is a meeting type?"
                      description="Meetings are of two types: <strong>Restricted</strong> and <b>Unrestricted.</b><br/>"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full grid opacity-0">
                    <input
                      type="radio"
                      className="cursor-pointer"
                      onInputCapture={() => {
                        setTypeSelected('unrestricted');
                      }}
                      name="type"
                      id="unrestricted"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid">
              <Button
                myRef={startMeetRef}
                onClick={createMeeting}
                className="grid place-content-center rounded-sm border border-gray-500 place-self-center text-white px-[30px] py-[10px] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 bg-[#2EA44E] hover:bg-[#148633]"
                text="Start meeting"
              />
            </div>
            <div className="grid">
              <div className="grid place-self-center w-full grid-cols-[5fr_1fr_5fr] gap-[5px]">
                <div className="grid h-[1px] w-full bg-gray-600 place-self-center"></div>
                <div className="text-gray-800 text-sm grid place-content-center place-self-center">
                  OR
                </div>
                <div className="grid h-[1px] w-full bg-gray-600 place-self-center"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-[1fr_3fr]">
            <div className="grid place-content-center font-bold text-lg text-gray-800">
              Join an existing meet
            </div>
            <div className="grid grid-rows-[1fr_1fr]">
              <div className="grid grid-cols-[1fr_2fr]">
                <div className="grid place-content-center">Meeting Code:</div>
                <div className="grid">
                  <input
                    type="text"
                    name="code"
                    placeholder="xxx-xxxx-xxx"
                    className="shadow-sm bg-gray-50 place-self-center border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                  />
                </div>
              </div>
              <div className="grid">
                <JoinButton
                  text="Join"
                  className="grid place-content-center place-self-center px-[30px] py-[10px] rounded-md cursor-pointer hover:bg-[#164fc1] text-white bg-[#1C64F2] disabled:bg-[#5283e7] disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
