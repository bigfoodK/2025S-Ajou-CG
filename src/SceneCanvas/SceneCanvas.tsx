import { styled } from "@mui/material";
import { useEffect, useRef } from "react";
import { Scene } from "./Scene";

export default function SceneCanvas() {
  const sceneRef = useRef<Scene | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.stopRendering();
    }

    if (!canvasRef.current) {
      sceneRef.current = null;
      return;
    }

    sceneRef.current = new Scene(canvasRef.current);
    sceneRef.current.startRendering();
  }, []);

  return <Canvas ref={canvasRef} />;
}

const Canvas = styled("canvas")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`;
