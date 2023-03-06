import { createRef, useEffect, useState } from 'react';
import { useSignup } from '../../context/signup-context';
import ClipLoader from 'react-spinners/ClipLoader';
import parse from 'html-react-parser';
import { useForm } from 'react-hook-form';
import { generateNewAvatar } from '../../utils/generateAvatar';
import FormInfo from '../../components/FormInfo';
import {
  LoginBody,
  METHOD,
  ModifiedSignupObject,
  ResponseType,
  TEMPLATETYPE,
} from '../../types';
import makeRequest from '../../utils/requestWrap';
import NormalButton from '../../components/Buttons/NormalButton';
import { useOutletContext } from 'react-router-dom';

type OTPI = {
  encodedURI: string;
};

export default function YourProfile() {
  const { formData, whichPart, updateFormData, isNextDisabled, updatePart } =
    useSignup();
  const [avatarLoader, setAvatarLoader] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [showPassword, setshowPassword] = useState(false);
  const { Button, setButtonLoading } = NormalButton();
  const { Button: SendOTPButton, setButtonLoading: sendOTPButtonLoading } =
    NormalButton();
  const [otpURI, setOtpURI] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const { addError } = useOutletContext<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const nextButtonRef = createRef<HTMLButtonElement>();

  const avatarCallback = () => {
    setAvatarLoader(true);
    generateNewAvatar().then(({ seed, stripe, randomColor, avatar }) => {
      updateFormData({ seed, stripe, backgroundColor: randomColor });
      setAvatar(avatar);
      setAvatarLoader(false);
    });
  };
  useEffect(() => {
    avatarCallback();
  }, []);

  useEffect(() => {
    if (!formData.isEmailVerified) {
      nextButtonRef.current?.setAttribute('disabled', 'true');
    } else {
      nextButtonRef.current?.removeAttribute('disabled');
    }
  }, [isNextDisabled, formData.isEmailVerified]);

  const formSubmit = (data: ModifiedSignupObject, e: any) => {
    e.preventDefault();
    if (isNextDisabled) {
      addError({
        success: false,
        message: 'Fill up required fields!',
      });
      return;
    }
    if (!formData.isEmailVerified) {
      addError({
        success: false,
        message: 'Please verify your email!',
      });
      return;
    }
    updatePart(1);
  };
  const onError = (errors: any, e: any) => {
    e.preventDefault();
    console.log(errors);
  };

  const verifyEmail = (email: string): boolean => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
      return true;
    return false;
  };

  const verifyOTP = (): boolean => {
    if (userOtp.length != 6 || !/^\d+$/.test(userOtp)) return false;
    return true;
  };

  const sendOTPRequest = async () => {
    setOtpURI('');
    const {
      response,
      displaySuccessMessage,
    }: {
      response: ResponseType<OTPI> | null;
      displaySuccessMessage: () => void;
    } = await makeRequest(
      METHOD.POST,
      'auth/verifyemail',
      {
        email: formData.email,
        type: TEMPLATETYPE.VERIFY,
      },
      addError,
      setButtonLoading
    );
    displaySuccessMessage();
    if (response.data) {
      setOtpURI(response.data?.body.encodedURI);
    }
  };

  const verifyUserOTP = async () => {
    const {
      response,
      displaySuccessMessage,
    }: {
      response: ResponseType<OTPI> | null;
      displaySuccessMessage: () => void;
    } = await makeRequest(
      METHOD.POST,
      'auth/verifyOTP',
      {
        otpURI: otpURI,
        otp: userOtp,
        check: formData.email,
      },
      addError,
      sendOTPButtonLoading
    );
    displaySuccessMessage();
    if (response.success) {
      updateFormData({ isEmailVerified: true });
      setOtpURI('');
    }
  };

  return (
    <>
      <div className="grid mx-[20px] mb-[20px]">
        <div className="grid place-self-center grid-rows-[1fr_auto] gap-[10px]">
          <div
            className={`grid w-[100px] h-[100px] rounded-full overflow-hidden bg-[${formData.backgroundColor}]`}
          >
            {avatarLoader ? (
              <div className="bg-gray-400 grid place-content-center">
                <ClipLoader color="white" />
              </div>
            ) : (
              parse(avatar)
            )}
          </div>
          <div className="grid ">
            <button
              disabled={avatarLoader}
              onClick={avatarCallback}
              className="px-5 py-2.5 relative rounded group overflow-hidden disabled:cursor-not-allowed font-medium bg-purple-50 text-purple-600 inline-block"
            >
              <span className="absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 group-disabled:bg-purple-50 bg-purple-600 group-hover:h-full opacity-90"></span>
              <span className="relative grid grid-cols-[1fr_auto] gap-[5px] group-disabled:text-purple-600 group-hover:text-white">
                Refresh
                {avatarLoader ? (
                  <ClipLoader className="group-hover:!border-[white_white_transparent] group-disabled:!border-[rgb(147_51_234)_rgb(147_51_234)_transparent] !border-[rgb(147_51_234)_rgb(147_51_234)_transparent] !w-[20px] !h-[20px] place-self-center" />
                ) : (
                  ''
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      <form
        className="grid mx-[20px] mb-[20px]"
        onSubmit={handleSubmit(formSubmit, onError)}
      >
        <div className="grid">
          <div className="grid grid-flow-row lg:grid-flow-col lg:gap-[15px]">
            <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
              <div className="grid text-gray-700 font-bold text-sm">
                First Name
              </div>
              <input
                type="text"
                id="firstName"
                {...register('firstName', {
                  required: true,
                })}
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => {
                  updateFormData({ firstName: e.target.value });
                }}
                spellCheck={false}
                className={`text-sm  rounded-md border bg-[#F9FAFB] outline-[#1C64F2] p-[10px] ${
                  errors.firstName ? 'border-red-700' : ''
                }`}
              />
            </div>
            <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
              <div className="grid text-gray-700 font-bold text-sm">
                Last Name
              </div>
              <input
                type="text"
                id="lastName"
                {...register('lastName', {
                  required: true,
                })}
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => {
                  updateFormData({ lastName: e.target.value });
                }}
                spellCheck={false}
                className={`text-sm  rounded-md border bg-[#F9FAFB] outline-[#1C64F2] p-[10px] ${
                  errors.lastName ? 'border-red-700' : ''
                }`}
              />
            </div>
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
            <div className="grid grid-cols-[auto_1fr] gap-[5px] text-gray-700 font-bold text-sm">
              Email
              <div className="grid group relative border border-[#1C64F2] text-[#1C64F2] cursor-pointer rounded-full w-[17px] h-[17px] text-xs self-center place-content-center">
                ?
                <FormInfo
                  className="left-[25px] -top-[300%] w-[230px] lg:w-[300px]"
                  title="Why we require your email?"
                  description="We require your email to verify your identity and to provide alerts about your scheduled meetings. Please re-verify your email as it cannot be changed after."
                />
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto]">
              <input
                type="email"
                disabled={formData.isEmailVerified}
                id="email"
                {...register('email', {
                  required: true,
                })}
                placeholder="johndoe@gmail.com"
                value={formData.email}
                onChange={(e) => {
                  if (!formData.isEmailVerified)
                    updateFormData({ email: e.target.value });
                }}
                spellCheck={false}
                className={`text-sm  rounded-md border bg-[#F9FAFB] outline-[#1C64F2] p-[10px] ${
                  errors.email ? 'border-red-700' : ''
                }`}
              />
              {formData.isEmailVerified ? (
                ''
              ) : (
                <div className="w-[80px] grid place-content-center ">
                  <Button
                    onClick={sendOTPRequest}
                    disabled={!verifyEmail(formData.email)}
                    text="Verify"
                    className={`w-fit h-fit ${
                      verifyEmail(formData.email)
                        ? 'text-purple-500 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
          {otpURI != '' ? (
            <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
              <div className="grid grid-cols-[auto_1fr] gap-[5px] text-gray-700 font-bold text-sm">
                Enter OTP
              </div>
              <div className="grid grid-cols-[auto_1fr]">
                <input
                  type="text"
                  id="otp"
                  placeholder="XXXXXX"
                  value={userOtp}
                  onChange={(e) => {
                    setUserOtp(e.target.value);
                  }}
                  spellCheck={false}
                  className={`text-sm w-[100px] text-center rounded-md border bg-[#F9FAFB] outline-[#1C64F2] p-[10px]`}
                />
                <div className="w-[80px] grid place-content-center ">
                  <SendOTPButton
                    onClick={verifyUserOTP}
                    disabled={!verifyOTP()}
                    text="Verify"
                    className={`w-fit h-fit ${
                      verifyOTP()
                        ? 'text-green-500 cursor-pointer'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          {/* <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
                <div className="grid grid-cols-[auto_1fr] gap-[5px] text-gray-700 font-bold text-sm">
                    Phone Number
                    <div className="grid group relative border border-[#1C64F2] text-[#1C64F2] cursor-pointer rounded-full w-[17px] h-[17px] text-xs self-center place-content-center">
                        ?
                        <FormInfo className="left-[25px] -top-[300%] w-[170px] lg:w-[300px]" title="Why we require your phone?" description="We require your phone to provide alerts about your scheduled meetings on WhatsApp."/>
                    </div>
                </div>
                <div className="grid grid-cols-[1fr_auto]">
                    <input type="text" name="phno" id="phno" placeholder="1234567890" required onBlur={(e)=>{alterRedBorderToInvalidPhone(e)}} spellCheck={false} className="border rounded-md bg-[#F9FAFB] outline-[#1C64F2] p-[10px]" />
                </div>
            </div> */}
          <div className="grid grid-rows-[auto_1fr] gap-[7px] mb-[10px]">
            <div className="grid text-gray-700 font-bold text-sm">Password</div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="•••••••••"
              {...register('password', {
                required: true,
                pattern: {
                  value: /[A-Za-z0-9](?!.*\s).{8,}$/,
                  message: 'Required',
                },
              })}
              spellCheck={false}
              value={formData.password}
              onChange={(e) => {
                updateFormData({ password: e.target.value });
              }}
              className={`text-sm  rounded-md border bg-[#F9FAFB] outline-[#1C64F2] p-[10px] ${
                errors.password ? 'border-red-700' : ''
              }`}
            />
          </div>
          <div className="grid grid-flow-col mb-[10px]">
            <div className="grid grid-cols-[auto_1fr] gap-[8px] place-self-start">
              <input
                type="checkbox"
                name="showpass"
                checked={showPassword}
                onChange={() => {
                  setshowPassword(!showPassword);
                }}
                id="showpass"
                className=" outline-[#1C64F2] border border-gray-300 bg-[#F9FAFB] w-[15px] rounded-md"
              />
              <div className="text-sm text-black  font-medium">
                Show Password
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-flow-col mx-[20px] mb-[20px]">
          <button
            ref={nextButtonRef}
            disabled={isNextDisabled}
            className={`grid cursor-pointer disabled:bg-[#698dd4] disabled:cursor-default hover:bg-[#1654cf] place-self-end font-extrabold px-[40px] place-content-center py-[10px] text-white bg-[#1C64F2] w-[120px] rounded-md ${
              whichPart === 3 ? 'hidden' : ''
            }`}
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}
