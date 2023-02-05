import { useEffect, useState } from 'react';
import NormalButton from '../components/Buttons/NormalButton';
import FormInfo from '../components/FormInfo';

export default function NewMeetForm() {
  const [typeSelected, setTypeSelected] = useState('');
  const [meetCode, setMeetCode] = useState('');
  useEffect(() => {
    console.log(typeSelected);
  }, [typeSelected]);
  const { setButtonLoading, Button } = NormalButton();
  const { setButtonLoading: setjoinButtonLoading, Button: JoinButton } =
    NormalButton();
  return (
    <div className="grid">
      <div className="grid grid-rows-[1fr_5fr] w-[75%] rounded h-[80%] place-self-center">
        <div className="grid place-content-center">
          <img
            src="https://readme-typing-svg.herokuapp.com?font=Poppins&weight=500&size=60&duration=2000&pause=500&color=8A44FF&center=true&vCenter=true&width=600&height=80&lines=Welcome;Bienvenu;Willkommen;%E0%A6%B8%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%97%E0%A6%A4;%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%97%E0%A4%A4;%E6%AD%A1%E8%BF%8E;Welkom;%E0%AA%B8%E0%AB%8D%E0%AA%B5%E0%AA%BE%E0%AA%97%E0%AA%A4+%E0%AA%9B%E0%AB%87;+%E3%81%84%E3%82%89%E3%81%A3%E3%81%97%E3%82%83%E3%81%84%E3%81%BE%E3%81%9B;%E0%B2%B8%E0%B3%8D%E0%B2%B5%E0%B2%BE%E0%B2%97%E0%B2%A4;+%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%97%E0%A4%A4+%E0%A4%86%E0%A4%B9%E0%A5%87;%E0%A8%B8%E0%A9%81%E0%A8%86%E0%A8%97%E0%A8%A4+%E0%A8%B9%E0%A9%88;%D0%94%D0%BE%D0%B1%D1%80%D0%BE+%D0%BF%D0%BE%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D1%82%D1%8C;%E0%A4%B8%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%97%E0%A4%A4%E0%A4%AE%E0%A5%8D%E2%80%8C"
            alt="Typing SVG"
          />
        </div>
        <div className="grid grid-rows-[1fr_4fr_4fr] border-[2px] rounded-md bg-gray-100 p-[10px]">
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
                className="grid place-content-center rounded-sm border border-gray-500 place-self-center text-white px-[30px] py-[10px] bg-[#2EA44E] hover:bg-[#148633]"
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
