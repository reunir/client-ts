import { Close } from '@styled-icons/ionicons-sharp';
import { NotificationObject } from '../types';
export default function NotificationHandler({
  notification,
  deleteAfterExpiryTime,
}: {
  notification: NotificationObject[];
  deleteAfterExpiryTime: (arrayIndex: number) => void;
}) {
  const deleteError = (timeOutId: NodeJS.Timeout, arrayIndex: number) => {
    clearTimeout(timeOutId);
    deleteAfterExpiryTime(arrayIndex);
  };
  return (
    <>
      {notification.length != 0
        ? notification.map((data, i) => (
            <div
              key={i}
              className={`grid left-full animate-notification top-[10px] z-10 opacity-100 absolute cursor-pointer group w-[300px] text-lg font-inter rounded-lg place-content-center border shadow-[rgba(0,0,0,0.16)_0px_3px_6px,_rgba(0,0,0,0.23)_0px_3px_6px] h-[60px] ${'bg-gray-500 dark:bg-gray-600 text-gray-100 dark:text-gray-100 dark:border-slate-800 border-gray-600'}`}
            >
              <div>{data.message}</div>
              <div
                className={`absolute ${'bg-gray-600 text-gray-100'} hidden group-hover:grid -top-[8px] -left-[8px] p-[3px] w-[25px] h-[25px] rounded-full`}
              >
                <Close
                  onClick={() => {
                    deleteError(data.timeOutId, data.arrayIndex);
                  }}
                />
              </div>
            </div>
          ))
        : ''}
    </>
  );
}
