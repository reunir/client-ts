import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import ModeSwitcher from './ModeSwitcher';

export default function Header({
  className,
  isHeaderShown,
  setIsHeaderShown,
}: {
  className: string;
  isHeaderShown: boolean;
  setIsHeaderShown: any;
}) {
  const [localheaderTimeout, setLocalHeaderTimeout] = useState<any>(null);
  const headerFocusOut = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.add('header');
    setIsHeaderShown(false);
  };
  const headerFocusIn = (e: React.BaseSyntheticEvent) => {
    e.currentTarget.classList.remove('header');
    setIsHeaderShown(true);
  };
  return (
    <div
      id="header"
      onMouseOut={headerFocusOut}
      onMouseOver={headerFocusIn}
      className={`${className} static grid grid-flow-col pr-[10px] lg:pr-0 lg:grid-cols-[3fr_11fr_1fr_1fr_1fr] grid-cols-[2fr_1fr_1fr] top-0 left-0 w-full h-[80px] bg-slate-100 dark:bg-gray-700`}
    >
      <div className="grid place-content-center font-inter font-medium dark:text-gray-100 text-4xl text-gray-700"></div>
      <div></div>
      <div className="grid">
        {/* <ShareDetails addNotification={addNotification} id={id} /> */}
      </div>
    </div>
  );
}
