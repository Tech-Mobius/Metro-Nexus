"use client";

import * as Color from "color-bits";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";


export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch (e) {
    console.error("Color parsing failed:", e);
    return fallback;
  }
};


export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string; 
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#B4B4B4",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const textMaskRef = useRef<Uint8Array | null>(null);

  
  const memoizedColor = useMemo(() => {
    return getRGBA(color);
  }, [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);

      const textMask = textMaskRef.current;

      // Draw flickering squares with optimized RGBA colors
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;

          const maskIndex = i * rows + j;
          const hasText = textMask && textMask[maskIndex] === 1;

          const opacity = squares[maskIndex];
          const finalOpacity = hasText
            ? Math.min(1, opacity * 3 + 0.4)
            : opacity;

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      // Precompute the text mask once during setup/resize
      const textMask = new Uint8Array(cols * rows);
      if (text) {
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
        if (maskCtx) {
          maskCtx.save();
          maskCtx.scale(dpr, dpr);
          maskCtx.fillStyle = "white";
          maskCtx.font = `${fontWeight} ${fontSize}px "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          maskCtx.textAlign = "center";
          maskCtx.textBaseline = "middle";
          maskCtx.fillText(text, width / 2, height / 2);
          maskCtx.restore();

          try {
            const maskImgData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
            const data = maskImgData.data;
            const w = canvas.width;

            for (let i = 0; i < cols; i++) {
              for (let j = 0; j < rows; j++) {
                const startX = Math.floor(i * (squareSize + gridGap) * dpr);
                const startY = Math.floor(j * (squareSize + gridGap) * dpr);
                const endX = Math.floor((i * (squareSize + gridGap) + squareSize) * dpr);
                const endY = Math.floor((j * (squareSize + gridGap) + squareSize) * dpr);

                let hasText = false;
                for (let sy = startY; sy < endY && sy < canvas.height && !hasText; sy++) {
                  for (let sx = startX; sx < endX && sx < canvas.width; sx++) {
                    const idx = (sy * w + sx) * 4;
                    if (data[idx] > 0) {
                      hasText = true;
                      break;
                    }
                  }
                }
                textMask[i * rows + j] = hasText ? 1 : 0;
              }
            }
          } catch (e) {
            console.error("Mask getImageData failed", e);
          }
        }
      }
      textMaskRef.current = textMask;

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity, text, fontSize, fontWeight],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};
