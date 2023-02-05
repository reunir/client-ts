import React, { useEffect, useRef } from 'react';
import Avatar from './Avatar';

export default function AudioVisualizer({
  stream,
}: {
  stream: MediaStream | null;
}) {
  const analyserCanvas = useRef<HTMLDivElement>(null);
  function removeDivAfter(this: HTMLSpanElement) {
    setTimeout(() => {
      this.remove();
    }, 3000);
  }
  useEffect(() => {
    if (stream) {
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const audioSrc = audioCtx.createMediaStreamSource(stream);
      audioSrc.connect(analyser);
      audioSrc.connect(audioCtx.destination);
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
      //   const ctx = analyserCanvas.current.getContext('2d');
      //   const draw = (dataParm: any) => {
      //     dataParm = [...dataParm];
      //     ctx.fillStyle = 'blue'; //white background
      //     ctx.lineWidth = 2; //width of candle/bar
      //     ctx.strokeStyle = '#d5d4d5'; //color of candle/bar
      //     const space = analyserCanvas.current.width / dataParm.length;
      //     dataParm.forEach((value: number, i: number) => {
      //       ctx.beginPath();
      //       ctx.moveTo(space * i, analyserCanvas.current.height); //x,y
      //       ctx.lineTo(space * i, analyserCanvas.current.height - value); //x,y
      //       ctx.stroke();
      //     });
      //   };
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
      };
      requestAnimationFrame(loopingFunction);
    }
  }, []);
  return (
    <div
      ref={analyserCanvas}
      className="grid w-[250px] h-[250px] place-self-center relative rotate-180"
    >
      <Avatar className="grid rotate-180 absolute top-0 left-0 z-[2] rounded-full w-[250px] h-[250px] overflow-hidden" />
    </div>
  );
}
