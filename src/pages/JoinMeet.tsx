import { Lottie } from '@crello/react-lottie';
import joinMeet from '../assets/joinanim.json';
import Avatar from '../components/Avatar';
import DateTime from './DateTime';
import NewMeetForm from './NewMeetForm';
export default function JoinMeet() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: joinMeet,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="grid h-screen w-screen bg-slate-100 grid-rows-[1fr_11fr]">
      <div className="grid grid-cols-[4fr_5fr_4fr] shadow">
        <div className="grid place-content-center text-[#C277E0] font-bold text-5xl">
          reunir
        </div>
        <div></div>
        <div className="grid grid-cols-[2fr_1fr_1fr]">
          <DateTime />
          <div></div>
          <div className="grid w-[60px] h-[60px] place-self-center overflow-hidden rounded-full">
            <Avatar className="" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1.5fr]">
        <NewMeetForm />
        <div className="grid content-center justify-end">
          <Lottie
            config={defaultOptions}
            style={{ placeSelf: 'center', cursor: 'default', width: '80%' }}
          />
        </div>
      </div>
    </div>
  );
}
