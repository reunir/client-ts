import { useEffect } from 'react';
import { useState } from 'react';
import parse from 'html-react-parser';
import { getUserAvatar } from '../utils/generateAvatar';
export default function Avatar({ className }: { className: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    setSvg(getUserAvatar());
  }, [getUserAvatar()]);
  return svg === '' ? (
    <div className="grid bg-gray-500 place-content-center">
      <svg
        className="animate-spin h-[20px] w-[20px] mr-3"
        viewBox="0 0 24 24"
      ></svg>
    </div>
  ) : (
    <div className={className}>{parse(svg)}</div>
  );
}
