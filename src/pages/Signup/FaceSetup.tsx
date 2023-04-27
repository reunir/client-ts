import { useEffect, useRef, useState } from 'react';
import { useUserMedia } from '../../hooks/userStream';
import { VIDEO_CAPTURE_OPTIONS } from '../../types';
import { useSignup } from '../../context/signup-context';
import VerifyImageModal from './VerifyImageModal';

export default function FacerSetup() {
  const {
    mediaStream,
    videoTrack,
    audioTrack,
    toggleAudio,
    toggleCamera,
    enableUserStream,
  } = useUserMedia(VIDEO_CAPTURE_OPTIONS);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRenderRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    enableUserStream();
  }, []);
  function handleCanPlay() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }
  useEffect(() => {
    if (videoRenderRef.current) {
      const boundingRect = videoRenderRef.current.getBoundingClientRect();
      const { width, height } = boundingRect;
      setWindowSize([Math.round(width), Math.round(height)]);
    }
  }, [videoRenderRef]);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  });
  useEffect(() => {
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = mediaStream;
    }
  });
  const { formData, updateModalElement, updateModalShown } = useSignup();
  const imageCapture = () => {
    if (videoRef.current)
      canvasRef.current
        ?.getContext('2d')
        ?.drawImage(videoRef.current, 0, 0, windowSize[0], windowSize[1]);

    let imageDataUrl = canvasRef.current?.toDataURL('image/jpeg');
    updateModalElement(
      <VerifyImageModal
        width={windowSize[0]}
        height={windowSize[1]}
        imageDataUrl={`${imageDataUrl}`}
      />
    );
    updateModalShown(true);
  };
  return (
    <>
      <div className="grid mx-[20px] mb-[20px]">
        <div className="grid justify-center h-[300px]" ref={videoRenderRef}>
          <div
            className="grid relative self-center"
            style={{
              width: windowSize[0] + 'px',
              height: windowSize[1] + 'px',
            }}
          >
            <div
              className={`grid ${
                videoTrack ? '' : 'border border-gray-400 bg-gray-400'
              } overflow-hidden justify-center`}
              style={{
                width: windowSize[0] + 'px',
                height: windowSize[1] + 'px',
              }}
            >
              <div className="rounded-md relative overflow-hidden">
                <video
                  className={`-scale-x-100 -top-[1px] h-full -left-[1px] pointer-events-none`}
                  ref={videoRef}
                  id={'authentication-video'}
                  onCanPlay={handleCanPlay}
                  autoPlay
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid h-[90px] place-content-center">
          <div
            onClick={imageCapture}
            className="grid w-fit h-fit px-[20px] rounded-md cursor-pointer hover:bg-red-800 py-[10px] bg-red-700 text-white"
          >
            Capture
          </div>
        </div>
      </div>
      <div className="hidden opacity-0">
        <canvas
          ref={canvasRef}
          width={windowSize[0]}
          height={windowSize[1]}
        ></canvas>
      </div>
    </>
  );
}
