import { Lottie } from '@crello/react-lottie';
import { useOutletContext } from 'react-router-dom';
import joinMeet from '../assets/joinanim.json';
import Avatar from '../components/Avatar';
import DateTime from './DateTime';
import NewMeetForm from './NewMeetForm';
import bgimg from '../assets/reunir-joinmeet.png';
import SlideShow from '../components/Slideshow/Slideshow';
export default function JoinMeet() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: joinMeet,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const { isSocketConnected, sendSocketRequest } = useOutletContext<any>();
  return (
    <div className="grid h-screen w-screen grid-rows-[1fr_11fr]">
      <div className="grid grid-cols-[4fr_8fr_4fr] bg-[#202124] shadow">
        <div className="grid ml-[20px] content-center text-white font-bold text-3xl">
          reunir
        </div>
        <div></div>
        <div className="grid grid-cols-[5.5fr_1fr]">
          <DateTime />
          <div className="grid w-[45px] mr-[20px] h-[45px] justify-self-end self-center overflow-hidden rounded-full">
            <Avatar className="" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1.5fr]">
        <NewMeetForm
          isSocketConnected={isSocketConnected}
          sendSocketRequest={sendSocketRequest}
        />
        <div className="grid">
          <SlideShow />
        </div>
      </div>
    </div>
  );
}
