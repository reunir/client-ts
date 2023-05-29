import { AppProp } from '../../types';

export default function Modal(props: AppProp) {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-600/50 grid">
        {props.children}
      </div>
    </>
  );
}
