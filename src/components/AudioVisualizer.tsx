import React, { createRef, useEffect, useRef } from 'react';
import Avatar from './Avatar';

export default function AudioVisualizer({
  stream,
  className,
  setIfSpeaking,
  audioTrack,
}: {
  stream: MediaStream | null;
  className?: string | null;
  setIfSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  audioTrack: boolean;
}) {
  const analyserCanvas = useRef<HTMLDivElement>(null);
  function removeDivAfter(this: HTMLSpanElement) {
    setTimeout(() => {
      this.remove();
    }, 3000);
  }
  const audioRef = createRef<HTMLAudioElement>();
  useEffect(() => {
    if (stream && audioRef.current && !audioRef.current.srcObject) {
      audioRef.current.srcObject = stream;
    }
    if (stream) {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const audioSrc = audioCtx.createMediaStreamSource(stream);
      audioSrc.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      let data = new Uint8Array(bufferLength);
      let elements: HTMLSpanElement[] = [];
      for (let i = 0; i < bufferLength; i++) {
        const element = document.createElement('span');
        element.classList.add('visualizers');
        element.addEventListener('load', removeDivAfter);
        elements.push(element);
        analyserCanvas.current?.appendChild(element);
      }
      const clamp = (num: number, min: number, max: number) => {
        if (num >= max) return max;
        if (num <= min) return min;
        return num;
      };
      const loopingFunction = () => {
        requestAnimationFrame(loopingFunction);
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < bufferLength; i++) {
          let item = data[i];
          item = item > 150 ? item / 1.5 : item;
          elements[i].style.transform = `rotateZ(${
            i * (360 / bufferLength)
          }deg) translate(-50%,${clamp(item, 100, 150)}px)`;
        }
        let isspeaking = false;
        for (let i in data) {
          if (data[i] > 30) {
            isspeaking = true;
            setIfSpeaking(true);
          }
        }
        if (!isspeaking) {
          setIfSpeaking(false);
        }
      };
      requestAnimationFrame(loopingFunction);
    }
    return () => {
      console.log('Dismounted visualizer!');
    };
  }, [stream]);
  return (
    <div
      ref={analyserCanvas}
      className={`w-[250px] h-[250px] place-self-center relative rotate-180 ${className}`}
    >
      <Avatar className="grid rotate-180 absolute top-0 left-0 z-[2] rounded-full w-[250px] h-[250px] overflow-hidden" />
    </div>
  );
}
