import { useEffect, useState, useRef } from "react";

export default function PixelGrid() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [isDrawing, setIsDrawing] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerup", () => setIsDrawing(false));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", () => setIsDrawing(false));
    };
  }, []);

  const totalPixels = 250 * 160;
  const pixels = Array.from({ length: totalPixels });

  const cols = 250;
  const cellWidth = size.w / cols;
  const rows = Math.floor(size.h / cellWidth);

  function paintPixel(e) {
    const grid = gridRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate column and row using exact pixel width/height
    let col = Math.floor(x / cellWidth);
    let row = Math.floor(y / cellWidth);

    // Clamp indices
    col = Math.max(0, Math.min(cols - 1, col));
    row = Math.max(0, Math.min(rows - 1, row));

    const index = row * cols + col;
    const pixel = grid.children[index];
    if (pixel) pixel.style.background = "blue";
  }

  return (
    <div
      ref={gridRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDrawing(true);
        paintPixel(e);
      }}
      onPointerMove={(e) => {
        if (isDrawing) paintPixel(e);
      }}
      onPointerUp={() => setIsDrawing(false)}
    >
      {pixels.map((_, i) => (
        <div
          key={i}
          id={`pixel-${i}`}
          style={{
            background: "white",
            minWidth: `${cellWidth}px`,
            minHeight: `${cellWidth}px`,
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}
