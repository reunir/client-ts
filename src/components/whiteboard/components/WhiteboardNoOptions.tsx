import React from "react";
import { WhiteboardStore } from "./WhiteboardStore";
import { CanvasNoOptionsEditor } from "./CanvasNoOptions";

export function WhiteboardNoOptions(props: any) {
  return (
    <WhiteboardStore>
      <CanvasNoOptionsEditor {...props} />
    </WhiteboardStore>
  );
}
