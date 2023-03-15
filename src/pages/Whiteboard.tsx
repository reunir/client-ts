import React from "react";
import { WhiteboardWithEditor } from "../components/whiteboard";

type Props = {};

const Whiteboard = (props: Props) => {
  const handleOnChange = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <WhiteboardWithEditor onChange={handleOnChange} />
    </div>
  );
};

export default Whiteboard;
