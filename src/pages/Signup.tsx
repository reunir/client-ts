import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSignup } from '../context/signup-context';
import SignupHelper from './Signup/SignupHelper';
import Modal from './Signup/Modal';

export default function Signup() {
  const {
    formData,
    updateFormData,
    whichPart,
    partTitle,
    percentageCompleted,
    modalShown,
    modalElement,
  } = useSignup();
  return (
    <>
      <div className="grid place-content-center bg-[#F9FAFB]">
        <div className="grid bg-white rounded-md w-full lg:w-[700px]">
          <div className="grid grid-flow-row lg:grid-flow-col mx-[20px] my-[20px] border-b-2">
            <div className="grid place-self-start lg:pb-[12px]">
              <div className="grid font-semibold text-sm text-gray-400">
                STEP: {whichPart + 1} of 2
              </div>
              <div className="font-bold text-lg">{partTitle}</div>
            </div>
            <div className="grid grid-flow-col content-center justify-start lg:justify-end gap-[6px] pb-[12px]">
              <div className="bg-gray-200 rounded-xl self-center w-[200px] h-[10px] overflow-hidden">
                <div
                  className={`grid h-full bg-green-500 rounded-r-xl`}
                  style={{ width: percentageCompleted + '%' }}
                ></div>
              </div>
              <div className="grid self-center text-gray-600">
                {percentageCompleted}%
              </div>
            </div>
          </div>
          <SignupHelper />
        </div>
        {/* {JSON.stringify(formData)} */}
      </div>
      {modalShown ? <Modal>{modalElement}</Modal> : <></>}
    </>
  );
}
