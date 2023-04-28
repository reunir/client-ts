import React, { useEffect, useRef, useState } from 'react';
import { CAPTIONS } from '../types';
import { useIsOverflow } from '../hooks/useOverflow';
import axios from 'axios';
import { useAuth } from '../context/auth-context';

export default function Captions({ captions }: { captions: CAPTIONS }) {
  const [captionQueue, setCaptionsQueue] = useState(captions);
  const divRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(divRef);
  const { user } = useAuth();
  const translateCaptions = async (captions: CAPTIONS) => {
    if (captions) {
      for (let ind = 0; ind < captions.length; ind++) {
        const res = await axios.post('fshare/translate', {
          lang: 'hi',
          caption: captions[ind].caption,
        });
        console.log(res.data.data.body.caption);
        setCaptionsQueue(captions);
      }
    }
  };
  useEffect(() => {
    // console.log(captions);
    translateCaptions(captions);
    divRef.current?.scrollTo(0, captionRef.current?.clientHeight || 0);
  }, [captions]);
  return (
    <>
      {captionQueue ? (
        <div
          ref={divRef}
          className="grid scroll-smooth p-[10px] absolute top-[10px] place-self-center w-[500px] overflow-scroll rounded-sm min-h-[50px] h-fit max-h-[80px] bg-gray-800 text-white"
        >
          <div ref={captionRef} className="grid w-full h-fit">
            <div className="grid grid-flow-col gap-[5px]">
              {captionQueue.map((cap) => (
                <div className="">
                  <div className="inline-block">{cap.username}:</div>
                  <div>{cap.caption}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
