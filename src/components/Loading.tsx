import { Lottie } from '@crello/react-lottie';
import loading from '../assets/loading.json';
export default function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    // here is where we will declare lottie animation
    // "animation" is what we imported before animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="grid place-content-center w-screen h-screen cursor-none">
      <Lottie
        config={defaultOptions}
        style={{
          placeSelf: 'center',
          cursor: 'none',
          width: '120px',
          height: '120px',
        }}
      />
    </div>
  );
}
