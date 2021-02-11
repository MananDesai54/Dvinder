import React, { useEffect, useRef, useState } from "react";
import { createCanvasEffect } from "../utils/createCanvasEffect";

const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasRef.current) {
      createCanvasEffect(canvasRef.current);
    }
  }, [canvasRef.current]);

  return <canvas ref={canvasRef as any}></canvas>;
};

export default BackgroundCanvas;
