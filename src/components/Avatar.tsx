import { useEffect } from 'react';
import { useState } from 'react';
import parse from 'html-react-parser';
import { getUserAvatar } from '../utils/generateAvatar';
export default function Avatar({ className }: { className: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    setSvg(getUserAvatar());
  }, []);
  return <div className={className}>{parse(svg)}</div>;
}
