import { Close } from '@styled-icons/ionicons-sharp';
import useDisplayError from '../hooks/useDisplayError';
import { ErrorObject } from '../types';

export default function ErrorHandler({
  error,
  deleteAfterExpiryTime,
}: {
  error: ErrorObject<any>[];
  deleteAfterExpiryTime: (arrayIndex: number) => void;
}) {
  const deleteError = (timeOutId: NodeJS.Timeout, arrayIndex: number) => {
    clearTimeout(timeOutId);
    deleteAfterExpiryTime(arrayIndex);
  };
  return (
    <>
      {error.length != 0
        ? error.map((data, i) => (
            <div
              key={i}
              className={`grid place-self-center bottom-full animate-error z-10 opacity-100 absolute cursor-pointer group w-[300px] text-lg font-inter rounded-lg place-content-center border shadow-[rgba(0,0,0,0.16)_0px_3px_6px,_rgba(0,0,0,0.23)_0px_3px_6px] h-[60px] ${
                data.success
                  ? 'bg-green-500 dark:bg-green-600 text-gray-100 dark:text-gray-100 dark:border-green-800 border-green-600'
                  : 'bg-red-500 text-gray-50 border-red-600'
              }`}
            >
              {data.success ? (
                <div>{data.data?.message}</div>
              ) : (
                <div>{data.error?.message}</div>
              )}
              <div
                className={`absolute ${
                  data.success
                    ? 'bg-gray-600 text-gray-100'
                    : 'bg-red-700 text-gray-100'
                } hidden group-hover:grid -top-[8px] -left-[8px] p-[3px] w-[25px] h-[25px] rounded-full`}
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
