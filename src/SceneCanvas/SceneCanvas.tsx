import {
  Box,
  Card,
  Fab,
  InputLabel,
  Popper,
  Slider,
  Stack,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState, type MouseEventHandler } from "react";
import { Scene } from "./Scene";
import { Settings } from "@mui/icons-material";

export default function SceneCanvas() {
  const sceneRef = useRef<Scene | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraDistance, setCameraDistance] = useState(4);
  const [cameraSensitivity, setCameraSensitivity] = useState(0.05);
  const theme = useTheme();
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(
    null
  );

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

  useEffect(() => {
    if (!sceneRef.current) {
      return;
    }
    sceneRef.current.cameraDistance = cameraDistance;
  }, [cameraDistance]);

  useEffect(() => {
    if (!sceneRef.current) {
      return;
    }
    sceneRef.current.cameraSensitivity = cameraSensitivity;
  }, [cameraSensitivity]);

  const handleCanvasClick: MouseEventHandler<HTMLCanvasElement> = async (
    event
  ) => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
      return;
    }
    await (event.target as HTMLCanvasElement).requestPointerLock({
      unadjustedMovement: true,
    });
  };

  const handleCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!document.pointerLockElement) {
      return;
    }
    sceneRef.current?.handleMouseMove({
      x: event.movementX,
      y: event.movementY,
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      sceneRef.current?.handleKeyDown(event.code);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      sceneRef.current?.handleKeyUp(event.code);
    };
    const handleMouseWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        setCameraDistance((prev) => Math.max(1, prev - 0.5));
      } else {
        setCameraDistance((prev) => Math.min(10, prev + 0.5));
      }
      event.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("wheel", handleMouseWheel, { passive: false });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, []);

  return (
    <>
      <Popper
        open={Boolean(settingsAnchorEl)}
        anchorEl={settingsAnchorEl}
        placement="top-end"
        sx={{ zIndex: theme.zIndex.modal }}
      >
        <Card sx={{ p: 2, minWidth: 256 }}>
          <Stack spacing={2}>
            <Stack>
              <InputLabel>
                Camera Sensitivity {cameraSensitivity.toFixed(4)}
              </InputLabel>
              <Slider
                min={0.01}
                max={0.1}
                step={0.001}
                value={cameraSensitivity}
                onChange={(_event, value) => {
                  setCameraSensitivity(value);
                }}
              />
            </Stack>
            <Stack>
              <InputLabel>
                Camera Distance {cameraDistance.toFixed(1)}
              </InputLabel>
              <Slider
                min={1}
                max={10}
                value={cameraDistance}
                onChange={(_event, value) => {
                  setCameraDistance(value);
                }}
              />
            </Stack>
          </Stack>
        </Card>
      </Popper>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          p: 2,
          zIndex: theme.zIndex.fab,
        }}
      >
        <Fab
          size="small"
          onClick={(event) => {
            setSettingsAnchorEl((prev) =>
              prev ? null : (event.currentTarget as HTMLElement)
            );
          }}
        >
          <Settings />
        </Fab>
      </Box>
      <Canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />
    </>
  );
}

const Canvas = styled("canvas")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;
