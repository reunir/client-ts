import { LeftArrow, RightArrow } from '@styled-icons/boxicons-solid';
import { useEffect, useState } from 'react';
import bgimg from '../../assets/reunir-joinmeet.png';
import bgimg2 from '../../assets/s2.jpeg';
import parse from 'html-react-parser';
export default function SlideShow() {
  const [shownImage, setShownImage] = useState(0);
  const [images, setImages] = useState([
    {
      location: bgimg,
      htmlTitle:
        "<div style='font-size:40px; font-weight:600;background: #edaa59;background: -webkit-linear-gradient(to right, #edaa59 0%, #FFA73D 30%, #FF7C00 60%, #FF7F04 100%);background: -moz-linear-gradient(to right, #edaa59 0%, #FFA73D 30%, #FF7C00 60%, #FF7F04 100%);background: linear-gradient(to right, #edaa59 0%, #FFA73D 30%, #FF7C00 60%, #FF7F04 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;' >Connect with your favourites.<div className='grid place-content-center gap-[5px]'>Anytime. Anywhere</div></div>",
    },
    {
      location: bgimg2,
      htmlTitle:
        "<div className='grid place-content-center text-white font-medium text-3xl'>Get richer experience with insights!</div>",
    },
  ]);
  const [length, setLength] = useState(images.length);

  const showForwardImage = () => {
    setShownImage((shownImage + 1) % length);
  };
  useEffect(() => {
    const imgAuto = setInterval(() => {
      showForwardImage();
    }, 3000);
    return () => {
      clearInterval(imgAuto);
    };
  });
  return (
    <div className="grid relative">
      {images.map((img, id) => (
        <div
          key={id}
          className={` relative ${id === shownImage ? 'grid' : 'hidden'}`}
        >
          <img className="w-full h-full" src={img.location} alt="" />
          <div className="absolute top-[20px] grid justify-self-center">
            {parse(img.htmlTitle)}
          </div>
        </div>
      ))}
      <div className="absolute p-[10px] rounded-[50px] bg-gray-700 bottom-[10px] grid grid-flow-col gap-[10px] justify-self-center">
        {images.map((val, ind) => (
          <div key={ind} className="grid place-content-center">
            <div
              className={`${
                ind === shownImage
                  ? 'w-[10px] h-[10px] bg-white '
                  : 'w-[6px] h-[6px] bg-gray-500'
              } rounded-full content-none transition-all ease-linear duration-500`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
