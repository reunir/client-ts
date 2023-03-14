import React, { useEffect, useRef, useState, useContext } from "react";
import { fabric } from "./FabricExtended";
import ExportIcon from "./icons/ExportIcon";
import FlopIcon from "./icons/FlopIcon";
import GridIcon from "./icons/GridIcon";
import JsonIcon from "./icons/JsonIcon";
import "./Whiteboard.css";
import { WhiteboardContext } from "./WhiteboardStore";

interface IProps {
  className?: string;
  options?: object;
  onChange?: any;
}

const bottomMenu = [
  { title: "Grid", icon: <GridIcon /> },
  { title: "Save", icon: <FlopIcon /> },
  { title: "Export", icon: <ExportIcon /> },
  { title: "ToJson", icon: <JsonIcon /> },
];

let currentCanvas: any = null;

export function CanvasNoOptionsEditor({
  onChange,
  className,
  options,
}: IProps) {
  const parentRef = useRef<any>();
  const canvasRef = useRef<any>();
  const inputImageFileRef = useRef<any>();
  const inputJsonFileRef = useRef<any>();

  const { gstate, setGState } = useContext(WhiteboardContext);
  const { canvasOptions, backgroundImage } = gstate;

  const [editor, setEditor] = useState<any>();

  const [showGrid, setShowGrid] = useState<boolean>(true);

  const canvasModifiedCallback = () => {
    if (currentCanvas) {
      onChange(currentCanvas.toDatalessJSON());
    }
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef?.current, {
      ...canvasOptions,
      selectable: false,
    });
    currentCanvas = canvas;
    setEditor(canvas);

    if (parentRef && parentRef.current && canvas) {
      const data = localStorage.getItem("whiteboard-cache");

      if (data)
        canvas.loadFromJSON(JSON.parse(data), canvas.renderAll.bind(canvas));

      // canvas.on('mouse:down', function (event) {
      //   setShowObjOptions(canvas.getActiveObject() ? true : false)
      // });

      if (onChange) {
        canvas.on("object:added", canvasModifiedCallback);
        canvas.on("object:removed", canvasModifiedCallback);
        canvas.on("object:modified", canvasModifiedCallback);
      }

      canvas.setHeight(parentRef.current?.clientHeight || 0);
      canvas.setWidth(parentRef.current?.clientWidth || 0);
      canvas.renderAll();
    }

    return () => {
      canvas.off("object:added", canvasModifiedCallback);
      canvas.off("object:removed", canvasModifiedCallback);
      canvas.off("object:modified", canvasModifiedCallback);

      canvas.dispose();
    };
  }, []);

  const onBottomMenu = (actionName: string) => {
    switch (actionName) {
      case "Export":
        const image = editor
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        window.open(image);
        break;

      case "Save":
        localStorage.setItem(
          "whiteboard-cache",
          JSON.stringify(editor.toDatalessJSON())
        );
        break;

      case "ToJson":
        const content = JSON.stringify(editor.toDatalessJSON());
        const link = document.createElement("a");
        const file = new Blob([content], { type: "application/json" });
        link.setAttribute("download", "whiteboard.json");
        link.href = URL.createObjectURL(file);
        document.body.appendChild(link);
        link.click();
        link.remove();
        break;

      case "Grid":
        setShowGrid(!showGrid);
        break;

      default:
        break;
    }
  };

  const onFileChange = (e: any) => {
    console.log(e.target.files.length);

    if (e.target.files.length < 1) return;

    const inputFileName = e.target.name;
    const file = e.target.files[0];
    const fileType = file.type;
    const url = URL.createObjectURL(file);

    if (inputFileName === "json") {
      fetch(url)
        .then((r) => r.json())
        .then((json) => {
          editor.loadFromJSON(json, (v: any) => {
            console.log(v);
          });
        });
    } else {
      if (fileType === "image/png" || fileType === "image/jpeg") {
        fabric.Image.fromURL(url, function (img: any) {
          img.set({ width: 180, height: 180 });
          editor.centerObject(img);
          editor.add(img);
        });
      }

      if (fileType === "image/svg+xml") {
        fabric.loadSVGFromURL(url, function (objects: any, options: any) {
          var svg = fabric.util.groupSVGElements(objects, options);
          svg.scaleToWidth(180);
          svg.scaleToHeight(180);
          editor.centerObject(svg);
          editor.add(svg);
        });
      }
    }
  };

  const onZoom = (e: any) => {
    editor.zoomToPoint(
      new fabric.Point(editor.width / 2, editor.height / 2),
      +e.target.value
    );
    const units = 10;
    const delta = new fabric.Point(units, 0);
    editor.relativePan(delta);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={"w-100 h-100 whiteboard " + className}
      style={{ backgroundImage: showGrid ? backgroundImage : "" }}
      ref={parentRef}
    >
      <div
        className="w-100 d-flex justify-center align-center"
        style={{ position: "fixed", top: "10px", left: 0, zIndex: 9999 }}
      >
        Reuinre
      </div>

      <canvas ref={canvasRef} className="canvas" />

      <div className="w-100 bottom-menu">
        <div className="d-flex align-center bg-white br-7 shadow">
          {bottomMenu.map((item) => (
            <button
              key={item.title}
              onClick={() => {
                onBottomMenu(item.title);
              }}
              title={item.title}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <select
          className="d-flex align-center bg-white br-7 shadow border-0 pr-1 pl-1"
          onChange={onZoom}
          defaultValue="1"
        >
          <option value="2">200%</option>
          <option value="1.5">150%</option>
          <option value="1">100%</option>
          <option value="0.75">75%</option>
          <option value="0.50">50%</option>
          <option value="0.25">25%</option>
        </select>

        <input
          ref={inputImageFileRef}
          type="file"
          name="image"
          onChange={onFileChange}
          accept="image/svg+xml, image/gif, image/jpeg, image/png"
          hidden
        />
        <input
          ref={inputJsonFileRef}
          type="file"
          name="json"
          onChange={onFileChange}
          accept="application/json"
          hidden
        />
      </div>
    </div>
  );
}
