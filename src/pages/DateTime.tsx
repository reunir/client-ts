import { useEffect, useState } from 'react';

export default function DateTime() {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const setTimeDate = () => {
    let date = new Date();
    setDate(
      `${weekday[date.getDay()]}, ${month[date.getMonth()]}${date.getDate()}`
    );
    setTime(
      `${
        date.getHours() == 0 || 12
          ? '12'
          : date.getHours() < 12
          ? date.getHours()
          : date.getHours() - 12
      }:${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      } ${date.getHours() <= 12 ? 'AM' : 'PM'}`
    );
  };
  useEffect(() => {
    setTimeDate();
    setInterval(() => {
      setTimeDate();
    }, 60000);
  }, []);
  return (
    <div className="grid place-content-center text-md tracking-wide text-gray-200">
      {time} | {date}
    </div>
  );
}
