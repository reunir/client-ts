import { useEffect, useRef } from 'react';
import { useSignup } from '../../context/signup-context';
import makeRequest from '../../utils/requestWrap';
import { FileResponse, LoginBody, METHOD, ResponseType } from '../../types';
import { useOutletContext } from 'react-router';
import NormalButton from '../../components/Buttons/NormalButton';

export default function VerifyImageModal({
  imageDataUrl,
  width,
  height,
}: {
  imageDataUrl: string | undefined;
  width: number;
  height: number;
}) {
  const pictureRef = useRef<HTMLCanvasElement>(null);
  const { updateModalShown, formData } = useSignup();
  const { addError } = useOutletContext<any>();
  const { Button, setButtonLoading } = NormalButton();

  useEffect(() => {
    if (pictureRef.current) {
      let img = new Image();
      img.onload = function (this: any) {
        pictureRef.current?.getContext('2d')?.drawImage(this, 0, 0, 400, 400);
      };
      if (imageDataUrl) img.src = imageDataUrl;
    }
  }, [pictureRef.current]);
  const retake = () => {
    updateModalShown(false);
  };
  const acceptFile = async () => {
    let files: File[] = [];
    pictureRef.current?.toBlob(async (blob) => {
      if (blob) {
        let file = new File([blob], formData.email + '.jpg', {
          type: 'image/jpeg',
        });
        files.push(file);

        const urls = files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const {
            response,
            displaySuccessMessage,
          }: {
            response: ResponseType<FileResponse> | null;
            displaySuccessMessage: () => void;
          } = await makeRequest(
            METHOD.POST,
            'fshare',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
            addError,
            setButtonLoading
          );

          displaySuccessMessage();
          console.log(response.data?.body);
          return response.data?.body.url;
        });
        const gotURLs = await Promise.all(urls);
        console.log(urls);
      }
    }, 'image/jpeg');
  };
  return (
    <div className="grid gap-[10px] place-self-center rounded bg-gray-50 w-[500px] h-fit">
      <div className="grid text-lg pl-[10px] pt-[10px]">Verify Your Image</div>
      <div className="grid place-content-center">
        <canvas
          className="grid"
          ref={pictureRef}
          width={400}
          height={400}
        ></canvas>
      </div>
      <div className="grid pb-[10px]">
        <div className="grid grid-flow-col gap-[100px] w-fit h-fit place-self-center">
          <div
            onClick={retake}
            className="grid bg-gray-300 cursor-pointer hover:bg-gray-400 rounded text-gray-700 px-[55px] py-[10px]"
          >
            Retake
          </div>
          <Button
            onClick={acceptFile}
            disabled={false}
            text="Accept"
            className="grid bg-green-600 cursor-pointer hover:bg-green-700 text-gray-100 rounded px-[55px] py-[10px]"
          />
        </div>
      </div>
    </div>
  );
}
