import { Apple } from '@styled-icons/fa-brands';
import Google from '../assets/google.webp';
import { Lottie } from '@crello/react-lottie';
import loading from '../assets/login-anim.json';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/auth-context';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { setToken } from '../axiosDefault';
import { LoginBody, METHOD, ResponseType } from '../types';
import makeRequest from '../utils/requestWrap';
import InputSubmit from '../components/Buttons/InputSubmit';
export default function Login() {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addError } = useOutletContext<any>();
  const navigate = useNavigate();
  const { setButtonLoading, SubmitButton } = InputSubmit();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const formSubmit = async (data: any, e: any) => {
    e.preventDefault();
    const {
      response,
      displaySuccessMessage,
    }: {
      response: ResponseType<LoginBody> | null;
      displaySuccessMessage: () => void;
    } = await makeRequest(
      METHOD.POST,
      'auth/login',
      data,
      addError,
      setButtonLoading
    );
    if (response.success) {
      if (setUser) {
        if (response.data) {
          setUser(response.data.body.token);
          setToken(response.data.body.token);
          setButtonLoading(false);
        }
        navigate('/meet');
      }
    }
  };
  const onError = (errors: any, e: any) => {
    e.preventDefault();
    console.log(errors);
  };
  return (
    <div className="grid lg:grid-cols-[1.5fr_1fr] bg-[#F9FAFB]">
      <div className="hidden lg:grid place-content-center">
        <Lottie
          config={defaultOptions}
          style={{ placeSelf: 'center', cursor: 'default', width: '100%' }}
        />
      </div>
      <div className="grid w-[90%] lg:w-fit h-fit lg:self-center lg:place-self-auto place-self-center grid-flow-row bg-white rounded-md shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px]">
        <div className="px-[30px] pt-[30px] grid grid-flow-row gap-[5px]">
          <div className="font-extrabold text-black text-xl">Welcome back</div>
          <div className="grid grid-cols-[auto_1fr] gap-1 text-sm">
            <div className="text-[#4444449e] font-thin">
              Don't have an account?
            </div>
            <Link to={'/signup'}>
              <div className="text-[#1C64F2] font-medium">Sign up.</div>
            </Link>
          </div>
        </div>
        <div className="grid grid-flow-row p-[30px]">
          <div className="grid grid-flow-row lg:grid-flow-col gap-[15px] pb-[20px]">
            <div className="border rounded-md grid grid-flow-col place-content-center gap-[8px] cursor-pointer hover:bg-gray-100">
              <div className="grid pl-[30px] place-content-center py-[10px]">
                <img src={Google} alt="G" width={20} />
              </div>
              <div className="grid pr-[30px] place-content-center text-sm">
                Sign in with Google
              </div>
            </div>
            <div className="border rounded-md grid grid-flow-col place-content-center bg-black text-white gap-[8px] cursor-pointer hover:bg-[#2d2d2d]">
              <div className="pl-[30px] grid place-content-center py-[10px]">
                <Apple width={15} />
              </div>
              <div className="grid pr-[30px] place-content-center text-sm">
                Sign in with Apple
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] pb-[20px]">
            <div className="h-[1px] w-full border-t-2 border-[#9f9f9f5e] place-self-center"></div>
            <div className="px-[20px] text-[#1C64F2]">or</div>
            <div className="h-[1px] w-full border-t-2 border-[#9f9f9f5e] place-self-center"></div>
          </div>
          <form
            onSubmit={handleSubmit(formSubmit, onError)}
            className="grid grid-flow-row"
          >
            <div className="grid grid-rows-[auto_1fr] gap-[5px] pb-[20px]">
              <div className="font-medium tracking-wider text-sm leading-5 text-black">
                Email
              </div>
              <input
                type="email"
                {...register('email', {
                  required: true,
                })}
                className={`text-sm outline-[#1C64F2] border border-gray-300 bg-[#F9FAFB] rounded-md p-[10px] ${
                  errors.email ? 'border-red-700' : ''
                }`}
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="grid grid-rows-[auto_1fr] gap-[5px] pb-[20px]">
              <div className="font-medium tracking-wider text-sm leading-5 text-black">
                Password
              </div>
              <input
                type="password"
                {...register('password', {
                  required: true,
                })}
                className={`text-sm outline-[#1C64F2] border border-gray-300 bg-[#F9FAFB] rounded-md p-[10px] ${
                  errors.password ? 'border-red-700' : ''
                }`}
                placeholder="•••••••"
              />
            </div>
            <div className="grid grid-flow-col gap-[5px] pb-[20px]">
              <div className="grid grid-cols-[auto_1fr] gap-[9px] place-content-start">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="border border-gray-300 bg-[#F9FAFB] w-[15px] rounded-md"
                />
                <div className="tracking-wide text-gray-500 text-sm">
                  Remember me
                </div>
              </div>
              <div className="grid place-content-end text-[#1C64F2] text-sm font-semibold">
                Forgot password?
              </div>
            </div>
            <SubmitButton
              className="grid grid-flow-col py-[10px] place-content-center font-semibold text-sm rounded-md cursor-pointer hover:bg-[#164fc1] text-white bg-[#1C64F2] disabled:bg-[#5283e7] disabled:cursor-not-allowed"
              text="Sign in to your account"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
